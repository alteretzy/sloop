import React, { useState } from 'react';
import { View, Dimensions, TouchableOpacity, Text } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { OnboardingCard, SlideData } from '../components/features/OnboardingCard';
import { GlassView } from '../components/ui/GlassView';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// The "Spotify Wrapped" Vibe Data
const SLIDES: SlideData[] = [
  {
    id: '1',
    title: 'Scan Reality',
    subtitle: 'Point your camera at any sneaker or tech. We identify it instantly.',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800',
    colors: ['#4ade80', '#064e3b'], // Green Vibe
  },
  {
    id: '2',
    title: 'One Cart',
    subtitle: 'Amazon, Nike, and StockX in a single place. Stop switching apps.',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
    colors: ['#3b82f6', '#1e3a8a'], // Blue Vibe
  },
  {
    id: '3',
    title: 'Drop The Price',
    subtitle: 'Hit the "Optimize" button and watch the prices fall automatically.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=800',
    colors: ['#f59e0b', '#78350f'], // Gold Vibe
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const progress = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleFinish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(tabs)'); // Navigate to the Main App
  };

  return (
    <View className="flex-1 bg-black">
      <Carousel
        width={width}
        height={height}
        data={SLIDES}
        onProgressChange={(_, absoluteProgress) => {
          progress.value = absoluteProgress;
        }}
        onSnapToItem={(index) => {
          setActiveIndex(index);
          Haptics.selectionAsync(); // The "Click" Feel
        }}
        renderItem={({ item, index }) => (
          <OnboardingCard item={item} index={index} progressValue={progress} />
        )}
      />

      {/* Bottom Controls Overlay */}
      <View className="absolute bottom-16 left-0 right-0 px-8 items-center">
        {/* Pagination Dots */}
        <View className="flex-row space-x-2 mb-8">
          {SLIDES.map((_, i) => (
            <View 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'
              }`} 
            />
          ))}
        </View>

        {/* Dynamic Action Button */}
        {activeIndex === SLIDES.length - 1 ? (
          // Final Slide: "Get Started" Button
          <TouchableOpacity onPress={handleFinish} className="w-full">
             <GlassView intensity={80} className="w-full py-4 rounded-2xl items-center flex-row justify-center">
                <Text className="text-white font-bold text-lg mr-2">Start Slooping</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
             </GlassView>
          </TouchableOpacity>
        ) : (
          // Other Slides: "Swipe" Hint
          <Text className="text-white/40 text-xs font-bold uppercase tracking-widest">
            Swipe to continue
          </Text>
        )}
      </View>
    </View>
  );
}