import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../src/presentation/hooks/useAuth";
import { globalStyles } from "../../src/styles/globalStyles";
import { colors, fontSize, spacing } from "../../src/styles/theme";

export default function RegistroScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rol, setRol] = useState<"chef" | "usuario">("usuario");
  const [cargando, setCargando] = useState(false);

  const { registrar } = useAuth();
  const router = useRouter();

  const handleRegistro = async () => {
    // Validaciones
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Registro
    setCargando(true);
    const resultado = await registrar(email, password, rol);
    setCargando(false);

    if (resultado.success) {
      Alert.alert(
        "¡Registro Exitoso!",
        "Tu cuenta ha sido creada. Ya puedes iniciar sesión.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/auth/login"),
          },
        ]
      );
    } else {
      Alert.alert("Error", resultado.error || "No se pudo crear la cuenta");
    }
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.contentPadding}>
        <Text style={styles.titulo}>Crear Cuenta</Text>
        <Text style={styles.subtitulo}>Únete a Recetas App</Text>

        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={globalStyles.input}
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={globalStyles.input}
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Text style={styles.labelRol}>Tipo de cuenta:</Text>
        <View style={styles.contenedorRoles}>
          <TouchableOpacity
            style={[
              styles.botonRol,
              rol === "usuario" && styles.botonRolActivo,
            ]}
            onPress={() => setRol("usuario")}
          >
            <Text
              style={[
                styles.textoRol,
                rol === "usuario" && styles.textoRolActivo,
              ]}
            >
              👤 Usuario
            </Text>
            <Text style={styles.descripcionRol}>
              Ver y buscar recetas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botonRol,
              rol === "chef" && styles.botonRolActivo,
            ]}
            onPress={() => setRol("chef")}
          >
            <Text
              style={[
                styles.textoRol,
                rol === "chef" && styles.textoRolActivo,
              ]}
            >
              👨‍🍳 Chef
            </Text>
            <Text style={styles.descripcionRol}>
              Crear y compartir recetas
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            globalStyles.button,
            globalStyles.buttonPrimary,
            styles.botonRegistro,
          ]}
          onPress={handleRegistro}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={globalStyles.buttonText}>Crear Cuenta</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.linkLogin}>
            ¿Ya tienes cuenta? Inicia sesión aquí
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: fontSize.xxxl,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.sm,
    marginTop: spacing.xxl * 2,
    color: colors.textPrimary,
  },
  subtitulo: {
    fontSize: fontSize.md,
    textAlign: "center",
    marginBottom: spacing.xl,
    color: colors.textSecondary,
  },
  labelRol: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  contenedorRoles: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  botonRol: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  botonRolActivo: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  textoRol: {
    fontSize: fontSize.lg,
    fontWeight: "bold",
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  textoRolActivo: {
    color: colors.primary,
  },
  descripcionRol: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    textAlign: "center",
  },
  botonRegistro: {
    marginTop: spacing.sm,
  },
  linkLogin: {
    textAlign: "center",
    marginTop: spacing.lg,
    color: colors.primary,
    fontSize: fontSize.sm,
  },
});