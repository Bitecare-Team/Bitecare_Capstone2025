import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';

const MapScreen = ({ navigation }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);

  // Mock ABTC locations in Bogo City
  const abtcLocations = [
    {
      id: 1,
      name: 'RHU ABTC Clinic',
      address: 'Bogo City Health Office, Bogo City, Cebu',
      coordinates: {
        latitude: 11.0519,
        longitude: 123.9956,
      },
      phone: '(032) 123-4567',
      hours: '8:00 AM - 12:00 PM',
      days: 'Monday & Thursday',
      isMain: true,
      distance: '0.5 km',
    },
    // {
    //   // id: 2,
    //   // name: 'Bogo City Medical Center',
    //   // address: 'Poblacion, Bogo City, Cebu',
    //   // coordinates: {
    //   //   latitude: 11.0525,
    //   //   longitude: 123.9960,
    //   // },
    //   // phone: '(032) 123-4568',
    //   // hours: '24/7 Emergency',
    //   // days: 'Daily',
    //   // isMain: false,
    //   // distance: '1.2 km',
    // },
    // {
    //   id: 3,
    //   name: 'Bogo City District Hospital',
    //   address: 'Barangay Cogon, Bogo City, Cebu',
    //   coordinates: {
    //     latitude: 11.0480,
    //     longitude: 123.9900,
    //   },
    //   phone: '(032) 123-4569',
    //   hours: '8:00 AM - 5:00 PM',
    //   days: 'Monday - Saturday',
    //   isMain: false,
    //   distance: '2.1 km',
    // },
  ];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to show your current location');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleGetDirections = (clinic) => {
    Alert.alert(
      'Get Directions',
      `Would you like to get directions to ${clinic.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Get Directions', 
          onPress: () => {
            // In a real app, this would open the device's map app
            Alert.alert('Directions', `Opening directions to ${clinic.name}`);
          }
        },
      ]
    );
  };

  const handleCallClinic = (clinic) => {
    Alert.alert(
      'Call Clinic',
      `Would you like to call ${clinic.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => {
            // In a real app, this would initiate a phone call
            Alert.alert('Calling', `Calling ${clinic.phone}`);
          }
        },
      ]
    );
  };

  const renderClinicCard = (clinic) => (
    <View key={clinic.id} style={[globalStyles.card, styles.clinicCard]}>
      <View style={styles.clinicHeader}>
        <View style={styles.clinicInfo}>
          <View style={styles.clinicTitleRow}>
            <Text style={styles.clinicName}>{clinic.name}</Text>
            {clinic.isMain && (
              <View style={styles.mainBadge}>
                <Text style={styles.mainBadgeText}>Main</Text>
              </View>
            )}
          </View>
          <Text style={styles.clinicAddress}>{clinic.address}</Text>
          <View style={styles.clinicDetails}>
            <View style={styles.clinicDetail}>
              <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.clinicDetailText}>{clinic.hours}</Text>
            </View>
            <View style={styles.clinicDetail}>
              <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.clinicDetailText}>{clinic.days}</Text>
            </View>
            <View style={styles.clinicDetail}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.clinicDetailText}>{clinic.distance}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.clinicActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.directionsButton]}
          onPress={() => handleGetDirections(clinic)}
        >
          <Ionicons name="navigate-outline" size={16} color={colors.primary} />
          <Text style={styles.actionButtonText}>Directions</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.callButton]}
          onPress={() => handleCallClinic(clinic)}
        >
          <Ionicons name="call-outline" size={16} color={colors.success} />
          <Text style={styles.actionButtonText}>Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ABTC Locations</Text>
        <TouchableOpacity onPress={getCurrentLocation} style={styles.locationButton}>
          <Ionicons name="locate-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={80} color={colors.border} />
          <Text style={styles.mapPlaceholderText}>Interactive Map</Text>
          <Text style={styles.mapPlaceholderSubtext}>
            {userLocation 
              ? 'Your location and nearby ABTC clinics are shown here'
              : 'Enable location to see your position on the map'
            }
          </Text>
        </View>
      </View>

      {/* Location List */}
      <ScrollView style={styles.locationsList}>
        <View style={styles.locationsHeader}>
          <Text style={styles.locationsTitle}>Available ABTC Clinics</Text>
          <Text style={styles.locationsSubtitle}>in Bogo City, Cebu</Text>
        </View>
        
        {abtcLocations.map(renderClinicCard)}
        

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
  locationButton: {
    padding: 4,
  },
  mapContainer: {
    height: 200,
    backgroundColor: colors.backgroundLight,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundLight,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 12,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  locationsList: {
    flex: 1,
  },
  locationsHeader: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  locationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  locationsSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  clinicCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  clinicHeader: {
    marginBottom: 16,
  },
  clinicInfo: {
    flex: 1,
  },
  clinicTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  mainBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  mainBadgeText: {
    color: colors.textWhite,
    fontSize: 10,
    fontWeight: '600',
  },
  clinicAddress: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  clinicDetails: {
    gap: 4,
  },
  clinicDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clinicDetailText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  clinicActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  directionsButton: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.primary,
  },
  callButton: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  emergencyInfo: {
    backgroundColor: colors.cardBackground,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  emergencyButtonText: {
    color: colors.textWhite,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default MapScreen;
