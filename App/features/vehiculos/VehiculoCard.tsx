import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Vehiculo } from "@/services/api";
import { colorEstado } from "@/features/vehiculos/Estados";

type Props = {
  vehiculo: Vehiculo;
  onPress: () => void;
};

export default function VehiculoCard({ vehiculo, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.fila}>
        <Text style={styles.nombre}>
          {vehiculo.marca} {vehiculo.modelo}
        </Text>
        <Text style={[styles.estado, colorEstado(vehiculo.estado)]}>{vehiculo.estado}</Text>
      </View>
      <Text style={styles.texto}>Año: {vehiculo.anio}</Text>
      <Text style={styles.precio}>${vehiculo.precio}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e3a8a",
    flex: 1,
  },
  estado: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  texto: {
    fontSize: 14,
    color: "#374151",
  },
  precio: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#059669",
    marginTop: 4,
  },
});
