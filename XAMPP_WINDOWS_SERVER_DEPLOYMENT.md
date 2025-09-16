# XAMPP Windows Server 2016 Deployment Guide
# emudhra Visitor Management System

## 🖥️ Server Configuration
- **Server**: Windows Server 2016
- **IP Address**: 192.168.1.10
- **Domain**: visitor-emudhra.local
- **Web Server**: XAMPP (Apache + MySQL)
- **Backend**: Node.js (Port 3001)

## 📋 Step-by-Step Deployment

### 1. XAMPP Installation & Configuration

```cmd
# Download XAMPP for Windows from https://www.apachefriends.org/
# Install with default settings to C:\xampp\

# Start XAMPP Control Panel as Administrator
# Start Apache and MySQL services
```

### 2. Domain Configuration

#### **A. Windows Hosts File Configuration**
```cmd
# Edit hosts file as Administrator
notepad C:\Windows\System32\drivers\etc\hosts

# Add this line:
192.168.1.10    visitor-emudhra.local
```

#### **B. Apache Virtual Host Setup**
```apache
# Edit: C:\xampp\apache\conf\httpd.conf
# Uncomment this line:
Include conf/extra/httpd-vhosts.conf

# Edit: C:\xampp\apache\conf\extra\httpd-vhosts.conf
# Add at the end:

<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/visitor-management/dist"
    ServerName visitor-emudhra.local
    ServerAlias www.visitor-emudhra.local
    
    <Directory "C:/xampp/htdocs/visitor-management/dist">
        AllowOverride All
        Require all granted
        DirectoryIndex index.html
        
        # Handle React Router
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Proxy API requests to Node.js backend
    ProxyPreserveHost On
    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api
</VirtualHost>

# For IP access
<VirtualHost 192.168.1.10:80>
    DocumentRoot "C:/xampp/htdocs/visitor-management/dist"
    ServerName 192.168.1.10
    
    <Directory "C:/xampp/htdocs/visitor-management/dist">
        AllowOverride All
        Require all granted
        DirectoryIndex index.html
        
        # Handle React Router
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Proxy API requests to Node.js backend
    ProxyPreserveHost On
    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api
</VirtualHost>
```

#### **C. Enable Apache Modules**
```apache
# In C:\xampp\apache\conf\httpd.conf, uncomment these lines:
LoadModule rewrite_module modules/mod_rewrite.so
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
```

### 3. MySQL Database Setup

```sql
-- Open phpMyAdmin: http://192.168.1.10/phpmyadmin
-- Create database
CREATE DATABASE visitor_management;

-- Import schema (copy from supabase/migrations/20250911055828_flat_shrine.sql)
USE visitor_management;

-- Create visitors table
CREATE TABLE IF NOT EXISTS visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    host VARCHAR(255) NOT NULL,
    check_in_time DATETIME NOT NULL,
    check_out_time DATETIME NULL,
    status ENUM('checked-in', 'checked-out') DEFAULT 'checked-in',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_status ON visitors(status);
CREATE INDEX idx_check_in_time ON visitors(check_in_time);
CREATE INDEX idx_company ON visitors(company);
CREATE INDEX idx_department ON visitors(department);
CREATE INDEX idx_name ON visitors(name);
```

### 4. Project Deployment

```cmd
# Copy project to XAMPP directory
xcopy /E /I "your-project-path" "C:\xampp\htdocs\visitor-management"

# Install Node.js dependencies
cd C:\xampp\htdocs\visitor-management
npm install

cd backend
npm install

# Build for production
cd C:\xampp\htdocs\visitor-management
npm run build:production
```

### 5. Windows Service Setup (Optional)

#### **A. Install Node.js Windows Service**
```cmd
# Install node-windows globally
npm install -g node-windows

# Create service script
cd C:\xampp\htdocs\visitor-management\backend
```

#### **B. Create service.js**
```javascript
// C:\xampp\htdocs\visitor-management\backend\service.js
var Service = require('node-windows').Service;

var svc = new Service({
  name: 'emudhra Visitor Management Backend',
  description: 'emudhra Visitor Management System Backend Service',
  script: 'C:\\xampp\\htdocs\\visitor-management\\backend\\server.js',
  env: {
    name: "NODE_ENV",
    value: "production"
  }
});

svc.on('install', function(){
  svc.start();
});

svc.on('alreadyinstalled', function(){
  console.log('Service already installed');
});

svc.install();
```

#### **C. Install and Start Service**
```cmd
# Run as Administrator
cd C:\xampp\htdocs\visitor-management\backend
node service.js
```

### 6. Firewall Configuration

```cmd
# Open Windows Firewall with Advanced Security
# Add Inbound Rules for:
# - Port 80 (HTTP)
# - Port 3001 (Node.js Backend)
# - Port 3306 (MySQL - if external access needed)

# PowerShell commands (run as Administrator):
New-NetFirewallRule -DisplayName "Apache HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow
New-NetFirewallRule -DisplayName "Node.js Backend" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow
```

### 7. Testing & Verification

#### **A. Test Database Connection**
```cmd
# Visit: http://192.168.1.10/phpmyadmin
# Verify visitor_management database exists
```

#### **B. Test Backend API**
```cmd
# Visit: http://192.168.1.10:3001/api/health
# Should return: {"status":"OK","message":"Server is running"}
```

#### **C. Test Frontend Application**
```cmd
# Visit: http://192.168.1.10
# OR: http://visitor-emudhra.local
# Should show emudhra Visitor Management System
```

### 8. Network Access Configuration

#### **A. For Local Network Access**
```cmd
# Other computers on network can access via:
# http://192.168.1.10
# http://visitor-emudhra.local (if DNS configured)
```

#### **B. Router Configuration (if needed)**
```cmd
# Configure router to:
# - Reserve IP 192.168.1.10 for this server
# - Set up local DNS for visitor-emudhra.local
```

### 9. Maintenance & Monitoring

#### **A. Log Locations**
```cmd
# Apache Logs: C:\xampp\apache\logs\
# MySQL Logs: C:\xampp\mysql\data\
# Node.js Logs: Check Windows Event Viewer
```

#### **B. Backup Strategy**
```cmd
# Database Backup via phpMyAdmin
# File Backup: C:\xampp\htdocs\visitor-management\
```

#### **C. Updates**
```cmd
# To update application:
cd C:\xampp\htdocs\visitor-management
git pull origin main  # if using git
npm run build:production
# Restart Node.js service if installed
```

### 10. Troubleshooting

#### **Common Issues:**

1. **Apache won't start**
   - Check if IIS is running (stop it)
   - Check port 80 availability
   - Review Apache error logs

2. **Node.js backend connection failed**
   - Verify Node.js is installed
   - Check if port 3001 is available
   - Review Windows Event Viewer

3. **Database connection error**
   - Verify MySQL is running in XAMPP
   - Check database credentials
   - Test connection via phpMyAdmin

4. **Domain not resolving**
   - Verify hosts file entry
   - Check Apache virtual host configuration
   - Restart Apache service

### 11. Access URLs

After successful deployment:

- **Main Application**: 
  - http://192.168.1.10
  - http://visitor-emudhra.local

- **API Endpoints**:
  - http://192.168.1.10:3001/api
  - http://visitor-emudhra.local:3001/api

- **Database Admin**:
  - http://192.168.1.10/phpmyadmin

- **XAMPP Control**:
  - http://192.168.1.10/xampp

## 🔧 Production Optimizations

### Performance Settings
```apache
# Add to .htaccess in dist folder
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>

<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

This deployment guide provides complete setup for your Windows Server 2016 with XAMPP configuration.