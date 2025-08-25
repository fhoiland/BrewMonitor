import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const sql = neon(process.env.DATABASE_URL);

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