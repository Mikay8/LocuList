import { useState } from 'react';
import { Text, TextInput, Button, Menu } from 'react-native-paper';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocations } from '../services/location';

const MOTION_ACTIVITIES = [
  'Walking',
  'In a Vehicle',
  'Stationary',
];

export default function UpdateReminderModal({ visible, reminder, onSave, onClose }) {
  const insets = useSafeAreaInsets();
  const { locations } = useLocations();

  const [reminderName, setReminderName] = useState(reminder?.reminderName ?? '');
  const [description, setDescription] = useState(reminder?.reminderDescription ?? '');
  const [selectedLocation, setSelectedLocation] = useState(
    reminder?.locationId ? { id: reminder.locationId, title: reminder.locationTitle } : null
  );
  const [locationMenuVisible, setLocationMenuVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(reminder?.activity ?? null);
  const [activityMenuVisible, setActivityMenuVisible] = useState(false);

  const [showDateSection, setShowDateSection] = useState(!!reminder?.dateTime);
  const [selectedDateTime, setSelectedDateTime] = useState(
    reminder?.dateTime ? new Date(reminder.dateTime) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const insetsStyle = {
    paddingTop: insets.top + 16,
    paddingBottom: insets.bottom + 16,
    paddingLeft: insets.left + 16,
    paddingRight: insets.right + 16,
  };

  // Re-sync fields when a different reminder is opened
  function handleShow() {
    setReminderName(reminder?.reminderName ?? '');
    setDescription(reminder?.reminderDescription ?? '');
    setSelectedLocation(
      reminder?.locationId ? { id: reminder.locationId, title: reminder.locationTitle } : null
    );
    setSelectedActivity(reminder?.activity ?? null);
    setShowDateSection(!!reminder?.dateTime);
    setSelectedDateTime(reminder?.dateTime ? new Date(reminder.dateTime) : new Date());
  }

  async function handleSave() {
    const updated = {
      ...reminder,
      reminderName,
      reminderDescription: description,
      dateTime: showDateSection ? selectedDateTime.toISOString() : null,
      locationId: selectedLocation?.id ?? null,
      locationTitle: selectedLocation?.title ?? null,
      activity: selectedActivity,
    };
    try {
      await onSave(updated);
      onClose();
    } catch (e) {
      console.error('Failed to update reminder', e);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onShow={handleShow}
      onRequestClose={onClose}
    >
      <ScrollView style={styles.container} contentContainerStyle={[styles.content, insetsStyle]}>
        <Text variant="headlineMedium" style={styles.title}>Edit Reminder</Text>

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
                themeVariant="light"
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

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.button}
          disabled={!reminderName.trim()}
        >
          Save Changes
        </Button>
        <Button mode="outlined" onPress={onClose} style={styles.button}>
          Cancel
        </Button>
      </ScrollView>
    </Modal>
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
