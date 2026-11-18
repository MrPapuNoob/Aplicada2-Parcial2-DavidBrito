export default {
  expo: {
    name: "Parcial 2",
    slug: "aplicada2-parcial2",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    scheme: "parcial2",
    userInterfaceStyle: "light",
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#ffffff",
        foregroundImage: "./assets/android-icon-foreground.png",
        backgroundImage: "./assets/android-icon-background.png",
        monochromeImage: "./assets/android-icon-monochrome.png",
      },
    },
    web: {
      bundler: "metro",
      favicon: "./assets/favicon.png",
    },
    plugins: ["expo-router", "expo-status-bar"],
    extra: {
      apiUrl: process.env.API_URL,
    },
  },
};
