import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { useAuth } from '../contexts/AuthContext';
import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../config/supabase';

const SignUpScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    sex: '',
    contactNumber: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBarangayDropdown, setShowBarangayDropdown] = useState(false);
  const [barangays, setBarangays] = useState([]);
  const [barangaysLoading, setBarangaysLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  // Fetch barangays from database
  useEffect(() => {
    fetchBarangays();
  }, []);

  const fetchBarangays = async () => {
    try {
      console.log('Fetching barangays from database...');
      setBarangaysLoading(true);
      
      const { data, error } = await supabase
        .from('barangays')
        .select('id, name')
        .order('name');
      
      if (error) {
        console.error('Error fetching barangays:', error);
        console.error('Error details:', error.message, error.code);
        // Set fallback barangays if database fails
        setBarangays([
          { id: 1, name: 'Agao' },
          { id: 2, name: 'Ambago' },
          { id: 3, name: 'Bancasi' },
          { id: 4, name: 'Banza' },
          { id: 5, name: 'Butuan' },
          { id: 6, name: 'Dagohoy' },
          { id: 7, name: 'Florida' },
          { id: 8, name: 'Libertad' },
          { id: 9, name: 'Masao' },
          { id: 10, name: 'Santo Niño' }
        ]);
      } else {
        console.log('Barangays fetched successfully:', data?.length, 'items');
        setBarangays(data || []);
      }
    } catch (error) {
      console.error('Unexpected error fetching barangays:', error);
      // Set fallback barangays
      setBarangays([
        { id: 1, name: 'Agao' },
        { id: 2, name: 'Ambago' },
        { id: 3, name: 'Bancasi' },
        { id: 4, name: 'Banza' },
        { id: 5, name: 'Butuan' }
      ]);
    } finally {
      setBarangaysLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'email') {
      console.log('Email field updated:', value);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { fullName, dateOfBirth, sex, contactNumber, address, email, password, confirmPassword } = formData;
    
    console.log('Validating form with email:', email);
    console.log('Full form data:', formData);
    
    if (!fullName || !dateOfBirth || !sex || !contactNumber || !address || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    // Contact number validation - must be exactly 11 digits
    const contactRegex = /^[0-9]{11}$/;
    if (!contactRegex.test(contactNumber)) {
      Alert.alert('Error', 'Contact number must be exactly 11 digits');
      return false;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Email validation failed for:', email);
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const { email, password, confirmPassword, ...userData } = formData;

    console.log('Email being used for signup:', email);
    console.log('User data being sent to Supabase:', userData);

    const { error, warning } = await signUp(email, password, userData);
    setLoading(false);

    if (error) {
      console.error('Error during sign-up:', error);
      Alert.alert('Error', error.message);
    } else if (warning) {
      Alert.alert(
        'Account Created', 
        `${warning} Please check your email for verification.`,
        [{ text: 'OK', onPress: () => navigation.navigate('SignIn') }]
      );
    } else {
      Alert.alert(
        'Success', 
        'Account created successfully! Please check your email for verification.',
        [{ text: 'OK', onPress: () => navigation.navigate('SignIn') }]
      );
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      handleInputChange('dateOfBirth', formattedDate);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <Ionicons name="medical" size={40} color={colors.primary} />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join BiteCare for rabies vaccination</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputContainer}>
              <Text style={globalStyles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={[globalStyles.input, styles.input]}
                  value={formData.fullName}
                  onChangeText={(value) => handleInputChange('fullName', value)}
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Date of Birth */}
            <View style={styles.inputContainer}>
              <Text style={globalStyles.label}>Date of Birth</Text>
              <TouchableOpacity
                style={[globalStyles.input, styles.dateInput]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {formData.dateOfBirth || 'Select your date of birth'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
              {showDatePicker && Platform.OS !== 'web' && (
                <DateTimePicker
                  value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
              {showDatePicker && Platform.OS === 'web' && (
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => {
                    handleInputChange('dateOfBirth', e.target.value);
                    setShowDatePicker(false);
                  }}
                  max={new Date().toISOString().split('T')[0]}
                  style={{
                    marginTop: 8,
                    padding: 12,
                    border: '1px solid #ddd',
                    borderRadius: 8,
                    fontSize: 16,
                    width: '100%'
                  }}
                />
              )}
            </View>

            {/* Sex */}
            <View style={styles.inputContainer}>
              <Text style={globalStyles.label}>Sex</Text>
              <View style={styles.sexContainer}>
                <TouchableOpacity
                  style={[
                    styles.sexButton,
                    formData.sex === 'Male' && styles.sexButtonActive
                  ]}
                  onPress={() => handleInputChange('sex', 'Male')}
                >
                  <Text style={[
                    styles.sexButtonText,
                    formData.sex === 'Male' && styles.sexButtonTextActive
                  ]}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sexButton,
                    formData.sex === 'Female' && styles.sexButtonActive
                  ]}
                  onPress={() => handleInputChange('sex', 'Female')}
                >
                  <Text style={[
                    styles.sexButtonText,
                    formData.sex === 'Female' && styles.sexButtonTextActive
                  ]}>Female</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Contact Number */}
            <View style={styles.inputContainer}>
              <Text style={globalStyles.label}>Contact Number (11 digits)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={[globalStyles.input, styles.input]}
                  value={formData.contactNumber}
                  onChangeText={(value) => {
                    // Only allow numbers and limit to 11 digits
                    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 11);
                    handleInputChange('contactNumber', numericValue);
                  }}
                  placeholder="09123456789"
                  keyboardType="numeric"
                  maxLength={11}
                />
              </View>
            </View>

            {/* Address - Barangay Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={globalStyles.label}>Barangay</Text>
              <TouchableOpacity
                style={[globalStyles.input, styles.dropdownInput]}
                onPress={() => setShowBarangayDropdown(!showBarangayDropdown)}
              >
                <Ionicons name="location-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                <Text style={[styles.dropdownText, !formData.address && styles.placeholderText]}>
                  {formData.address || 'Select your barangay'}
                </Text>
                <Ionicons 
                  name={showBarangayDropdown ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={colors.primary} 
                />
              </TouchableOpacity>
              
              {showBarangayDropdown && (
                <View style={styles.dropdownContainer}>
                  <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                    {barangays.map((barangay) => (
                      <TouchableOpacity
                        key={barangay.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          handleInputChange('address', barangay.name);
                          setShowBarangayDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{barangay.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={globalStyles.label}>Email (for login & verification)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={[globalStyles.input, styles.input]}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={globalStyles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={[globalStyles.input, styles.input]}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color={colors.primary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={globalStyles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={[globalStyles.input, styles.input]}
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  placeholder="Confirm your password"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color={colors.primary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity 
              style={[globalStyles.button, styles.signUpButton]}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={globalStyles.buttonText}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%', // Ensure full height for web
    backgroundColor: colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
    overflow: 'scroll', // Explicitly enable scrolling for web
  },
  card: {
    backgroundColor: colors.cardBackground,
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    paddingLeft: 50,
    paddingRight: 50,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 12,
    zIndex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 12,
    zIndex: 1,
  },
  sexContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  sexButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
  },
  sexButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sexButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  sexButtonTextActive: {
    color: colors.textWhite,
    fontWeight: '600',
  },
  signUpButton: {
    marginTop: 20,
    marginBottom: 24,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  signInLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dateText: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  dropdownInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  dropdownText: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  dropdownContainer: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  dropdownItemText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
});

export default SignUpScreen;
