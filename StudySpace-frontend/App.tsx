import { DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppFrame } from './src/components/AppFrame';
import { useAppFonts } from './src/hooks/useAppFonts';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/colors';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.surfaceApp,
    card: colors.surfaceApp,
    primary: colors.primary900,
    text: colors.textMain,
    border: colors.border,
  },
};
const queryClient = new QueryClient();
export default function App() {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) return null;

  return (
  <QueryClientProvider client={queryClient}>
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppFrame>
        <NavigationContainer theme={navigationTheme}>
          <RootNavigator />
        </NavigationContainer>
      </AppFrame>
    </SafeAreaProvider>
  </QueryClientProvider>
);
}