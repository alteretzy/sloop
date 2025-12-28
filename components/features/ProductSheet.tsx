import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { GlassView } from '../ui/GlassView';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

interface ProductSheetProps {
  visible: boolean;
  onClose: () => void;
  onAddToCart: () => void;
}

export const ProductSheet = ({ visible, onClose, onAddToCart }: ProductSheetProps) => {
  if (!visible) return null;

  return (
    <Animated.View 
      entering={FadeInDown.springify()} 
      exiting={FadeOutDown}
      className="absolute bottom-10 left-4 right-4"
    >
      <GlassView intensity={90} className="p-0">
        <View className="p-4 flex-row items-start">
          {/* Product Image */}
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200' }} 
            className="w-24 h-24 rounded-2xl bg-gray-200"
          />
          
          <View className="ml-4 flex-1">
            <View className="flex-row justify-between items-start">
              <Text className="text-white font-bold text-lg w-4/5">Nike Dunk Low Retro</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close-circle" size={24} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>
            </View>
            
            <Text className="text-gray-300 text-xs mt-1">Detected via Vision</Text>
            
            <View className="flex-row items-baseline mt-2">
              <Text className="text-white text-2xl font-bold">$110.00</Text>
              <Text className="text-green-400 text-xs ml-2 font-bold">Best Price found on Nike</Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <View className="p-4 pt-0">
          <TouchableOpacity 
            onPress={onAddToCart}
            className="bg-white w-full py-4 rounded-xl flex-row justify-center items-center active:opacity-90"
          >
            <Ionicons name="cart" size={20} color="black" style={{ marginRight: 8 }} />
            <Text className="text-black font-bold text-base">Add to One Cart</Text>
          </TouchableOpacity>
        </View>
      </GlassView>
    </Animated.View>
  );
};