const jwt = require('jsonwebtoken');

// Simple auth check endpoint for Vercel
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get token from cookie
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    return res.json({ user: decoded });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}