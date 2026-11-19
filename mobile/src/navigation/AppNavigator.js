import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { loadStoredUser } from '../store/slices/authSlice';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import StoreScreen from '../screens/StoreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AiGeneratorScreen from '../screens/AiGeneratorScreen';
import ExamScreen from '../screens/ExamScreen';
import ResultScreen from '../screens/ResultScreen';
import CartScreen from '../screens/CartScreen';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home-outline';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Analytics') iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          else if (route.name === 'Bookmarks') iconName = focused ? 'bookmark' : 'bookmark-outline';
          else if (route.name === 'Store') iconName = focused ? 'bag-handle' : 'bag-handle-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
      <Tab.Screen name="Store" component={StoreScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const dispatch = useDispatch();
  const { token, initializing } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadStoredUser());
  }, [dispatch]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="AiGenerator" component={AiGeneratorScreen} />
            <Stack.Screen name="ExamScreen" component={ExamScreen} />
            <Stack.Screen name="ResultScreen" component={ResultScreen} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
