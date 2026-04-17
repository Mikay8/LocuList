import React from 'react';
import { Text, Button, Card, Icon } from 'react-native-paper';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocations } from '../services/location';
import { elevation, palette } from '../theme/appTheme';

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

const styles = StyleSheet.create({
    container: {
      flex: 1,
        backgroundColor: palette.background,
    },
    heroCard: {
        backgroundColor: palette.surface,
        borderRadius: 28,
        padding: 24,
        marginBottom: 16,
        ...elevation.card,
    },
    header: {
        color: palette.text,
    },
    heroText: {
        color: palette.textMuted,
        marginTop: 8,
    },
    addButton: {
        marginBottom: 16,
        backgroundColor: palette.primary,
    },
    addButtonContent: {
        minHeight: 54,
    },
    addButtonLabel: {
        fontSize: 17,
        fontWeight: '700',
    },
    listContent: {
        paddingBottom: 12,
    },
    locationCard: {
        backgroundColor: palette.surface,
        borderRadius: 24,
        ...elevation.card,
    },
    locationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    markerBadge: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: palette.primarySoft,
    },
    locationCopy: {
        flex: 1,
    },
    locationTitle: {
        color: palette.text,
    },
    locationSubtitle: {
        color: palette.textMuted,
        marginTop: 2,
    },
    locationAddress: {
        color: palette.textMuted,
        marginTop: 16,
    },
    actions: {
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 4,
    },
    actionButtonContent: {
        minHeight: 48,
        paddingHorizontal: 10,
    },
    actionButtonLabel: {
        fontSize: 16,
        fontWeight: '700',
    },
    deleteButton: {
        borderColor: '#E2B1AA',
    },
    separator: {
        height: 14,
    },
    emptyState: {
        backgroundColor: palette.surface,
        borderRadius: 24,
        padding: 24,
        ...elevation.card,
    },
    emptyTitle: {
        color: palette.text,
        marginBottom: 8,
    },
    emptyText: {
        color: palette.textMuted,
    }
});