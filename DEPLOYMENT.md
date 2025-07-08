# Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Frontend) + Railway (Backend) - RECOMMENDED

#### Frontend Deployment (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel:**
   ```bash
   npm run deploy
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project settings in Vercel
   - Add environment variable: `REACT_APP_API_URL` = your backend URL

#### Backend Deployment (Railway)

1. **Create Railway Account:**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend:**
   - Connect your GitHub repository
   - Set root directory to `backend`
   - Add environment variables:
     - `EMAIL_USER`
     - `EMAIL_PASSWORD`
     - `SPREADSHEET_ID`
     - `GOOGLE_CLIENT_EMAIL`
     - `GOOGLE_PRIVATE_KEY`

3. **Get Backend URL:**
   - Railway will provide a URL like: `https://your-app.railway.app`
   - Update `REACT_APP_API_URL` in Vercel with this URL

### Option 2: Netlify (Frontend) + Render (Backend)

#### Frontend Deployment (Netlify)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag and drop the `build` folder to [netlify.com](https://netlify.com)
   - Or connect your GitHub repository

3. **Set Environment Variables:**
   - Go to Site Settings > Environment Variables
   - Add `REACT_APP_API_URL`

#### Backend Deployment (Render)

1. **Create Render Account:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend:**
   - Create new Web Service
   - Connect your GitHub repository
   - Set root directory to `backend`
   - Build command: `npm install`
   - Start command: `npm start`

### Option 3: GitHub Pages (Frontend) + Heroku (Backend)

#### Frontend Deployment (GitHub Pages)

1. **Add GitHub Pages dependency:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json:**
   ```json
   {
     "homepage": "https://yourusername.github.io/your-repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

#### Backend Deployment (Heroku)

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

3. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

## Environment Variables Setup

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.com
```

### Backend (.env)
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
SPREADSHEET_ID=your-google-sheet-id
GOOGLE_CLIENT_EMAIL=your-service-account-email
GOOGLE_PRIVATE_KEY=your-private-key
PORT=3001
```

## Continuous Deployment

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && npm install
      - uses: railway/action@v1
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
```

## Domain Setup

### Custom Domain (Optional)

1. **Vercel:**
   - Go to project settings
   - Add custom domain
   - Update DNS records

2. **Railway:**
   - Go to project settings
   - Add custom domain
   - Update DNS records

## Monitoring & Analytics

### Vercel Analytics
- Built-in analytics in Vercel dashboard
- Performance monitoring
- Error tracking

### Railway Monitoring
- Built-in logs and monitoring
- Performance metrics
- Error tracking

## Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files
   - Use platform-specific secret management

2. **CORS Configuration:**
   - Update backend CORS to allow your frontend domain

3. **HTTPS:**
   - All platforms provide HTTPS by default

## Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Update backend CORS configuration
   - Check environment variables

2. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed

3. **Environment Variables:**
   - Ensure all required variables are set
   - Check variable names and values

### Support

- Vercel: [vercel.com/support](https://vercel.com/support)
- Railway: [railway.app/docs](https://railway.app/docs)
- Netlify: [netlify.com/support](https://netlify.com/support)
- Render: [render.com/docs](https://render.com/docs) 