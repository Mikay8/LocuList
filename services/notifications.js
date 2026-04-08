import * as Notifications from 'expo-notifications';
import * as Speech from 'expo-speech';

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

export async function speakNotificationMessage(title, body) {
  const messageParts = [title, body].filter(Boolean);
  if (messageParts.length === 0) return;

  try {
    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) {
      await Speech.stop();
    }

    await Speech.speak(messageParts.join('. '));
  } catch (error) {
    console.warn('[Notifications] Failed to speak notification message:', error);
  }
}

export async function sendLocationNearbyNotification(location, distanceMeters) {
  const distanceMiles = distanceMeters / 1609.344;
  const distanceText = Number.isFinite(distanceMeters)
    ? `You are about ${distanceMiles.toFixed(1)} miles away.`
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




