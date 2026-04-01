import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useLocations } from '../services/location';

export default function LocationScreenNew({ navigation }) {
	const [title, setTitle] = useState('');
	const [subtitle, setSubtitle] = useState('');
	const [address, setAddress] = useState('');
	const { addLocation } = useLocations();

	const saveLocation = () => {
		if (!title.trim()) return;

		addLocation({
			title: title.trim(),
			subtitle: subtitle.trim(),
			address: address.trim(),
		});

		setTitle('');
		setSubtitle('');
		setAddress('');
		navigation.goBack();
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

			<Button mode="contained" onPress={saveLocation}>
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
