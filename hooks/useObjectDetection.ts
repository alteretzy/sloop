import { useState, useEffect } from 'react';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { useFrameProcessor } from 'react-native-vision-camera';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { Dimensions, Platform } from 'react-native';

// Standard MobileNet Input Size
const MODEL_WIDTH = 320;
const MODEL_HEIGHT = 320;

export const useObjectDetection = () => {
  // 1. Load the Model
  const plugin = useTensorflowModel(require('../assets/model.tflite'));
  
  // 2. Shared Values for Skia (The UI listens to these)
  const boxX = useSharedValue(0);
  const boxY = useSharedValue(0);
  const boxW = useSharedValue(0);
  const boxH = useSharedValue(0);
  const isDetected = useSharedValue(0); // 0 or 1

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    
    if (plugin.state !== 'loaded') return;

    // 3. Pre-processing: Resize camera frame to Model input size
    // Note: react-native-fast-tflite handles basic resizing internally if configured, 
    // but explicit resizing via vision-camera-resize-plugin is often safer for complex pipelines.
    // For this example, we assume direct input mapping or a resize helper is available.
    // simpler approach:
    
    const data = plugin.model.runSync([frame]); 
    // ^ In a real prod app, you'd use a resize plugin here to crop 'frame' to 320x320 first.

    // 4. Output Parsing (Depends on your Model Architecture)
    // MobileNet usually returns: [Boxes, Classes, Scores, Count]
    const boxes = data[0]; // [y1, x1, y2, x2] usually
    const scores = data[2];

    // Check if the highest confidence score > 50%
    if (scores[0] > 0.5) {
        const y1 = boxes[0];
        const x1 = boxes[1];
        const y2 = boxes[2];
        const x2 = boxes[3];

        // 5. Coordinate Mapping (Model -> Screen)
        // This is rough math. In production, you need to account for Aspect Ratio (cover vs contain)
        const scaleX = screenWidth / MODEL_WIDTH;
        const scaleY = screenHeight / MODEL_HEIGHT;

        // Smoothly animate the box to the new coordinates
        boxX.value = withSpring(x1 * MODEL_WIDTH * scaleX);
        boxY.value = withSpring(y1 * MODEL_HEIGHT * scaleY);
        boxW.value = withSpring((x2 - x1) * MODEL_WIDTH * scaleX);
        boxH.value = withSpring((y2 - y1) * MODEL_HEIGHT * scaleY);
        
        isDetected.value = 1;
    } else {
        isDetected.value = 0;
    }

  }, [plugin]);

  return { frameProcessor, boxX, boxY, boxW, boxH, isDetected };
};
// Inside useFrameProcessor...
const { top, left, width, height } = mapCoordinates(
  { y1: boxes[0], x1: boxes[1], y2: boxes[2], x2: boxes[3] }, // Normalized coords
  frame.width,
  frame.height
);

// Update Shared Values
boxX.value = withSpring(left);
boxY.value = withSpring(top);
boxW.value = withSpring(width);
boxH.value = withSpring(height);