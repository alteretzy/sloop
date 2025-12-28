import React from 'react';
import { View, Text, SafeAreaView, Platform } from 'react-native';
import { MasonryFlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import { FeedCard } from '../../components/features/FeedCard';
import { GlassView } from '../../components/ui/GlassView';
import { Ionicons } from '@expo/vector-icons';

// 1. Generate Fake Data with varying heights (Aspect Ratios)
const MOCK_FEED = Array.from({ length: 20 }).map((_, i) => ({
  id: String(i),
  title: [
    'Nike Dunk Low Retro', 'Sony XM5', 'Hydro Flask', 'Aesop Soap', 'Herman Miller', 'MacBook Air'
  ][i % 6],
  price: [110, 348, 45, 30, 1200, 999][i % 6],
  image: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500',
    'https://images.unsplash.com/photo-1602143407151-01114192003b?w=500',
    'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500',
    'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500',
  ][i % 6],
  // Random aspect ratio between 0.7 (tall) and 1.3 (wide)
  aspectRatio: 0.7 + Math.random() * 0.6, 
}));

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-black">
      {/* Dark Gradient Background */}
      <LinearGradient
        colors={['#0f172a', '#000000']}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-2 pb-6 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-400 text-xs uppercase font-bold tracking-widest">Welcome Back</Text>
            <Text className="text-white text-3xl font-bold">Discover</Text>
          </View>
          <GlassView intensity={40} className="p-2 rounded-full">
            <Ionicons name="notifications" size={20} color="white" />
          </GlassView>
        </View>

        {/* The Infinite Masonry List */}
        <View className="flex-1 px-2">
          <MasonryFlashList
            data={MOCK_FEED}
            numColumns={2}
            renderItem={({ item }) => <FeedCard item={item} />}
            estimatedItemSize={200}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}