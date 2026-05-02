import * as React from 'react';
import { Text, Button, Card, Chip } from 'react-native-paper';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UpdateReminderModal from '../components/UpdateReminderModal';
import { palette } from '../theme/appTheme';
import { homeScreenStyles as styles } from './LocationScreenDetail.styles';

export default function HomeScreen({ reminders, onDelete, onUpdate }) {
  const insets = useSafeAreaInsets();
  const [editingReminder, setEditingReminder] = React.useState({});

  const insetsStyle = {
    paddingTop: insets.top + 20,
    paddingBottom: insets.bottom + 24,
    paddingLeft: insets.left + 20,
    paddingRight: insets.right + 20,
  };

  const upcomingCount = reminders.filter(reminder => reminder.dateTime).length;

  function renderMetaChips(reminder) {
    const chips = [];

    if (reminder.dateTime) {
      chips.push(
        <Chip key="time" compact icon="clock-outline" style={styles.metaChip} textStyle={styles.metaChipText}>
          {new Date(reminder.dateTime).toLocaleString([], {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </Chip>
      );
    }

    if (reminder.locationTitle) {
      chips.push(
        <Chip key="location" compact icon="map-marker" style={styles.metaChip} textStyle={styles.metaChipText}>
          {reminder.locationTitle}
        </Chip>
      );
    }

    if (reminder.activity) {
      chips.push(
        <Chip key="activity" compact icon="walk" style={styles.metaChip} textStyle={styles.metaChipText}>
          {reminder.activity}
        </Chip>
      );
    }

    return chips;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, insetsStyle]}>
        <View style={styles.heroCard}>
          <Text variant="headlineMedium" style={styles.header}>Simple reminders, easy to read.</Text>
          <Text variant="bodyLarge" style={styles.heroText}>
            Keep important tasks visible with larger text, calmer colors, and fewer distractions.
          </Text>
          <View style={styles.heroStats}>
            <View style={styles.statCard}>
              <Text variant="headlineSmall" style={styles.statValue}>{reminders.length}</Text>
              <Text variant="bodyMedium" style={styles.statLabel}>Saved reminders</Text>
            </View>
            <View style={styles.statCardAccent}>
              <Text variant="headlineSmall" style={styles.statValueAccent}>{upcomingCount}</Text>
              <Text variant="bodyMedium" style={styles.statLabelAccent}>With a time set</Text>
            </View>
          </View>
        </View>

        <UpdateReminderModal
          visible={!!editingReminder.id}
          reminder={editingReminder}
          onSave={async (updated) => {
            await onUpdate(updated);
            setEditingReminder({});
          }}
          onClose={() => setEditingReminder({})}
        />

        <View style={styles.sectionHeader}>
          <Text variant="titleLarge" style={styles.sectionTitle}>Your reminders</Text>
          <Text variant="bodyMedium" style={styles.sectionSubtitle}>Tap a card to review details or make changes.</Text>
        </View>

        {reminders.length > 0 ? (
            reminders?.map((reminder) => (
                <Card key={reminder.id} style={styles.card} mode="contained">
                  <Card.Content>
                    <Text variant="titleLarge" style={styles.cardTitle}>{reminder.reminderName}</Text>
                    {!!reminder.description && (
                      <Text variant="bodyLarge" style={styles.cardBody}>{reminder.description}</Text>
                    )}
                    <View style={styles.metaRow}>{renderMetaChips(reminder)}</View>
                  </Card.Content>
                  <Card.Actions style={styles.cardActions}>
                    <Button mode="contained" buttonColor={palette.primary} contentStyle={styles.actionButtonContent} labelStyle={styles.actionLabel} onPress={() => {
                      setEditingReminder(reminder);
                    }}>
                      Edit
                    </Button>
                    <Button mode="outlined" textColor={palette.danger} style={styles.deleteButton} contentStyle={styles.actionButtonContent} labelStyle={styles.actionLabel} onPress={() => onDelete(reminder)}>
                      Delete
                    </Button>
                  </Card.Actions>
                </Card>
            ))
            
        ) : (
          <View style={styles.emptyState}>
            <Text variant="titleLarge" style={styles.emptyTitle}>No reminders yet</Text>
            <Text variant="bodyLarge" style={styles.emptyText}>Use the New tab to add a reminder for medicine, appointments, errands, or daily routines.</Text>
          </View>
        )}
    </ScrollView>
  );
}