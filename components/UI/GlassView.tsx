import React from 'react';
import { View, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassProps extends ViewProps {
  intensity?: number;
  children: React.ReactNode;
}

export const GlassView = ({ children, intensity = 60, style, className, ...props }: GlassProps) => {
  return (
    <View 
      className={`overflow-hidden rounded-3xl bg-white/10 border border-white/20 ${className}`} 
      style={style} 
      {...props}
    >
      <BlurView intensity={intensity} tint="light" className="p-4">
        {children}
      </BlurView>
    </View>
  );
};