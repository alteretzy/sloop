import React from 'react';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        // The "Floating Glass" Tab Bar
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: 'transparent',
          height: 70,
          borderTopWidth: 0,
        },
        // We use a custom background to get the Blur effect
        tabBarBackground: () => (
          <View style={[StyleSheet.absoluteFill, { overflow: 'hidden', borderRadius: 35 }]}>
            <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />
          </View>
        ),
        // Active/Inactive Colors
        tabBarActiveTintColor: '#34D399', // Sloop Green
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
      }}
    >
      {/* Tab 1: Home (The Feed - Placeholder for now) */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />

      {/* Tab 2: The Scanner (Central Button) */}
      <Tabs.Screen
        name="scan"
        options={{
          // We make the scanner icon bigger and pop out
          tabBarIcon: ({ focused }) => (
            <View className={`w-14 h-14 rounded-full items-center justify-center ${focused ? 'bg-green-400' : 'bg-white/20'}`}>
              <Ionicons name="scan" size={24} color={focused ? 'black' : 'white'} />
            </View>
          ),
          // Hide the tab bar when scanning to be immersive? 
          // Set to 'display: none' if you want full immersion, but let's keep it for nav access.
        }}
      />

      {/* Tab 3: The Cart */}
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="cart" size={24} color={color} />,
          tabBarBadge: 2, // You can link this to store.items.length later
          tabBarBadgeStyle: { backgroundColor: '#ef4444', color: 'white' }
        }}
      />
    </Tabs>
  );
}