const jwt = require('jsonwebtoken');

// Simple login endpoint for Vercel
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

      // Set cookie with proper settings for Vercel
      const cookieOptions = [
        `token=${token}`,
        'HttpOnly',
        'Path=/',
        'Max-Age=86400',
        'SameSite=None',
        'Secure'
      ];
      
      res.setHeader('Set-Cookie', cookieOptions.join('; '));
      
      return res.json({ 
        user: { id: 'admin', username: 'admin' },
        token: token, // Also send token in response for debugging
        message: 'Login successful' 
      });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}