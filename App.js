import * as React from 'react';
import { PaperProvider, BottomNavigation, Icon } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import HomeScreen from './screens/HomeScreen';
import CreateReminderScreen from './screens/CreateReminderScreen';
import ReminderModal from './components/ReminderModal';
import { useReminders } from './hooks/useReminders';
import { requestPermissions } from './services/notifications';
import LocationScreen from './screens/LocationScreen';
import LocationScreenDetail from './screens/LocationScreenDetail';
import LocationScreenNew from './screens/LocationScreenNew';
import { useLocations } from './services/location';
import { startAccelerometer, stopAccelerometer, onMotionChange } from './services/accelerometer';
import { checkConditions } from './services/reminderConditionChecker';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function MainTabs({ navigation }) {
  const [index, setIndex] = React.useState(0);
  const [modalNotif, setModalNotif] = React.useState(null);
  const [routes] = React.useState([
    { key: 'home',    title: 'Home',    focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'createReminder', title: 'Create Reminder', focusedIcon: 'plus', unfocusedIcon: 'plus' },
    { key: 'location', title: 'Location', focusedIcon: 'map-marker', unfocusedIcon: 'map-marker-outline' }
  ]);

  const { reminders, add, remove, update } = useReminders();
  const { locations } = useLocations();

  const latestMotionType = React.useRef('stationary');
  const latestPosition = React.useRef(null);

  React.useEffect(() => {
    requestPermissions();
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const { title, body } = notification.request.content;
      setModalNotif({ title: title ?? 'Reminder', body: body ?? '' });
    });

    return () => subscription.remove();
  }, []);

  // Accelerometer — updates latest motion and runs condition checks
  React.useEffect(() => {
    startAccelerometer();

    const unsubscribe = onMotionChange(({ motionType }) => {
      latestMotionType.current = motionType;
      checkConditions({ motionType, currentPosition: latestPosition.current, reminders, locations });
    });

    return () => {
      unsubscribe();
      stopAccelerometer();
    };
  }, [reminders, locations]);

  // Location polling — updates latest position and runs condition checks every 30s
  React.useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled || cancelled) return;

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted' || cancelled) return;

        const lastKnown = await Location.getLastKnownPositionAsync();
        const pos = lastKnown ?? await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          maximumAge: 60_000,
          timeInterval: 5_000,
        });

        if (!pos?.coords || cancelled) return;
        if (cancelled) return;
        const currentPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        latestPosition.current = currentPosition;
        checkConditions({ motionType: latestMotionType.current, currentPosition, reminders, locations });
      } catch (e) {
        console.warn('[Location] Poll failed:', e);
      }
    }

    poll();
    const interval = setInterval(poll, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [reminders, locations]);

  const renderScene = BottomNavigation.SceneMap({
    home:    () => <HomeScreen reminders={reminders} onDelete={remove} onUpdate={update} navigation={navigation} />,
    createReminder: () => <CreateReminderScreen onAdd={add} navigation={navigation}/>,
    location: () => <LocationScreen navigation={navigation} />
  });

  return (
    <>
      <ReminderModal
        visible={!!modalNotif}
        title={modalNotif?.title}
        body={modalNotif?.body}
        onClose={() => setModalNotif(null)}
      />
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
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="LocationScreenDetail" component={LocationScreenDetail} options={{ title: 'Location Details' }} />
            <Stack.Screen name="LocationScreenNew" component={LocationScreenNew} options={{ title: 'New Location' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
