# BiteCare - Rabies Vaccination Appointment App

A React Native Expo application for managing rabies vaccination appointments at RHU ABTC Clinic in Bogo City, Cebu.

## Features

### Authentication
- **Sign Up**: Complete registration with full name, date of birth, sex, contact number, address, email, and password
- **Sign In**: Email and password authentication
- **Email Verification**: Account verification via Gmail
- **Google Sign In**: Social authentication (placeholder implementation)

### Homepage
- **User Information**: Displays user's name and profile
- **Clinic Information**: Shows RHU ABTC clinic hours and details
- **Treatment Progress**: Status bar showing completed doses out of total doses
- **Quick Actions**: 
  - Book Appointment
  - My Appointments
  - View Location
  - Help & FAQ's
- **Recent Activity**: Shows recent vaccination activities

### Appointments
- **Upcoming Appointments**: View confirmed and pending appointments
- **Past Appointments**: View completed appointments
- **Book Appointment**: Multi-step booking process:
  1. Select available date and time slot
  2. Enter patient information
  3. Confirm appointment and accept terms & conditions

### Map
- **ABTC Locations**: Shows all available ABTC clinics in Bogo City
- **Interactive Map**: Displays clinic locations (placeholder)
- **Clinic Details**: Contact information, hours, and directions
- **Emergency Information**: Quick access to emergency contacts

### More/Profile
- **Edit Profile**: Update personal information
- **Settings**: 
  - Notifications toggle
  - Language selection (English, Filipino, Cebuano)
  - Terms & Conditions
  - Privacy Policy
  - Help & FAQ's
  - About
- **Logout**: Secure sign out

## Technology Stack

- **React Native Expo**: Cross-platform mobile development
- **Supabase**: Backend-as-a-Service for authentication and database
- **React Navigation**: Navigation between screens
- **Expo Vector Icons**: Icon library
- **React Native Calendars**: Calendar component for appointment booking
- **Expo Location**: Location services for map functionality

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bitecare-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key
   - Update `src/config/supabase.js` with your credentials:
   ```javascript
   const supabaseUrl = 'YOUR_SUPABASE_URL';
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
   ```

4. **Set up Supabase Database**
   Create the following tables in your Supabase database:

   ```sql
   -- Users table (extends auth.users)
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

   -- Appointments table
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

   -- Treatment progress table
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

5. **Run the application**
   ```bash
   npm start
   ```

6. **Test on device**
   - Install Expo Go app on your mobile device
   - Scan the QR code from the terminal
   - Or run on simulator: `npm run ios` or `npm run android`

## Color Theme

The app uses a consistent color scheme based on the provided designs:

- **Primary Blue**: `#4285F4` - Main buttons and active elements
- **Light Blue**: `#A0C4FF` - Secondary buttons and backgrounds
- **Background**: `#F8F9FA` - Main background color
- **Card Background**: `#FFFFFF` - White for cards and modals
- **Text Primary**: `#343A40` - Dark gray for main text
- **Text Secondary**: `#6C757D` - Light gray for secondary text

## Project Structure

```
bitecare-app/
├── src/
│   ├── config/
│   │   └── supabase.js          # Supabase configuration
│   ├── contexts/
│   │   └── AuthContext.jsx      # Authentication context
│   ├── navigation/
│   │   └── AppNavigator.jsx     # Navigation setup
│   ├── screens/
│   │   ├── WelcomeScreen.jsx    # Welcome/onboarding screen
│   │   ├── SignInScreen.jsx     # Sign in screen
│   │   ├── SignUpScreen.jsx     # Sign up screen
│   │   ├── HomeScreen.jsx       # Homepage
│   │   ├── AppointmentsScreen.jsx # Appointments list
│   │   ├── BookAppointmentScreen.jsx # Appointment booking
│   │   ├── MapScreen.jsx        # Map and locations
│   │   ├── MoreScreen.jsx       # More/Profile screen
│   │   └── EditProfileScreen.jsx # Edit profile screen
│   └── styles/
│       ├── colors.js            # Color definitions
│       └── globalStyles.js      # Global styles
├── App.js                       # Main app component
└── package.json
```

## Features Implementation Status

- ✅ Authentication (Sign Up, Sign In, Email Verification)
- ✅ Homepage with user info and quick actions
- ✅ Appointments management (view, book)
- ✅ Map with ABTC locations
- ✅ Profile management and settings
- ✅ Bottom navigation
- ✅ Color theme and styling
- ⏳ Google Sign In (placeholder)
- ⏳ Real-time notifications
- ⏳ Offline support
- ⏳ Push notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
