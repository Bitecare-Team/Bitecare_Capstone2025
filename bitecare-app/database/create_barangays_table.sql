-- Create barangays table for BiteCare app
CREATE TABLE IF NOT EXISTS barangays (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  municipality TEXT DEFAULT 'Butuan City',
  province TEXT DEFAULT 'Agusan del Norte',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert barangays in Butuan City
INSERT INTO barangays (name) VALUES
  ('Agao'),
  ('Ambago'),
  ('Amparo'),
  ('Anticala'),
  ('Baan Km. 3'),
  ('Baan Riverside'),
  ('Babag'),
  ('Bancasi'),
  ('Banza'),
  ('Baobaoan'),
  ('Basag'),
  ('Bilay'),
  ('Bit-os'),
  ('Bobon'),
  ('Bood'),
  ('Cabcabon'),
  ('Dagohoy'),
  ('Dankias'),
  ('Diego Silang'),
  ('Doongan'),
  ('Dumalagan'),
  ('Florida'),
  ('Golden Ribbon'),
  ('Guingona'),
  ('Holy Redeemer'),
  ('Humabon'),
  ('Imadejas'),
  ('Jose Rizal'),
  ('Kinamlutan'),
  ('Lapu-lapu'),
  ('Lemon'),
  ('Leon Kilat'),
  ('Libertad'),
  ('Limaha'),
  ('Los Angeles'),
  ('Lumbocan'),
  ('Mahay'),
  ('Maibu'),
  ('Mandamo'),
  ('Maon'),
  ('Masao'),
  ('Matin-ao'),
  ('New Society Village'),
  ('Nongnong'),
  ('Ong Yiu'),
  ('Pagatpatan'),
  ('Pangabugan'),
  ('Pianing'),
  ('Pinamanculan'),
  ('Port Poyohon'),
  ('Rajah Soliman'),
  ('San Ignacio'),
  ('San Mateo'),
  ('Santo Niño'),
  ('Sikatuna'),
  ('Silongan'),
  ('Sumilihon'),
  ('Tagabaca'),
  ('Taguibo'),
  ('Taligaman'),
  ('Tandang Sora'),
  ('Tiniwisan'),
  ('Tungao'),
  ('Villa Kananga')
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE barangays ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read barangays
CREATE POLICY IF NOT EXISTS "Anyone can view barangays" ON barangays
  FOR SELECT TO authenticated, anon
  USING (true);
