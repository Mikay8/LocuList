import { useEffect, useState } from 'react';
import { Text, TextInput, Button, Menu, Surface } from 'react-native-paper';
import { Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocations } from '../services/location';
import { palette } from '../theme/appTheme';
import { updateReminderModalStyles as styles } from '../screens/LocationScreenDetail.styles';

const MOTION_ACTIVITIES = [
  'Walking',
  'In a Vehicle',
  'Stationary',
];

export default function UpdateReminderModal({ visible, reminder, onSave, onClose }) {
  const insets = useSafeAreaInsets();
  const { locations } = useLocations();

  const [reminderName, setReminderName] = useState(reminder?.reminderName ?? '');
  const [description, setDescription] = useState(reminder?.description ?? '');
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
    paddingTop: insets.top + 20,
    paddingBottom: insets.bottom + 28,
    paddingLeft: insets.left + 20,
    paddingRight: insets.right + 20,
  };

  useEffect(() => {
    setReminderName(reminder?.reminderName ?? '');
    setDescription(reminder?.description ?? '');
    setSelectedLocation(
      reminder?.locationId ? { id: reminder.locationId, title: reminder.locationTitle } : null
    );
    setSelectedActivity(reminder?.activity ?? null);
    setShowDateSection(!!reminder?.dateTime);
    setSelectedDateTime(reminder?.dateTime ? new Date(reminder.dateTime) : new Date());
  }, [reminder]);

  async function handleSave() {
    const updated = {
      ...reminder,
      reminderName,
      description,
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
      onRequestClose={onClose}
    >
      <ScrollView style={styles.container} contentContainerStyle={[styles.content, insetsStyle]}>
        <Surface style={styles.heroCard} elevation={0}>
          <Text variant="headlineMedium" style={styles.title}>Edit reminder</Text>
          <Text variant="bodyLarge" style={styles.subtitle}>Update the task details without leaving the page.</Text>
        </Surface>

        <Surface style={styles.sectionCard} elevation={0}>
          <Text variant="titleLarge" style={styles.sectionTitle}>Reminder details</Text>
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
          <Text variant="titleLarge" style={styles.sectionTitle}>Triggers</Text>
          <Text variant="bodyMedium" style={styles.sectionBody}>Adjust where, when, or how this reminder should appear.</Text>

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
                  themeVariant="light"
                  style={styles.iosPicker}
                />
              )}
            </View>
          )}
        </Surface>

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.button}
          contentStyle={styles.primaryButtonContent}
          labelStyle={styles.primaryButtonLabel}
          disabled={!reminderName.trim()}
        >
          Save changes
        </Button>
        <Button mode="outlined" onPress={onClose} style={styles.secondaryButton} contentStyle={styles.actionButtonContent}>
          Cancel
        </Button>
      </ScrollView>
    </Modal>
  );
}
