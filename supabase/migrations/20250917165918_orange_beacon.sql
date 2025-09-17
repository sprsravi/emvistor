/*
  # Add Identity Card Fields to Visitors Table

  1. New Columns
    - `id_type` (enum) - Type of identity document (PAN, Aadhaar, Driving License, Passport, etc.)
    - `id_number` (varchar) - Identity document number
    - `id_verified` (boolean) - Whether ID was verified (default false)

  2. Security
    - Add indexes for better performance
    - Ensure data integrity with constraints

  3. Changes
    - Alter existing visitors table to add identity fields
    - Add validation constraints
*/

-- Add identity card fields to visitors table
ALTER TABLE visitors 
ADD COLUMN id_type ENUM('pan', 'aadhaar', 'driving_license', 'passport', 'voter_id', 'other') NULL,
ADD COLUMN id_number VARCHAR(50) NULL,
ADD COLUMN id_verified BOOLEAN DEFAULT FALSE;

-- Add indexes for better performance
CREATE INDEX idx_id_type ON visitors(id_type);
CREATE INDEX idx_id_number ON visitors(id_number);

-- Add constraint to ensure id_number is provided when id_type is selected
ALTER TABLE visitors 
ADD CONSTRAINT chk_id_details 
CHECK ((id_type IS NULL AND id_number IS NULL) OR (id_type IS NOT NULL AND id_number IS NOT NULL));