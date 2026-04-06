import { sendImmediateNotification } from './notifications';

// Maps reminder activity dropdown values to accelerometer motionType values
const ACTIVITY_MAP = {
  'Walking': 'walking',
  'In a Vehicle': 'driving',
  'Stationary': 'stationary',
};

const PROXIMITY_METERS = 200;
const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes

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
function isNearby(a, b) {
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

// Called on every accelerometer motion change
export function checkMotionConditions({ motionType, reminders }) {
  for (const reminder of reminders) {
    if (!reminder.activity) continue;
    if (isOnCooldown(reminder.id)) continue;
    const mapped = ACTIVITY_MAP[reminder.activity];
    if (mapped === motionType) {
      markFired(reminder.id);
      sendImmediateNotification(reminder);
    }
  }
}

// Called every 30s from the location polling loop
export function checkLocationConditions({ currentPosition, reminders, locations }) {
  for (const reminder of reminders) {
    if (!reminder.locationId) continue;
    if (isOnCooldown(reminder.id)) continue;
    const loc = locations.find(l => l.id === reminder.locationId);
    if (!loc?.location?.lat) continue;
    const dist = isNearby(currentPosition, loc.location);
    if (dist <= PROXIMITY_METERS) {
      markFired(reminder.id);
      sendImmediateNotification(reminder);
    }
  }
}
