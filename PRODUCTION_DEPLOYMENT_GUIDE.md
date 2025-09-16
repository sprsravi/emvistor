# Production Deployment Guide - emudhra Visitor Management System

## 🚀 Production Server Setup

### Prerequisites
- **Linux/Windows Server** with Node.js 18+ and MySQL
- **Domain name** configured with DNS
- **SSL Certificate** for HTTPS (recommended: Let's Encrypt)
- **Reverse proxy** (Nginx/Apache) for production

## 📋 Step-by-Step Production Deployment

### 1. Server Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Install PM2 for process management
sudo npm install -g pm2
```

### 2. Database Setup

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create production database
CREATE DATABASE visitor_management;

-- Create dedicated user for production
CREATE USER 'visitor_app'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON visitor_management.* TO 'visitor_app'@'localhost';
FLUSH PRIVILEGES;

-- Import schema
USE visitor_management;
SOURCE /path/to/your/schema.sql;
```

### 3. Application Deployment

```bash
# Clone/upload your application to server
cd /var/www/
sudo git clone your-repo visitor-management
cd visitor-management

# Install dependencies
npm install --production
cd backend && npm install --production && cd ..

# Set up environment files
sudo cp .env.production .env
sudo cp backend/.env.production backend/.env

# Edit environment files with your production values
sudo nano .env
sudo nano backend/.env
```

### 4. Environment Configuration

**Frontend (.env):**
```bash
VITE_API_BASE_URL=https://visitor.emudhra.com/api
```

**Backend (backend/.env):**
```bash
DB_HOST=localhost
DB_USER=visitor_app
DB_PASSWORD=your_secure_password
DB_NAME=visitor_management
DB_PORT=3306
PORT=3001
NODE_ENV=production
CORS_ORIGINS=https://visitor.emudhra.com,https://www.visitor.emudhra.com
```

### 5. Build Application

```bash
# Build for production
npm run build:production

# Verify build files
ls -la dist/
```

### 6. Nginx Configuration

```nginx
# /etc/nginx/sites-available/visitor-management
server {
    listen 80;
    server_name visitor.emudhra.com www.visitor.emudhra.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name visitor.emudhra.com www.visitor.emudhra.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/visitor.emudhra.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/visitor.emudhra.com/privkey.pem;

    # Serve React build files
    location / {
        root /var/www/visitor-management/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Proxy API requests to Node.js backend
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d visitor.emudhra.com -d www.visitor.emudhra.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### 8. Process Management with PM2

```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'visitor-management-backend',
    script: './backend/server.js',
    cwd: '/var/www/visitor-management',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 9. Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 3306  # MySQL (only if needed externally)
sudo ufw enable
```

### 10. Monitoring and Maintenance

```bash
# Monitor PM2 processes
pm2 status
pm2 logs visitor-management-backend

# Monitor system resources
pm2 monit

# Restart application
pm2 restart visitor-management-backend

# Update application
cd /var/www/visitor-management
git pull origin main
npm run build:production
pm2 restart visitor-management-backend
```

## 🔧 Production Optimizations

### Performance Optimizations

1. **Enable Gzip Compression:**
```nginx
# Add to nginx server block
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

2. **Database Connection Pooling:**
```javascript
// In backend/config/database.js
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'visitor_management',
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000
};
```

### Security Enhancements

1. **Rate Limiting:**
```bash
npm install express-rate-limit
```

2. **Security Headers:**
```bash
npm install helmet
```

3. **Input Validation:**
```bash
npm install joi
```

## 📊 Backup Strategy

### Database Backup
```bash
# Create backup script
cat > /usr/local/bin/backup-visitor-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/visitor-management"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

mysqldump -u visitor_app -p'your_secure_password' visitor_management > $BACKUP_DIR/visitor_management_$DATE.sql
gzip $BACKUP_DIR/visitor_management_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-visitor-db.sh

# Add to crontab for daily backups
echo "0 2 * * * /usr/local/bin/backup-visitor-db.sh" | sudo crontab -
```

## 🚨 Troubleshooting

### Common Issues

1. **502 Bad Gateway:**
   - Check if backend is running: `pm2 status`
   - Check nginx configuration: `sudo nginx -t`
   - Check logs: `pm2 logs`

2. **Database Connection Error:**
   - Verify MySQL is running: `sudo systemctl status mysql`
   - Check database credentials in `.env`
   - Test connection: `mysql -u visitor_app -p visitor_management`

3. **SSL Certificate Issues:**
   - Renew certificate: `sudo certbot renew`
   - Check certificate status: `sudo certbot certificates`

### Log Locations
- **Nginx:** `/var/log/nginx/`
- **PM2:** `/var/www/visitor-management/logs/`
- **MySQL:** `/var/log/mysql/`

## 📞 Support Checklist

Before deployment, ensure:
- [ ] Domain DNS is configured
- [ ] SSL certificate is installed
- [ ] Database is set up with proper credentials
- [ ] Environment variables are configured
- [ ] Firewall rules are applied
- [ ] Backup strategy is implemented
- [ ] Monitoring is configured

## 🔄 Deployment Commands Summary

```bash
# Quick deployment commands
cd /var/www/visitor-management
git pull origin main
npm run build:production
pm2 restart visitor-management-backend
sudo systemctl reload nginx
```

This guide provides a complete production deployment setup for the emudhra Visitor Management System with security, performance, and reliability considerations.