# Deployment Guide

## Production Build

### Local Build and Preview

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview the production build
npm run preview
```

The production build will be in the `dist/` folder.

## Deployment Platforms

### 1. Vercel (Recommended for PWAs)

**Benefits:**
- Automatic HTTPS
- Edge caching
- Perfect for PWAs
- Free tier available

**Steps:**
1. Push code to GitHub
2. Connect repository to Vercel (vercel.com)
3. Vercel auto-detects Vite and builds automatically
4. Set build command: `npm run build`
5. Set output directory: `dist`

**Command line deployment:**
```bash
npm i -g vercel
vercel
```

### 2. Netlify

**Steps:**
1. Connect GitHub repository to Netlify (netlify.com)
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Deploy

**Command line deployment:**
```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod
```

### 3. Firebase Hosting

**Steps:**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init hosting

# Build the app
npm run build

# Deploy
firebase deploy --only hosting
```

**firebase.json configuration:**
```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 4. GitHub Pages (Free Static Hosting)

**Setup:**
1. Update `vite.config.ts` with base path:
```typescript
export default defineConfig({
  base: '/dailyspend-app/', // Replace with your repo name
  // ... other config
})
```

2. Create deploy script in `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. Deploy:
```bash
npm install --save-dev gh-pages
npm run deploy
```

### 5. Self-Hosted (Any Static Server)

**Simple Node.js + Express:**
```javascript
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

**Nginx configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /var/www/dailyspend-app/dist;
    index index.html;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri /index.html;
    }
}
```

## Pre-Deployment Checklist

### Build Verification
- [ ] `npm run build` completes without errors
- [ ] No TypeScript errors (`npm run lint`)
- [ ] Production bundle size is acceptable
- [ ] All assets are included in dist/

### PWA Verification
- [ ] `manifest.json` is valid
- [ ] Service worker registers successfully
- [ ] App icon displays correctly
- [ ] Works offline after initial load

### Security
- [ ] HTTPS is enabled
- [ ] No sensitive data in client code
- [ ] Environment variables are handled properly

### Performance
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 3s
- [ ] Cumulative Layout Shift < 0.1

### Browser Compatibility
- [ ] Works on modern browsers (Chrome, Firefox, Safari, Edge)
- [ ] Responsive on mobile devices
- [ ] No console errors

## Environment Variables

Create `.env` file if needed:
```
VITE_API_URL=https://api.example.com
VITE_APP_NAME=Daily Spend
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Continuous Integration/Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm run build
      
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## Monitoring & Logs

### Sentry Integration (Optional)

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

## Troubleshooting Deployment

### Service Worker Issues
- Ensure manifest.json has correct MIME type: `application/manifest+json`
- Verify HTTPS is enabled
- Clear browser cache and service worker
- Check browser console for errors

### Routing Issues
- Ensure server rewrites all routes to index.html
- Verify `base` setting in vite.config.ts

### Performance Issues
- Check bundle size: `npm run build -- --reporter=verbose`
- Enable gzip compression on server
- Use CDN for static assets

## Rollback Procedures

### Vercel
```bash
vercel rollback
```

### Firebase
```bash
firebase hosting:disable
# Redeploy previous version
firebase deploy --only hosting
```

### GitHub Pages
```bash
git revert <commit-hash>
git push origin main
```

## Cost Estimation

| Platform | Cost | Notes |
|----------|------|-------|
| Vercel | Free | 10K serverless function invocations/month free |
| Netlify | Free | Generous free tier, perfect for PWAs |
| Firebase | Free | 1 GB storage, 10 GB/month transfer |
| GitHub Pages | Free | Unlimited, tied to GitHub account |
| AWS | Variable | Pay-as-you-go, typically ~$1-5/month for this app |

## Performance Optimization

### Bundle Size
- Current size: ~150KB gzipped
- Main dependencies:
  - React: ~40KB
  - Dexie: ~15KB
  - Recharts: ~45KB
  - date-fns: ~30KB

### Caching Strategy
- Service worker caches assets for 1 year
- Dynamic content updates on network access
- Fallback to cache if offline

### Database
- IndexedDB stores data locally
- No network requests for read operations
- Reduces API calls significantly

---

**Last Updated:** 2024
