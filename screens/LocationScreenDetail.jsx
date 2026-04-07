import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import{
SafeAreaView,
View,
Text,
StyleSheet,
TouchableOpacity,
Platform,
Linking,
} from 'react-native';

export default function LocationScreenDetail(props) {
    const navigation = props.navigation || useNavigation();
    const route = props.route || useRoute();
    const { title, subtitle, address, location } = route.params || {};
    
const resolveCoords = (loc) => {

    if (!loc) return null;
    const lat = loc.latitude ?? loc.lat;
    const lng = loc.longitude ?? loc.lng;
    return lat != null && lng != null ? {lat, lng} : null;
};

React.useEffect(() => {
    console.log('[LocationScreenDetail] title:', title);
    console.log('[LocationScreenDetail] subtitle:', subtitle);
    console.log('[LocationScreenDetail] address:', address);
    console.log('[LocationScreenDetail] location:', location);
    console.log('[LocationScreenDetail] coords:', resolveCoords(location));
}, [title, subtitle, address, location]);

const openMaps = async () => {
    //const coords = resolveCoords(location);

    //if (!address && !coords) return;

   

    let url = '';
    if (Platform.OS === 'ios') {
        url = `http://maps.apple.com/?daddr=${encodeURIComponent(address)}`;
            
    } else {
        url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
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
        <View style={styles.headerRow}>
          
            <Text style={styles.title}>{title}</Text>
        </View>

        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

        <View style={styles.locationCard}>
            <Text style={styles.locationText}>{displayLocation()}</Text>
            <TouchableOpacity
                style={[styles.button, !address && !location && styles.buttonDisabled]}
                onPress={openMaps}
                disabled={!address && !location}>
                <Text style={styles.buttonText}>Navigate</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
);
}

const styles = StyleSheet.create({
container: {flex: 1, padding: 16, backgroundColor: '#fff'},
headerRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
back: {padding: 8},
backText: {color: '#007aff'},
title: {flex: 1, fontSize: 20, fontWeight: '600', textAlign: 'center'},
subtitle: {fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center'},
locationCard: {
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f7f7f8',
    alignItems: 'center',
},
locationText: {fontSize: 16, marginBottom: 12, textAlign: 'center'},
button: {
    backgroundColor: '#007aff',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
},
buttonDisabled: {backgroundColor: '#bfcfff'},
buttonText: {color: '#fff', fontWeight: '600'},
});