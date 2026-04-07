import { useState } from 'react';
import { Text, TextInput, Button, Menu } from 'react-native-paper';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocations } from '../services/location';

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
    paddingTop: insets.top + 16,
    paddingBottom: insets.bottom + 16,
    paddingLeft: insets.left + 16,
    paddingRight: insets.right + 16,
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
      <Text variant="headlineMedium" style={styles.title}>Create Reminder</Text>

      <TextInput
        label="Name"
        value={reminderName}
        onChangeText={setReminderName}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        style={styles.input}
      />

      {/* Location dropdown */}
      <View style={styles.menuWrapper}>
        <Menu
          visible={locationMenuVisible}
          onDismiss={() => setLocationMenuVisible(false)}
          anchor={
            <TextInput
              label="Location (optional)"
              value={selectedLocation?.title ?? ''}
              mode="outlined"
              style={styles.input}
              editable={false}
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

      {/* Activity dropdown */}
      <View style={styles.menuWrapper}>
        <Menu
          visible={activityMenuVisible}
          onDismiss={() => setActivityMenuVisible(false)}
          anchor={
            <TextInput
              label="Motion Activity (optional)"
              value={selectedActivity ?? ''}
              mode="outlined"
              style={styles.input}
              editable={false}
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

      {/* Date/time section — optional */}
      <Button
        mode="outlined"
        icon={showDateSection ? 'calendar-remove' : 'calendar'}
        onPress={() => setShowDateSection(v => !v)}
        style={styles.dateToggleButton}
      >
        {showDateSection ? 'Remove Date & Time' : 'Set Date & Time'}
      </Button>

      {showDateSection && (
        <>
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
                <Text>Date: {selectedDateTime.toLocaleDateString()}</Text>
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
                <Text>Time: {selectedDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
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
        </>
      )}

      <Button mode="contained" onPress={handleSubmitReminder} style={styles.button} disabled={!reminderName.trim()}>
        Save Reminder
      </Button>
      <Button mode="contained"  style={styles.button} >
        Speak a Reminder
      </Button>
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
  title: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  menuWrapper: {
    marginBottom: 16,
  },
  dateToggleButton: {
    marginBottom: 16,
  },
  iosPicker: {
    marginBottom: 8,
  },
  androidPickerButton: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
  },
});
