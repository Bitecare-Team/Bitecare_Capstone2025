-- Create appointments table for patient bookings
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Appointment Details
  appointment_date DATE NOT NULL,
  appointment_time VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  reason TEXT DEFAULT 'Rabies Vaccination',
  
  -- Patient Information (filled by patient)
  patient_name VARCHAR(255) NOT NULL,
  patient_age INTEGER,
  patient_sex VARCHAR(10) CHECK (patient_sex IN ('Male', 'Female')),
  patient_address TEXT,
  patient_contact VARCHAR(20),
  date_of_birth DATE,
  
  -- Bite Information (filled by patient)
  date_bitten DATE,
  site_of_bite TEXT,
  biting_animal VARCHAR(100),
  animal_status VARCHAR(20) CHECK (animal_status IN ('Immunized', 'Unimmunized', 'Unknown')),
  place_bitten VARCHAR(255), -- Barangay
  time_bitten VARCHAR(20),
  provoke VARCHAR(10) CHECK (provoke IN ('Yes', 'No')),
  local_wound_treatment VARCHAR(10) CHECK (local_wound_treatment IN ('Yes', 'No')),
  
  -- Terms and Conditions
  terms_accepted BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_update_appointments_updated_at ON appointments;
CREATE TRIGGER trigger_update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_appointments_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create simple policy to allow authenticated users to manage appointments
DROP POLICY IF EXISTS "Allow authenticated users full access" ON appointments;
CREATE POLICY "Allow authenticated users full access" ON appointments
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Insert sample appointment for testing (commented out for now)
-- INSERT INTO appointments (
--   user_id,
--   appointment_date,
--   appointment_time,
--   full_name,
--   age,
--   sex,
--   address,
--   contact_number,
--   date_of_birth,
--   date_bitten,
--   site_of_bite,
--   biting_animal,
--   animal_status,
--   place_bitten,
--   time_bitten,
--   provoke,
--   local_wound_treatment,
--   created_by
-- ) VALUES (
--   (SELECT id FROM auth.users LIMIT 1), -- Use first available user
--   CURRENT_DATE + INTERVAL '1 day',
--   '10:00 AM',
--   'John Doe',
--   25,
--   'Male',
--   '123 Main St, Barangay Sample',
--   '09123456789',
--   '1998-01-15',
--   CURRENT_DATE - INTERVAL '2 days',
--   'Left hand',
--   'Dog',
--   'Unknown',
--   'Barangay Sample',
--   '2:30 PM',
--   'No',
--   'Yes',
--   (SELECT id FROM auth.users LIMIT 1)
-- ) ON CONFLICT DO NOTHING;
