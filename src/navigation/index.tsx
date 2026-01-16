import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';

import TodayScreen from '../screens/TodayScreen';
import JournalScreen from '../screens/JournalScreen';
import MoreScreen from '../screens/MoreScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import AlertsScreen from '../screens/AlertsScreen';
import RulesScreen from '../screens/RulesScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#10B981',
    background: '#0F172A',
    card: '#1E293B',
    text: '#F1F5F9',
    border: '#334155',
    notification: '#EF4444',
  },
};

const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => (
  <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{name}</Text>
);

// Stack navigator for More tab
function MoreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1E293B' },
        headerTintColor: '#F1F5F9',
      }}
    >
      <Stack.Screen
        name="MoreMain"
        component={MoreScreen}
        options={{ title: 'More' }}
      />
      <Stack.Screen
        name="Analytics"
        component={AnalyticsScreen}
      />
      <Stack.Screen
        name="Rules"
        component={RulesScreen}
      />
      <Stack.Screen
        name="Alerts"
        component={AlertsScreen}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
      />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#1E293B' },
          headerTintColor: '#F1F5F9',
          tabBarStyle: { backgroundColor: '#1E293B', borderTopColor: '#334155' },
          tabBarActiveTintColor: '#10B981',
          tabBarInactiveTintColor: '#94A3B8',
        }}
      >
        <Tab.Screen
          name="Today"
          component={TodayScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="📍" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Journal"
          component={JournalScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon name="📓" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="More"
          component={MoreStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabIcon name="⋮" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
