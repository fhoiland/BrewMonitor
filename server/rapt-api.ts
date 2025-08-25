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

      // Try to get telemetry from first available device
      const device = devicesResponse.data[0];
      console.log('RAPT device found:', device.deviceName, 'Type:', device.deviceType);

      let telemetryEndpoint: string;
      switch (device.deviceType) {
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
          // Fallback to general bonded device telemetry
          telemetryEndpoint = `/api/BondedDevices/GetTelemetry?id=${device.id}`;
      }

      const telemetryResponse = await axios.get(`${this.baseUrl}${telemetryEndpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return this.mapRaptDataToOurFormat(telemetryResponse.data, device);
    } catch (error) {
      console.error('Failed to fetch RAPT brewing data:', error);
      throw new Error('Failed to fetch brewing data from RAPT');
    }
  }

  private mapRaptDataToOurFormat(telemetryData: any, device: any): any {
    // Map RAPT API telemetry response to our database format
    console.log('RAPT telemetry data:', telemetryData);
    
    return {
      id: `rapt-${device.id}`,
      kettleTemperature: telemetryData.temperature || telemetryData.currentTemperature || null,
      maltTemperature: telemetryData.maltTemperature || null,
      mode: telemetryData.state || telemetryData.mode || 'Unknown',
      power: telemetryData.heatingUtilisation || telemetryData.power || null,
      timeGMT: telemetryData.dateTime || telemetryData.timestamp || new Date().toISOString(),
      fermenterBeerType: device.deviceName || 'Unknown',
      fermenterTemperature: telemetryData.temperature || telemetryData.currentTemperature || null,
      fermenterGravity: telemetryData.gravity || telemetryData.specificGravity || null,
      fermenterTotal: null, // Not available in standard telemetry
      fermenterTimeRemaining: null, // Calculated field
      fermenterProgress: telemetryData.progress || null,
      updatedAt: new Date().toISOString()
    };
  }
}

export const raptApi = new RaptApiService();