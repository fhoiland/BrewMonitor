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
      // Example API call - adjust endpoint based on RAPT API documentation
      const response = await axios.get(`${this.baseUrl}/api/telemetry/current`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return this.mapRaptDataToOurFormat(response.data);
    } catch (error) {
      console.error('Failed to fetch RAPT brewing data:', error);
      throw new Error('Failed to fetch brewing data from RAPT');
    }
  }

  private mapRaptDataToOurFormat(raptData: any): any {
    // Map RAPT API response to our database format
    // This will depend on actual RAPT API response structure
    return {
      kettleTemperature: raptData.kettleTemp || 65.0,
      maltTemperature: raptData.maltTemp || 68.0,
      mode: raptData.brewingMode || "Active",
      power: raptData.heaterPower || 75,
      timeGMT: new Date().toISOString(),
      fermenterBeerType: raptData.beerStyle || "IPA",
      fermenterTemperature: raptData.fermenterTemp || 20.0,
      fermenterGravity: raptData.specificGravity || 1.045,
      fermenterTotal: raptData.batchSize || "23L",
      fermenterTimeRemaining: raptData.timeRemaining || "5 days",
      fermenterProgress: raptData.fermentationProgress || 85
    };
  }
}

export const raptApi = new RaptApiService();