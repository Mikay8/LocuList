import { cancelNotification, scheduleNotification } from './notifications';

function hasFutureDateTime(reminder) {
  if (!reminder?.dateTime) return false;
  const triggerDate = new Date(reminder.dateTime);
  return !Number.isNaN(triggerDate.getTime()) && triggerDate > new Date();
}

export async function attachReminderTimer(reminder, existingNotifId = null) {
  if (existingNotifId) {
    await cancelNotification(existingNotifId);
  }

  if (!hasFutureDateTime(reminder)) {
    return { ...reminder, notifId: null };
  }

  const notifId = await scheduleNotification(reminder);
  return { ...reminder, notifId: notifId ?? null };
}

export async function detachReminderTimer(reminder) {
  if (reminder?.notifId) {
    await cancelNotification(reminder.notifId);
  }
}

export async function syncReminderTimers(reminders) {
  const nextReminders = [];

  for (const reminder of reminders) {
    nextReminders.push(await attachReminderTimer(reminder, reminder.notifId));
  }

  return nextReminders;
}