import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        title: 'Login'
      }} />
      <Stack.Screen name="admin" />
        <Stack.Screen name="stack" options={{
            headerShown: false,
        }} />
    </Stack>
  );
}
