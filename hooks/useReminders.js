import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { attachReminderTimer, detachReminderTimer, syncReminderTimers } from '../services/reminderTimer';

export function useReminders() {
  const [reminders, setReminders] = useState([]);

  // Load reminders from storage on mount
  useEffect(() => {
    AsyncStorage.getItem('reminders').then(async data => {
      const parsed = data ? JSON.parse(data) : [];
      const synced = await syncReminderTimers(parsed);
      await AsyncStorage.setItem('reminders', JSON.stringify(synced));
      setReminders(synced);
    });
  }, []);

  // Add a new reminder and attach a separate date-time timer when available.
  async function add(reminder) {
    const withNotif = await attachReminderTimer(reminder);
    const updated = [...reminders, withNotif];
    await AsyncStorage.setItem('reminders', JSON.stringify(updated));
    setReminders(updated);
  }

  // Remove a reminder and cancel notification
  async function remove(reminder) {
    await detachReminderTimer(reminder);
    const updated = reminders.filter(r => r.id !== reminder.id);
    await AsyncStorage.setItem('reminders', JSON.stringify(updated));
    setReminders(updated);
  }

  // Update a reminder and reschedule notification
  async function update(reminder) {
    const existing = reminders.find(r => r.id === reminder.id);
    if (existing) {
      const withNotif = await attachReminderTimer(reminder, existing.notifId);
      const updated = reminders.map(r => r.id === reminder.id ? withNotif : r);
      await AsyncStorage.setItem('reminders', JSON.stringify(updated));
      setReminders(updated);
    }
  }

  return { reminders, add, remove, update };
}
