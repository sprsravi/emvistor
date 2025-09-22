# Database Setup Instructions

## Quick Import to MySQL

### Option 1: Using phpMyAdmin (Recommended for XAMPP)
1. Open phpMyAdmin: `http://192.168.1.10/phpmyadmin`
2. Click "Import" tab
3. Choose file: `complete_schema.sql`
4. Click "Go" to execute

### Option 2: Using MySQL Command Line
```bash
mysql -u root -p < database/complete_schema.sql
```

### Option 3: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your MySQL server
3. File → Open SQL Script
4. Select `complete_schema.sql`
5. Execute the script

## Database Features Included

### Core Fields
- ✅ Visitor basic information (name, company, department, etc.)
- ✅ Check-in/check-out tracking
- ✅ Host employee information

### Additional Fields
- ✅ **Location/Floor/Room** - Where visitor is going
- ✅ **Appointment details** - Person and time of appointment
- ✅ **Electronic devices** - Checkbox and device list
- ✅ **Identity cards** - Any one ID proof (PAN, Aadhaar, etc.)

### Performance Features
- ✅ **Indexes** on all searchable fields
- ✅ **Constraints** for data integrity
- ✅ **Sample data** for testing

## Table Structure

```sql
visitors (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    name                    VARCHAR(255) NOT NULL,
    company                 VARCHAR(255) NOT NULL,
    department              VARCHAR(255) NOT NULL,
    purpose                 VARCHAR(255) NOT NULL,
    phone                   VARCHAR(20) NOT NULL,
    email                   VARCHAR(255),
    host                    VARCHAR(255) NOT NULL,
    location                VARCHAR(255),
    appointment_with        VARCHAR(255),
    appointment_time        DATETIME,
    has_electronic_devices  BOOLEAN DEFAULT FALSE,
    electronic_devices_list TEXT,
    id_type                 ENUM(...),
    id_number               VARCHAR(50),
    id_verified             BOOLEAN DEFAULT FALSE,
    check_in_time           DATETIME NOT NULL,
    check_out_time          DATETIME,
    status                  ENUM('checked-in', 'checked-out'),
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

## Verification

After import, verify the setup:

1. **Check database exists:**
   ```sql
   SHOW DATABASES;
   ```

2. **Check table structure:**
   ```sql
   USE visitor_management;
   DESCRIBE visitors;
   ```

3. **Check sample data:**
   ```sql
   SELECT * FROM visitors;
   ```

## Troubleshooting

### Common Issues:
1. **Permission denied**: Run MySQL as administrator
2. **Database exists**: The script will recreate the table safely
3. **Character encoding**: Ensure UTF-8 encoding in phpMyAdmin

### Clean Install:
If you need to start fresh:
```sql
DROP DATABASE IF EXISTS visitor_management;
```
Then re-run the complete_schema.sql file.