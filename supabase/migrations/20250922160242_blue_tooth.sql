/*
  # Complete Database Schema for emudhra Visitor Management System
  # Consolidated from all migrations for easy MySQL import
  
  This file contains:
  1. Database creation
  2. Complete visitors table with all fields
  3. Indexes for performance
  4. Sample data (optional)
  5. All features: identity cards, location, appointments, electronic devices
*/

-- Create database
CREATE DATABASE IF NOT EXISTS visitor_management;
USE visitor_management;

-- Drop table if exists (for clean import)
DROP TABLE IF EXISTS visitors;

-- Create complete visitors table with all fields
CREATE TABLE visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    host VARCHAR(255) NOT NULL,
    
    -- Location and appointment fields
    location VARCHAR(255) NULL,
    appointment_with VARCHAR(255) NULL,
    appointment_time DATETIME NULL,
    
    -- Electronic devices fields
    has_electronic_devices BOOLEAN DEFAULT FALSE,
    electronic_devices_list TEXT NULL,
    
    -- Identity card fields (any one ID is acceptable)
    id_type ENUM('pan', 'aadhaar', 'driving_license', 'passport', 'voter_id', 'other') NULL,
    id_number VARCHAR(50) NULL,
    id_verified BOOLEAN DEFAULT FALSE,
    
    -- Check-in/out tracking
    check_in_time DATETIME NOT NULL,
    check_out_time DATETIME NULL,
    status ENUM('checked-in', 'checked-out') DEFAULT 'checked-in',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_status ON visitors(status);
CREATE INDEX idx_check_in_time ON visitors(check_in_time);
CREATE INDEX idx_company ON visitors(company);
CREATE INDEX idx_department ON visitors(department);
CREATE INDEX idx_name ON visitors(name);
CREATE INDEX idx_location ON visitors(location);
CREATE INDEX idx_appointment_with ON visitors(appointment_with);
CREATE INDEX idx_appointment_time ON visitors(appointment_time);
CREATE INDEX idx_has_electronic_devices ON visitors(has_electronic_devices);
CREATE INDEX idx_id_type ON visitors(id_type);
CREATE INDEX idx_id_number ON visitors(id_number);

-- Add constraint to ensure id_number is provided when id_type is selected
ALTER TABLE visitors 
ADD CONSTRAINT chk_id_details 
CHECK ((id_type IS NULL AND id_number IS NULL) OR (id_type IS NOT NULL AND id_number IS NOT NULL));

-- Insert sample data (optional - remove if not needed)
INSERT INTO visitors (
    name, company, department, purpose, phone, email, host, 
    location, appointment_with, appointment_time, 
    has_electronic_devices, electronic_devices_list,
    id_type, id_number, check_in_time, status
) VALUES
(
    'John Doe', 'Tech Corp', 'IT-Infrastructure', 'Business Meeting', 
    '+1234567890', 'john@techcorp.com', 'Alice Smith',
    'Floor 2, Conference Room A', 'Alice Smith', '2024-01-15 14:00:00',
    TRUE, 'Laptop, Mobile Phone',
    'pan', 'ABCDE1234F', '2024-01-15 09:30:00', 'checked-in'
),
(
    'Jane Wilson', 'Design Studio', 'Marketing', 'Interview', 
    '+1234567891', 'jane@designstudio.com', 'Bob Johnson',
    'Floor 1, HR Room', 'Bob Johnson', '2024-01-15 11:00:00',
    FALSE, NULL,
    'aadhaar', '123456789012', '2024-01-15 10:15:00', 'checked-out'
),
(
    'Mike Brown', 'Consulting Inc', 'HR', 'Consultation', 
    '+1234567892', 'mike@consulting.com', 'Carol Davis',
    'Floor 3, Office 301', 'Carol Davis', '2024-01-15 15:30:00',
    TRUE, 'Tablet, Camera',
    'driving_license', 'DL1234567890', '2024-01-15 11:00:00', 'checked-in'
);

-- Update check-out time for checked-out visitor
UPDATE visitors SET check_out_time = '2024-01-15 12:30:00' WHERE name = 'Jane Wilson';

-- Display table structure for verification
DESCRIBE visitors;

-- Display sample data
SELECT 
    id, name, company, department, purpose, host,
    location, appointment_with, 
    has_electronic_devices, id_type,
    check_in_time, status
FROM visitors;

-- Success message
SELECT 'Database schema created successfully! All features included.' as message;