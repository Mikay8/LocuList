import React, { createContext, useContext, useMemo, useState } from 'react';

const initialLocations = [
	{ id: '1', title: 'Medicine Pick-up', subtitle: 'CSV Pharmacy', address: '123 Main St - Pharmacy' },
	{ id: '2', title: 'Buy Groceries', subtitle: 'Walmart', address: '456 Supermarket Blvd - Walmart' },
	{ id: '3', title: 'Gym', subtitle: 'LA Fitness', address: '789 Fitness Ave - Gym' },
];

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
	const [locations, setLocations] = useState(initialLocations);

	const addLocation = (payload) => {
		const nextItem = {
			id: String(Date.now()),
			title: payload.title,
			subtitle: payload.subtitle || '',
			address: payload.address || '',
			location: payload.location || null,
		};

		setLocations((prev) => [nextItem, ...prev]);
	};

	const removeLocation = (id) => {
		setLocations((prev) => prev.filter((item) => item.id !== id));
	};

	const value = useMemo(() => ({
		locations,
		addLocation,
		removeLocation,
	}), [locations]);

	return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocations() {
	const context = useContext(LocationContext);
	if (!context) {
		throw new Error('useLocations must be used within LocationProvider');
	}
	return context;
}
