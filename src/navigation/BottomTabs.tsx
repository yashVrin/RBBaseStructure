import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/main/HomeScreen/HomeScreen';
import Search from '../screens/main/Search/Search';
import ProfileScreen from '../screens/main/ProfileScreen/ProfileScreen';
import SettingsScreen from '../screens/main/SettingsScreen/SettingsScreen';
import Colors from '@assets/Colors';
import { useI18n } from '../i18n/i18n';

// Define param list for Bottom Tabs (adjust params if your screens accept any)
export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabs: React.FC = () => {
  const { t } = useI18n();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarInactiveTintColor: Colors.GRAY,
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'Search':
              iconName = 'search-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            case 'Settings':
              iconName = 'settings-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('home') }} />
      <Tab.Screen name="Search" component={Search} options={{ title: t('search') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: t('profile') }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: t('settings') }} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
