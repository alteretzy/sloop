import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image'; // Much faster than RN Image
import { GlassView } from '../ui/GlassView';
import { LiquidPress } from '../ui/LiquidPress';
import { Ionicons } from '@expo/vector-icons';

interface FeedItem {
  id: string;
  image: string;
  title: string;
  price: number;
  aspectRatio: number; // Critical for Masonry look
}

export const FeedCard = ({ item }: { item: FeedItem }) => {
  return (
    <LiquidPress className="mb-4 mx-2">
      <View className="rounded-3xl overflow-hidden bg-gray-900 relative">
        {/* The Product Image */}
        <Image
          source={{ uri: item.image }}
          style={{ aspectRatio: item.aspectRatio, width: '100%' }}
          contentFit="cover"
          transition={500} // Fade in duration
        />

        {/* The "Price Tag" Overlay */}
        <View className="absolute bottom-3 right-3">
          <GlassView intensity={70} className="px-3 py-1.5 rounded-xl flex-row items-center">
            <Text className="text-white font-bold text-xs">${item.price}</Text>
          </GlassView>
        </View>

        {/* The "Wishlist" Heart */}
        <View className="absolute top-3 right-3">
          <GlassView intensity={50} className="p-2 rounded-full">
            <Ionicons name="heart-outline" size={16} color="white" />
          </GlassView>
        </View>
      </View>
      
      {/* Title below card */}
      <Text className="text-gray-400 text-xs font-medium mt-2 ml-1" numberOfLines={1}>
        {item.title}
      </Text>
    </LiquidPress>
  );
};
import { useRouter } from 'expo-router';
// ... other imports

export const FeedCard = ({ item }: { item: FeedItem }) => {
  const router = useRouter(); // Hook for navigation

  const handlePress = () => {
    // Navigate and pass data as params
    router.push({
      pathname: '/product/[id]',
      params: { 
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image
      }
    });
  };

  return (
    <LiquidPress 
      onPress={handlePress} // <--- Attach the navigator here
      className="mb-4 mx-2"
    >
      {/* ... existing UI code ... */}
    </LiquidPress>
  );
};