import { PaperProvider, Text } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <HomeScreen />
      </PaperProvider>
    </SafeAreaProvider>
  );
}


