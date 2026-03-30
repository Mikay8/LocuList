import { Text, Button, Card  } from 'react-native-paper';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useState, useEffect, use } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LocationScreen() {
    const insets = useSafeAreaInsets();

    // Apply the insets as padding to ensure content stays on screen
    const insetsStyle = {
      paddingTop: insets.top + 16, // Add some vertical padding
      paddingBottom: insets.bottom+16, // Add some vertical padding
      paddingLeft: insets.left + 16, // Add some horizontal padding
      paddingRight: insets.right + 16, // Add some horizontal padding
    };
    
        return (
        <View style={[styles.container, insetsStyle]}>
            <Text variant="headlineMedium" style={styles.header}>Location Screen</Text>
            <Text variant="bodyMedium" style={styles.text}>This is where the location-based reminders will be displayed.</Text>
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
    text: {
        fontSize: 16,
    }
});