import * as React from 'react';
import { PaperProvider, BottomNavigation, Icon } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import CreateReminderScreen from './screens/CreateReminderScreen';
import LocationScreen from './screens/LocationScreen';
import LocationScreenDetail from './screens/LocationScreenDetail';
import LocationScreenNew from './screens/LocationScreenNew';
import { LocationProvider } from './services/location';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function MainTabs({ navigation }) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home',    title: 'Home',    focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'createReminder', title: 'Create Reminder', focusedIcon: 'plus', unfocusedIcon: 'plus' },
    { key: 'location', title: 'Location', focusedIcon: 'map-marker', unfocusedIcon: 'map-marker-outline' }
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home:    () => <HomeScreen navigation={navigation} />,
    createReminder: () => <CreateReminderScreen navigation={navigation} />,
    location: () => <LocationScreen navigation={navigation} />
  });

  return (
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
      }}
      renderIcon={({ route, focused, color }) => (
        <Icon
          source={focused ? route.focusedIcon : route.unfocusedIcon}
          color={color}
          size={25}
        />
      )}
    />
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <LocationProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
              <Stack.Screen name="LocationScreenDetail" component={LocationScreenDetail} options={{ title: 'Location Details' }} />
              <Stack.Screen name="LocationScreenNew" component={LocationScreenNew} options={{ title: 'New Location' }} />
            </Stack.Navigator>
          </NavigationContainer>
        </LocationProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
