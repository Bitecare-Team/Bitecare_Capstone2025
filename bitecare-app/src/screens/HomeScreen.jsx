import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { supabase } from '../config/supabase';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);
  const [appointmentLoading, setAppointmentLoading] = useState(true);
  
  // Mock data - in real app, this would come from Supabase
  const treatmentProgress = {
    completedDoses: 0,
    totalDoses: 5,
  };

  // Fetch user's upcoming appointments from Supabase
  const fetchUpcomingAppointment = useCallback(async () => {
    if (!user?.id) {
      setAppointmentLoading(false);
      return;
    }
    
    try {
      const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['confirmed', 'pending'])
        .gte('appointment_date', currentDate)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })
        .limit(1);

      if (error) {
        console.error('Error fetching upcoming appointment:', error);
      } else if (data && data.length > 0) {
        setUpcomingAppointment(data[0]);
      } else {
        setUpcomingAppointment(null);
      }
    } catch (error) {
      console.error('Unexpected error fetching appointment:', error);
    } finally {
      setAppointmentLoading(false);
    }
  }, [user?.id]);

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
    fetchUpcomingAppointment();
  }, [fetchUserProfile, fetchUpcomingAppointment]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
      fetchUpcomingAppointment();
    }, [fetchUserProfile, fetchUpcomingAppointment])
  );

  const quickActions = [
    {
      id: 'book-appointment',
      title: 'Book Appointment',
      icon: 'calendar-outline',
      color: colors.primary,
      onPress: () => navigation.navigate('Appointments'),
    },
    {
      id: 'my-appointments',
      title: 'My Appointments',
      icon: 'list-outline',
      color: colors.info,
      onPress: () => navigation.navigate('Appointments'),
    },
    {
      id: 'view-location',
      title: 'View Location',
      icon: 'location-outline',
      color: colors.success,
      onPress: () => navigation.navigate('Map'),
    },
    {
      id: 'help-faq',
      title: 'Help & FAQ\'s',
      icon: 'help-circle-outline',
      color: colors.warning,
      onPress: () => navigation.navigate('More'),
    },
  ];

  const getUserName = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name;
    }
    if (user?.user_metadata?.fullName) {
      return user.user_metadata.fullName;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getUserImage = () => {
    return userProfile?.profile_image_url || null;
  };

  // Add a key to force image re-render when URL changes
  const getImageKey = () => {
    return userProfile?.profile_image_url ? `${userProfile.profile_image_url}-${Date.now()}` : 'placeholder';
  };

  // Format appointment date and time for display
  const formatAppointmentDateTime = (appointment) => {
    if (!appointment) return null;
    
    const appointmentDate = new Date(appointment.appointment_date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    let dateText;
    if (appointmentDate.toDateString() === today.toDateString()) {
      dateText = 'Today';
    } else if (appointmentDate.toDateString() === tomorrow.toDateString()) {
      dateText = 'Tomorrow';
    } else {
      dateText = appointmentDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
    
    return `${dateText}, ${appointment.appointment_time}`;
  };

  // Get appointment type text
  const getAppointmentTypeText = (appointment) => {
    if (!appointment) return 'No upcoming appointments';
    return 'Rabies Vaccination';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Hello,</Text>
              <Text style={styles.userName}>{getUserName()}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.notificationButton}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
                {unreadCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={() => navigation.navigate('EditProfile')}
              >
                {getUserImage() ? (
                  <Image 
                    key={getImageKey()}
                    source={{ uri: getUserImage() }} 
                    style={styles.profileImage} 
                  />
                ) : (
                  <View style={styles.profilePlaceholder}>
                    <Ionicons name="person" size={20} color={colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 1. Clinic Information */}
        <View style={[globalStyles.card, styles.clinicCard]}>
          <View style={styles.clinicHeader}>
            <Ionicons name="medical" size={24} color={colors.primary} />
            <Text style={styles.clinicTitle}>RHU ABTC Clinic</Text>
          </View>
          <View style={styles.clinicInfo}>
            <View style={styles.clinicHours}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.clinicHoursText}>Open Hours: 8:00 AM - 12:00 PM</Text>
            </View>
            <View style={styles.clinicDays}>
              <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.clinicDaysText}>Monday & Thursday</Text>
            </View>
          </View>
        </View>

        {/* 2. Upcoming Appointments */}
        <View style={[globalStyles.card, styles.appointmentCard]}>
          <View style={styles.appointmentHeader}>
            <Ionicons name="calendar" size={24} color={colors.info} />
            <Text style={styles.appointmentTitle}>Upcoming Appointment</Text>
          </View>
          {appointmentLoading ? (
            <View style={styles.appointmentInfo}>
              <Text style={styles.appointmentDateText}>Loading...</Text>
            </View>
          ) : upcomingAppointment ? (
            <View style={styles.appointmentInfo}>
              <View style={styles.appointmentDate}>
                <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.appointmentDateText}>
                  {formatAppointmentDateTime(upcomingAppointment)}
                </Text>
              </View>
              <View style={styles.appointmentType}>
                <Ionicons name="medical-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.appointmentTypeText}>
                  {getAppointmentTypeText(upcomingAppointment)}
                </Text>
              </View>
              <View style={styles.appointmentStatus}>
                <Ionicons 
                  name={upcomingAppointment.status === 'confirmed' ? 'checkmark-circle' : 'time'} 
                  size={16} 
                  color={upcomingAppointment.status === 'confirmed' ? colors.success : colors.warning} 
                />
                <Text style={[
                  styles.appointmentStatusText,
                  { color: upcomingAppointment.status === 'confirmed' ? colors.success : colors.warning }
                ]}>
                  {upcomingAppointment.status === 'confirmed' ? 'Confirmed' : 'Pending Confirmation'}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.appointmentInfo}>
              <View style={styles.noAppointmentContainer}>
                <Ionicons name="calendar-outline" size={32} color={colors.textSecondary} />
                <Text style={styles.noAppointmentText}>No upcoming appointments</Text>
                <TouchableOpacity 
                  style={styles.bookNowButton}
                  onPress={() => navigation.navigate('Appointments')}
                >
                  <Text style={styles.bookNowText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

     

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionButton, { borderColor: action.color }]}
                onPress={action.onPress}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon} size={24} color={colors.textWhite} />
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
   {/* 3. Treatment Progress */}
        <View style={[globalStyles.card, styles.progressCard]}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Treatment Progress</Text>
            <View style={styles.progressBadge}>
              <Text style={styles.progressText}>
                {treatmentProgress.completedDoses}/{treatmentProgress.totalDoses} doses
              </Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(treatmentProgress.completedDoses / treatmentProgress.totalDoses) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressSubtext}>
            {treatmentProgress.totalDoses - treatmentProgress.completedDoses} doses remaining
          </Text>
        </View>
        {/* Recent Activity */}
        <View style={[globalStyles.card, styles.activityCard]}>
          <Text style={styles.activityTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Dose 2 completed</Text>
              <Text style={styles.activityDate}>2 days ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Appointment scheduled</Text>
              <Text style={styles.activityDate}>1 week ago</Text>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    padding: 4,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.cardBackground,
  },
  notificationBadgeText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 4,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  profilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  progressCard: {
    marginTop: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  progressBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  clinicCard: {
    marginTop: 16,
  },
  appointmentCard: {
    marginTop: 12,
    padding: 12,
    marginHorizontal: 16,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 6,
  },
  appointmentInfo: {
    gap: 6,
  },
  appointmentDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentDateText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  appointmentType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentTypeText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  appointmentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentStatusText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
  noAppointmentContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  noAppointmentText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 12,
  },
  bookNowButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookNowText: {
    color: colors.textWhite,
    fontSize: 14,
    fontWeight: '600',
  },
  rescheduleButton: {
    backgroundColor: colors.info,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  rescheduleText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: '600',
  },
  clinicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  clinicTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  clinicInfo: {
    gap: 8,
  },
  clinicHours: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clinicHoursText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  clinicDays: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clinicDaysText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  quickActionsContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  activityCard: {
    marginTop: 16,
    marginBottom: 20,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  activityDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default HomeScreen;
