import React from 'react';
import { Text, List, IconButton, Button } from 'react-native-paper';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocations } from '../services/location';

export default function LocationScreen({ navigation }) {
        const insets = useSafeAreaInsets();
    const { locations, removeLocation } = useLocations();

        const insetsStyle = {
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 16,
            paddingLeft: insets.left + 16,
            paddingRight: insets.right + 16,
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
            <List.Item
                title={item.title}
                description={item.subtitle}
                left={props => <List.Icon {...props} icon="map-marker" />}
                right={props => (
                    <View style={styles.actions}>
                        <IconButton icon="eye" size={20} onPress={() => viewDetails(item)} />
                        <IconButton icon="delete" size={20} onPress={() => confirmDelete(item.id)} />
                    </View>
                )}
            />
        );

        return (
            <View style={[styles.container, insetsStyle]}>
                <Text variant="headlineMedium" style={styles.header}>Locations</Text>
                <Button
                    mode="contained"
                    icon="plus"
                    onPress={goToNewLocation}
                    style={styles.addButton}
                >
                    Add New Location
                </Button>
                <FlatList
                    data={locations}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
        backgroundColor: '#fff',
        },
    header: {
        marginBottom: 16,
    },
    addButton: {
        marginBottom: 12,
    },
    text: {
        fontSize: 16,
    }
});