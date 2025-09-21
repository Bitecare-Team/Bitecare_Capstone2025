import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';

const AppointmentsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('upcoming');

  // Mock data - in real app, this would come from Supabase
  const upcomingAppointments = [
    {
      id: 1,
      date: '2024-01-15',
      time: '10:00 AM',
      type: 'Rabies Vaccination - Dose 3',
      status: 'confirmed',
      clinic: 'RHU ABTC Clinic',
    },
    {
      id: 2,
      date: '2024-01-22',
      time: '2:00 PM',
      type: 'Rabies Vaccination - Dose 4',
      status: 'pending',
      clinic: 'RHU ABTC Clinic',
    },
  ];

  const pastAppointments = [
    {
      id: 3,
      date: '2024-01-01',
      time: '9:00 AM',
      type: 'Rabies Vaccination - Dose 1',
      status: 'completed',
      clinic: 'RHU ABTC Clinic',
    },
    {
      id: 4,
      date: '2024-01-08',
      time: '11:00 AM',
      type: 'Rabies Vaccination - Dose 2',
      status: 'completed',
      clinic: 'RHU ABTC Clinic',
    },
  ];

  const handleBookAppointment = () => {
    navigation.navigate('BookAppointment');
  };

  const renderAppointmentCard = (appointment) => (
    <View key={appointment.id} style={[globalStyles.card, styles.appointmentCard]}>
      <View style={styles.appointmentHeader}>
        <View style={styles.appointmentDate}>
          <Text style={styles.appointmentDay}>
            {new Date(appointment.date).getDate()}
          </Text>
          <Text style={styles.appointmentMonth}>
            {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}
          </Text>
        </View>
        <View style={styles.appointmentDetails}>
          <Text style={styles.appointmentType}>{appointment.type}</Text>
          <Text style={styles.appointmentTime}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            {' '}{appointment.time}
          </Text>
          <Text style={styles.appointmentClinic}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            {' '}{appointment.clinic}
          </Text>
        </View>
        <View style={styles.appointmentStatus}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(appointment.status) }
          ]}>
            <Text style={styles.statusText}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'completed':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIllustration}>
        <Ionicons name="calendar-outline" size={80} color={colors.border} />
      </View>
      <Text style={styles.emptyTitle}>
        {activeTab === 'upcoming' ? 'No upcoming appointments yet' : 'No past appointments'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'upcoming' 
          ? 'Schedule your healthcare appointments at your convenience'
          : 'Your completed appointments will appear here'
        }
      </Text>
      {activeTab === 'upcoming' && (
        <TouchableOpacity 
          style={[globalStyles.button, styles.bookButton]}
          onPress={handleBookAppointment}
        >
          <Text style={globalStyles.buttonText}>Book An Appointment</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const currentAppointments = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Appointments</Text>
        <TouchableOpacity 
          style={styles.bookButtonHeader}
          onPress={handleBookAppointment}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
          {activeTab === 'upcoming' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Past
          </Text>
          {activeTab === 'past' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {currentAppointments.length > 0 ? (
          <View style={styles.appointmentsList}>
            {currentAppointments.map(renderAppointmentCard)}
          </View>
        ) : (
          renderEmptyState()
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  bookButtonHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  bookButtonText: {
    color: colors.textWhite,
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    // Active tab styling
  },
  tabText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
  },
  appointmentsList: {
    padding: 16,
  },
  appointmentCard: {
    marginBottom: 12,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentDate: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 50,
  },
  appointmentDay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  appointmentMonth: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentType: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  appointmentClinic: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  appointmentStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIllustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  bookButton: {
    minWidth: 200,
  },
});

export default AppointmentsScreen;
