import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/tokens';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../node_modules/@expo-google-fonts/space-mono/400Regular/SpaceMono_400Regular.ttf'),
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.ground }}>
        <ActivityIndicator color={Colors.textPrimary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="trade/[id]" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </>
  );
}
