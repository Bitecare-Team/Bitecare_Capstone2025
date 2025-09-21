# BiteCare App Setup Guide

## Quick Start

1. **Install Dependencies** (Already done)
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Set up Supabase** (Required)
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Get your project URL and anon key
   - Update `src/config/supabase.js`:
   ```javascript
   const supabaseUrl = 'YOUR_SUPABASE_URL';
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
   ```

3. **Start the App**
   ```bash
   # Option 1: Normal start
   npm start
   
   # Option 2: Offline mode (if network issues)
   npx expo start --offline
   
   # Option 3: Specific port
   npx expo start --port 8082
   ```

4. **Test on Device**
   - Install "Expo Go" app on your phone
   - Scan the QR code from the terminal
   - Or use Android/iOS simulator

## Database Setup (Supabase)

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  date_of_birth DATE,
  sex TEXT,
  contact_number TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  appointment_type TEXT DEFAULT 'Rabies Vaccination',
  status TEXT DEFAULT 'pending',
  patient_name TEXT,
  patient_contact TEXT,
  patient_address TEXT,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create treatment progress table
CREATE TABLE public.treatment_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  total_doses INTEGER DEFAULT 5,
  completed_doses INTEGER DEFAULT 0,
  last_dose_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own treatment progress" ON public.treatment_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own treatment progress" ON public.treatment_progress
  FOR UPDATE USING (auth.uid() = user_id);
```

## Troubleshooting

### Network Issues
If you get "fetch failed" errors:
```bash
npx expo start --offline
```

### Port Issues
If port 8081 is busy:
```bash
npx expo start --port 8082
```

### Dependencies Issues
```bash
npm install --legacy-peer-deps
```

## App Features

✅ **Authentication**: Sign up, Sign in, Email verification
✅ **Homepage**: User info, treatment progress, quick actions
✅ **Appointments**: View and book appointments
✅ **Map**: ABTC clinic locations
✅ **Profile**: Edit profile and settings
✅ **Navigation**: Bottom tab navigation

## Next Steps

1. Set up Supabase credentials
2. Create database tables
3. Start the app
4. Test on your device
5. Customize as needed

The app is ready to use! 🚀
