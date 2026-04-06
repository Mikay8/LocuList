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

  // Add a new reminder and schedule notification (only if dateTime is set)
  async function add(reminder) {
    const notifId = reminder.dateTime ? await scheduleNotification(reminder) : null;
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

  // Update a reminder and reschedule notification
  async function update(reminder) {
    const existing = reminders.find(r => r.id === reminder.id);
    if (existing) {
      if (existing.notifId) await cancelNotification(existing.notifId);
      const notifId = reminder.dateTime ? await scheduleNotification(reminder) : null;
      const withNotif = { ...reminder, notifId };
      const updated = reminders.map(r => r.id === reminder.id ? withNotif : r);
      await AsyncStorage.setItem('reminders', JSON.stringify(updated));
      setReminders(updated);
    }
  }

  return { reminders, add, remove, update };
}
