import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';

const MoreScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('English');
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile data from Supabase
  const fetchUserProfile = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Initial load
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Refresh profile data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [fetchUserProfile])
  );

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleChangeLanguage = () => {
    Alert.alert(
      'Change Language',
      'Select your preferred language',
      [
        { text: 'English', onPress: () => setLanguage('English') },
        { text: 'Filipino', onPress: () => setLanguage('Filipino') },
        { text: 'Cebuano', onPress: () => setLanguage('Cebuano') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleTermsAndConditions = () => {
    Alert.alert('Terms & Conditions', 'Terms and conditions content would be displayed here');
  };

  const handleHelpAndFAQ = () => {
    Alert.alert('Help & FAQ', 'Help and FAQ content would be displayed here');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy content would be displayed here');
  };

  const handleAbout = () => {
    Alert.alert(
      'About BiteCare',
      'Version 1.0.0\n\nBiteCare is a mobile application designed to help patients manage their rabies vaccination appointments and track their treatment progress.\n\nDeveloped for the RHU ABTC Clinic in Bogo City, Cebu.'
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await signOut();
              if (error) {
                Alert.alert('Error', error.message);
              } else {
                console.log('User logged out successfully');
                // Navigation to AuthStack (including SignIn) happens automatically
                // when user becomes null through AuthContext
              }
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getUserName = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name;
    }
    if (user?.user_metadata?.fullName) {
      return user.user_metadata.fullName;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getUserEmail = () => {
    return user?.email || 'user@example.com';
  };

  const getUserImage = () => {
    return userProfile?.profile_image_url || null;
  };

  const getImageKey = () => {
    return userProfile?.profile_image_url ? `${userProfile.profile_image_url}-${Date.now()}` : 'placeholder';
  };

  const menuItems = [
    // {
    //   id: 'edit-profile',
    //   title: 'Edit Profile',
    //   icon: 'person-outline',
    //   onPress: handleEditProfile,
    //   showArrow: true,
    // },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => setNotificationsEnabled(!notificationsEnabled),
      showArrow: false,
      rightComponent: (
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.textWhite}
        />
      ),
    },
    {
      id: 'language',
      title: 'Language',
      icon: 'language-outline',
      onPress: handleChangeLanguage,
      showArrow: true,
      rightComponent: <Text style={styles.languageText}>{language}</Text>,
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      icon: 'document-text-outline',
      onPress: handleTermsAndConditions,
      showArrow: true,
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: 'shield-checkmark-outline',
      onPress: handlePrivacyPolicy,
      showArrow: true,
    },
    {
      id: 'help',
      title: 'Help & FAQ',
      icon: 'help-circle-outline',
      onPress: handleHelpAndFAQ,
      showArrow: true,
    },
    {
      id: 'about',
      title: 'About',
      icon: 'information-circle-outline',
      onPress: handleAbout,
      showArrow: true,
    },
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuItemIcon}>
          <Ionicons name={item.icon} size={20} color={colors.primary} />
        </View>
        <Text style={styles.menuItemText}>{item.title}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {item.rightComponent || (item.showArrow && (
          <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>More</Text>
        </View>

        {/* Profile Section */}
        <View style={[globalStyles.card, styles.profileCard]}>
          <View style={styles.profileInfo}>
            <View style={styles.profileAvatar}>
              {getUserImage() ? (
                <Image 
                  key={getImageKey()}
                  source={{ uri: getUserImage() }} 
                  style={styles.profileImage} 
                />
              ) : (
                <Ionicons name="person" size={32} color={colors.primary} />
              )}
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{loading ? 'Loading...' : getUserName()}</Text>
              <Text style={styles.profileEmail}>{getUserEmail()}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={16} color={colors.primary} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map(renderMenuItem)}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>BiteCare v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.cardBackground,
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  profileCard: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  profileExtraInfo: {
    marginTop: 4,
  },
  profileInfoText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  menuSection: {
    marginTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  menuItemRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  logoutSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutButtonText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default MoreScreen;
