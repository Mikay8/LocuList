import { cancelNotification, scheduleNotification } from './notifications';


export async function AttachReminderTimer(reminder, existingNotifId = null) {
  if (existingNotifId) {
    await cancelNotification(existingNotifId);
  }

  if (!reminder?.dateTime || Number.isNaN(new Date(reminder.dateTime).getTime()) || new Date(reminder.dateTime) <= new Date()) {
    return { ...reminder, notifId: null };
  }

  const notifId = await scheduleNotification(reminder);
  return { ...reminder, notifId: notifId ?? null };
}

export async function DetachReminderTimer(reminder) {
  if (reminder?.notifId) {
    await cancelNotification(reminder.notifId);
  }
}

export async function SyncReminderTimers(reminders) {
  const nextReminders = [];

  for (const reminder of reminders) {
    nextReminders.push(await AttachReminderTimer(reminder, reminder.notifId));
  }

  return nextReminders;
}