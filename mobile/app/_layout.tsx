import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./auth/login/Login";
import RegisterScreen from "./auth/register/Register";
import HomeScreen from "./views/Home/Home";
import { VIEWS } from "@/constants/VIEWS";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const Stack = createStackNavigator();

function RootLayoutNav() {
  return (
    <Stack.Navigator initialRouteName={VIEWS.LOGIN}>
      <Stack.Screen name={VIEWS.LOGIN} component={LoginScreen} />
      <Stack.Screen name={VIEWS.REGISTER} component={RegisterScreen} />
      <Stack.Screen name={VIEWS.HOME} component={HomeScreen} />
    </Stack.Navigator>
  );
}
