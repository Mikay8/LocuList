import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Surface, ActivityIndicator, TouchableRipple } from 'react-native-paper';
import * as Location from 'expo-location';
import { useLocations } from '../services/location';
import { elevation, palette } from '../theme/appTheme';
import { fetchGoogleAddressSuggestions, hasGooglePlacesApiKey } from '../services/googlePlaces';

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

				{hasPlacesKey ? (
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
				) : (
					<Text variant="bodyMedium" style={styles.helperText}>
						Set EXPO_PUBLIC_GOOGLE_PLACES_API_KEY to enable Google address autocomplete.
					</Text>
				)}

				<Button mode="contained" onPress={saveLocation} loading={saving} disabled={saving} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel}>
					Save place
				</Button>
			</Surface>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: palette.background,
		padding: 20,
		gap: 18,
	},
	heroCard: {
		backgroundColor: palette.surface,
		borderRadius: 28,
		padding: 24,
		...elevation.card,
	},
	header: {
		color: palette.text,
	},
	heroText: {
		color: palette.textMuted,
		marginTop: 8,
	},
	formCard: {
		backgroundColor: palette.surface,
		borderRadius: 24,
		padding: 20,
		...elevation.card,
	},
	sectionTitle: {
		color: palette.text,
		marginBottom: 16,
	},
	input: {
		marginBottom: 12,
		backgroundColor: palette.surface,
	},
	autocompleteSection: {
		marginBottom: 16,
	},
	helperText: {
		color: palette.textMuted,
		marginBottom: 10,
	},
	loadingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		marginBottom: 10,
	},
	loadingText: {
		color: palette.textMuted,
	},
	errorText: {
		color: palette.danger,
		marginBottom: 10,
	},
	suggestionsCard: {
		borderRadius: 18,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: palette.surfaceVariant,
		backgroundColor: palette.background,
	},
	suggestionItem: {
		paddingHorizontal: 16,
		paddingVertical: 14,
	},
	suggestionTitle: {
		color: palette.text,
	},
	suggestionSubtitle: {
		color: palette.textMuted,
		marginTop: 2,
	},
	inputOutline: {
		borderRadius: 18,
		borderColor: palette.outline,
	},
	buttonContent: {
		minHeight: 54,
	},
	buttonLabel: {
		fontSize: 17,
		fontWeight: '700',
	},
});
