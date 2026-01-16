# Maven Trading Proxy

Simple proxy server to handle Maven Trading API requests from React Native app.

## Why?

React Native can't send Cookie headers directly, but Maven's API requires them. This proxy adds the cookies server-side.

## Deploy to Railway (Free)

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and deploy:
```bash
cd broker-proxy
railway login
railway init
railway up
```

3. Get your URL:
```bash
railway domain
```

## Deploy to Vercel (Free)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd broker-proxy
vercel
```

## Or run locally for testing:

```bash
cd broker-proxy
npm install
npm start
```

Server runs on http://localhost:3000

## Update your app

After deploying, update `PROXY_URL` in `src/lib/matchTraderAPI.ts` to your deployed URL.

## Endpoints

- `POST /api/login` - Login to Maven
- `GET/POST /api/maven/*` - Proxy all Maven API requests
