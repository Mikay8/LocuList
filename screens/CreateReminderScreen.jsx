import { useState } from 'react';
import { Text, TextInput, Button } from 'react-native-paper';
import { Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateReminderScreen() {
  const insets = useSafeAreaInsets();
  const [reminderName, setReminderName] = useState('');

  const [selectedDateTime, setSelectedDateTime] = useState(new Date());

  // Android only: controls which picker is currently open
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [description, setDescription] = useState('');

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
      dateTime: selectedDateTime.toISOString(),
    };
    console.log({ reminderName, description, selectedDateTime });
 
    try {
      const existing = await AsyncStorage.getItem('reminders');
      const reminders = existing ? JSON.parse(existing) : [];
      reminders.push(newReminder);
      await AsyncStorage.setItem('reminders', JSON.stringify(reminders));
      console.log('Saved!', reminders);
      setReminderName('');
      setDescription('');
      setSelectedDateTime(new Date());
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

      {/* iOS: single inline datetime picker */}
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

      {/* Android: button-triggered modal pickers */}
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

      <Button mode="contained" onPress={handleSubmitReminder} style={styles.button} disabled={!reminderName.trim()}>
        Save Reminder
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
