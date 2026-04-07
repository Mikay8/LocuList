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

		let gpsCoords = null;
		try {
			const servicesEnabled = await Location.hasServicesEnabledAsync();
			if (!servicesEnabled) {
				throw new Error('Location services are disabled on this device or simulator.');
			}

			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				throw new Error('Location permission was not granted.');
			}

			const lastKnown = await Location.getLastKnownPositionAsync();
			const pos = lastKnown ?? await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.Balanced,
				maximumAge: 60_000,
				timeInterval: 5_000,
			});

			if (pos?.coords) {
				gpsCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
			}
		} catch (e) {
			console.warn('Could not get GPS coordinates:', e);
		}

		try {
			await addLocation({
				title: title.trim(),
				subtitle: subtitle.trim(),
				address: address.trim(),
				location: gpsCoords,
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
