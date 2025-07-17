import { Stack } from 'expo-router';

export default function ManagementLayout() {
  return (
    <Stack>
      <Stack.Screen name="projects" options={{ headerShown: false }} />
      <Stack.Screen name="projects/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="timecards" options={{ headerShown: false }} />
      <Stack.Screen name="dispatch" options={{ headerShown: false }} />
      <Stack.Screen name="crew" options={{ headerShown: false }} />
      <Stack.Screen name="equipment" options={{ headerShown: false }} />
    </Stack>
  );
}
