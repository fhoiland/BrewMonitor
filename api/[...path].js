import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const sql = neon(process.env.DATABASE_URL);

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
      // Adjust endpoint based on actual RAPT API documentation
      const response = await axios.get(`${this.baseUrl}/api/telemetry/current`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return this.mapRaptDataToOurFormat(response.data);
    } catch (error) {
      console.error('Failed to fetch RAPT brewing data:', error.response?.data || error.message);
      throw new Error('Failed to fetch brewing data from RAPT');
    }
  }

  mapRaptDataToOurFormat(raptData) {
    // Map RAPT API response to our database format
    // Adjust based on actual RAPT API response structure
    return {
      id: 'rapt-live-data',
      kettle_temperature: raptData.kettleTemp || 65.0,
      malt_temperature: raptData.maltTemp || 68.0,
      mode: raptData.brewingMode || "Live",
      power: raptData.heaterPower || 75,
      time_gmt: new Date().toISOString(),
      fermenter_beer_type: raptData.beerStyle || "IPA",
      fermenter_temperature: raptData.fermenterTemp || 20.0,
      fermenter_gravity: raptData.specificGravity || 1.045,
      fermenter_total: raptData.batchSize || "23L",
      fermenter_time_remaining: raptData.timeRemaining || "Live",
      fermenter_progress: raptData.fermentationProgress || 85,
      updated_at: new Date().toISOString()
    };
  }
}

const raptApi = new RaptApiService();

// Simple storage functions
const storage = {
  async getUserByUsername(username) {
    const result = await sql`SELECT * FROM users WHERE username = ${username} LIMIT 1`;
    return result[0] || null;
  },
  
  async createUser(userData) {
    const result = await sql`
      INSERT INTO users (username, password) 
      VALUES (${userData.username}, ${userData.password}) 
      RETURNING id, username
    `;
    return result[0];
  },

  async getBrewingData() {
    const result = await sql`SELECT * FROM brewing_data ORDER BY id DESC`;
    return result;
  },

  async getBlogPosts() {
    const result = await sql`SELECT * FROM blog_posts ORDER BY created_at DESC`;
    return result;
  },

  async getStats() {
    const result = await sql`SELECT * FROM stats ORDER BY id DESC LIMIT 1`;
    return result[0] || null;
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
          return res.json([raptData]); // Return as array to match database format
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