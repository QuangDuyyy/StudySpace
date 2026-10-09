import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomNavigation } from '../components/BottomNavigation';
import { BrowseScreen } from '../screens/BrowseScreen';
import { MyBookingsScreen, ProfileScreen } from '../screens/PlaceholderScreens';
import type { MainTabParamList, RootStackParamList } from './types';
import { RoomDetailsScreen } from '../screens/RoomDetailsScreen';
import { ConfirmationScreen } from '../screens/ConfirmationScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNavigation {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Browse" component={BrowseScreen} />
      <Tab.Screen name="MyBookings" component={MyBookingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />

<Stack.Screen
  name="RoomDetails"
  component={RoomDetailsScreen}
/>

<Stack.Screen
  name="Confirmation"
  component={ConfirmationScreen}
/>
    </Stack.Navigator>
  );
}