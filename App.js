import * as React from 'react';
import { PaperProvider, BottomNavigation, Icon } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import CreateReminderScreen from './screens/CreateReminderScreen';
import LocationScreen from './screens/LocationScreen';

export default function App() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home',    title: 'Home',    focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'createReminder', title: 'Create Reminder', focusedIcon: 'plus', unfocusedIcon: 'plus' },
    { key: 'location', title: 'Location', focusedIcon: 'map-marker', unfocusedIcon: 'map-marker-outline' }
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home:    () => <HomeScreen />,
    createReminder: () => <CreateReminderScreen />,
    location: () => <LocationScreen />
  });

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          activeColor="#fbfbfb"
          inactiveColor="#fbfbfb"
          barStyle={{
            backgroundColor: '#0073AF',
            
          }}
          activeIndicatorStyle={{
            backgroundColor: '#2ea2e0',
            //borderRadius: 16,
            //height: 40,
          }}
          renderIcon={({ route, focused, color }) => (
            <Icon
              source={focused ? route.focusedIcon : route.unfocusedIcon}
              color={color}
              size={25}
            />
          )}
        />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
