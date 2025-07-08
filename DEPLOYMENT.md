# Deployment Guide for CP Assessment Form

## Frontend Deployment (Hostinger)

### Hostinger Deployment Steps
1. **Build your React app:**
   ```bash
   npm run build
   ```

2. **Upload to Hostinger:**
   - Log in to your Hostinger control panel
   - Go to File Manager
   - Navigate to `public_html` folder
   - Upload all contents from the `build` folder

3. **Configure Domain:**
   - Point your domain to the Hostinger hosting
   - Set up SSL certificate (free with Hostinger)

4. **Environment Variables:**
   - Update `REACT_APP_API_URL` in your code to point to your backend

## Backend Deployment

### Option 1: Railway (Recommended)
1. **Sign up at [railway.app](https://railway.app)**
2. **Connect your GitHub repository**
3. **Add environment variables:**
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   PORT=3001
   ```
4. **Deploy automatically**

### Option 2: Render
1. **Sign up at [render.com](https://render.com)**
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure:**
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Add environment variables

### Option 3: Heroku
1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

3. **Add environment variables:**
   ```bash
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASSWORD=your-app-password
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

## Environment Variables Setup

### Frontend (.env file)
```
REACT_APP_API_URL=https://your-backend-url.com
```

### Backend (.env file)
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
PORT=3001
```

## Continuous Deployment

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Build
      run: npm run build
    - name: Upload build artifacts
      uses: actions/upload-artifact@v2
      with:
        name: build-files
        path: build/
```

## Domain Setup

### Custom Domain
1. **Hostinger:**
   - Go to Domain Management in Hostinger
   - Point your domain to hosting
   - Set up SSL certificate

2. **Backend:**
   - Use your hosting provider's domain management
   - Set up subdomain (e.g., api.yourdomain.com)

## Monitoring & Analytics

### Frontend
- Google Analytics
- Hotjar for user behavior
- Hostinger's built-in analytics

### Backend
- Railway/Render/Heroku logs
- Application monitoring tools

## Security Considerations

### Environment Variables
- Never commit `.env` files
- Use secure environment variable storage
- Rotate API keys regularly

### HTTPS
- Enable HTTPS on all domains
- Use secure headers
- Implement CORS properly

### Data Protection
- Validate all inputs
- Sanitize data before storage
- Implement rate limiting

## Troubleshooting

### Common Issues
1. **Build Failures:**
   - Check for linting errors
   - Verify all dependencies are installed
   - Check environment variables

2. **API Connection Issues:**
   - Verify backend URL is correct
   - Check CORS settings
   - Ensure backend is running

3. **Email Issues:**
   - Verify email credentials
   - Check email service settings
   - Test email functionality

### Support Resources
- [Hostinger Documentation](https://www.hostinger.com/help)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Heroku Documentation](https://devcenter.heroku.com) 