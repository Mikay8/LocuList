import { Text, Button } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
        <Text variant="headlineMedium">Welcome to LocuList!</Text>
        <Button mode="contained" onPress={() => console.log('Button Pressed')}>
          Get Started
        </Button>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});