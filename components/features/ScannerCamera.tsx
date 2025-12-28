import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { Canvas, Rect, Paint } from '@shopify/react-native-skia';
import { useSharedValue } from 'react-native-reanimated';

export const ScannerCamera = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  // Shared values for the Bounding Box (mocking detection for now)
  // In the next step, the Frame Processor will update these values at 60fps
  const boxX = useSharedValue(100);
  const boxY = useSharedValue(200);
  const boxW = useSharedValue(200);
  const boxH = useSharedValue(200);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  if (!device || !hasPermission) {
    return <View className="flex-1 bg-black justify-center items-center"><Text className="text-white">No Camera Access</Text></View>;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        enableZoomGesture
      />

      {/* Skia Overlay: Much faster than React Views for drawing boxes */}
      <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
        <Rect
          x={boxX}
          y={boxY}
          width={boxW}
          height={boxH}
          color="rgba(255, 255, 255, 0.3)" // Semi-transparent fill
          style="stroke"
          strokeWidth={4}
        >
          {/* The "Sloop" Glow Effect */}
          <Paint color="#34D399" style="stroke" strokeWidth={2} />
        </Rect>
      </Canvas>
    </View>
  );
};