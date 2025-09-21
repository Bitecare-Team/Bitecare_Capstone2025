import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from './AuthContext';

const NotificationContext = createContext({});

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications for the current user
  const fetchNotifications = async () => {
    if (!user?.id) return;

    try {
      console.log('=== FETCHING NOTIFICATIONS ===');
      console.log('User ID:', user.id);
      
      // Get appointments that have been confirmed (status changed from pending to confirmed)
      const { data, error } = await supabase
        .from('appointments')
        .select('id, appointment_date, appointment_time, status, created_at, patient_name')
        .eq('user_id', user.id)
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false });

      console.log('Appointments query result:', { data, error });

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      console.log('Confirmed appointments found:', data?.length || 0);

      // Create notification objects for confirmed appointments
      const appointmentNotifications = data.map(appointment => ({
        id: `appointment-${appointment.id}`,
        type: 'appointment_confirmed',
        title: 'Appointment Confirmed',
        message: `Your appointment for ${new Date(appointment.appointment_date).toLocaleDateString()} at ${appointment.appointment_time} has been confirmed by the admin.`,
        timestamp: appointment.created_at,
        read: false,
        appointmentId: appointment.id
      }));

      console.log('Generated notifications:', appointmentNotifications);

      setNotifications(appointmentNotifications);
      setUnreadCount(appointmentNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Unexpected error fetching notifications:', error);
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  // Set up real-time subscription for appointment status changes
  useEffect(() => {
    if (!user?.id) return;

    fetchNotifications();

    // Subscribe to changes in appointments table
    const subscription = supabase
      .channel('appointment-notifications')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('=== REAL-TIME UPDATE ===');
          console.log('Appointment updated:', payload);
          console.log('New status:', payload.new?.status);
          console.log('Old status:', payload.old?.status);
          
          // Refresh notifications when appointment status changes
          if (payload.new?.status === 'confirmed' && payload.old?.status !== 'confirmed') {
            console.log('Status changed to confirmed - refreshing notifications');
            setTimeout(() => fetchNotifications(), 1000); // Small delay to ensure DB is updated
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  const value = {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
