export const colorEstado = (estado: string) =>
  estado === "disponible"
    ? { color: "#059669", backgroundColor: "#d1fae5" }
    : { color: "#dc2626", backgroundColor: "#fee2e2" };
