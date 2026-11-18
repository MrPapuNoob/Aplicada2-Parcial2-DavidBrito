import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1e3a8a" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login" options={{ title: "Iniciar sesion" }} />
      <Stack.Screen name="(auth)/registro" options={{ title: "Registrarse" }} />
      <Stack.Screen name="(app)/vehiculos/index" options={{ title: "Vehiculos" }} />
      <Stack.Screen name="(app)/vehiculos/[id]" options={{ title: "Detalle del vehiculo" }} />
      <Stack.Screen name="(app)/vehiculos/ventas" options={{ title: "Historial de compras" }} />
    </Stack>
  );
}
