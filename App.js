import * as React from 'react';
import { PaperProvider, BottomNavigation } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import ExploreScreen from './screens/ExploreScreen';

export default function App() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home',    title: 'Home',    focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'explore', title: 'Explore', focusedIcon: 'map-marker', unfocusedIcon: 'map-marker-outline' },
  
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home:    () => <HomeScreen />,
    explore: () => <ExploreScreen />
  });

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          
        />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
