import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { api, Ventas } from "@/services/api";
import { obtenerToken } from "@/lib/auth";

export default function HistorialVentas() {
  const [ventas, setVentas] = useState<Ventas[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = async () => {
    setCargando(true);
    setError("");
    const token = await obtenerToken();
    if (!token) return router.replace("/login");
    try {
      const data = await api.getVentas(token);
      if (Array.isArray(data)) setVentas(data);
      else setError(data.error || "No se pudieron cargar las compras");
    } catch {
      setError("No se pudo conectar con el servidor");
    }
    setCargando(false);
  };

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [])
  );

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {cargando ? (
        <ActivityIndicator size="large" color="#1e3a8a" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={ventas}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={styles.vacio}>No hay compras registradas</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nombre}>
                {item.vehiculo
                  ? `${item.vehiculo.marca} ${item.vehiculo.modelo}`
                  : `Vehiculo #${item.vehiculoId}`}
              </Text>
              <Text style={styles.texto}>Fecha: {item.fecha ? item.fecha.slice(0, 10) : "-"}</Text>
              <Text style={styles.monto}>Monto: ${item.vehiculo?.precio ?? "-"}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 4,
  },
  texto: {
    fontSize: 14,
    color: "#374151",
  },
  monto: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#059669",
    marginTop: 4,
  },
  vacio: {
    textAlign: "center",
    marginTop: 40,
    color: "#6b7280",
  },
  error: {
    color: "#9f0d0d",
    textAlign: "center",
    marginTop: 16,
  },
});
