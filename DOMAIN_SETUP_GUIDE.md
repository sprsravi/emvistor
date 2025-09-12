# Domain Name Setup Guide for emudhra Visitor Management System

## 🌐 Domain Configuration Options

### 1. **Local Network Access (IP Address)**
```bash
# Update .env file
VITE_API_BASE_URL=http://192.168.1.100:3001/api
```
- Replace `192.168.1.100` with your server's IP address
- Accessible from other computers on the same network

### 2. **Custom Domain Setup**
```bash
# Update .env file
VITE_API_BASE_URL=https://visitor.emudhra.com/api
```

### 3. **Subdomain Configuration**
```bash
# Examples:
VITE_API_BASE_URL=https://vm.yourcompany.com/api
VITE_API_BASE_URL=https://visitors.emudhra.com/api
```

## 🚀 **Step-by-Step Domain Setup**

### **Option A: Local Network (IP Address)**

1. **Find Your Server IP:**
   ```cmd
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```

2. **Update Configuration:**
   ```bash
   # In .env file
   VITE_API_BASE_URL=http://YOUR_IP_ADDRESS:3001/api
   ```

3. **Update CORS in backend/server.js:**
   ```javascript
   origin: [
     'http://localhost:5173',
     'http://YOUR_IP_ADDRESS:3001',
     'http://YOUR_IP_ADDRESS:5173'
   ]
   ```

### **Option B: Custom Domain**

1. **Purchase/Configure Domain:**
   - Buy domain from registrar (GoDaddy, Namecheap, etc.)
   - Point domain to your server IP

2. **Update DNS Records:**
   ```
   A Record: visitor.emudhra.com → YOUR_SERVER_IP
   CNAME: www.visitor.emudhra.com → visitor.emudhra.com
   ```

3. **Update Configuration:**
   ```bash
   # In .env file
   VITE_API_BASE_URL=https://visitor.emudhra.com/api
   ```

4. **SSL Certificate (for HTTPS):**
   - Use Let's Encrypt (free)
   - Or purchase SSL certificate
   - Configure in your web server

### **Option C: Windows Host File (Local Testing)**

1. **Edit Host File (as Administrator):**
   ```
   File: C:\Windows\System32\drivers\etc\hosts
   
   Add line:
   127.0.0.1    visitor.emudhra.local
   ```

2. **Update Configuration:**
   ```bash
   VITE_API_BASE_URL=http://visitor.emudhra.local:3001/api
   ```

## 🔧 **XAMPP Virtual Host Setup**

### **1. Enable Virtual Hosts:**
```apache
# In C:\xampp\apache\conf\httpd.conf
# Uncomment this line:
Include conf/extra/httpd-vhosts.conf
```

### **2. Configure Virtual Host:**
```apache
# In C:\xampp\apache\conf\extra\httpd-vhosts.conf
<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/visitor-management/dist"
    ServerName visitor.emudhra.local
    ServerAlias www.visitor.emudhra.local
    
    <Directory "C:/xampp/htdocs/visitor-management/dist">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### **3. Restart Apache:**
- Stop and start Apache in XAMPP Control Panel

## 🌍 **Production Deployment Options**

### **1. Cloud Hosting (Recommended):**
- **AWS EC2** with Elastic IP
- **Google Cloud Platform** with static IP
- **DigitalOcean** droplet
- **Azure** virtual machine

### **2. VPS Hosting:**
- **Hostinger VPS**
- **Vultr**
- **Linode**

### **3. Shared Hosting:**
- Upload built files to hosting provider
- Configure database connection
- Update API endpoints

## 📝 **Configuration Examples**

### **Development:**
```bash
VITE_API_BASE_URL=http://localhost:3001/api
```

### **Local Network:**
```bash
VITE_API_BASE_URL=http://192.168.1.100:3001/api
```

### **Production Domain:**
```bash
VITE_API_BASE_URL=https://visitor.emudhra.com/api
```

### **Custom Port:**
```bash
VITE_API_BASE_URL=https://yourdomain.com:8080/api
```

## 🔒 **Security Considerations**

1. **HTTPS in Production:**
   - Always use HTTPS for production
   - Configure SSL certificates
   - Update CORS settings

2. **Firewall Configuration:**
   - Open necessary ports (80, 443, 3001)
   - Restrict database access

3. **Environment Variables:**
   - Never commit production credentials
   - Use different .env files for different environments

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **CORS Error:**
   - Update backend CORS configuration
   - Add your domain to allowed origins

2. **DNS Not Resolving:**
   - Check DNS propagation (24-48 hours)
   - Verify A records point to correct IP

3. **SSL Certificate Issues:**
   - Ensure certificate is valid
   - Check certificate chain

4. **Port Access Issues:**
   - Check firewall settings
   - Verify port forwarding

## 📞 **Quick Setup Commands**

```bash
# 1. Update environment
echo "VITE_API_BASE_URL=https://yourdomain.com/api" > .env

# 2. Rebuild application
npm run build

# 3. Restart backend
cd backend
npm start

# 4. Test connection
curl https://yourdomain.com/api/health
```

Replace `yourdomain.com` with your actual domain name throughout the configuration files.