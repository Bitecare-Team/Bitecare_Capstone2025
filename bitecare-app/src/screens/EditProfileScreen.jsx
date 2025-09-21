import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';

const EditProfileScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    sex: '',
    contactNumber: '',
    address: '',
    email: user?.email || '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [barangays, setBarangays] = useState([]);
  const [imageChanged, setImageChanged] = useState(false);

  // Fetch user profile data from Supabase
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          Alert.alert('Error', 'Failed to load profile data');
        } else if (data) {
          setFormData({
            fullName: data.full_name || '',
            dateOfBirth: data.date_of_birth || '',
            sex: data.sex || '',
            contactNumber: data.contact_number || '',
            address: data.address || '',
            email: data.email || user?.email || '',
          });
          if (data.profile_image_url) {
            setProfileImage(data.profile_image_url);
          }
        }
      } catch (error) {
        console.error('Unexpected error fetching profile:', error);
        Alert.alert('Error', 'Failed to load profile data');
      } finally {
        setFetchingProfile(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Fetch barangays from Supabase
  useEffect(() => {
    const fetchBarangays = async () => {
      try {
        const { data, error } = await supabase
          .from('barangays')
          .select('id, name')
          .order('name');

        if (error) {
          console.error('Error fetching barangays:', error);
        } else {
          setBarangays(data || []);
        }
      } catch (error) {
        console.error('Unexpected error fetching barangays:', error);
      }
    };

    fetchBarangays();
  }, []);

  // Convert date string to Date object for picker
  useEffect(() => {
    if (formData.dateOfBirth) {
      const date = new Date(formData.dateOfBirth);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
      }
    }
  }, [formData.dateOfBirth]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to change your profile picture.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
        setImageChanged(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);
    
    // Format date as MM/DD/YYYY
    const formattedDate = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
    handleInputChange('dateOfBirth', formattedDate);
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  // Convert barangays to picker format
  const barangayPickerItems = barangays.map(barangay => ({
    label: barangay.name,
    value: barangay.name,
  }));

  const validateForm = () => {
    const { fullName, dateOfBirth, sex, contactNumber, address } = formData;
    
    if (!fullName || !dateOfBirth || !sex || !contactNumber || !address) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    return true;
  };

  const uploadImageToSupabase = async (imageUri) => {
    try {
      // Generate unique filename
      const fileExt = imageUri.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: `image/${fileExt}`,
        name: fileName,
      });
      
      // Upload to Supabase storage using FormData
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, formData, {
          contentType: `image/${fileExt}`,
          upsert: true
        });
      
      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);
      
      return publicUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Prepare update data
      const updateData = {
        full_name: formData.fullName,
        date_of_birth: formData.dateOfBirth,
        sex: formData.sex,
        contact_number: formData.contactNumber,
        address: formData.address,
      };

      // Upload image if changed
      if (imageChanged && profileImage && profileImage.startsWith('file://')) {
        try {
          const imageUrl = await uploadImageToSupabase(profileImage);
          updateData.profile_image_url = imageUrl;
        } catch (imageError) {
          console.error('Image upload failed:', imageError);
          Alert.alert(
            'Warning', 
            'Profile updated but image upload failed. Please try uploading the image again.',
            [{ text: 'OK' }]
          );
        }
      }

      // Update profile in database
      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Error', 'Failed to update profile. Please try again.');
        return;
      }
      
      // Reset image changed flag
      setImageChanged(false);
      
      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Unexpected error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          onPress={handleSave}
          style={[styles.saveButton, (loading || fetchingProfile) && styles.saveButtonDisabled]}
          disabled={loading || fetchingProfile}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : fetchingProfile ? 'Loading...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {fetchingProfile ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        ) : (
        <View style={styles.form}>
          {/* Profile Picture */}
          <View style={styles.profilePictureSection}>
            <View style={styles.profilePicture}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <Ionicons name="person" size={40} color={colors.primary} />
              )}
            </View>
            <TouchableOpacity style={styles.changePictureButton} onPress={pickImage}>
              <Text style={styles.changePictureText}>Change Picture</Text>
            </TouchableOpacity>
          </View>

          {/* Full Name */}
          <View style={styles.inputContainer}>
            <Text style={globalStyles.label}>Full Name *</Text>
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
            <Text style={globalStyles.label}>Date of Birth *</Text>
            <TouchableOpacity onPress={showDatePickerModal} style={styles.inputWrapper}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} style={styles.inputIcon} />
              <View style={[globalStyles.input, styles.input, styles.dateInput]}>
                <Text style={[styles.dateText, !formData.dateOfBirth && styles.placeholderText]}>
                  {formData.dateOfBirth || 'Select Date of Birth'}
                </Text>
              </View>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          {/* Sex */}
          <View style={styles.inputContainer}>
            <Text style={globalStyles.label}>Sex *</Text>
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
            <Text style={globalStyles.label}>Contact Number *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={[globalStyles.input, styles.input]}
                value={formData.contactNumber}
                onChangeText={(value) => handleInputChange('contactNumber', value)}
                placeholder="Enter your contact number"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Address - Barangay Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={globalStyles.label}>Barangay *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={20} color={colors.primary} style={styles.inputIcon} />
              <View style={[globalStyles.input, styles.input, styles.pickerContainer]}>
                <RNPickerSelect
                  onValueChange={(value) => handleInputChange('address', value)}
                  items={barangayPickerItems}
                  value={formData.address}
                  placeholder={{
                    label: 'Select your barangay...',
                    value: null,
                    color: colors.textSecondary,
                  }}
                  style={{
                    inputIOS: styles.pickerInput,
                    inputAndroid: styles.pickerInput,
                    placeholder: styles.pickerPlaceholder,
                  }}
                />
              </View>
            </View>
          </View>

          {/* Email (Read-only) */}
          <View style={styles.inputContainer}>
            <Text style={globalStyles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[globalStyles.input, styles.input, styles.readOnlyInput]}
                value={formData.email}
                placeholder="Email address"
                editable={false}
              />
            </View>
            <Text style={styles.readOnlyNote}>
              Email cannot be changed. Contact support if you need to update your email.
            </Text>
          </View>
        </View>
        )}
      </ScrollView>
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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  saveButtonText: {
    color: colors.textWhite,
    fontSize: 14,
    fontWeight: '600',
  },
  saveButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  changePictureButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  changePictureText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  dateInput: {
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  pickerContainer: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  pickerInput: {
    fontSize: 16,
    color: colors.textPrimary,
    paddingLeft: 50,
    paddingRight: 16,
    paddingVertical: 12,
  },
  pickerPlaceholder: {
    color: colors.textSecondary,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    paddingLeft: 50,
    paddingRight: 16,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
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
  readOnlyInput: {
    backgroundColor: colors.backgroundLight,
    color: colors.textSecondary,
  },
  readOnlyNote: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default EditProfileScreen;
