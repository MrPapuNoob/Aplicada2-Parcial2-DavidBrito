import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";
import { decodificarToken, eliminarToken, obtenerToken } from "@/lib/auth";

export default function Index() {
  useEffect(() => {
    const verificar = async () => {
      const token = await obtenerToken();
      if (!token) {
        router.replace("/login");
        return;
      }

      const payload = decodificarToken(token);
      const ahora = Date.now() / 1000;
      if (!payload || (payload.exp && payload.exp < ahora)) {
        await eliminarToken();
        router.replace("/login");
        return;
      }
      router.replace("/vehiculos");
    };
    verificar();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#1e3a8a" />
    </View>
  );
}
