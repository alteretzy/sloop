import { Dimensions, Platform } from 'react-native';

/**
 * Converts normalized bounding box coordinates (0-1) from the model
 * to absolute screen coordinates, accounting for "cover" aspect fill.
 */
export const mapCoordinates = (
  box: { y1: number; x1: number; y2: number; x2: number },
  frameWidth: number,
  frameHeight: number
) => {
  'worklet'; // Must run on UI thread for performance

  const { width: screenW, height: screenH } = Dimensions.get('window');

  // 1. Determine the orientation
  // On Android, width/height often need swapping depending on sensor orientation.
  // We assume standard portrait mode logic here.
  const sensorW = Platform.OS === 'android' ? frameHeight : frameWidth;
  const sensorH = Platform.OS === 'android' ? frameWidth : frameHeight;

  // 2. Calculate Scale (How much was the image zoomed to cover the screen?)
  const scaleX = screenW / sensorW;
  const scaleY = screenH / sensorH;
  
  // "Cover" uses the larger scale factor to ensure no black bars
  const scale = Math.max(scaleX, scaleY);

  // 3. Calculate the size of the image as it exists on the screen (including hidden cropped parts)
  const scaledWidth = sensorW * scale;
  const scaledHeight = sensorH * scale;

  // 4. Calculate Offsets (How much is hanging off the edge?)
  const offsetX = (scaledWidth - screenW) / 2;
  const offsetY = (scaledHeight - screenH) / 2;

  // 5. Map the Normalized Coordinates (0-1) to Screen Pixels
  // Note: TFLite usually outputs relative (0-1) or absolute (0-320). 
  // We assume relative (0-1) here. If your model outputs 0-320, divide by 320 first.
  
  return {
    left: (box.x1 * scaledWidth) - offsetX,
    top: (box.y1 * scaledHeight) - offsetY,
    width: (box.x2 - box.x1) * scaledWidth,
    height: (box.y2 - box.y1) * scaledHeight,
  };
};