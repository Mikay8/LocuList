import React from 'react';
import { useRoute } from '@react-navigation/native';
import {
    SafeAreaView,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Linking,
} from 'react-native';
import { Surface } from 'react-native-paper';
import { elevation, palette } from '../theme/appTheme';

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

    if (address) {
        if (Platform.OS === 'ios') {
            url = `http://maps.apple.com/?daddr=${encodeURIComponent(address)}`;
        } else {
            url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
        }
    } else if (coords) {
        const destination = `${coords.lat},${coords.lng}`;
        if (Platform.OS === 'ios') {
            url = `http://maps.apple.com/?daddr=${destination}`;
        } else {
            url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
        }
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

const styles = StyleSheet.create({
container: {
    flex: 1,
    padding: 20,
    backgroundColor: palette.background,
    gap: 18,
},
heroCard: {
    backgroundColor: palette.surface,
    borderRadius: 28,
    padding: 24,
    ...elevation.card,
},
eyebrow: {
    color: palette.secondary,
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
},
title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    color: palette.text,
},
subtitle: {
    fontSize: 18,
    lineHeight: 26,
    color: palette.textMuted,
    marginTop: 8,
},
locationCard: {
    backgroundColor: palette.surface,
    borderRadius: 24,
    padding: 24,
    ...elevation.card,
},
sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.textMuted,
    marginBottom: 10,
},
locationText: {
    fontSize: 20,
    lineHeight: 30,
    color: palette.text,
    marginBottom: 20,
},
button: {
    backgroundColor: palette.primary,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 18,
    alignItems: 'center',
},
buttonDisabled: {
    backgroundColor: '#AABCBF',
},
buttonText: {
    color: palette.white,
    fontWeight: '700',
    fontSize: 17,
},
});