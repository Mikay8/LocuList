import * as React from 'react';
import { Text, Button, Card  } from 'react-native-paper';
import { StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UpdateReminderModal from '../components/UpdateReminderModal';

export default function HomeScreen({ reminders, onDelete, onUpdate }) {
  const insets = useSafeAreaInsets();
  const [editingReminder, setEditingReminder] = React.useState({});
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
        {/* Modal for updating reminders */}
        <UpdateReminderModal
          visible={!!editingReminder.id}
          reminder={editingReminder}
          onSave={async (updated) => {
            await onUpdate(updated);
            setEditingReminder({});
          }}
          onClose={() => setEditingReminder({})}
        />
        {/* List of reminders or a message if there are none */}
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
                    <Button mode="contained" onPress={() => {
                      setEditingReminder(reminder);
                    }}>
                      Edit
                    </Button>
                    <Button mode="contained" onPress={() => onDelete(reminder)}>
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