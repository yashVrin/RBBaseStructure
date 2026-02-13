import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/main/HomeScreen/HomeScreen';
import Search from '../screens/main/Search/Search';
import ProfileScreen from '../screens/main/ProfileScreen/ProfileScreen';
import SettingsScreen from '../screens/main/SettingsScreen/SettingsScreen';
import Colors from '@assets/Colors';
import { useI18n } from '../i18n/i18n';

import TabTransitionOverlay from '../components/TabTransitionOverlay';

// Custom Tab Bar Icon Component with Animation
interface AnimatedTabIconProps {
  name: string;
  color: string;
  size: number;
  focused: boolean;
}

const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({ name, color, size, focused }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.2 : 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, [focused, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
};

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
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <AnimatedTabIcon name={iconName} size={size} color={color} focused={focused} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        options={{ title: t('home') }}
      >
        {() => (
          <TabTransitionOverlay>
            <HomeScreen />
          </TabTransitionOverlay>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Search"
        options={{ title: t('search') }}
      >
        {() => (
          <TabTransitionOverlay>
            <Search />
          </TabTransitionOverlay>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{ title: t('profile') }}
      >
        {() => (
          <TabTransitionOverlay>
            <ProfileScreen />
          </TabTransitionOverlay>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Settings"
        options={{ title: t('settings') }}
      >
        {() => (
          <TabTransitionOverlay>
            <SettingsScreen />
          </TabTransitionOverlay>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default BottomTabs;
