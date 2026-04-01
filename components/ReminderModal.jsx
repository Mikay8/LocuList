import { StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button, Icon } from 'react-native-paper';

export default function ReminderModal({ visible, title, body, onClose }) {
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.container}>
        <Icon source="alert-circle" size={48} color="#0073AF" />
        <Text variant="headlineMedium" style={styles.title}>{title}</Text>
        {!!body && <Text variant="bodyLarge" style={styles.body}>{body}</Text>}
        <Button mode="contained" onPress={onClose} style={styles.button}>
          Close
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 24,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  body: {
    textAlign: 'center',
    color: '#555',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#0073AF',
  },
});