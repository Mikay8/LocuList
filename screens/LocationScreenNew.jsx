import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import * as Location from 'expo-location';
import { useLocations } from '../services/location';

export default function LocationScreenNew({ navigation }) {
	const [title, setTitle] = useState('');
	const [subtitle, setSubtitle] = useState('');
	const [address, setAddress] = useState('');
	const [saving, setSaving] = useState(false);
	const { addLocation } = useLocations();

	const saveLocation = async () => {
		if (!title.trim()) return;
		setSaving(true);

		const trimmedAddress = address.trim();
		let geocodedCoords = null;
		try {
			if (trimmedAddress) {
				const matches = await Location.geocodeAsync(trimmedAddress);
				const bestMatch = matches[0];

				if (!bestMatch) {
					throw new Error('No coordinates found for the entered address.');
				}

				geocodedCoords = { lat: bestMatch.latitude, lng: bestMatch.longitude };
			}
		} catch (e) {
			console.warn('Could not geocode address:', e);
		}

		try {
			console.log('[LocationScreenNew] saving location:', {
				title: title.trim(),
				subtitle: subtitle.trim(),
				address: trimmedAddress,
				location: geocodedCoords,
			});

			await addLocation({
				title: title.trim(),
				subtitle: subtitle.trim(),
				address: trimmedAddress,
				location: geocodedCoords,
			});

			setTitle('');
			setSubtitle('');
			setAddress('');
			navigation.goBack();
		} catch (e) {
			console.warn('Could not save location:', e);
		} finally {
			setSaving(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text variant="headlineSmall" style={styles.header}>Add New Location</Text>

			<TextInput
				label="Title"
				mode="outlined"
				value={title}
				onChangeText={setTitle}
				style={styles.input}
			/>

			<TextInput
				label="Subtitle"
				mode="outlined"
				value={subtitle}
				onChangeText={setSubtitle}
				style={styles.input}
			/>

			<TextInput
				label="Address"
				mode="outlined"
				value={address}
				onChangeText={setAddress}
				style={styles.input}
			/>

			<Button mode="contained" onPress={saveLocation} loading={saving} disabled={saving}>
				Save Location
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 16,
	},
	header: {
		marginBottom: 16,
	},
	input: {
		marginBottom: 12,
	},
});
