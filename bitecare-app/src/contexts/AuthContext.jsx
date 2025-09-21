import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, userData) => {
    try {
      console.log('=== SIGNUP DEBUG START ===');
      console.log('Starting Supabase signup for:', email);
      console.log('User data:', userData);

      // Step 1: Create auth user with metadata and proper redirect URL
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'exp://localhost:8081/--/auth/callback',
          data: {
            full_name: userData.fullName,
            date_of_birth: userData.dateOfBirth,
            sex: userData.sex,
            contact_number: userData.contactNumber,
            address: userData.address,
          }
        }
      });

      console.log('Auth signup result:', { 
        user: authData?.user?.id, 
        error: authError?.message,
        session: !!authData?.session,
        emailConfirmed: authData?.user?.email_confirmed_at 
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        return { error: authError, warning: null };
      }

      // If email confirmation is required, store profile data temporarily in user metadata
      // The profile will be created after email confirmation via a database trigger or webhook
      if (authData.user && !authData.user.email_confirmed_at) {
        console.log('Email confirmation required - profile will be created after verification');
        return { 
          error: null, 
          warning: 'Account created successfully! Please check your email to verify your account. Your profile will be set up after verification.' 
        };
      }

      // If email is already confirmed (or confirmation disabled), create profile immediately
      if (authData.user && authData.user.email_confirmed_at) {
        console.log('Email confirmed - creating user profile immediately');
        
        const profileData = {
          id: authData.user.id,
          full_name: userData.fullName,
          date_of_birth: userData.dateOfBirth,
          sex: userData.sex,
          contact_number: userData.contactNumber,
          address: userData.address,
          email: email,
        };

        const { data: insertData, error: profileError } = await supabase
          .from('user_profiles')
          .insert([profileData])
          .select();

        if (profileError) {
          console.error('Profile creation error:', profileError);
          return { 
            error: null, 
            warning: `Account created but profile setup incomplete: ${profileError.message}` 
          };
        }

        console.log('User profile created successfully:', insertData);
      }

      console.log('=== SIGNUP COMPLETED SUCCESSFULLY ===');
      return { error: null, warning: null };

    } catch (error) {
      console.error('Unexpected signup error:', error);
      return { error: { message: 'An unexpected error occurred during signup' }, warning: null };
    }
  };

  const signIn = async (email, password) => {
    try {
      console.log('Attempting to sign in:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { data: null, error };
      }

      console.log('Sign in successful:', data.user?.email);
      return { data, error: null };

    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { data: null, error: { message: 'An unexpected error occurred during sign in' } };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      return { error };
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      return { error: { message: 'An unexpected error occurred during sign out' } };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
