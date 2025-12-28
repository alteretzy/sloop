import { BlurView } from 'expo-blur';
import { Pressable, Image, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { MotiView } from 'moti'; // Great for the entry animation

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const PinterestCard = ({ product, onAdd }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      className="flex-1 m-2 rounded-2xl overflow-hidden"
    >
      <AnimatedPressable
        onPressIn={() => (scale.value = withSpring(0.95))}
        onPressOut={() => (scale.value = withSpring(1))}
        style={animatedStyle}
        className="relative aspect-[1/1.4]"
      >
        <Image 
          source={{ uri: product.image }} 
          className="w-full h-full" 
          resizeMode="cover" 
        />
        
        {/* Glassmorphism Price Overlay */}
        <BlurView 
          intensity={80} 
          tint="light" 
          className="absolute bottom-2 left-2 right-2 rounded-xl overflow-hidden"
        >
          <View className="bg-white/10 px-3 py-2 flex-row justify-between items-center">
            <View>
              <Text className="text-xs font-bold text-black">{product.prices[0].site}</Text>
              <Text className="text-sm font-semibold text-blue-600">₹{product.prices[0].price}</Text>
            </View>
            <Pressable 
              onPress={onAdd}
              className="bg-black/80 w-8 h-8 rounded-full items-center justify-center"
            >
              <Text className="text-white font-bold">+</Text>
            </Pressable>
          </View>
        </BlurView>
      </AnimatedPressable>
    </MotiView>
  );
};