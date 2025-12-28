// hooks/useFashionScanner.ts (Conceptual)
import { useFrameProcessor } from 'react-native-vision-camera';
import { useTensorflowModel, useTensorflowLite } from 'react-native-fast-tflite';
import { Worklets } from 'react-native-worklets-core';

export function useFashionScanner(onObjectsDetectedJS: (objects: any[]) => void) {
  const model = useTensorflowModel(require('../../assets/models/fashion-detector.tflite'));
  const tflite = useTensorflowLite();

  // Create a JS-thread wrapper for the callback
  const runOnJS = Worklets.createRunOnJS(onObjectsDetectedJS);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    if (!model.state === "loaded") return;

    // 1. Run inference on the camera frame
    const outputs = tflite.runSync(model.model, frame);

    // 2. Post-process outputs (NMS - Non-Max Suppression) to get bounding boxes
    const detectedObjects = processBoundingBoxes(outputs);

    // 3. Call back to JS thread to update UI state (e.g., draw Skia boxes)
    if (detectedObjects.length > 0) {
        runOnJS(detectedObjects);
    }
  }, [model]);

  return frameProcessor;
}