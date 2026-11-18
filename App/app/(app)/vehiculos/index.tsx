import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { api, Vehiculo } from "@/services/api";
import { eliminarToken, obtenerToken } from "@/lib/auth";
import VehiculoCard from "@/features/vehiculos/VehiculoCard";

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = async (disponibles: boolean) => {
    setCargando(true);
    setError("");
    const token = await obtenerToken();
    if (!token) return router.replace("/login");
    try {
      const data = await api.getVehiculos(token, disponibles);
      if (Array.isArray(data)) setVehiculos(data);
      else setError(data.error || "No se pudieron cargar los vehiculos");
    } catch {
      setError("No se pudo conectar con el servidor");
    }
    setCargando(false);
  };

  useFocusEffect(
    useCallback(() => {
      cargar(soloDisponibles);
    }, [soloDisponibles])
  );

  const handleLogout = async () => {
    await eliminarToken();
    router.replace("/login");
  };
  const handleHistorial = async () => {
    router.push("/vehiculos/ventas");
  }

  return (
    <View style={styles.container}>
      <View style={styles.botones}>
        <TouchableOpacity
          style={[styles.boton, soloDisponibles && styles.botonActivo]}
          onPress={() => setSoloDisponibles(!soloDisponibles)}
        >
          <Text style={[styles.botonTexto, soloDisponibles && styles.botonTextoActivo]}>
            {soloDisponibles ? "Ver todos" : "Solo disponibles"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.boton, styles.botonHistorial]} onPress={handleHistorial}>
          <Text style={styles.botonHistorialTexto}>Historial</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.boton, styles.botonSalir]} onPress={handleLogout}>
          <Text style={styles.botonSalirTexto}>Cerrar sesion</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {cargando ? (
        <ActivityIndicator size="large" color="#1e3a8a" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={vehiculos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={styles.vacio}>No hay vehiculos disponibles</Text>}
          renderItem={({ item }) => (
            <VehiculoCard vehiculo={item} onPress={() => router.push(`/vehiculos/${item.id}`)} />
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
  botones: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  boton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1e3a8a",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  botonActivo: {
    backgroundColor: "#1e3a8a",
  },
  botonTexto: {
    color: "#1e3a8a",
    fontWeight: "bold",
  },
  botonTextoActivo: {
    color: "#fff",
  },
  botonSalir: {
    borderColor: "#9f0d0d",
  },
  botonHistorial: {
    borderColor: "#076c3f",
  },
  botonHistorialTexto: {
    color: "#076c3f",
    fontWeight: "bold",
  },
  botonSalirTexto: {
    color: "#9f0d0d",
    fontWeight: "bold",
  },
  error: {
    color: "#9f0d0d",
    textAlign: "center",
    marginTop: 16,
  },
  vacio: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 40,
  },
});
