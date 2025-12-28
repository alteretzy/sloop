module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // NativeWind must run before Reanimated
      "nativewind/babel",
      // Tamagui plugin for optimization
      [
        "@tamagui/babel-plugin",
        {
          components: ["tamagui"],
          config: "./tamagui.config.ts",
          logTimings: true,
        },
      ],
      // Reanimated must be last
      "react-native-reanimated/plugin",
    ],
  };
};