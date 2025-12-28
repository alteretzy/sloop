import React from 'react';
import { View, Text, Dimensions, Image } from 'react-native';
import Animated, { 
  Extrapolation, 
  interpolate, 
  useAnimatedStyle, 
  SharedValue 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export interface SlideData {
  id: string;
  title: string;
  subtitle: string;
  image: string; // URL or require()
  colors: [string, string]; // Gradient tuple
}

interface Props {
  item: SlideData;
  index: number;
  progressValue: SharedValue<number>;
}

export const OnboardingCard = ({ item, index, progressValue }: Props) => {
  
  // Parallax Effect: Text moves slower than the swipe
  const parallaxStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progressValue.value,
      [index - 1, index, index + 1],
      [-width * 0.5, 0, width * 0.5],
      Extrapolation.CLAMP
    );
    return { transform: [{ translateX }] };
  });

  // Scale Effect: Image shrinks slightly when swiping away
  const scaleStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      progressValue.value,
      [index - 1, index, index + 1],
      [0.8, 1, 0.8],
      Extrapolation.CLAMP
    );
    return { transform: [{ scale }] };
  });

  return (
    <View style={{ width, height, overflow: 'hidden' }}>
      {/* 1. Dynamic Background Gradient */}
      <LinearGradient
        colors={item.colors}
        style={{ position: 'absolute', width, height }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* 2. Visual Content */}
      <View className="flex-1 justify-center items-center p-8">
        <Animated.View style={[{ width: width * 0.8, height: width * 0.8 }, scaleStyle]}>
          <Image 
            source={{ uri: item.image }} 
            className="w-full h-full rounded-3xl"
            resizeMode="cover"
          />
        </Animated.View>

        {/* 3. Typography with Parallax */}
        <Animated.View style={[{ marginTop: 60, alignItems: 'center' }, parallaxStyle]}>
          <Text className="text-white text-4xl font-black text-center tracking-tighter uppercase leading-none mb-4">
            {item.title}
          </Text>
          <Text className="text-white/70 text-lg font-medium text-center px-4 leading-6">
            {item.subtitle}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};