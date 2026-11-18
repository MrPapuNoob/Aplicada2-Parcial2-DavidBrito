import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { api } from "@/services/api";
import { guardarToken } from "@/lib/auth";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleRegistro = async () => {
    setError("");
    if (!nombre || !email || !password) {
      setError("Completa todos los campos");
      return;
    }
    if (password.length < 6) {
      setError("La password debe tener al menos 6 caracteres");
      return;
    }

    setCargando(true);
    try {
      const data = await api.registro(nombre, email, password);
      if (data.error) {
        setError(data.error);
        setCargando(false);
        return;
      }

      const loginData = await api.login(email, password);
      if (loginData.token) {
        await guardarToken(loginData.token);
        router.replace("/vehiculos");
      } else {
        router.replace("/login");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    }
    setCargando(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>Vice City Motors</Text>
        <Text style={styles.subtitulo}>Crear cuenta</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.boton}
          onPress={handleRegistro}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botonTexto}>Registrarse</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.linkTexto}>
            Inicia sesion
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f3f4f6",
    padding: 24,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1e3a8a",
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 18,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    fontSize: 16,
  },
  error: {
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 8,
  },
  boton: {
    backgroundColor: "#1e3a8a",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  botonTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
    alignItems: "center",
  },
  linkTexto: {
    color: "#1e3a8a",
    fontSize: 14,
    fontWeight: "500",
  },
});
