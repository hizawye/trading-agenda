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

    const response = await fetch(`${MAVEN_API}/mtr-core-edge/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        partnerId: parseInt(partnerId || '117', 10),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generic proxy for authenticated requests
app.all('/api/maven/*', async (req, res) => {
  try {
    const { token, tradingApiToken } = req.headers;

    if (!token || !tradingApiToken) {
      return res.status(401).json({ error: 'Missing authentication tokens' });
    }

    // Extract the path after /api/maven/
    const path = req.params[0];
    const url = `${MAVEN_API}/${path}`;

    const options = {
      method: req.method,
      headers: {
        'auth-trading-api': tradingApiToken,
        'cookie': `co-auth=${token}`,
        'accept': 'application/json, text/plain, */*',
        'content-type': 'application/json',
      },
    };

    // Add body for POST requests
    if (req.method === 'POST' && req.body) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
