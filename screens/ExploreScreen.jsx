import { Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Explore</Text>
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
