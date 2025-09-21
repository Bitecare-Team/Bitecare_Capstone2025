import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Platform, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';

const BookAppointmentScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [barangays, setBarangays] = useState([]);
  const [showBarangayDropdown, setShowBarangayDropdown] = useState(false);
  const [appointmentSlots, setAppointmentSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [barangaysLoading, setBarangaysLoading] = useState(true);
  const [patientInfo, setPatientInfo] = useState({
    fullName: '',
    age: '',
    sex: '',
    address: '',
    contactNumber: '',
    dateOfBirth: '',
    dateBitten: '',
    siteOfBite: '',
    bitingAnimal: '',
    animalStatus: '',
    placeBitten: '',
    timeBitten: '',
    provoke: '',
    localWoundTreatment: '',
    reason: 'Rabies Vaccination',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showDateOfBirthPicker, setShowDateOfBirthPicker] = useState(false);
  const [showDateBittenPicker, setShowDateBittenPicker] = useState(false);
  const [idImage, setIdImage] = useState(null);
  const [idVerificationStatus, setIdVerificationStatus] = useState('pending'); // 'pending', 'verifying', 'verified', 'failed'
  const [extractedName, setExtractedName] = useState('');

  // Fetch appointment slots from database
  const fetchAppointmentSlots = async () => {
    try {
      setSlotsLoading(true);
      const { data, error } = await supabase
        .from('appointment_slots')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching appointment slots:', error);
      } else {
        console.log('Appointment slots data:', data);
        setAppointmentSlots(data || []);
      }
    } catch (error) {
      console.error('Unexpected error fetching appointment slots:', error);
    } finally {
      setSlotsLoading(false);
    }
  };

  // Fetch booked appointments from database
  const fetchBookedAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_date, appointment_time')
        .in('status', ['pending', 'confirmed']);

      if (error) {
        console.error('Error fetching booked appointments:', error);
      } else {
        console.log('Booked appointments data:', data);
        setBookedAppointments(data || []);
      }
    } catch (error) {
      console.error('Unexpected error fetching booked appointments:', error);
    }
  };

  // Get available slots for a specific date
  const getAvailableSlotsForDate = (date) => {
    if (!appointmentSlots || !Array.isArray(appointmentSlots)) return [];
    const dateSlots = appointmentSlots.filter(slot => slot.date === date);
    return dateSlots.filter(slot => slot.available_slots > 0);
  };

  // Get total slots for a specific date
  const getTotalSlotsForDate = (date) => {
    if (!appointmentSlots || !Array.isArray(appointmentSlots)) return 0;
    const dateSlots = appointmentSlots.filter(slot => slot.date === date);
    return dateSlots.reduce((total, slot) => total + (slot.total_slots || 0), 0);
  };

  // Get booked appointments count for a specific date
  const getBookedAppointmentsForDate = (date) => {
    if (!bookedAppointments || !Array.isArray(bookedAppointments)) return 0;
    return bookedAppointments.filter(appointment => appointment.appointment_date === date).length;
  };

  // Get available slots count for a specific date
  const getAvailableSlotsCountForDate = (date) => {
    if (!appointmentSlots || !Array.isArray(appointmentSlots)) return 0;
    const dateSlots = appointmentSlots.filter(slot => slot.date === date);
    return dateSlots.reduce((total, slot) => total + (slot.available_slots || 0), 0);
  };

  // Get remaining slots for a specific date (available_slots - booked_appointments)
  const getRemainingSlotsForDate = (date) => {
    const availableSlots = getAvailableSlotsCountForDate(date);
    const bookedCount = getBookedAppointmentsForDate(date);
    return Math.max(0, availableSlots - bookedCount);
  };

  // Check if date is fully booked
  const isDateFullyBooked = (date) => {
    const remainingSlots = getRemainingSlotsForDate(date);
    return remainingSlots <= 0;
  };

  // Check if date has available slots
  const hasAvailableSlots = (date) => {
    const remainingSlots = getRemainingSlotsForDate(date);
    return remainingSlots > 0;
  };

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching user profile:', error);
          } else if (data) {
            console.log('User profile data:', data);
            // Auto-populate patient info from user profile
            setPatientInfo(prev => ({
              ...prev,
              fullName: data.full_name || '',
              address: data.address || '',
              contactNumber: data.contact_number || '',
              dateOfBirth: data.date_of_birth || '',
              sex: data.sex || '',
              age: data.date_of_birth ? calculateAge(data.date_of_birth) : ''
            }));
          }
        } catch (error) {
          console.error('Unexpected error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
    fetchAppointmentSlots();
    fetchBookedAppointments();
    fetchBarangays();
  }, [user]);

  // Fetch barangays from database
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

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Handle date of birth change
  const handleDateOfBirthChange = (event, selectedDate) => {
    setShowDateOfBirthPicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setPatientInfo(prev => ({ 
        ...prev, 
        dateOfBirth: formattedDate,
        age: calculateAge(formattedDate).toString()
      }));
    }
  };

  // Handle date bitten change
  const handleDateBittenChange = (event, selectedDate) => {
    setShowDateBittenPicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setPatientInfo(prev => ({ ...prev, dateBitten: formattedDate }));
    }
  };

  // Handle ID image upload
  const handleIdUpload = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to take a photo of your ID.');
        return;
      }

      Alert.alert(
        'Upload ID',
        'Choose how to upload your valid ID',
        [
          { text: 'Take Photo', onPress: () => takeIdPhoto() },
          { text: 'Choose from Gallery', onPress: () => pickIdFromGallery() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request camera permissions.');
    }
  };

  const takeIdPhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setIdImage(result.assets[0]);
        await processIdImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo.');
    }
  };

  const pickIdFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setIdImage(result.assets[0]);
        await processIdImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  // Process ID image using OCR
  const processIdImage = async (imageAsset) => {
    try {
      setIdVerificationStatus('verifying');
      
      // Use OCR.space free API for text extraction with direct file upload
      const formData = new FormData();
      formData.append('file', {
        uri: imageAsset.uri,
        type: 'image/jpeg',
        name: 'id-image.jpg',
      });
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'false');
      formData.append('detectOrientation', 'true');
      formData.append('scale', 'true');
      formData.append('OCREngine', '2');

      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: {
          'apikey': 'K87899142388957', // Free OCR.space API key
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();
      
      console.log('=== OCR API RESPONSE ===');
      console.log('Full API Response:', JSON.stringify(result, null, 2));
      
      if (result.ParsedResults && result.ParsedResults.length > 0) {
        const extractedText = result.ParsedResults[0].ParsedText;
        console.log('=== EXTRACTED TEXT ===');
        console.log('Raw OCR Text:', extractedText);
        console.log('Text Length:', extractedText.length);
        console.log('User Full Name:', patientInfo.fullName);
        
        // Show extracted text to user for debugging
        Alert.alert(
          'OCR Text Extracted',
          `Extracted text: "${extractedText}"\n\nLooking for: "${patientInfo.fullName}"`,
          [
            { text: 'Continue', onPress: () => {
              // Extract name from the text
              const nameMatch = extractName(extractedText);
              console.log('=== NAME EXTRACTION RESULT ===');
              console.log('Extracted Name:', nameMatch);
              
              if (nameMatch) {
                setExtractedName(nameMatch);
                verifyNameMatch(nameMatch, patientInfo.fullName);
              } else {
                setIdVerificationStatus('failed');
                Alert.alert(
                  'ID Verification Failed',
                  `Could not extract name from the ID.\n\nExtracted text: "${extractedText}"\n\nPlease ensure the ID is clear and try again.`
                );
              }
            }}
          ]
        );
      } else {
        console.log('=== OCR FAILED ===');
        console.log('No ParsedResults in response');
        setIdVerificationStatus('failed');
        Alert.alert(
          'ID Verification Failed',
          'Could not read the ID. Please ensure the image is clear and try again.'
        );
      }
    } catch (error) {
      console.error('Error processing ID:', error);
      setIdVerificationStatus('failed');
      Alert.alert('Error', 'Failed to process ID image. Please try again.');
    }
  };

  // Enhanced name extraction from OCR text
  const extractName = (text) => {
    console.log('=== NAME EXTRACTION DEBUG ===');
    console.log('Original OCR text:', text);
    
    // Clean and normalize the text
    const cleanText = text.replace(/[^\w\s:]/g, ' ').replace(/\s+/g, ' ').trim();
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    console.log('Cleaned text:', cleanText);
    console.log('Lines:', lines);
    
    const potentialNames = [];
    const userFullName = patientInfo?.fullName || '';
    const userNameParts = userFullName.toLowerCase().split(' ').filter(part => part.length > 1);
    
    console.log('User name parts to find:', userNameParts);
    
    // Method 1: Direct search for user's name parts in the entire text (most flexible)
    const textLower = text.toLowerCase();
    const foundParts = [];
    
    for (const namePart of userNameParts) {
      if (textLower.includes(namePart.toLowerCase())) {
        foundParts.push(namePart);
        console.log(`Found name part: "${namePart}"`);
      }
    }
    
    // If we found any name parts, consider it a match
    if (foundParts.length > 0) {
      console.log('Direct name parts found:', foundParts);
      return foundParts.join(' ');
    }
    
    // Method 2: Look for explicit name fields
    const nameKeywords = ['name', 'full name', 'given name', 'surname', 'first name', 'last name'];
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      for (const keyword of nameKeywords) {
        if (lowerLine.includes(keyword)) {
          // Try different separators
          const separators = [':', '-', ' '];
          for (const sep of separators) {
            if (line.includes(sep)) {
              const parts = line.split(sep);
              if (parts.length > 1) {
                const namePart = parts[1]?.trim();
                if (namePart && namePart.length > 2) {
                  potentialNames.push(namePart);
                  console.log(`Found name from keyword "${keyword}": "${namePart}"`);
                }
              }
            }
          }
        }
      }
    }
    
    // Method 3: Look for name patterns (1-4 words, letters only)
    const namePattern = /^[A-Za-z\s]+$/;
    for (const line of lines) {
      const words = line.split(' ').filter(word => word.length > 1);
      if (words.length >= 1 && words.length <= 4 && namePattern.test(line)) {
        // Skip common non-name patterns
        const skipPatterns = ['republic', 'philippines', 'department', 'government', 'office', 'city', 'province', 'address', 'date', 'birth', 'sex', 'signature'];
        const hasSkipPattern = skipPatterns.some(pattern => 
          line.toLowerCase().includes(pattern)
        );
        
        if (!hasSkipPattern && line.length > 2 && line.length < 50) {
          potentialNames.push(line);
          console.log(`Found potential name pattern: "${line}"`);
        }
      }
    }
    
    console.log('All potential names found:', potentialNames);
    
    // Return the first potential name if any found
    if (potentialNames.length > 0) {
      return potentialNames[0];
    }
    
    // Method 4: Fallback - return any text that might contain the user's name
    for (const line of lines) {
      for (const namePart of userNameParts) {
        if (line.toLowerCase().includes(namePart.toLowerCase())) {
          console.log(`Fallback match found in line: "${line}"`);
          return line;
        }
      }
    }
    
    console.log('No name extraction successful');
    return null;
  };

  // Enhanced name verification with comprehensive matching
  const verifyNameMatch = (extractedName, patientName) => {
    if (!extractedName || !patientName) {
      setIdVerificationStatus('failed');
      return;
    }

    // Normalize names for comparison
    const normalizeString = (str) => {
      return str.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const normalizedExtracted = normalizeString(extractedName);
    const normalizedPatient = normalizeString(patientName);

    // Split names into parts for component matching
    const extractedParts = normalizedExtracted.split(' ').filter(part => part.length > 1);
    const patientParts = normalizedPatient.split(' ').filter(part => part.length > 1);

    // Method 1: Exact match
    if (normalizedExtracted === normalizedPatient) {
      setIdVerificationStatus('verified');
      Alert.alert('ID Verified Successfully', 'Exact name match found!');
      return;
    }

    // Method 2: Component matching - check if any patient name parts are found (case-insensitive)
    let matchedParts = 0;
    for (const patientPart of patientParts) {
      for (const extractedPart of extractedParts) {
        // Case-insensitive comparison with minimum length check
        if (patientPart.length >= 2 && extractedPart.length >= 2) {
          if (extractedPart.toLowerCase().includes(patientPart.toLowerCase()) || 
              patientPart.toLowerCase().includes(extractedPart.toLowerCase())) {
            matchedParts++;
            break;
          }
        }
      }
    }

    const componentMatchRatio = matchedParts / patientParts.length;
    console.log(`Component match ratio: ${componentMatchRatio * 100}%`);
    
    // Method 2.5: Single word match - if any single name part matches exactly, consider it valid
    let hasSingleWordMatch = false;
    for (const patientPart of patientParts) {
      for (const extractedPart of extractedParts) {
        if (patientPart.toLowerCase() === extractedPart.toLowerCase() && patientPart.length >= 3) {
          hasSingleWordMatch = true;
          console.log(`Single word match found: "${patientPart}"`);
          break;
        }
      }
      if (hasSingleWordMatch) break;
    }

    // Method 3: Levenshtein distance similarity
    const calculateSimilarity = (str1, str2) => {
      const matrix = [];
      const len1 = str1.length;
      const len2 = str2.length;

      for (let i = 0; i <= len2; i++) {
        matrix[i] = [i];
      }

      for (let j = 0; j <= len1; j++) {
        matrix[0][j] = j;
      }

      for (let i = 1; i <= len2; i++) {
        for (let j = 1; j <= len1; j++) {
          if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
          }
        }
      }

      const maxLen = Math.max(len1, len2);
      return maxLen === 0 ? 1 : (maxLen - matrix[len2][len1]) / maxLen;
    };

    const similarity = calculateSimilarity(normalizedExtracted, normalizedPatient);
    
    console.log(`Full OCR text analysis:`);
    console.log(`Extracted: "${normalizedExtracted}"`);
    console.log(`Patient: "${normalizedPatient}"`);
    console.log(`Similarity: ${Math.round(similarity * 100)}%`);
    console.log(`Component match: ${Math.round(componentMatchRatio * 100)}%`);

    // Verification logic: Pass if single word match OR high similarity OR good component matching
    const passThreshold = hasSingleWordMatch || similarity >= 0.7 || componentMatchRatio >= 0.8;

    if (passThreshold) {
      setIdVerificationStatus('verified');
      let matchType;
      if (hasSingleWordMatch) {
        matchType = 'single name match';
      } else if (similarity >= 0.7) {
        matchType = 'text similarity';
      } else {
        matchType = 'name component matching';
      }
      
      Alert.alert(
        'ID Verified Successfully',
        `Name verified via ${matchType}: ${hasSingleWordMatch ? '100' : Math.round(Math.max(similarity, componentMatchRatio) * 100)}% match`
      );
    } else {
      setIdVerificationStatus('failed');
      Alert.alert(
        'ID Verification Failed',
        `Name verification failed.\nExtracted: "${extractedName}"\nExpected: "${patientName}"\nSimilarity: ${Math.round(similarity * 100)}%\nComponent match: ${Math.round(componentMatchRatio * 100)}%`
      );
    }
  };

  const timeSlots = [
    '8:00 AM', '9:00 AM'
  ];

  const handleNext = () => {
    if (currentStep === 1 && !selectedDate) {
      Alert.alert('Error', 'Please select a date');
      return;
    }
    if (currentStep === 1 && !selectedTime) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }
    if (currentStep === 2) {
      const { fullName, age, sex, address, contactNumber, dateOfBirth, dateBitten, siteOfBite, bitingAnimal, animalStatus, placeBitten, timeBitten, provoke, localWoundTreatment } = patientInfo;
      if (!fullName || !age || !sex || !address || !contactNumber || !dateOfBirth || !dateBitten || !siteOfBite || !bitingAnimal || !animalStatus || !placeBitten || !timeBitten || !provoke || !localWoundTreatment) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      // Check ID verification
      if (idVerificationStatus !== 'verified') {
        Alert.alert('ID Verification Required', 'Please upload and verify your valid ID before proceeding.');
        return;
      }
    }
    if (currentStep === 3 && !acceptedTerms) {
      Alert.alert('Error', 'Please accept the terms and conditions');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  // Helper function to convert 12-hour format to 24-hour format for database
  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    // Convert to numbers for proper calculation
    hours = parseInt(hours, 10);
    
    if (hours === 12 && modifier === 'AM') {
      hours = 0;
    } else if (hours !== 12 && modifier === 'PM') {
      hours = hours + 12;
    }
    
    // Ensure proper formatting with leading zeros
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes}:00`;
  };

  const handleConfirm = async () => {
    // Validate terms acceptance
    if (!acceptedTerms) {
      Alert.alert(
        'Terms & Conditions Required',
        'Please accept the Terms & Conditions and Privacy Policy to proceed with booking.',
        [{ text: 'OK' }]
      );
      return;
    }

    setBookingLoading(true);

    try {
      // Prepare appointment data
      const appointmentData = {
        user_id: user.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        patient_name: patientInfo.fullName,
        patient_age: parseInt(patientInfo.age),
        patient_sex: patientInfo.sex,
        patient_address: patientInfo.address,
        patient_contact: patientInfo.contactNumber,
        date_of_birth: patientInfo.dateOfBirth,
        date_bitten: patientInfo.dateBitten,
        site_of_bite: patientInfo.siteOfBite,
        biting_animal: patientInfo.bitingAnimal,
        animal_status: patientInfo.animalStatus,
        place_bitten: patientInfo.placeBitten,
        time_bitten: patientInfo.timeBitten,
        provoke: patientInfo.provoke,
        local_wound_treatment: patientInfo.localWoundTreatment,
        reason: patientInfo.reason,
        status: 'pending',
        terms_accepted: true,
        created_at: new Date().toISOString()
      };

      // Save appointment to Supabase
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select();

      if (error) {
        console.error('Error saving appointment:', error);
        Alert.alert(
          'Booking Failed',
          'There was an error booking your appointment. Please try again.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Update appointment slot availability using database function
      const timeSlot = convertTo24Hour(selectedTime);
      console.log('Updating slot availability:', {
        selectedDate,
        selectedTime,
        timeSlot
      });
      
      try {
        const { data, error: slotError } = await supabase
          .rpc('decrease_available_slots', {
            slot_date: selectedDate,
            slot_time: timeSlot
          });

        console.log('Slot update result:', { data, slotError });

        if (slotError) {
          console.error('Error updating slot availability:', slotError);
        } else if (data === 0) {
          console.warn('No slots were updated - slot may not exist or already full');
        } else {
          console.log('Successfully updated slot availability, rows affected:', data);
        }
      } catch (error) {
        console.error('Unexpected error updating slots:', error);
      }

      // Refresh slots data to show updated availability
      await fetchAppointmentSlots();
      await fetchBookedAppointments();

      // Success - show confirmation and navigate back
      Alert.alert(
        'Appointment Booked!',
        `Your appointment has been successfully booked for ${new Date(selectedDate).toLocaleDateString()} at ${selectedTime}. You will receive a confirmation shortly.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back to home or appointments screen
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'MainTabs' }],
                })
              );
            },
          },
        ]
      );

    } catch (error) {
      console.error('Unexpected error during booking:', error);
      Alert.alert(
        'Booking Failed',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((step) => (
        <View key={step} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            currentStep >= step && styles.stepCircleActive
          ]}>
            <Text style={[
              styles.stepText,
              currentStep >= step && styles.stepTextActive
            ]}>
              {step}
            </Text>
          </View>
          {step < 3 && (
            <View style={[
              styles.stepLine,
              currentStep > step && styles.stepLineActive
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => {
    // Create marked dates object with appointment slot indicators
    const markedDates = {};
    const currentDate = getCurrentDate();
    
    // Mark dates with appointment slots
    if (appointmentSlots && Array.isArray(appointmentSlots)) {
      appointmentSlots.forEach(slot => {
        const date = slot.date;
        const isFullyBooked = isDateFullyBooked(date);
        const isToday = date === currentDate;
        const isSelected = date === selectedDate;
      
      markedDates[date] = {
        selected: isSelected,
        selectedColor: isSelected ? colors.primary : undefined,
        selectedTextColor: isSelected ? colors.textWhite : undefined,
        marked: true,
        dotColor: isFullyBooked ? '#ff4444' : '#4CAF50',
        customStyles: {
          container: {
            backgroundColor: isToday ? colors.primaryLight : 
                           isFullyBooked ? '#ffebee' : 
                           hasAvailableSlots(date) ? '#e8f5e8' : 'transparent',
            borderRadius: 8,
            borderWidth: isToday ? 2 : 0,
            borderColor: isToday ? colors.primary : 'transparent',
          },
          text: {
            color: isSelected ? colors.textWhite :
                   isToday ? colors.primary :
                   isFullyBooked ? '#d32f2f' :
                   hasAvailableSlots(date) ? '#2e7d32' : colors.textPrimary,
            fontWeight: isToday || isSelected ? 'bold' : '500',
          }
        }
      };
      });
    }

    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>Select Date & Time</Text>
        <Text style={styles.stepSubtitle}>Choose an available slot for your appointment</Text>
        
        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#ff4444' }]} />
            <Text style={styles.legendText}>Fully Booked</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.primary }]} />
            <Text style={styles.legendText}>Today</Text>
          </View>
        </View>
        
        <Calendar
          onDayPress={(day) => {
            const dateString = day.dateString;
            // Only allow selection of dates with available slots
            if (hasAvailableSlots(dateString)) {
              setSelectedDate(dateString);
              setSelectedTime(''); // Reset time when date changes
              const availableSlots = getAvailableSlotsForDate(dateString);
              setAvailableSlots(availableSlots || []);
            } else {
              Alert.alert(
                'No Available Slots',
                'This date is fully booked or has no appointment slots available. Please select another date.',
                [{ text: 'OK' }]
              );
            }
          }}
          markedDates={markedDates}
          markingType={'custom'}
          current={currentMonth}
          onMonthChange={(month) => {
            console.log('Month changed to:', month);
            setCurrentMonth(new Date(month.dateString));
          }}
          theme={{
            selectedDayBackgroundColor: colors.primary,
            todayTextColor: colors.primary,
            arrowColor: colors.primary,
            monthTextColor: colors.textPrimary,
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
          }}
          style={styles.calendar}
        />
        
        {/* Selected Date Info */}
        {selectedDate && (
          <View style={styles.selectedDateInfo}>
            <Text style={styles.selectedDateTitle}>
              Selected Date: {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            <View style={styles.slotInfo}>
              <Text style={styles.slotInfoText}>
                Remaining Slots: {getRemainingSlotsForDate(selectedDate)}
              </Text>
              <Text style={styles.slotInfoText}>
                Available Slots: {getAvailableSlotsCountForDate(selectedDate)}
              </Text>
              <Text style={styles.slotInfoText}>
                Booked: {getBookedAppointmentsForDate(selectedDate)}
              </Text>
            </View>
          </View>
        )}
        
        {/* Time Slots */}
        {selectedDate && hasAvailableSlots(selectedDate) && (
          <View style={styles.timeSlotsContainer}>
            <Text style={styles.timeSlotsTitle}>Available Time Slots</Text>
            <View style={styles.timeSlots}>
              {/* Default time slots since your table doesn't have specific times */}
              {['08:00 AM', '9:00 AM'].map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.selectedTimeSlot
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.selectedTimeSlotText
                  ]}>
                    {time}
                  </Text>
                  <Text style={styles.timeSlotAvailable}>
                    Available
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderCheckboxGroup = (title, value, options, field) => (
    <View style={styles.inputContainer}>
      <Text style={globalStyles.label}>{title} *</Text>
      <View style={styles.checkboxGroup}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.checkboxOption,
              value === option && styles.checkboxOptionSelected
            ]}
            onPress={() => setPatientInfo(prev => ({ ...prev, [field]: option }))}
            activeOpacity={0.7}
          >
            <View style={[styles.radioButton, value === option && styles.radioButtonSelected]}>
              {value === option && <View style={styles.radioButtonInner} />}
            </View>
            <Text style={[
              styles.checkboxText,
              value === option && styles.checkboxTextSelected
            ]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.stepContent}>
      <Text style={styles.stepTitle}>Patient Information</Text>
      <Text style={styles.stepSubtitle}>Please provide complete patient details</Text>

      <View style={styles.form}>
        {/* Basic Information */}
        <View style={styles.inputContainer}>
          <Text style={globalStyles.label}>Full Name *</Text>
          <TextInput
            style={globalStyles.input}
            value={patientInfo.fullName}
            onChangeText={(value) => setPatientInfo(prev => ({ ...prev, fullName: value }))}
            placeholder="Enter full name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={globalStyles.label}>Age *</Text>
          <TextInput
            style={globalStyles.input}
            value={patientInfo.age}
            onChangeText={(value) => setPatientInfo(prev => ({ ...prev, age: value }))}
            placeholder="Enter age"
            keyboardType="numeric"
          />
        </View>

        {renderCheckboxGroup('Sex', patientInfo.sex, ['Male', 'Female'], 'sex')}

        <View style={styles.inputContainer}>
          <Text style={globalStyles.label}>Address *</Text>
          <TextInput
            style={[globalStyles.input, styles.textArea]}
            value={patientInfo.address}
            onChangeText={(value) => setPatientInfo(prev => ({ ...prev, address: value }))}
            placeholder="Enter complete address"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={globalStyles.label}>Contact Number *</Text>
          <TextInput
            style={globalStyles.input}
            value={patientInfo.contactNumber}
            onChangeText={(value) => setPatientInfo(prev => ({ ...prev, contactNumber: value }))}
            placeholder="Enter contact number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={globalStyles.label}>Date of Birth *</Text>
          <TouchableOpacity
            style={[globalStyles.input, styles.dateInput]}
            onPress={() => setShowDateOfBirthPicker(true)}
          >
            <Text style={[styles.dateText, !patientInfo.dateOfBirth && styles.placeholderText]}>
              {patientInfo.dateOfBirth ? new Date(patientInfo.dateOfBirth).toLocaleDateString() : 'Select date of birth'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
          {showDateOfBirthPicker && (
            <DateTimePicker
              value={patientInfo.dateOfBirth ? new Date(patientInfo.dateOfBirth) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateOfBirthChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        {/* Bite Information */}
        <Text style={styles.sectionTitle}>Bite Information</Text>
        
        <View style={styles.inputContainer}>
          <Text style={globalStyles.label}>Date Bitten *</Text>
          <TouchableOpacity
            style={[globalStyles.input, styles.dateInput]}
            onPress={() => setShowDateBittenPicker(true)}
          >
            <Text style={[styles.dateText, !patientInfo.dateBitten && styles.placeholderText]}>
              {patientInfo.dateBitten ? new Date(patientInfo.dateBitten).toLocaleDateString() : 'Select date bitten'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
          {showDateBittenPicker && (
            <DateTimePicker
              value={patientInfo.dateBitten ? new Date(patientInfo.dateBitten) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateBittenChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        {renderCheckboxGroup('Site of Bite', patientInfo.siteOfBite, [
          'Head & Neck',
          'Upper Extremity', 
          'Abdomen',
          'Chest',
          'Lower Extremity'
        ], 'siteOfBite')}

        {renderCheckboxGroup('Biting Animal', patientInfo.bitingAnimal, [
          'Stray Dog',
          'Pet Dog',
          'Stray Cat',
          'Pet Cat',
          'Other Animal'
        ], 'bitingAnimal')}

        {renderCheckboxGroup('Animal Status', patientInfo.animalStatus, [
          'Immunized',
          'Unimmunized',
          'Unknown'
        ], 'animalStatus')}

        <View style={styles.inputContainer}>
          <Text style={globalStyles.label}>Place Bitten (Barangay) *</Text>
          <TouchableOpacity
            style={[globalStyles.input, styles.dropdownInput]}
            onPress={() => setShowBarangayDropdown(true)}
          >
            <Ionicons name="location-outline" size={20} color={colors.primary} style={styles.inputIcon} />
            <Text style={[styles.dropdownText, !patientInfo.placeBitten && styles.placeholderText]}>
              {patientInfo.placeBitten || 'Select barangay where bite occurred'}
            </Text>
            <Ionicons 
              name="chevron-down" 
              size={20} 
              color={colors.primary} 
            />
          </TouchableOpacity>
        </View>

        {/* Barangay Selection Modal */}
        <Modal
          visible={showBarangayDropdown}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowBarangayDropdown(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Barangay</Text>
                <TouchableOpacity
                  onPress={() => setShowBarangayDropdown(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={true}>
                {barangays.map((barangay) => (
                  <TouchableOpacity
                    key={barangay.id}
                    style={[
                      styles.modalItem,
                      patientInfo.placeBitten === barangay.name && styles.modalItemSelected
                    ]}
                    onPress={() => {
                      setPatientInfo(prev => ({ ...prev, placeBitten: barangay.name }));
                      setShowBarangayDropdown(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.modalItemText,
                      patientInfo.placeBitten === barangay.name && styles.modalItemTextSelected
                    ]}>
                      {barangay.name}
                    </Text>
                    {patientInfo.placeBitten === barangay.name && (
                      <Ionicons name="checkmark" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <View style={styles.inputContainer}>
          <Text style={globalStyles.label}>Time Bitten *</Text>
          <TextInput
            style={globalStyles.input}
            value={patientInfo.timeBitten}
            onChangeText={(value) => setPatientInfo(prev => ({ ...prev, timeBitten: value }))}
            placeholder="HH:MM AM/PM"
          />
        </View>

        {renderCheckboxGroup('Provoke', patientInfo.provoke, ['Yes', 'No'], 'provoke')}

        {renderCheckboxGroup('Local Wound Treatment', patientInfo.localWoundTreatment, ['Yes', 'No'], 'localWoundTreatment')}

        <View style={styles.inputContainer}>
          <Text style={globalStyles.label}>Reason for Visit</Text>
          <TextInput
            style={globalStyles.input}
            value={patientInfo.reason}
            onChangeText={(value) => setPatientInfo(prev => ({ ...prev, reason: value }))}
            placeholder="Enter reason for visit"
          />
        </View>

        {/* ID Verification Section */}
        <Text style={styles.sectionTitle}>ID Verification</Text>
        <View style={styles.inputContainer}>
          <Text style={globalStyles.label}>Valid ID Upload *</Text>
          <Text style={styles.helperText}>
            Please upload a clear photo of your valid government-issued ID to verify your identity and prevent fraud.
          </Text>
          
          <TouchableOpacity
            style={[styles.idUploadButton, idImage && styles.idUploadButtonUploaded]}
            onPress={handleIdUpload}
          >
            <View style={styles.idUploadContent}>
              {idImage ? (
                <>
                  <Image source={{ uri: idImage.uri }} style={styles.idPreview} />
                  <View style={styles.idUploadTextContainer}>
                    <Text style={styles.idUploadText}>ID Uploaded</Text>
                    <Text style={styles.idUploadSubtext}>Tap to change</Text>
                  </View>
                </>
              ) : (
                <>
                  <Ionicons name="camera-outline" size={32} color={colors.primary} />
                  <Text style={styles.idUploadText}>Upload Valid ID</Text>
                  <Text style={styles.idUploadSubtext}>Take photo or choose from gallery</Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          {/* ID Verification Status */}
          {idImage && (
            <View style={[styles.verificationStatus, 
              idVerificationStatus === 'verified' && styles.verificationSuccess,
              idVerificationStatus === 'failed' && styles.verificationError,
              idVerificationStatus === 'verifying' && styles.verificationPending
            ]}>
              <Ionicons 
                name={
                  idVerificationStatus === 'verified' ? 'checkmark-circle' :
                  idVerificationStatus === 'failed' ? 'close-circle' :
                  idVerificationStatus === 'verifying' ? 'time' : 'alert-circle'
                } 
                size={20} 
                color={
                  idVerificationStatus === 'verified' ? colors.success :
                  idVerificationStatus === 'failed' ? colors.error :
                  idVerificationStatus === 'verifying' ? colors.warning : colors.textSecondary
                } 
              />
              <Text style={[styles.verificationText,
                idVerificationStatus === 'verified' && styles.verificationSuccessText,
                idVerificationStatus === 'failed' && styles.verificationErrorText,
                idVerificationStatus === 'verifying' && styles.verificationPendingText
              ]}>
                {idVerificationStatus === 'verified' && 'ID Verified Successfully'}
                {idVerificationStatus === 'failed' && 'ID Verification Failed'}
                {idVerificationStatus === 'verifying' && 'Verifying ID...'}
                {idVerificationStatus === 'pending' && 'ID verification pending'}
              </Text>
            </View>
          )}

          {extractedName && idVerificationStatus === 'verified' && (
            <View style={styles.extractedNameContainer}>
              <Text style={styles.extractedNameLabel}>Name from ID:</Text>
              <Text style={styles.extractedNameText}>{extractedName}</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Confirmation</Text>
      <Text style={styles.stepSubtitle}>Review your appointment details</Text>

      <View style={[globalStyles.card, styles.confirmationCard]}>
        <View style={styles.confirmationItem}>
          <Text style={styles.confirmationLabel}>Date:</Text>
          <Text style={styles.confirmationValue}>
            {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
        <View style={styles.confirmationItem}>
          <Text style={styles.confirmationLabel}>Time:</Text>
          <Text style={styles.confirmationValue}>{selectedTime}</Text>
        </View>
        <View style={styles.confirmationItem}>
          <Text style={styles.confirmationLabel}>Patient:</Text>
          <Text style={styles.confirmationValue}>{patientInfo.fullName}</Text>
        </View>
        <View style={styles.confirmationItem}>
          <Text style={styles.confirmationLabel}>Contact:</Text>
          <Text style={styles.confirmationValue}>{patientInfo.contactNumber}</Text>
        </View>
        <View style={styles.confirmationItem}>
          <Text style={styles.confirmationLabel}>Reason:</Text>
          <Text style={styles.confirmationValue}>{patientInfo.reason}</Text>
        </View>
        <View style={styles.confirmationItem}>
          <Text style={styles.confirmationLabel}>ID Verification:</Text>
          <Text style={[styles.confirmationValue, styles.verificationSuccessText]}>
            ✓ Verified
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.termsContainer}
        onPress={() => setAcceptedTerms(!acceptedTerms)}
      >
        <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
          {acceptedTerms && <Ionicons name="checkmark" size={16} color={colors.textWhite} />}
        </View>
        <Text style={styles.termsText}>
          I accept the <Text style={styles.termsLink}>Terms & Conditions</Text> and 
          <Text style={styles.termsLink}> Privacy Policy</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Select Date & Time';
      case 2: return 'Patient Information';
      case 3: return 'Confirmation';
      default: return 'Book Appointment';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getStepTitle()}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Content */}
      <ScrollView style={styles.content}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            globalStyles.button,
            styles.nextButton,
            (currentStep === 3 && (!acceptedTerms || bookingLoading)) && styles.disabledButton,
            (currentStep === 2 && idVerificationStatus !== 'verified') && styles.disabledButton
          ]}
          onPress={currentStep === 3 ? handleConfirm : handleNext}
          disabled={(currentStep === 3 && (!acceptedTerms || bookingLoading)) || (currentStep === 2 && idVerificationStatus !== 'verified')}
        >
          <Text style={[
            globalStyles.buttonText,
            (currentStep === 3 && (!acceptedTerms || bookingLoading)) && styles.disabledButtonText,
            (currentStep === 2 && idVerificationStatus !== 'verified') && styles.disabledButtonText
          ]}>
            {currentStep === 3 
              ? (bookingLoading ? 'Booking...' : 'Confirm Appointment') 
              : 'Next'
            }
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.cardBackground,
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  placeholder: {
    width: 32,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: colors.cardBackground,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  stepTextActive: {
    color: colors.textWhite,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: colors.borderLight,
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
  },
  stepContent: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  calendar: {
    borderRadius: 12,
    marginBottom: 20,
  },
  timeSlotsContainer: {
    marginTop: 20,
  },
  timeSlotsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
  },
  timeSlotSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  timeSlotTextSelected: {
    color: colors.textWhite,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    // Inherits from globalStyles
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  confirmationCard: {
    marginBottom: 24,
  },
  confirmationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  confirmationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  confirmationValue: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 24,
    marginBottom: 16,
  },
  checkboxGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    backgroundColor: colors.background,
    flex: 1,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checkboxOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  radioButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  checkboxText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
    flex: 1,
  },
  checkboxTextSelected: {
    color: colors.primary,
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
  placeholderText: {
    color: colors.textSecondary,
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
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 12,
    zIndex: 1,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    width: '90%',
    maxHeight: '70%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalItemSelected: {
    backgroundColor: colors.primaryLight,
  },
  modalItemText: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  modalItemTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  selectedDateInfo: {
    backgroundColor: colors.cardBackground,
    padding: 16,
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedDateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  slotInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  slotInfoText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  timeSlotsContainer: {
    marginTop: 16,
  },
  timeSlotsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    backgroundColor: colors.cardBackground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 120,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  selectedTimeSlotText: {
    color: colors.textWhite,
  },
  timeSlotAvailable: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    padding: 20,
    backgroundColor: colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  nextButton: {
    // Inherits from globalStyles.button
  },
  buttonText: {
    color: colors.textSecondary,
  },
  helperText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  errorText: {
    color: colors.error,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  disabledButton: {
    backgroundColor: colors.textSecondary,
    opacity: 0.6,
  },
  disabledButtonText: {
    color: colors.textSecondary,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '500',
  },
  confirmationCard: {
    marginTop: 16,
  },
  confirmationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  confirmationLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  confirmationValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  // ID Upload Styles
  idUploadButton: {
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    backgroundColor: colors.background,
  },
  idUploadButtonUploaded: {
    borderColor: colors.success,
    borderStyle: 'solid',
    backgroundColor: colors.success + '10',
  },
  idUploadContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  idUploadTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  idUploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  idUploadSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  idPreview: {
    width: 60,
    height: 40,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    backgroundColor: colors.backgroundLight,
  },
  verificationSuccess: {
    backgroundColor: colors.success + '20',
    borderWidth: 1,
    borderColor: colors.success,
  },
  verificationError: {
    backgroundColor: colors.error + '20',
    borderWidth: 1,
    borderColor: colors.error,
  },
  verificationPending: {
    backgroundColor: colors.warning + '20',
    borderWidth: 1,
    borderColor: colors.warning,
  },
  verificationText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    color: colors.textSecondary,
  },
  verificationSuccessText: {
    color: colors.success,
  },
  verificationErrorText: {
    color: colors.error,
  },
  verificationPendingText: {
    color: colors.warning,
  },
  extractedNameContainer: {
    backgroundColor: colors.backgroundLight,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  extractedNameLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  extractedNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 16,
  },
});

export default BookAppointmentScreen;
