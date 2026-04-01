import { useState } from 'react';
import { Text, TextInput, Button } from 'react-native-paper';
import { Modal, Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function UpdateReminderModal({ visible, reminder, onSave, onClose }) {
  const insets = useSafeAreaInsets();

  const [reminderName, setReminderName] = useState(reminder?.reminderName ?? '');
  const [description, setDescription] = useState(reminder?.reminderDescription ?? '');
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
    setSelectedDateTime(reminder?.dateTime ? new Date(reminder.dateTime) : new Date());
  }

  async function handleSave() {
    const updated = {
      ...reminder,
      reminderName,
      reminderDescription: description,
      dateTime: selectedDateTime.toISOString(),
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
