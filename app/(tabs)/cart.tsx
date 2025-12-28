import React from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCartStore } from '../../store/cartStore';
import { CartItem } from '../../components/features/CartItem';
import { GlassView } from '../../components/ui/GlassView';
import { Ionicons } from '@expo/vector-icons';
import Animated, { Layout } from 'react-native-reanimated';

export default function CartScreen() {
  const { items, totalPrice, totalSavings, optimizeCart } = useCartStore();

  return (
    <View className="flex-1">
      {/* Background Gradient - Critical for Glassmorphism */}
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1">
        <View className="px-6 pt-6 pb-4 flex-row justify-between items-end">
          <Text className="text-white text-4xl font-bold tracking-tighter">My Cart</Text>
          <Text className="text-gray-300 text-base font-medium">{items.length} Items</Text>
        </View>

        {/* Scrollable List */}
        <Animated.FlatList 
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CartItem item={item} />}
          contentContainerStyle={{ padding: 24, paddingBottom: 150 }}
          itemLayoutAnimation={Layout.springify()} // Smooth reordering animation
        />

        {/* Floating Bottom Action Bar */}
        <View className="absolute bottom-0 w-full px-6 pb-10">
          <GlassView intensity={80} className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-300 text-xs uppercase font-bold">Total</Text>
              <Text className="text-white text-2xl font-bold">${totalPrice.toFixed(2)}</Text>
              {totalSavings > 0 && (
                <Text className="text-green-400 text-xs font-bold">
                  You saved ${totalSavings.toFixed(2)}
                </Text>
              )}
            </View>

            {/* The Magic Button */}
            <TouchableOpacity 
              onPress={optimizeCart}
              className="bg-white rounded-2xl px-6 py-3 flex-row items-center shadow-lg"
            >
              <Ionicons name="sparkles" size={18} color="black" style={{ marginRight: 8 }} />
              <Text className="text-black font-bold text-base">Optimize</Text>
            </TouchableOpacity>
          </GlassView>
        </View>
      </SafeAreaView>
    </View>
  );
}
import { seedDatabase } from '../../utils/debugStore';

// Inside CartScreen component:
<TouchableOpacity onPress={seedDatabase} className="mb-4 bg-red-500/20 p-2 rounded-lg">
  <Text className="text-red-300 text-center text-xs">DEV: Seed Data</Text>
</TouchableOpacity>