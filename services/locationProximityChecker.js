import { sendLocationNearbyNotification } from './notifications';

const PROXIMITY_METERS = 300;
const EXIT_BUFFER_METERS = 50;
const COOLDOWN_MS = 10 * 60 * 1000;

const proximityState = new Map();

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

function normalizeCoords(location) {
	if (!location) return null;
	const lat = location.lat ?? location.latitude;
	const lng = location.lng ?? location.longitude;
	return lat != null && lng != null ? { lat, lng } : null;
}

function startOfDay(dateLike) {
	const date = new Date(dateLike);
	date.setHours(0, 0, 0, 0);
	return date;
}

export function checkSavedLocationProximity({ currentPosition, locations, reminders }) {
	if (!currentPosition) return;

	const activeIds = new Set(locations.map(location => location.id));
	for (const locationId of proximityState.keys()) {
		if (!activeIds.has(locationId)) {
			proximityState.delete(locationId);
		}
	}

for (const reminder of reminders) {

	//check reminder date greater then todays date
    const hasTime = !!reminder.dateTime;
	if (hasTime && startOfDay(reminder.dateTime) > startOfDay(new Date())) continue;


	//get location coordinates  and normalize them
	const hasLocation = !!reminder.locationId;
	if (hasLocation) {
		const location = locations.find(l => l.id === reminder.locationId);
		if (location) {
				console.log('[LocationProximityChecker] Checking location:', location.id);
		const coords = normalizeCoords(location.location);
		if (!coords) continue;

		// use distance measure haversine formula to find shortest distance on sphere
		const distance = distanceMeters(currentPosition, coords);
		const state = proximityState.get(location.id) ?? { inside: false, lastNotifiedAt: 0 };
		const onCooldown = Date.now() - state.lastNotifiedAt < COOLDOWN_MS;

		if (distance <= PROXIMITY_METERS) {
			if (!state.inside && !onCooldown) {
				void sendLocationNearbyNotification(location, Math.round(distance));
				state.lastNotifiedAt = Date.now();
			}
			state.inside = true;
		} else if (distance > PROXIMITY_METERS + EXIT_BUFFER_METERS) {
			state.inside = false;
		}

		proximityState.set(location.id, state);

		}
	}
}

}