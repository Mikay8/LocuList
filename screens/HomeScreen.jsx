import { Text, Button, Card  } from 'react-native-paper';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useState, useEffect, use } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
      AsyncStorage.getItem('reminders').then((existing) => {
        setReminders(existing ? JSON.parse(existing) : []);
      });
    }, []);

  async function handleDelete(id) {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    console.log('Deleted', id, { updated });
    await AsyncStorage.setItem('reminders', JSON.stringify(updated));
  }

  // Apply the insets as padding to ensure content stays on screen
  const insetsStyle = {
    paddingTop: insets.top + 16, // Add some vertical padding
    paddingBottom: insets.bottom+16, // Add some vertical padding
    paddingLeft: insets.left + 16, // Add some horizontal padding
    paddingRight: insets.right + 16, // Add some horizontal padding
  };
  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, insetsStyle]}>
        <Text variant="headlineMedium" style={styles.header}>Welcome to LocuList!</Text>
        {reminders.length > 0 ? (
            reminders?.map((reminder) => (
                <Card key={reminder.id} style={styles.card}>
                  
                  <Card.Content>
                    <Text variant="titleLarge">{reminder.reminderName}</Text>
                    <Text variant="bodyMedium">{reminder.reminderDescription}</Text>
                    <Text variant="bodyMedium">
                      {new Date(reminder.dateTime).toLocaleString([], {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </Text>
                  </Card.Content>
                  <Card.Actions>
                    <Button mode="contained" onPress={() => handleDelete(reminder.id)}>
                      Delete
                    </Button>
                  </Card.Actions>
                </Card>
            ))
            
        ) : (
          <Text variant="bodyMedium" style={styles.text}>No reminders yet. Create one to get started!</Text>
        )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingLeft: 16,
  },
  header: {
    marginBottom: 24,
  },
  text: {
    marginTop: 8,
  },
  card: {
    marginBottom: 16,
  },
});