import { StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button, Icon } from 'react-native-paper';
import { elevation, palette } from '../theme/appTheme';

export default function ReminderModal({ visible, title, body, onClose }) {
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.container}>
        <Icon source="bell-ring-outline" size={54} color={palette.primary} />
        <Text variant="headlineMedium" style={styles.title}>{title}</Text>
        {!!body && <Text variant="bodyLarge" style={styles.body}>{body}</Text>}
        <Button mode="contained" onPress={onClose} style={styles.button} contentStyle={styles.buttonContent} labelStyle={styles.buttonLabel}>
          Close
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surface,
    borderRadius: 28,
    margin: 24,
    padding: 28,
    alignItems: 'center',
    gap: 16,
    ...elevation.card,
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
    color: palette.text,
  },
  body: {
    textAlign: 'center',
    color: palette.textMuted,
  },
  button: {
    marginTop: 8,
    backgroundColor: palette.primary,
  },
  buttonContent: {
    minHeight: 50,
    paddingHorizontal: 18,
  },
  buttonLabel: {
    fontSize: 17,
    fontWeight: '700',
  },
});