import { Text, Button } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  
  // Apply the insets as padding to ensure content stays on screen
  const insetsStyle = {
    paddingTop: insets.top + 16, // Add some vertical padding
    paddingBottom: insets.bottom+16, // Add some vertical padding
    paddingLeft: insets.left + 16, // Add some horizontal padding
    paddingRight: insets.right + 16, // Add some horizontal padding
  };
  return (
    <View style={[styles.container, insetsStyle]}>
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
  },
});