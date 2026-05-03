import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Text, TextInput, Button, Surface, ActivityIndicator, TouchableRipple } from 'react-native-paper';
import * as Location from 'expo-location';
import { useLocations } from '../services/location';
import { palette } from '../theme/appTheme';
import { fetchGoogleAddressSuggestions, hasGooglePlacesApiKey } from '../services/googlePlaces';
import { locationScreenNewStyles as styles } from './LocationScreenDetail.styles';

export default function LocationScreenNew({ navigation }) {
	const [title, setTitle] = useState('');
	const [subtitle, setSubtitle] = useState('');
	const [address, setAddress] = useState('');
	const [addressSuggestions, setAddressSuggestions] = useState([]);
	const [autocompleteLoading, setAutocompleteLoading] = useState(false);
	const [autocompleteError, setAutocompleteError] = useState('');
	const [saving, setSaving] = useState(false);
	const { addLocation } = useLocations();
	const skipNextLookupRef = useRef(false);
	const hasPlacesKey = hasGooglePlacesApiKey();

	useEffect(() => {
		const query = address.trim();

		if (skipNextLookupRef.current) {
			skipNextLookupRef.current = false;
			return;
		}

		if (!hasPlacesKey || query.length < 3) {
			setAddressSuggestions([]);
			setAutocompleteLoading(false);
			setAutocompleteError('');
			return;
		}

		let cancelled = false;
		setAutocompleteError('');
		setAutocompleteLoading(true);

		const timeoutId = setTimeout(async () => {
			try {
				const suggestions = await fetchGoogleAddressSuggestions(query);
				if (!cancelled) {
					setAddressSuggestions(suggestions);
				}
			} catch (error) {
				if (!cancelled) {
					setAddressSuggestions([]);
					setAutocompleteError('Could not load address suggestions right now.');
				}
			} finally {
				if (!cancelled) {
					setAutocompleteLoading(false);
				}
			}
		}, 300);

		return () => {
			cancelled = true;
			clearTimeout(timeoutId);
		};
	}, [address, hasPlacesKey]);

	const selectSuggestion = (suggestion) => {
		skipNextLookupRef.current = true;
		setAddress(suggestion.description);
		setAddressSuggestions([]);
		setAutocompleteError('');
	};

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
			setAddressSuggestions([]);
			navigation.goBack();
		} catch (e) {
			console.warn('Could not save location:', e);
		} finally {
			setSaving(false);
		}
	};

	return (
		<View style={styles.container}>
			<Surface style={styles.heroCard} elevation={0}>
				<Text variant="headlineSmall" style={styles.header}>Add a place</Text>
				<Text variant="bodyLarge" style={styles.heroText}>
					Save common places like home, the pharmacy, or the doctor so reminders can use them later.
				</Text>
			</Surface>

			<Surface style={styles.formCard} elevation={0}>
				<Text variant="titleLarge" style={styles.sectionTitle}>Place details</Text>
				<TextInput
					label="Title"
					mode="outlined"
					value={title}
					onChangeText={setTitle}
					style={styles.input}
					outlineStyle={styles.inputOutline}
				/>

				<TextInput
					label="Subtitle"
					mode="outlined"
					value={subtitle}
					onChangeText={setSubtitle}
					style={styles.input}
					outlineStyle={styles.inputOutline}
				/>

				<TextInput
					label="Address"
					mode="outlined"
					value={address}
					onChangeText={setAddress}
					style={styles.input}
					outlineStyle={styles.inputOutline}
				/>

				<View style={styles.autocompleteSection}>
					<Text variant="bodyMedium" style={styles.helperText}>Start typing an address to see Google suggestions.</Text>
					{autocompleteLoading ? (
						<View style={styles.loadingRow}>
							<ActivityIndicator size="small" color={palette.primary} />
							<Text variant="bodyMedium" style={styles.loadingText}>Looking up addresses...</Text>
						</View>
					) : null}
					{autocompleteError ? <Text variant="bodyMedium" style={styles.errorText}>{autocompleteError}</Text> : null}
					{addressSuggestions.length > 0 ? (
						<View style={styles.suggestionsCard}>
							{addressSuggestions.map(suggestion => (
								<TouchableRipple key={suggestion.id} onPress={() => selectSuggestion(suggestion)} borderless={false} style={styles.suggestionItem}>
									<View>
										<Text variant="titleMedium" style={styles.suggestionTitle}>{suggestion.title}</Text>
										{!!suggestion.subtitle && <Text variant="bodyMedium" style={styles.suggestionSubtitle}>{suggestion.subtitle}</Text>}
									</View>
								</TouchableRipple>
							))}
						</View>
					) : null}
				</View>

				<Button mode="contained" onPress={saveLocation} loading={saving} disabled={saving} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel}>
					Save place
				</Button>
			</Surface>
		</View>
	);
}
