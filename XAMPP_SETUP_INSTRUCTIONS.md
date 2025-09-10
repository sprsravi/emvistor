# emudhra Visitor Management System - XAMPP Setup Guide

## Prerequisites
- Windows 11
- XAMPP installed (download from https://www.apachefriends.org/)
- Node.js installed (download from https://nodejs.org/)

## Step-by-Step Setup Instructions

### 1. Install and Configure XAMPP

1. **Download and Install XAMPP**
   - Go to https://www.apachefriends.org/
   - Download XAMPP for Windows
   - Install with default settings

2. **Start XAMPP Services**
   - Open XAMPP Control Panel as Administrator
   - Start **Apache** and **MySQL** services
   - Make sure both show "Running" status

3. **Configure MySQL (if needed)**
   - Click "Admin" next to MySQL to open phpMyAdmin
   - Default credentials: username=`root`, password=`(empty)`

### 2. Setup MySQL Database

1. **Create Database**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Click "New" to create a new database
   - Name it: `visitor_management`
   - Click "Create"

2. **Import Database Schema**
   - Select the `visitor_management` database
   - Click "Import" tab
   - Choose the `database/schema.sql` file from your project
   - Click "Go" to execute

   **OR manually run the SQL:**
   - Click "SQL" tab in phpMyAdmin
   - Copy and paste the contents of `database/schema.sql`
   - Click "Go"

### 3. Setup Project Files

1. **Copy Project to XAMPP Directory**
   ```
   Copy your entire project folder to:
   C:\xampp\htdocs\visitor-management\
   ```

2. **Install Backend Dependencies**
   ```bash
   # Open Command Prompt as Administrator
   cd C:\xampp\htdocs\visitor-management\backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd C:\xampp\htdocs\visitor-management
   npm install
   ```

### 4. Build and Deploy

1. **Build React Application**
   ```bash
   # In the main project directory
   cd C:\xampp\htdocs\visitor-management
   npm run build
   ```

2. **Start Backend Server**
   ```bash
   cd C:\xampp\htdocs\visitor-management\backend
   npm start
   ```

### 5. Access the Application

1. **Backend API**: http://localhost:3001/api
2. **Frontend Application**: http://localhost:3001
3. **phpMyAdmin**: http://localhost/phpmyadmin

### 6. Verify Setup

1. **Test Database Connection**
   - Visit: http://localhost:3001/api/health
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **Test API Endpoints**
   - Visit: http://localhost:3001/api/visitors
   - Should return JSON array of visitors

3. **Test Frontend**
   - Visit: http://localhost:3001
   - Should show the emudhra Visitor Management System

### 7. Troubleshooting

**Common Issues:**

1. **Port 3001 already in use**
   ```bash
   # Kill process using port 3001
   netstat -ano | findstr :3001
   taskkill /PID <PID_NUMBER> /F
   ```

2. **MySQL Connection Error**
   - Verify MySQL is running in XAMPP Control Panel
   - Check database name is `visitor_management`
   - Verify credentials in `backend/config/database.js`

3. **Cannot access phpMyAdmin**
   - Make sure Apache is running
   - Try: http://localhost:8080/phpmyadmin (if port 80 is busy)

4. **Node.js not found**
   - Install Node.js from https://nodejs.org/
   - Restart Command Prompt after installation

### 8. Production Deployment

For production deployment on Windows Server:

1. **Install Node.js as Windows Service**
   ```bash
   npm install -g node-windows
   npm link node-windows
   ```

2. **Create Windows Service**
   ```javascript
   // Create service.js in backend folder
   var Service = require('node-windows').Service;
   
   var svc = new Service({
     name: 'emudhra Visitor Management',
     description: 'emudhra Visitor Management System Backend',
     script: 'C:\\xampp\\htdocs\\visitor-management\\backend\\server.js'
   });
   
   svc.on('install', function(){
     svc.start();
   });
   
   svc.install();
   ```

3. **Run Service Installation**
   ```bash
   cd C:\xampp\htdocs\visitor-management\backend
   node service.js
   ```

### 9. CSV Export Feature

The CSV export feature will:
- Export all visitor data from MySQL database
- Include visitor details, check-in/out times, and duration
- Download automatically when "Export CSV" button is clicked
- Files saved with timestamp: `visitors_export_YYYY-MM-DD.csv`

### 10. Backup and Maintenance

**Database Backup:**
1. Open phpMyAdmin
2. Select `visitor_management` database
3. Click "Export" tab
4. Choose "Quick" export method
5. Click "Go" to download backup

**Regular Maintenance:**
- Monitor disk space in `C:\xampp\htdocs\`
- Regular database backups
- Check XAMPP logs for errors
- Update Node.js dependencies periodically

## File Structure
```
C:\xampp\htdocs\visitor-management\
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   └── Visitor.js
│   ├── routes/
│   │   └── visitors.js
│   ├── package.json
│   └── server.js
├── database/
│   └── schema.sql
├── dist/ (built React app)
├── src/ (React source code)
└── package.json
```

## Support
For issues or questions:
1. Check XAMPP Control Panel for service status
2. Review browser console for JavaScript errors
3. Check Node.js server logs in Command Prompt
4. Verify MySQL database connection in phpMyAdmin