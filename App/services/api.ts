import Constants from "expo-constants";
import { router } from "expo-router";
import { eliminarToken } from "@/lib/auth";

const API_URL: string = Constants.expoConfig?.extra?.apiUrl;

export type Vehiculo = {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  estado: string;
  imagen?: string;
};
export type Ventas = {
  id: number;
  vehiculoId: number;
  fecha: string;
  metodoPago: string;
  vehiculo: Vehiculo;
};
const revisarRespuesta = async (res: Response) => {
  if (res.status === 401) {
    await eliminarToken();
    router.replace("/login");
  }
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    return { error: json?.error || json?.message || `Error ${res.status}` };
  }
  return json?.data ?? json;
};

export const api = {
  login: async (email: string, password: string): Promise<{ token?: string; error?: string }> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.token) {
      return { error: json?.error || json?.message || "Credenciales invalidas" };
    }
    console.log("Login exitoso");
    return { token: json.token };
  },

  registro: async (nombre: string, email: string, password: string): Promise<{ error?: string }> => {
    const res = await fetch(`${API_URL}/auth/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      return { error: json?.error || json?.message || `Error ${res.status}` };
    }
    console.log("Registro exitoso");
    return {};
  },

  getVehiculos: async (
    token: string,
    soloDisponibles: boolean
  ): Promise<Vehiculo[] | { error: string }> => {
    const filtro = soloDisponibles ? "?estado=disponible" : "";
    const res = await fetch(`${API_URL}/vehiculos${filtro}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return revisarRespuesta(res);
  },

  getVehiculo: async (token: string, id: number): Promise<Vehiculo | { error: string }> => {
    const res = await fetch(`${API_URL}/vehiculos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return revisarRespuesta(res);
  },

  comprarVehiculo: async (
    token: string,
    vehiculoId: number
  ): Promise<{ id: number } | { error: string }> => {
    const res = await fetch(`${API_URL}/ventas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ vehiculoId, metodoPago: "transferencia" }),
    });
    return revisarRespuesta(res);
  },
  getVentas: async (token: string): Promise<Ventas[] | { error: string }> => {
    const res = await fetch(`${API_URL}/ventas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return revisarRespuesta(res);
  }
};
