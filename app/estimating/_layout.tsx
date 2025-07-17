import { Stack } from 'expo-router';

export default function EstimatingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="database" options={{ headerShown: false }} />
      <Stack.Screen name="projects" options={{ headerShown: false }} />
    </Stack>
  );
}
