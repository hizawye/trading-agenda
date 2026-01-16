const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

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

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, partnerId } = req.body;

    console.log('Login request:', { email, partnerId });

    const response = await fetch(`${MAVEN_API}/mtr-core-edge/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Origin': 'https://manager.maven.markets',
        'Referer': 'https://manager.maven.markets/login',
      },
      body: JSON.stringify({
        email,
        password,
        partnerId: parseInt(partnerId || '117', 10),
      }),
    });

    const contentType = response.headers.get('content-type');
    let data;

    // Check if response is JSON
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('Non-JSON response from Maven:', text.substring(0, 500));
      return res.status(500).json({
        error: 'Invalid response from Maven API',
        details: text.substring(0, 200)
      });
    }

    if (!response.ok) {
      console.error('Login failed:', response.status, data);
      return res.status(response.status).json(data);
    }

    console.log('Login successful');
    res.json(data);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Generic proxy for authenticated requests
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
      headers: {
        'auth-trading-api': tradingapitoken,
        'cookie': `co-auth=${token}`,
        'accept': 'application/json, text/plain, */*',
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'origin': 'https://manager.maven.markets',
        'referer': 'https://manager.maven.markets/app/trade',
      },
    };

    // Add body for POST requests
    if (req.method === 'POST' && req.body) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, options);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('Non-JSON response:', text.substring(0, 500));
      return res.status(500).json({
        error: 'Invalid response from Maven API',
        details: text.substring(0, 200)
      });
    }

    if (!response.ok) {
      console.error('API error:', response.status, data);
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
