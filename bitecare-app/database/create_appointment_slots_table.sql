-- Create appointment_slots table
CREATE TABLE IF NOT EXISTS appointment_slots (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  time_slot TIME NOT NULL,
  total_slots INTEGER NOT NULL DEFAULT 1,
  available_slots INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure available_slots doesn't exceed total_slots
  CONSTRAINT check_available_slots CHECK (available_slots >= 0 AND available_slots <= total_slots),
  
  -- Unique constraint to prevent duplicate time slots for the same date
  UNIQUE(date, time_slot)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_appointment_slots_date ON appointment_slots(date);
CREATE INDEX IF NOT EXISTS idx_appointment_slots_available ON appointment_slots(available_slots) WHERE available_slots > 0;

-- Note: Appointment slots should be managed by admin users only
-- No sample data inserted - admin will add slots as needed

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_appointment_slots_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_appointment_slots_updated_at
  BEFORE UPDATE ON appointment_slots
  FOR EACH ROW
  EXECUTE FUNCTION update_appointment_slots_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE appointment_slots ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read appointment slots
CREATE POLICY "Allow read access to appointment slots" ON appointment_slots
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to book appointments (decrease available_slots)
CREATE POLICY "Allow authenticated users to book appointments" ON appointment_slots
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated' AND available_slots >= 0);

-- Create function to atomically decrease available slots
CREATE OR REPLACE FUNCTION decrease_available_slots(slot_date DATE, slot_time TIME)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE appointment_slots 
  SET available_slots = available_slots - 1
  WHERE date = slot_date 
    AND time_slot = slot_time 
    AND available_slots > 0;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
