import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { api, Vehiculo } from "@/services/api";
import { obtenerToken } from "@/lib/auth";
import { colorEstado } from "@/features/vehiculos/Estados";

export default function DetalleVehiculo() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [cargando, setCargando] = useState(true);
  const [comprando, setComprando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargar = async () => {
    const token = await obtenerToken();
    if (!token) return router.replace("/login");
    try {
      const data = await api.getVehiculo(token, Number(id));
      if ("error" in data) setError(data.error);
      else setVehiculo(data);
    } catch {
      setError("No se pudo conectar con el servidor");
    }
    setCargando(false);
  };

  useEffect(() => {
    cargar();
  }, [id]);

  const comprar = async () => {
    setError("");
    setMensaje("");
    const token = await obtenerToken();
    if (!token) return router.replace("/login");
    setComprando(true);
    try {
      const res = await api.comprarVehiculo(token, Number(id));
      if ("error" in res) {
        setError(res.error);
        Alert.alert("Error", res.error);
      } else {
        setMensaje("Compra realizada con exito");
        Alert.alert("Listo", "Compra realizada con exito");
        await cargar();
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    }
    setComprando(false);
  };

  const handleComprar = () => {
    const texto = `Comprar ${vehiculo?.marca} ${vehiculo?.modelo} por $${vehiculo?.precio}?`;
    if (Platform.OS === "web") {
      if (window.confirm(texto)) comprar();
      return;
    }
    Alert.alert("Confirmar", texto, [
      { text: "Cancelar", style: "cancel" },
      { text: "Comprar", onPress: comprar },
    ]);
  };

  if (cargando) {
    return <ActivityIndicator size="large" color="#1e3a8a" style={{ marginTop: 40 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {vehiculo ? (
        <>
          {vehiculo.imagen ? <Image source={{ uri: vehiculo.imagen }} style={styles.imagen} /> : null}
          <Text style={styles.titulo}>
            {vehiculo.marca} {vehiculo.modelo}
          </Text>
          <Text style={[styles.estado, colorEstado(vehiculo.estado)]}>{vehiculo.estado}</Text>
          <Text style={styles.texto}>Marca: {vehiculo.marca}</Text>
          <Text style={styles.texto}>Modelo: {vehiculo.modelo}</Text>
          <Text style={styles.texto}>Año: {vehiculo.anio}</Text>
          <Text style={styles.precio}>${vehiculo.precio}</Text>

          {vehiculo.estado === "disponible" ? (
            <TouchableOpacity style={styles.boton} onPress={handleComprar} disabled={comprando}>
              {comprando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.botonTexto}>Comprar</Text>
              )}
            </TouchableOpacity>
          ) : null}
        </>
      ) : null}

      {mensaje ? <Text style={styles.exito}>{mensaje}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f3f4f6",
    padding: 24,
  },
  imagen: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 8,
  },
  estado: {
    alignSelf: "flex-start",
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  texto: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 6,
  },
  precio: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#059669",
    marginTop: 8,
  },
  boton: {
    backgroundColor: "#059669",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  botonTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  exito: {
    color: "#059669",
    textAlign: "center",
    marginTop: 16,
    fontWeight: "bold",
  },
  error: {
    color: "#dc2626",
    textAlign: "center",
    marginTop: 16,
  },
});
