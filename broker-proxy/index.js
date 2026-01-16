const express = require('express');
const cors = require('cors');
const cloudscraper = require('cloudscraper');

const app = express();
const PORT = process.env.PORT || 3000;

// Maven API base URL
const MAVEN_API = 'https://manager.maven.markets';

// Enable CORS for your mobile app
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Maven Trading Proxy Server' });
});

// Login endpoint with Cloudflare bypass
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, partnerId } = req.body;

    console.log('Login request:', { email, partnerId });

    const response = await cloudscraper({
      method: 'POST',
      url: `${MAVEN_API}/mtr-core-edge/login`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        partnerId: parseInt(partnerId || '117', 10),
      }),
      json: true,
    });

    console.log('Login successful');
    res.json(response);
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      error: error.message,
      details: error.error ? error.error.substring(0, 200) : 'No details'
    });
  }
});

// Generic proxy for authenticated requests with Cloudflare bypass
app.all('/api/maven/*', async (req, res) => {
  try {
    const { token, tradingapitoken } = req.headers;

    if (!token || !tradingapitoken) {
      return res.status(401).json({ error: 'Missing authentication tokens' });
    }

    // Extract the path after /api/maven/
    const path = req.params[0];
    const url = `${MAVEN_API}/${path}`;

    console.log('Proxying request:', req.method, path);

    const options = {
      method: req.method,
      url: url,
      headers: {
        'auth-trading-api': tradingapitoken,
        'cookie': `co-auth=${token}`,
        'accept': 'application/json, text/plain, */*',
        'content-type': 'application/json',
      },
      json: true,
    };

    // Add body for POST requests
    if (req.method === 'POST' && req.body) {
      options.body = JSON.stringify(req.body);
    }

    const response = await cloudscraper(options);
    res.json(response);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({
      error: error.message,
      details: error.error ? error.error.substring(0, 200) : 'No details'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
