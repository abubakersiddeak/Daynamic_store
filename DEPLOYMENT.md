# Deployment Guide - Cosmatics Store

Complete guide for deploying your ecommerce application to production.

## 🚀 Quick Deployment (Recommended: Vercel)

### Step 1: Prepare Your Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Cosmatics ecommerce platform"
```

### Step 2: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:

```bash
git remote add origin https://github.com/yourusername/cosmatics-store.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Configure settings:
   - Framework: Next.js (auto-detected)
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 4: Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
NEXT_PUBLIC_SITE_NAME=Cosmatics Store
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Step 5: Deploy

Click "Deploy" and wait for the build to complete.

---

## 🏠 Self-Hosted Deployment

### Prerequisites

- Server with Node.js 18+
- MongoDB instance
- Domain name
- SSL certificate (Let's Encrypt recommended)

### Option A: DigitalOcean App Platform

1. Push code to GitHub
2. Connect GitHub to DigitalOcean
3. Create new app
4. Configure:
   ```
   Build command: npm run build
   Run command: npm start
   ```
5. Add environment variables
6. Deploy

### Option B: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create cosmatics-store

# Add MongoDB Atlas
heroku addons:create mongolab

# Set environment variables
heroku config:set NEXT_PUBLIC_IMGBB_API_KEY=your_key
heroku config:set NEXT_PUBLIC_SITE_URL=https://cosmatics-store.herokuapp.com

# Deploy
git push heroku main
```

### Option C: Traditional Server (Ubuntu)

```bash
# Connect to server
ssh root@your_server_ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Clone your repository
git clone https://github.com/yourusername/cosmatics-store.git
cd cosmatics-store

# Install dependencies
npm install

# Build the app
npm run build

# Start with PM2
pm2 start npm --name "cosmatics" -- start

# Enable PM2 to start on reboot
pm2 startup
pm2 save
```

**Configure Nginx:**

```bash
# Install Nginx
apt install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/cosmatics
```

Add this content:

```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/cosmatics /etc/nginx/sites-enabled/

# Test Nginx
sudo nginx -t

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install SSL (Let's Encrypt)
apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com
```

---

## 📊 Database Deployment

### MongoDB Atlas Setup

1. **Create Account**: Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Create Cluster**:
   - Choose free tier
   - Select region close to your servers
3. **Create Database User**:
   - Username: `cosmatics_user`
   - Generate secure password
4. **Get Connection String**:
   - Copy connection string
   - Replace `<password>` with your password
   - Add to environment variables as `MONGODB_URI`

### Connection String Format

```
mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```

---

## 🔐 Pre-Deployment Checklist

- [ ] All environment variables are set
- [ ] Database is set up and accessible
- [ ] ImgBB API key is valid
- [ ] `.env.local` is NOT committed to Git
- [ ] Build command runs successfully: `npm run build`
- [ ] No console errors or warnings
- [ ] Admin dashboard is protected (add auth before going live)
- [ ] All images are optimized
- [ ] SEO metadata is complete
- [ ] 404 and error pages are customized

---

## 📈 Post-Deployment Steps

### 1. Verify Functionality

```bash
# Test public site
curl https://your-domain.com

# Test API
curl https://your-domain.com/api/health
```

### 2. Set Up Monitoring

- **Uptime**: Use UptimeRobot or similar
- **Error Tracking**: Set up Sentry
- **Performance**: Enable Vercel Analytics

### 3. Set Up Backups

MongoDB Atlas includes automatic backups. For self-hosted:

```bash
# Daily backup script
0 2 * * * mongodump --uri="$MONGODB_URI" --out=/backups/$(date +\%Y\%m\%d)
```

### 4. Configure Domain

1. Update DNS records to point to your server/Vercel
2. Enable HTTPS and redirect HTTP to HTTPS

---

## 🔧 Maintenance

### Update Dependencies

```bash
npm update
npm audit fix
npm run build
npm run start
```

### View Logs

```bash
# Vercel
vercel logs

# Self-hosted with PM2
pm2 logs cosmatics

# Nginx
tail -f /var/log/nginx/error.log
```

### Monitor Performance

- Check server CPU and memory usage
- Monitor database connections
- Track API response times

---

## 🚨 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Error

- Verify `MONGODB_URI` in environment variables
- Check if database is accessible from server
- Ensure IP whitelist includes server IP (MongoDB Atlas)

### Images Not Loading

- Verify ImgBB API key
- Check image URLs in database
- Ensure CORS is configured for image domains

### Site is Slow

- Enable caching in Nginx
- Optimize images
- Use CDN for static assets
- Enable Vercel Edge Caching

---

## 🆘 Support Resources

- Next.js Deployment: https://nextjs.org/docs/deployment
- MongoDB Hosting: https://docs.atlas.mongodb.com/
- Vercel Docs: https://vercel.com/docs
- PM2 Guide: https://pm2.keymetrics.io/docs/

---

## 📝 Production Security

1. **Database**
   - Enable encryption at rest
   - Use strong passwords
   - Regular backups

2. **API Security**
   - Add rate limiting
   - Validate all inputs
   - Use API keys for external services

3. **Application**
   - Enable HTTPS everywhere
   - Set security headers
   - Regular security audits

4. **Admin Dashboard**
   - Add authentication (critical!)
   - Use strong passwords
   - Implement 2FA
   - Log all admin actions

---

Happy deploying! 🚀
