// Simple logout endpoint for Vercel
export default function handler(req, res) {
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
    // Clear the token cookie
    const cookieOptions = [
      'token=',
      'HttpOnly',
      'Path=/',
      'Max-Age=0',
      'SameSite=None',
      'Secure'
    ];
    
    res.setHeader('Set-Cookie', cookieOptions.join('; '));
    
    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}