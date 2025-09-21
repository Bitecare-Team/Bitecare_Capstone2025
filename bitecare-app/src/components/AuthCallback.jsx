import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';

const AuthCallback = ({ navigation }) => {
  const { user } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback from email confirmation
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigation.navigate('SignIn');
          return;
        }

        if (data.session) {
          console.log('Email confirmed successfully:', data.session.user.email);
          // Navigate to main app
          navigation.navigate('Main');
        } else {
          navigation.navigate('SignIn');
        }
      } catch (error) {
        console.error('Unexpected auth callback error:', error);
        navigation.navigate('SignIn');
      }
    };

    handleAuthCallback();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 16 }}>Confirming your email...</Text>
    </View>
  );
};

export default AuthCallback;
