import { useState } from 'react';
import { Text, TextInput, Button, Menu, Surface } from 'react-native-paper';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocations } from '../services/location';
import { elevation, palette } from '../theme/appTheme';

const MOTION_ACTIVITIES = [
  'Walking',
  'In a Vehicle',
  'Stationary',
];

export default function CreateReminderScreen({ onAdd }) {
  const insets = useSafeAreaInsets();
  const { locations } = useLocations();

  const [reminderName, setReminderName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationMenuVisible, setLocationMenuVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityMenuVisible, setActivityMenuVisible] = useState(false);

  const [showDateSection, setShowDateSection] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const insetsStyle = {
    paddingTop: insets.top + 20,
    paddingBottom: insets.bottom + 28,
    paddingLeft: insets.left + 20,
    paddingRight: insets.right + 20,
  };

  async function handleSubmitReminder() {
    const newReminder = {
      id: Date.now().toString(),
      reminderName,
      description,
      dateTime: showDateSection ? selectedDateTime.toISOString() : null,
      locationId: selectedLocation?.id ?? null,
      locationTitle: selectedLocation?.title ?? null,
      activity: selectedActivity,
    };

    try {
      await onAdd(newReminder);
      setReminderName('');
      setDescription('');
      setSelectedDateTime(new Date());
      setSelectedLocation(null);
      setSelectedActivity(null);
      setShowDateSection(false);
    } catch (e) {
      console.error('Failed to save reminder', e);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, insetsStyle]}>
      <Surface style={styles.heroCard} elevation={0}>
        <Text variant="headlineMedium" style={styles.title}>Create a reminder</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Use plain labels and larger controls so important tasks are quick to set up.
        </Text>
      </Surface>

      <Surface style={styles.sectionCard} elevation={0}>
        <Text variant="titleLarge" style={styles.sectionTitle}>What should you remember?</Text>
        <TextInput
          label="Reminder name"
          value={reminderName}
          onChangeText={setReminderName}
          mode="outlined"
          style={styles.input}
          outlineStyle={styles.inputOutline}
        />
        <TextInput
          label="Notes"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          style={styles.input}
          outlineStyle={styles.inputOutline}
        />
      </Surface>

      <Surface style={styles.sectionCard} elevation={0}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Add a trigger</Text>
        <Text variant="bodyMedium" style={styles.sectionBody}>Choose a place, an activity, a date, or combine them.</Text>

        <View style={styles.menuWrapper}>
          <Menu
            visible={locationMenuVisible}
            onDismiss={() => setLocationMenuVisible(false)}
            anchor={
              <TextInput
                label="Place"
                value={selectedLocation?.title ?? ''}
                mode="outlined"
                style={styles.input}
                editable={false}
                outlineStyle={styles.inputOutline}
                right={<TextInput.Icon icon="chevron-down" onPress={() => setLocationMenuVisible(true)} />}
                onPressIn={() => setLocationMenuVisible(true)}
              />
            }
          >
            <Menu.Item
              title="None"
              onPress={() => { setSelectedLocation(null); setLocationMenuVisible(false); }}
            />
            {locations.map(loc => (
              <Menu.Item
                key={loc.id}
                title={loc.title}
                onPress={() => { setSelectedLocation(loc); setLocationMenuVisible(false); }}
              />
            ))}
          </Menu>
        </View>

        <View style={styles.menuWrapper}>
          <Menu
            visible={activityMenuVisible}
            onDismiss={() => setActivityMenuVisible(false)}
            anchor={
              <TextInput
                label="Motion activity"
                value={selectedActivity ?? ''}
                mode="outlined"
                style={styles.input}
                editable={false}
                outlineStyle={styles.inputOutline}
                right={<TextInput.Icon icon="chevron-down" onPress={() => setActivityMenuVisible(true)} />}
                onPressIn={() => setActivityMenuVisible(true)}
              />
            }
          >
            <Menu.Item
              title="None"
              onPress={() => { setSelectedActivity(null); setActivityMenuVisible(false); }}
            />
            {MOTION_ACTIVITIES.map(activity => (
              <Menu.Item
                key={activity}
                title={activity}
                onPress={() => { setSelectedActivity(activity); setActivityMenuVisible(false); }}
              />
            ))}
          </Menu>
        </View>

        <Button
          mode="outlined"
          icon={showDateSection ? 'calendar-remove' : 'calendar'}
          textColor={palette.primary}
          style={styles.dateToggleButton}
          contentStyle={styles.actionButtonContent}
          onPress={() => setShowDateSection(v => !v)}
        >
          {showDateSection ? 'Remove date and time' : 'Add date and time'}
        </Button>

        {showDateSection && (
          <View style={styles.pickerCard}>
            {Platform.OS === 'ios' && (
              <DateTimePicker
                mode="datetime"
                value={selectedDateTime}
                onChange={(_, date) => date && setSelectedDateTime(date)}
                display="inline"
                minimumDate={new Date()}
                style={styles.iosPicker}
              />
            )}

            {Platform.OS === 'android' && (
              <>
                <Pressable onPress={() => setShowDatePicker(true)} style={styles.androidPickerButton}>
                  <Text variant="titleMedium" style={styles.pickerLabel}>Date</Text>
                  <Text variant="bodyLarge" style={styles.pickerValue}>{selectedDateTime.toLocaleDateString()}</Text>
                </Pressable>
                {showDatePicker && (
                  <DateTimePicker
                    mode="date"
                    value={selectedDateTime}
                    onChange={(_, date) => {
                      setShowDatePicker(false);
                      if (date) setSelectedDateTime(date);
                    }}
                  />
                )}

                <Pressable onPress={() => setShowTimePicker(true)} style={styles.androidPickerButton}>
                  <Text variant="titleMedium" style={styles.pickerLabel}>Time</Text>
                  <Text variant="bodyLarge" style={styles.pickerValue}>
                    {selectedDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </Pressable>
                {showTimePicker && (
                  <DateTimePicker
                    mode="time"
                    value={selectedDateTime}
                    onChange={(_, date) => {
                      setShowTimePicker(false);
                      if (date) setSelectedDateTime(date);
                    }}
                  />
                )}
              </>
            )}
          </View>
        )}
      </Surface>

      <Button
        mode="contained"
        onPress={handleSubmitReminder}
        style={styles.button}
        contentStyle={styles.primaryButtonContent}
        labelStyle={styles.primaryButtonLabel}
        disabled={!reminderName.trim()}
      >
        Save reminder
      </Button>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    gap: 18,
  },
  heroCard: {
    backgroundColor: palette.surface,
    borderRadius: 28,
    padding: 24,
    ...elevation.card,
  },
  title: {
    color: palette.text,
  },
  subtitle: {
    color: palette.textMuted,
    marginTop: 8,
  },
  sectionCard: {
    backgroundColor: palette.surface,
    borderRadius: 24,
    padding: 20,
    ...elevation.card,
  },
  sectionTitle: {
    color: palette.text,
    marginBottom: 6,
  },
  sectionBody: {
    color: palette.textMuted,
    marginBottom: 18,
  },
  input: {
    marginBottom: 16,
    backgroundColor: palette.surface,
  },
  inputOutline: {
    borderRadius: 18,
    borderColor: palette.outline,
  },
  button: {
    marginTop: 4,
  },
  primaryButtonContent: {
    minHeight: 56,
  },
  primaryButtonLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    borderColor: '#D8B794',
  },
  menuWrapper: {
    marginBottom: 8,
  },
  dateToggleButton: {
    marginTop: 4,
    borderColor: palette.primary,
    borderRadius: 18,
  },
  actionButtonContent: {
    minHeight: 48,
  },
  iosPicker: {
    marginBottom: 8,
  },
  pickerCard: {
    marginTop: 16,
    backgroundColor: palette.background,
    borderRadius: 20,
    padding: 12,
  },
  androidPickerButton: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  pickerLabel: {
    color: palette.textMuted,
    marginBottom: 4,
  },
  pickerValue: {
    color: palette.text,
  },
});
