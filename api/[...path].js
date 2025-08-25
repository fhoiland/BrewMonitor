import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';

// Supabase REST API configuration
const supabase = {
  url: 'https://ahembadjzomvymqrujto.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoZW1iYWRqem9tdnltcXJ1anRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjQ3NzgsImV4cCI6MjA3MTcwMDc3OH0.w95g_j5SzM3ltI7DKEoE0D0R9dcGNFjlU2Jo6o0S2uM'
};

// Helper function for Supabase REST API calls
async function supabaseRequest(endpoint, options = {}) {
  const response = await fetch(`${supabase.url}/rest/v1/${endpoint}`, {
    ...options,
    headers: {
      'apikey': supabase.key,
      'Authorization': `Bearer ${supabase.key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return transformKeys(data);
}

// Convert snake_case to camelCase for frontend compatibility
function transformKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(transformKeys);
  }
  
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = transformKeys(obj[key]);
      return result;
    }, {});
  }
  
  return obj;
}

// RAPT API Integration
class RaptApiService {
  constructor() {
    this.baseUrl = 'https://api.rapt.io';
    this.authUrl = 'https://id.rapt.io/connect/token';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    // Check if we have RAPT credentials
    if (!process.env.RAPT_USERNAME || !process.env.RAPT_API_SECRET) {
      throw new Error('RAPT credentials not configured');
    }

    // Check if token is still valid (with 5 min buffer)
    if (this.accessToken && this.tokenExpiry && 
        new Date().getTime() < this.tokenExpiry.getTime() - 5 * 60 * 1000) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(this.authUrl, new URLSearchParams({
        'client_id': 'rapt-user',
        'grant_type': 'password',
        'username': process.env.RAPT_USERNAME,
        'password': process.env.RAPT_API_SECRET
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('Failed to get RAPT access token:', error.response?.data || error.message);
      throw new Error('RAPT authentication failed');
    }
  }

  async fetchBrewingData() {
    const token = await this.getAccessToken();
    
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
      let targetDevice = devicesResponse.data.find(d => d.macAddress === 'fc-e8-c0-ef-5b-78');
      
      if (targetDevice) {
        console.log(`🎯 Found device with target MAC address: ${targetDevice.name} (${targetDevice.macAddress})`);
        
        // Use the device with the target MAC address
        const device = targetDevice;
        console.log(`Trying RAPT device: ${device.name} (${device.deviceType}) MAC: ${device.macAddress} ID: ${device.id}`);

        let telemetryEndpoint;
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
          
        } catch (error) {
          console.log(`❌ Failed to get telemetry from ${device.name}:`, error.response?.data?.error || error.message);
          continue;
        }
      }
      
      if (!workingDevice || !telemetryData) {
        throw new Error('No working RAPT devices found');
      }

      return this.mapRaptDataToOurFormat(telemetryData, workingDevice);
    } catch (error) {
      console.error('Failed to fetch RAPT brewing data:', error.response?.data || error.message);
      throw new Error('Failed to fetch brewing data from RAPT');
    }
  }

  mapRaptDataToOurFormat(telemetryData, device) {
    // Map RAPT API response to our brewing dashboard format
    console.log('RAPT telemetry data:', telemetryData);
    
    const actualTemp = telemetryData.temperature || telemetryData.currentTemperature || device.temperature;
    console.log(`🌡️ Real temperature from ${device.name}: ${actualTemp}°C`);
    
    return {
      id: `rapt-${device.id}`,
      kettle_temperature: actualTemp || 65.5,
      malt_temperature: (actualTemp + 2.7) || 68.2,
      mode: telemetryData.state || "Mashing",
      power: telemetryData.heatingUtilisation || 75,
      time_gmt: telemetryData.dateTime || new Date().toISOString(),
      fermenter_beer_type: "IPA",
      fermenter_temperature: actualTemp || 18.7,
      fermenter_gravity: telemetryData.gravity || 1.045,
      fermenter_total: "23L",
      fermenter_time_remaining: "5 days", 
      fermenter_progress: 85,
      updated_at: new Date().toISOString()
    };
  }
}

const raptApi = new RaptApiService();

// Supabase storage functions
const storage = {
  async getUserByUsername(username) {
    const users = await supabaseRequest(`users?username=eq.${username}`);
    return users[0] || null;
  },
  
  async createUser(userData) {
    const user = {
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const [created] = await supabaseRequest('users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
    return created;
  },

  async getBrewingData() {
    const data = await supabaseRequest('brewing_data?limit=1');
    return data[0] || null;
  },

  async getBlogPosts() {
    return await supabaseRequest('blog_posts?published=eq.true&order=created_at.desc');
  },

  async getStats() {
    const data = await supabaseRequest('stats?limit=1');
    return data[0] || null;
  }
};

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '24h' });
}

export default async function handler(req, res) {
  const { url, method } = req;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Auth endpoints
    if (url === '/api/auth/login' && method === 'POST') {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken({ id: user.id, username: user.username });
      
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
      return res.json({ user: { id: user.id, username: user.username } });
    }

    if (url === '/api/auth/logout' && method === 'POST') {
      res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0');
      return res.json({ message: "Logged out successfully" });
    }

    // Data endpoints
    if (url === '/api/brewing-data' && method === 'GET') {
      try {
        // Try RAPT API first if configured
        if (process.env.RAPT_USERNAME && process.env.RAPT_API_SECRET) {
          const raptData = await raptApi.fetchBrewingData();
          return res.json(transformKeys(raptData)); // Transform to camelCase
        }
      } catch (error) {
        console.log('RAPT API failed, falling back to database:', error.message);
      }
      
      // Fallback to database data  
      const data = await storage.getBrewingData();
      return res.json(data);
    }

    if (url === '/api/blog-posts' && method === 'GET') {
      const data = await storage.getBlogPosts();
      return res.json(data);
    }

    if (url === '/api/stats' && method === 'GET') {
      const data = await storage.getStats();
      return res.json(data);
    }

    // Auth check
    if (url === '/api/auth/me' && method === 'GET') {
      return res.status(401).json({ message: "Access token required" });
    }

    // Default 404
    return res.status(404).json({ message: "Not Found" });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}