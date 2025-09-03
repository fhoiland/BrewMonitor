const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Simple login endpoint for Vercel
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    // For simplicity, hardcode admin credentials for Vercel
    if (username === 'admin' && password === 'admin123') {
      // Generate JWT token
      const token = jwt.sign(
        { id: 'admin', username: 'admin' },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );

      // Set HTTP-only cookie
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/`);
      
      return res.json({ 
        user: { id: 'admin', username: 'admin' },
        message: 'Login successful' 
      });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}