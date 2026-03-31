import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleNotification, cancelNotification } from '../services/notifications';

export function useReminders() {
  const [reminders, setReminders] = useState([]);

  // Load reminders from storage on mount
  useEffect(() => {
    AsyncStorage.getItem('reminders').then(data => {
      setReminders(data ? JSON.parse(data) : []);
    });
  }, []);

  // Add a new reminder and schedule notification
  async function add(reminder) {
    const notifId = await scheduleNotification(reminder);
    const withNotif = { ...reminder, notifId };
    const updated = [...reminders, withNotif];
    await AsyncStorage.setItem('reminders', JSON.stringify(updated));
    setReminders(updated);
  }

  // Remove a reminder and cancel notification
  async function remove(reminder) {
    if (reminder.notifId) await cancelNotification(reminder.notifId);
    const updated = reminders.filter(r => r.id !== reminder.id);
    await AsyncStorage.setItem('reminders', JSON.stringify(updated));
    setReminders(updated);
  }

  return { reminders, add, remove };
}
