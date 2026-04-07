import * as Notifications from 'expo-notifications';

// Configure how notifications are handled when received
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request permissions for notifications (required on iOS)
export async function requestPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// Schedule a notification
export async function scheduleNotification(reminder) {
  const triggerDate = new Date(reminder.dateTime);
  if (triggerDate <= new Date()) {
    //throw new Error('Reminder time must be in the future.');
    console.error('Reminder time must be in the future.');
    return;
  }
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: reminder?.reminderName,
      body: reminder?.description||'You have a reminder scheduled.',
    },
    trigger: { type: 'date', date: triggerDate },
  });
}

// Cancel a scheduled notification
export async function cancelNotification(notifId) {
  await Notifications.cancelScheduledNotificationAsync(notifId);
}

// Fire a notification immediately (condition-based trigger)
export async function sendImmediateNotification(reminder) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: reminder.reminderName,
      body: reminder.description || 'You have a reminder.',
    },
    trigger: null,
  });
}

export async function sendLocationNearbyNotification(location, distanceMeters) {
  const distanceText = Number.isFinite(distanceMeters)
    ? `You are about ${distanceMeters} meters away.`
    : 'You are near one of your saved locations.';

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Nearby: ${location.title}`,
      body: location.address
        ? `${distanceText} ${location.address}`
        : distanceText,
    },
    trigger: null,
  });
}
