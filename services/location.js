import { useEffect, useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'locations';
const initialLocations = [];
const listeners = new Set();
let locationsState = initialLocations;
let loadLocationsPromise = null;

function emitChange() {
	listeners.forEach((listener) => listener());
}

function subscribe(listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

function getSnapshot() {
	return locationsState;
}

async function persistLocations(nextLocations) {
	locationsState = nextLocations;
	emitChange();
	await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextLocations));
}

async function ensureLocationsLoaded() {
	if (!loadLocationsPromise) {
		loadLocationsPromise = AsyncStorage.getItem(STORAGE_KEY)
			.then((storedLocations) => {
				locationsState = storedLocations ? JSON.parse(storedLocations) : initialLocations;
				emitChange();
			})
			.catch((error) => {
				console.warn('[Location] Failed to load locations:', error);
				locationsState = initialLocations;
				emitChange();
			});
	}

	return loadLocationsPromise;
}

async function addLocation(payload) {
	await ensureLocationsLoaded();

	const nextItem = {
		id: String(Date.now()),
		title: payload.title,
		subtitle: payload.subtitle || '',
		address: payload.address || '',
		location: payload.location || null,
	};

	await persistLocations([nextItem, ...locationsState]);
}

async function removeLocation(id) {
	await ensureLocationsLoaded();
	await persistLocations(locationsState.filter((item) => item.id !== id));
}

export function useLocations() {
	const locations = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

	useEffect(() => {
		void ensureLocationsLoaded();
	}, []);

	return { locations, addLocation, removeLocation };
}
