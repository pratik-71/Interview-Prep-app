# Vercel Deployment Guide - Frontend Only

This guide will help you deploy your React frontend to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your backend API URL (where your backend is hosted)

## Deployment Steps

### 1. Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

### 2. Set Environment Variables

Before deploying, you need to set the following environment variable in Vercel:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the following variable:

```
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

**Important:** Replace `https://your-backend-url.com` with your actual backend API URL.

### 3. Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. **Important:** Set the **Root Directory** to `frontend`
4. Configure the project:
   - **Framework Preset:** Create React App (should auto-detect)
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (or leave empty to use vercel.json)
   - **Output Directory:** `build` (or leave empty to use vercel.json)
   - **Install Command:** `npm install` (or leave empty to use vercel.json)
5. Add your environment variable (`REACT_APP_BACKEND_URL`)
6. Click "Deploy"

### 4. Deploy via CLI (Alternative)

```bash
# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

## Project Structure

The frontend is configured as follows:

- **Framework:** Create React App
- **Build Output:** `build/` directory
- **Configuration:** `vercel.json` in the frontend directory
- **Backend URL:** Configured via `REACT_APP_BACKEND_URL` environment variable

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_BACKEND_URL` | Yes | Your backend API URL (e.g., `https://api.example.com` or `http://localhost:10000` for development) |

## Important Notes

1. **Root Directory:** Make sure to set the root directory to `frontend` in Vercel settings
2. **Backend URL:** The frontend will use the `REACT_APP_BACKEND_URL` environment variable to connect to your backend
3. **CORS:** Make sure your backend allows requests from your Vercel domain

## Post-Deployment

After successful deployment:
1. Test your frontend: `https://your-domain.vercel.app`
2. Verify API calls are working (check browser console)
3. Test authentication flow
4. Check that all routes work correctly

## Custom Domain

To add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

## Troubleshooting

### Build Errors

If you encounter build errors:
1. Check that all dependencies are listed in `package.json`
2. Ensure Node.js version is compatible (Vercel uses Node 18.x by default)
3. Check build logs in Vercel dashboard

### API Not Working

If API calls fail:
1. Verify `REACT_APP_BACKEND_URL` is set correctly
2. Check CORS settings on your backend
3. Review browser console for errors
4. Verify backend is accessible from the internet

### Routes Not Working

If React Router routes return 404:
1. Verify `vercel.json` has the rewrite rule for `index.html`
2. Check that all routes are properly configured


