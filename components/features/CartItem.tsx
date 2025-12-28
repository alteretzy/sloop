import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { GlassView } from '../ui/GlassView';
import { useCartStore } from '../../store/cartStore';
import { CartItem as CartItemType } from '../../types/cart';
import { Ionicons } from '@expo/vector-icons';

export const CartItem = ({ item }: { item: CartItemType }) => {
  const { updateQuantity, removeItem } = useCartStore();

  // Check if current selection is the cheapest option
  const minPrice = Math.min(...item.alternatives.map(a => a.price));
  const isBestPrice = item.selectedOption.price === minPrice;

  return (
    <GlassView className="mb-4 flex-row items-center">
      {/* Product Image */}
      <Image 
        source={{ uri: item.image }} 
        className="w-20 h-20 rounded-xl bg-gray-200" 
      />

      <View className="flex-1 ml-4 justify-between h-20">
        <View>
          <Text className="text-white font-bold text-lg leading-tight">{item.name}</Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-gray-300 text-xs mr-2">Sold by {item.selectedOption.vendor}</Text>
            {isBestPrice && (
              <View className="bg-green-500/80 px-2 py-0.5 rounded-full">
                <Text className="text-white text-[10px] font-bold">BEST PRICE</Text>
              </View>
            )}
          </View>
        </View>

        <View className="flex-row justify-between items-end">
          <Text className="text-white text-xl font-bold">
            ${item.selectedOption.price.toFixed(2)}
          </Text>

          {/* Quantity Controls */}
          <View className="flex-row items-center bg-white/20 rounded-full px-2">
            <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} className="p-1">
              <Ionicons name="remove" size={16} color="white" />
            </TouchableOpacity>
            <Text className="text-white mx-2 font-medium">{item.quantity}</Text>
            <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} className="p-1">
              <Ionicons name="add" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </GlassView>
  );
};