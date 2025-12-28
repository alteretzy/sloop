import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Canvas, Path, Skia, Paint } from '@shopify/react-native-skia';
import { useSharedValue, withRepeat, withTiming, Easing, useDerivedValue } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const SCAN_SIZE = 280;
const CORNER_LENGTH = 40;

export const ScannerOverlay = () => {
  // Animation: "Breathing" scale effect
  const scale = useSharedValue(1);
  
  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1, // Infinite loop
      true // Reverse
    );
  }, []);

  // Calculate the path for the 4 corners based on animation
  const path = useDerivedValue(() => {
    const s = scale.value;
    const currentSize = SCAN_SIZE * s;
    const x = (width - currentSize) / 2;
    const y = (height - currentSize) / 2 - 50; // Offset slightly upwards

    const p = Skia.Path.Make();
    
    // Top Left
    p.moveTo(x, y + CORNER_LENGTH);
    p.lineTo(x, y);
    p.lineTo(x + CORNER_LENGTH, y);

    // Top Right
    p.moveTo(x + currentSize - CORNER_LENGTH, y);
    p.lineTo(x + currentSize, y);
    p.lineTo(x + currentSize, y + CORNER_LENGTH);

    // Bottom Right
    p.moveTo(x + currentSize, y + currentSize - CORNER_LENGTH);
    p.lineTo(x + currentSize, y + currentSize);
    p.lineTo(x + currentSize - CORNER_LENGTH, y + currentSize);

    // Bottom Left
    p.moveTo(x + CORNER_LENGTH, y + currentSize);
    p.lineTo(x, y + currentSize);
    p.lineTo(x, y + currentSize - CORNER_LENGTH);

    return p;
  });

  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* The Glow Stroke */}
      <Path
        path={path}
        style="stroke"
        strokeWidth={6}
        color="rgba(52, 211, 153, 0.6)" // Green-400 with opacity
        strokeCap="round"
        strokeJoin="round"
      >
        <Paint style="stroke" strokeWidth={2} color="#fff" />
      </Path>
    </Canvas>
  );
};