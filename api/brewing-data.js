// Simple brewing data endpoint for Vercel with RAPT integration
const axios = require('axios');

// RAPT API configuration
const RAPT_CONFIG = {
  baseUrl: 'https://api.rapt.io/api/Telemetry/GetAllDevices',
  username: process.env.RAPT_USERNAME,
  secret: process.env.RAPT_API_SECRET
};

async function fetchRaptData() {
  try {
    if (!RAPT_CONFIG.username || !RAPT_CONFIG.secret) {
      throw new Error('RAPT credentials not configured');
    }

    const response = await axios.get(RAPT_CONFIG.baseUrl, {
      headers: {
        'X-API-KEY': RAPT_CONFIG.secret,
        'X-USERNAME': RAPT_CONFIG.username,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });

    const devices = response.data;
    
    // Find BLE Temperature device
    const tempDevice = devices.find(device => 
      device.deviceType === 'BLETemperature' && device.telemetry && device.telemetry.length > 0
    );

    if (tempDevice) {
      return {
        id: `rapt-${tempDevice.id}`,
        kettleTemperature: 100,
        maltTemperature: 99.8,
        mode: "Boil",
        power: 5000,
        timeGMT: new Date().toLocaleTimeString('no-NO'),
        fermenterBeerType: "NEIPA",
        fermenterTemperature: tempDevice.temperature,
        fermenterGravity: 1.012,
        fermenterTotal: "25L",
        fermenterTimeRemaining: "3 dager 4 timer",
        fermenterProgress: 75,
        updatedAt: new Date().toISOString()
      };
    }

    throw new Error('No suitable RAPT device found');
  } catch (error) {
    console.log('RAPT API failed:', error.message);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Try RAPT API first
    try {
      const raptData = await fetchRaptData();
      return res.json(raptData);
    } catch (raptError) {
      console.log('RAPT failed, using fallback data');
    }

    // Fallback data
    const fallbackData = {
      id: "fallback-brewing-data",
      kettleTemperature: 100,
      maltTemperature: 99.8,
      mode: "Boil",
      power: 5000,
      timeGMT: new Date().toLocaleTimeString('no-NO'),
      fermenterBeerType: "NEIPA",
      fermenterTemperature: 19.5,
      fermenterGravity: 1.012,
      fermenterTotal: "25L",
      fermenterTimeRemaining: "3 dager 4 timer",
      fermenterProgress: 75,
      updatedAt: new Date().toISOString()
    };

    return res.json(fallbackData);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}