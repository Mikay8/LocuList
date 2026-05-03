import React from 'react';
import { useRoute } from '@react-navigation/native';
import {
    SafeAreaView,
    Text,
    TouchableOpacity,
    Platform,
    Linking,
} from 'react-native';
import { Surface } from 'react-native-paper';
import styles from './LocationScreenDetail.styles';

export default function LocationScreenDetail(props) {
    const route = props.route || useRoute();
    const { title, subtitle, address, location } = route.params || {};

const resolveCoords = (loc) => {

    if (!loc) return null;
    const lat = loc.latitude ?? loc.lat;
    const lng = loc.longitude ?? loc.lng;
    return lat != null && lng != null ? {lat, lng} : null;
};

const openMaps = async () => {
    const coords = resolveCoords(location);
    let url = '';

    
        console.log('Opening maps with address:', address);
        if (Platform.OS === 'ios') {
            url = `http://maps.apple.com/?daddr=${encodeURIComponent(address)}`;
        } 
    

    if (!url) {
        return;
    }

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
        Linking.openURL(url);
    } else {
        alert('Could not open the maps application.');
    }
};

const displayLocation = () => {
    const coords = resolveCoords(location);

    if (address) return address;
    
    if (coords) return `${coords.lat}, ${coords.lng}`;
    return 'No location provided';
};

return (
    <SafeAreaView style={styles.container}>
        <Surface style={styles.heroCard} elevation={0}>
            <Text style={styles.eyebrow}>Saved place</Text>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </Surface>

        <Surface style={styles.locationCard} elevation={0}>
            <Text style={styles.sectionLabel}>Address or coordinates</Text>
            <Text style={styles.locationText}>{displayLocation()}</Text>
            <TouchableOpacity
                style={[styles.button, !address && !location && styles.buttonDisabled]}
                onPress={openMaps}
                disabled={!address && !location}>
                <Text style={styles.buttonText}>Open directions</Text>
            </TouchableOpacity>
        </Surface>
    </SafeAreaView>
);
}