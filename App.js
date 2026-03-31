import * as React from 'react';
import { PaperProvider, BottomNavigation, Icon } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import HomeScreen from './screens/HomeScreen';
import CreateReminderScreen from './screens/CreateReminderScreen';
import ReminderModal from './components/ReminderModal';
import { useReminders } from './hooks/useReminders';
import { requestPermissions } from './services/notifications';

export default function App() {
  const [index, setIndex] = React.useState(0);
  const [modalNotif, setModalNotif] = React.useState(null);
  // Define the routes for the bottom navigation
  const [routes] = React.useState([
    { key: 'home',    title: 'Home',    focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'createReminder', title: 'Create Reminder', focusedIcon: 'plus', unfocusedIcon: 'plus' }
  ]);

  const { reminders, add, remove } = useReminders();
  
  //This triggers a notification popup
  React.useEffect(() => {
    requestPermissions();
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const { title, body } = notification.request.content;
      setModalNotif({ title: title ?? 'Reminder', body: body ?? '' });
    });

    return () => subscription.remove();
  }, []);

  // Define the scene renderer for the bottom navigation
   const renderScene = BottomNavigation.SceneMap({
    home:    () => <HomeScreen reminders={reminders} onDelete={remove}/>,
    createReminder: () => <CreateReminderScreen onAdd={add} />
  });

  return (
    <SafeAreaProvider>
      <PaperProvider>
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
