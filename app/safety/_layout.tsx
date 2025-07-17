import { Stack } from 'expo-router';

export default function SafetyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="daily-reports" options={{ headerShown: false }} />
      <Stack.Screen name="flha" options={{ headerShown: false }} />
    </Stack>
  );
}
