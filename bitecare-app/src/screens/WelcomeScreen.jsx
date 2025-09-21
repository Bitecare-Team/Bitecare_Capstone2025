import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo and Branding */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>🏥</Text>
          </View>
          <Text style={styles.appName}>
            Welcome to <Text style={styles.appNameHighlight}>BiteCare</Text>
          </Text>
          <Text style={styles.tagline}>
            Simplifying <Text style={styles.taglineHighlight}>rabies care</Text> through digital innovation.
          </Text>
        </View>

        {/* Central Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.illustration}>
            <Image 
              source={require('../../assets/Screen.png')}
              style={styles.illustrationImage}
              resizeMode="contain"
            />
            <Text style={styles.illustrationText}>Professional Care</Text>
            <Text style={styles.illustrationSubtext}>Safe and reliable vaccination services</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[globalStyles.button, styles.signUpButton]}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={globalStyles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[globalStyles.button, styles.logInButton]}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={globalStyles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    fontSize: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  appNameHighlight: {
    color: colors.primary,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  taglineHighlight: {
    color: colors.primary,
    fontWeight: '600',
  },
  illustrationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    alignItems: 'center',
    // backgroundColor: colors.backgroundLight,
    padding: 40,
    borderRadius: 20,
    width: '100%',
  },
  illustrationImage: {
    width: 350,
    height: 300,
    // marginBottom: 10,
  },
  illustrationText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
    
  },
  illustrationSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  signUpButton: {
    marginBottom: 16,
  },
  logInButton: {
    backgroundColor: colors.primary,
  },
});

export default WelcomeScreen;
