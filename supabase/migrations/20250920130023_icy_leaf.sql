/*
  # Add Location, Appointment and Electronic Devices Fields

  1. New Columns
    - `location` (varchar) - Location/floor/room where visitor is going
    - `appointment_with` (varchar) - Person visitor has appointment with
    - `appointment_time` (datetime) - Scheduled appointment time
    - `has_electronic_devices` (boolean) - Whether visitor is carrying electronic devices
    - `electronic_devices_list` (text) - List of electronic devices being carried

  2. Changes
    - Alter existing visitors table to add new fields
    - Add indexes for better performance
*/

-- Add new fields to visitors table
ALTER TABLE visitors 
ADD COLUMN location VARCHAR(255) NULL,
ADD COLUMN appointment_with VARCHAR(255) NULL,
ADD COLUMN appointment_time DATETIME NULL,
ADD COLUMN has_electronic_devices BOOLEAN DEFAULT FALSE,
ADD COLUMN electronic_devices_list TEXT NULL;

-- Add indexes for better performance
CREATE INDEX idx_location ON visitors(location);
CREATE INDEX idx_appointment_with ON visitors(appointment_with);
CREATE INDEX idx_appointment_time ON visitors(appointment_time);
CREATE INDEX idx_has_electronic_devices ON visitors(has_electronic_devices);