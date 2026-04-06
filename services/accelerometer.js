import { Accelerometer } from 'expo-sensors';
const MOVEMENT_THRESHOLD = 0.1;
const UPDATE_INTERVAL = 300;
const WINDOW_SIZE = 15;
const WALKING_VARIANCE_THRESHOLD = 0.015;

let subscription = null;
let lastMagnitude = 0;
let listeners = [];
let magnitudeWindow = [];

function getMagnitude({ x, y, z }) {
	return Math.sqrt(x * x + y * y + z * z);
}

function computeVariance(values) {
	if (values.length < 2) return 0;
	const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
	return values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
}

function classifyMotion(magnitude, variance) {
	if (magnitude <= 1.05) return 'stationary';
	return variance >= WALKING_VARIANCE_THRESHOLD ? 'walking' : 'driving';
}

function notifyListeners(event) {
	listeners.forEach((cb) => cb(event));
}

export function startAccelerometer() {
	if (subscription) return;

	Accelerometer.setUpdateInterval(UPDATE_INTERVAL);

	subscription = Accelerometer.addListener((data) => {
		const magnitude = getMagnitude(data);
		const delta = Math.abs(magnitude - lastMagnitude);

		magnitudeWindow.push(magnitude);
		if (magnitudeWindow.length > WINDOW_SIZE) magnitudeWindow.shift();

		if (delta > MOVEMENT_THRESHOLD) {
			const variance = computeVariance(magnitudeWindow);
			const motionType = classifyMotion(magnitude, variance);
			const isMoving = motionType !== 'stationary';
			notifyListeners({ isMoving, motionType, magnitude, delta, variance, raw: data });
		}

		lastMagnitude = magnitude;
	});
}

export function stopAccelerometer() {
	if (subscription) {
		subscription.remove();
		subscription = null;
	}
}

export function onMotionChange(callback) {
	listeners.push(callback);
	return () => {
		listeners = listeners.filter((cb) => cb !== callback);
	};
}

import { useEffect, useState } from 'react';

export function useAccelerometer() {
	const [state, setState] = useState({ isMoving: false, motionType: 'stationary', magnitude: 0, delta: 0, variance: 0 });

	useEffect(() => {
		startAccelerometer();
		const unsubscribe = onMotionChange((event) => setState(event));
		return () => {
			unsubscribe();
			// Only stop the hardware listener if no other listeners remain
			if (listeners.length === 0) stopAccelerometer();
		};
	}, []);

	return state;
}
