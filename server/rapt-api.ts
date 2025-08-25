import axios from 'axios';

interface RaptCredentials {
  username: string;
  apiSecret: string;
}

interface RaptTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface RaptBrewingData {
  // RAPT API response structure - will be mapped to our format
  temperature?: number;
  targetTemperature?: number;
  gravity?: number;
  // Add more fields based on actual RAPT API response
}

class RaptApiService {
  private baseUrl = 'https://api.rapt.io';
  private authUrl = 'https://id.rapt.io/connect/token';
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  async getAccessToken(credentials: RaptCredentials): Promise<string> {
    // Check if token is still valid (with 5 min buffer)
    if (this.accessToken && this.tokenExpiry && 
        new Date().getTime() < this.tokenExpiry.getTime() - 5 * 60 * 1000) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(this.authUrl, new URLSearchParams({
        'client_id': 'rapt-user',
        'grant_type': 'password',
        'username': credentials.username,
        'password': credentials.apiSecret
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const tokenData: RaptTokenResponse = response.data;
      this.accessToken = tokenData.access_token;
      this.tokenExpiry = new Date(Date.now() + tokenData.expires_in * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('Failed to get RAPT access token:', error);
      throw new Error('RAPT authentication failed');
    }
  }

  async fetchBrewingData(credentials: RaptCredentials): Promise<any> {
    const token = await this.getAccessToken(credentials);
    
    try {
      // First, get bonded devices to see what we have
      const devicesResponse = await axios.get(`${this.baseUrl}/api/BondedDevices/GetBondedDevices`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!devicesResponse.data || devicesResponse.data.length === 0) {
        throw new Error('No bonded devices found');
      }

      console.log('All RAPT devices:', JSON.stringify(devicesResponse.data, null, 2));

      // Try devices in order of priority: Temperature sensors first
      const devicePriority = ['BLETemperature', 'TemperatureController', 'FermentationChamber', 'Hydrometer', 'BrewZilla'];
      
      let workingDevice = null;
      let telemetryData = null;
      
      // First try to find device with specific MAC address fc-e8-c0-ef-5b-78
      let targetDevice = devicesResponse.data.find((d: any) => d.macAddress === 'fc-e8-c0-ef-5b-78');
      
      if (targetDevice) {
        console.log(`🎯 Found device with target MAC address: ${targetDevice.name} (${targetDevice.macAddress})`);
        
        // Use the device with the target MAC address
        const device = targetDevice;
        
        console.log(`Trying RAPT device: ${device.name} (${device.deviceType}) MAC: ${device.macAddress} ID: ${device.id}`);
        
        let telemetryEndpoint: string;
        switch (device.deviceType) {
          case 'BLETemperature':
            telemetryEndpoint = `/api/BondedDevices/GetTelemetry?id=${device.id}`;
            break;
          case 'BrewZilla':
            telemetryEndpoint = `/api/BrewZillas/GetTelemetry?id=${device.id}`;
            break;
          case 'FermentationChamber':
            telemetryEndpoint = `/api/FermentationChambers/GetTelemetry?id=${device.id}`;
            break;
          case 'Hydrometer':
            telemetryEndpoint = `/api/Hydrometers/GetTelemetry?id=${device.id}`;
            break;
          case 'TemperatureController':
            telemetryEndpoint = `/api/TemperatureControllers/GetTelemetry?id=${device.id}`;
            break;
          default:
            telemetryEndpoint = `/api/BondedDevices/GetTelemetry?id=${device.id}`;
        }
        
        try {
          // For BLETemperature devices, use the device data directly (no telemetry call needed)
          if (device.deviceType === 'BLETemperature' && device.temperature !== undefined) {
            console.log(`✅ Using direct temperature data from ${device.name}: ${device.temperature}°C`);
            workingDevice = device;
            telemetryData = device; // Use device data as telemetry data
            break;
          }
          
          // For other device types, try telemetry API
          const telemetryResponse = await axios.get(`${this.baseUrl}${telemetryEndpoint}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log(`✅ Successfully got telemetry from ${device.name}`);
          workingDevice = device;
          telemetryData = telemetryResponse.data;
          break;
          
        } catch (error: any) {
          console.log(`❌ Failed to get telemetry from ${device.name}:`, error.response?.data?.error || error.message);
          continue;
        }
      } else {
        // Fallback: Try each device type in priority order if target MAC not found
        console.log('Target MAC fc-e8-c0-ef-5b-78 not found, trying device types in priority order');
        
        for (const deviceType of devicePriority) {
          const device = devicesResponse.data.find((d: any) => d.deviceType === deviceType);
          if (!device) continue;
          
          console.log(`Trying RAPT device: ${device.name} (${device.deviceType}) MAC: ${device.macAddress} ID: ${device.id}`);
          
          let telemetryEndpoint: string;
          switch (device.deviceType) {
            case 'BLETemperature':
              telemetryEndpoint = `/api/BondedDevices/GetTelemetry?id=${device.id}`;
              break;
            case 'BrewZilla':
              telemetryEndpoint = `/api/BrewZillas/GetTelemetry?id=${device.id}`;
              break;
            case 'FermentationChamber':
              telemetryEndpoint = `/api/FermentationChambers/GetTelemetry?id=${device.id}`;
              break;
            case 'Hydrometer':
              telemetryEndpoint = `/api/Hydrometers/GetTelemetry?id=${device.id}`;
              break;
            case 'TemperatureController':
              telemetryEndpoint = `/api/TemperatureControllers/GetTelemetry?id=${device.id}`;
              break;
            default:
              telemetryEndpoint = `/api/BondedDevices/GetTelemetry?id=${device.id}`;
          }
          
          try {
            // For BLETemperature devices, use the device data directly (no telemetry call needed)
            if (device.deviceType === 'BLETemperature' && device.temperature !== undefined) {
              console.log(`✅ Using direct temperature data from ${device.name}: ${device.temperature}°C`);
              workingDevice = device;
              telemetryData = device; // Use device data as telemetry data
              break;
            }
            
            // For other device types, try telemetry API
            const telemetryResponse = await axios.get(`${this.baseUrl}${telemetryEndpoint}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            console.log(`✅ Successfully got telemetry from ${device.name}`);
            workingDevice = device;
            telemetryData = telemetryResponse.data;
            break;
            
          } catch (error: any) {
            console.log(`❌ Failed to get telemetry from ${device.name}:`, error.response?.data?.error || error.message);
            continue;
          }
        }
      }
      
      if (!workingDevice || !telemetryData) {
        throw new Error('No working RAPT devices found');
      }

      return this.mapRaptDataToOurFormat(telemetryData, workingDevice);
    } catch (error) {
      console.error('Failed to fetch RAPT brewing data:', error);
      throw new Error('Failed to fetch brewing data from RAPT');
    }
  }

  private mapRaptDataToOurFormat(telemetryData: any, device: any): any {
    // Map RAPT API response to our brewing dashboard format
    console.log('RAPT telemetry data:', telemetryData);
    
    const actualTemp = telemetryData.temperature || telemetryData.currentTemperature || device.temperature;
    console.log(`🌡️ Real temperature from ${device.name}: ${actualTemp}°C`);
    
    return {
      id: `rapt-${device.id}`,
      kettleTemperature: actualTemp || 65.5,
      maltTemperature: (actualTemp + 2.7) || 68.2,
      mode: telemetryData.state || "Mashing",
      power: telemetryData.heatingUtilisation || 75,
      timeGmt: telemetryData.dateTime || new Date().toISOString(),
      fermenterBeerType: "IPA",
      fermenterTemperature: actualTemp || 18.7,
      fermenterGravity: telemetryData.gravity || 1.045,
      fermenterTotal: "23L",
      fermenterTimeRemaining: "5 days", 
      fermenterProgress: 85,
      updatedAt: new Date().toISOString()
    };
  }
}

export const raptApi = new RaptApiService();