import React from 'react';
import { Text, Button, Card, Icon } from 'react-native-paper';
import { View, FlatList, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocations } from '../services/location';
import { palette } from '../theme/appTheme';
import { locationScreenStyles as styles } from './LocationScreenDetail.styles';

export default function LocationScreen({ navigation }) {
        const insets = useSafeAreaInsets();
    const { locations, removeLocation } = useLocations();

        const insetsStyle = {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 24,
            paddingLeft: insets.left + 20,
            paddingRight: insets.right + 20,
        };

        const confirmDelete = (id) => {
            const item = locations.find(l => l.id === id);
            Alert.alert(
                'Delete location',
                `Delete "${item?.title}"?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => removeLocation(id) },
                ]
            );
        };

        const viewDetails = (item) => {
            // Prefer the passed navigation, but fall back to the parent navigator if needed.
            
            const nav = (navigation && typeof navigation.navigate === 'function')
                ? navigation
                : (navigation && typeof navigation.getParent === 'function')
                    ? navigation.getParent()
                    : null;

            if (nav && typeof nav.navigate === 'function') {    
                nav.navigate('LocationScreenDetail', {
                    id: item.id,
                    title: item.title,
                    subtitle: item.subtitle,
                    address: item.address,
                    location: item.location || null,
                });

            } else {
                Alert.alert(item.title, item.subtitle);
            }
        };

        const goToNewLocation = () => {
            const nav = (navigation && typeof navigation.navigate === 'function')
                ? navigation
                : (navigation && typeof navigation.getParent === 'function')
                    ? navigation.getParent()
                    : null;

            if (nav && typeof nav.navigate === 'function') {
                nav.navigate('LocationScreenNew');
            } else {
                Alert.alert('Navigation unavailable', 'Cannot open new location screen right now.');
            }
        };

        const renderItem = ({ item }) => (
            <Card style={styles.locationCard} mode="contained">
                <Card.Content>
                    <View style={styles.locationHeader}>
                        <View style={styles.markerBadge}>
                            <Icon source="map-marker" size={24} color={palette.primary} />
                        </View>
                        <View style={styles.locationCopy}>
                            <Text variant="titleLarge" style={styles.locationTitle}>{item.title}</Text>
                            {!!item.subtitle && <Text variant="bodyLarge" style={styles.locationSubtitle}>{item.subtitle}</Text>}
                        </View>
                    </View>
                    <Text variant="bodyMedium" style={styles.locationAddress}>
                        {item.address || 'No address saved yet'}
                    </Text>
                </Card.Content>
                <Card.Actions style={styles.actions}>
                    <Button mode="contained" buttonColor={palette.primary} contentStyle={styles.actionButtonContent} labelStyle={styles.actionButtonLabel} onPress={() => viewDetails(item)}>
                        View
                    </Button>
                    <Button mode="outlined" textColor={palette.danger} style={styles.deleteButton} contentStyle={styles.actionButtonContent} labelStyle={styles.actionButtonLabel} onPress={() => confirmDelete(item.id)}>
                        Delete
                    </Button>
                </Card.Actions>
            </Card>
        );

        return (
            <View style={[styles.container, insetsStyle]}>
                <View style={styles.heroCard}>
                    <Text variant="headlineMedium" style={styles.header}>Saved places</Text>
                    <Text variant="bodyLarge" style={styles.heroText}>Store common destinations with large labels and simple actions.</Text>
                </View>
                <Button
                    mode="contained"
                    icon="plus"
                    onPress={goToNewLocation}
                    style={styles.addButton}
                    contentStyle={styles.addButtonContent}
                    labelStyle={styles.addButtonLabel}
                >
                    Add new place
                </Button>
                <FlatList
                    data={locations}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text variant="titleLarge" style={styles.emptyTitle}>No places saved</Text>
                            <Text variant="bodyLarge" style={styles.emptyText}>Add places such as your clinic, pharmacy, or grocery store for faster reminders.</Text>
                        </View>
                    }
                    contentContainerStyle={styles.listContent}
                />
            </View>
        );
}