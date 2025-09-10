-- Create database
CREATE DATABASE IF NOT EXISTS visitor_management;
USE visitor_management;

-- Create visitors table
CREATE TABLE IF NOT EXISTS visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
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

-- Create indexes for better performance
CREATE INDEX idx_status ON visitors(status);
CREATE INDEX idx_check_in_time ON visitors(check_in_time);
CREATE INDEX idx_company ON visitors(company);
CREATE INDEX idx_name ON visitors(name);

-- Insert sample data (optional)
INSERT INTO visitors (name, company, purpose, phone, email, host, check_in_time, status) VALUES
('John Doe', 'Tech Corp', 'Business Meeting', '+1234567890', 'john@techcorp.com', 'Alice Smith', '2024-01-15 09:30:00', 'checked-in'),
('Jane Wilson', 'Design Studio', 'Interview', '+1234567891', 'jane@designstudio.com', 'Bob Johnson', '2024-01-15 10:15:00', 'checked-out'),
('Mike Brown', 'Consulting Inc', 'Consultation', '+1234567892', 'mike@consulting.com', 'Carol Davis', '2024-01-15 11:00:00', 'checked-in');

-- Update check-out time for checked-out visitor
UPDATE visitors SET check_out_time = '2024-01-15 12:30:00' WHERE name = 'Jane Wilson';