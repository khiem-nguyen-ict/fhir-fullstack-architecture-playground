# Hot Reload Configuration Plan

## Current State
- Frontend uses Vite (already has hot reload built-in)
- `vite.config.js` exists but lacks proxy configuration for BFF API

## Issue
When running frontend locally with `npm run dev`, the app cannot connect to the BFF at `localhost:4000` because:
1. `graphqlClient.js` uses `window.__BFF_URL__` or `window.location.origin`
2. Vite dev server runs on port 5173, but BFF is on port 4000
3. No proxy is configured to forward `/graphql` requests

## Solution
Add proxy configuration to `vite.config.js` to forward `/graphql` requests to the BFF.

## Changes Required

### 1. Update vite.config.js
Add proxy configuration in `frontend/vite.config.js`:
```js
server: {
  port: 5173,
  proxy: {
    "/graphql": {
      target: "http://localhost:4000",
      changeOrigin: true,
    },
  },
},
```

### 2. Update graphqlClient.js
Modify the BFF URL logic to work with proxy:
```js
const BFF_URL = `${window.__BFF_URL__ || window.location.origin}/graphql`;
```
Change to:
```js
const BFF_URL = `${import.meta.env.VITE_BFF_URL || "/graphql"}`;
```

## Development Workflow
Run in order:
```bash
# Terminal 1 - Patient Service
cd services/patient-service
mvn spring-boot:run

# Terminal 2 - BFF  
cd bff
npm run dev

# Terminal 3 - Frontend (hot reload enabled)
cd frontend
npm run dev
```

Then open http://localhost:5173

## Validation
- Hot reload should work when editing React components
- API calls should succeed (no CORS errors)
- Patient list should load from the BFF