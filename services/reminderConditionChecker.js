import { sendImmediateNotification } from './notifications';

const ACTIVITY_MAP = {
  'Walking': 'walking',
  'In a Vehicle': 'driving',
  'Stationary': 'stationary',
};

const PROXIMITY_METERS = 200;
const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes
const WAIT_TIME = 60_000; // don't trigger within 60s of creation

// reminderId → timestamp of last fired notification
const lastFired = new Map();

function isOnCooldown(id) {
  const t = lastFired.get(id);
  return t != null && Date.now() - t < COOLDOWN_MS;
}

function markFired(id) {
  lastFired.set(id, Date.now());
}

// Haversine distance in meters between two { lat, lng } points
function distanceMeters(a, b) {
  const R = 6_371_000;
  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Time-only reminders are handled by scheduled notifications, not here.
export function checkConditions({ motionType, currentPosition, reminders, locations }) {
  for (const reminder of reminders) {
    const hasLocation = !!reminder.locationId;
    const hasActivity = !!reminder.activity;
    const hasTime = !!reminder.dateTime;

    // Time-only reminders are handled by scheduleNotification in useReminders
    if (!hasLocation && !hasActivity) continue;

    if (isOnCooldown(reminder.id)) continue;

    const createdAt = parseInt(reminder.id, 10);
    if (!isNaN(createdAt) && Date.now() - createdAt < WAIT_TIME) continue;

    // Time gates location/activity: don't fire before dateTime
    if (hasTime && new Date(reminder.dateTime) > new Date()) continue;

    // Check location condition
    if (hasLocation) {
      if (!currentPosition) continue;
      const loc = locations.find(l => l.id === reminder.locationId);
      if (!loc?.location?.lat) continue;
      if (distanceMeters(currentPosition, loc.location) > PROXIMITY_METERS) continue;
    }

    // Check activity condition
    if (hasActivity) {
      if (!motionType) continue;
      const mapped = ACTIVITY_MAP[reminder.activity];
      if (mapped !== motionType) continue;
    }

    // All conditions matched
    markFired(reminder.id);
    sendImmediateNotification(reminder);
  }
}
