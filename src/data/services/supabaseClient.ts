import { createClient } from "@supabase/supabase-js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import "react-native-url-polyfill/auto";

/**
 * Cliente de Supabase con persistencia de sesión usando AsyncStorage
 * 
 * CAMBIOS CLAVE:
 * 1. Agregado AsyncStorage para persistir sesión
 * 2. persistSession: true (en lugar de false)
 * 3. autoRefreshToken: true mantiene la sesión activa
 */

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "❌ ERROR: Faltan variables de entorno.\n\n" +
    "Asegúrate de tener un archivo .env con:\n" +
    "- EXPO_PUBLIC_SUPABASE_URL\n" +
    "- EXPO_PUBLIC_SUPABASE_ANON_KEY\n\n" +
    "Revisa .env.example para ver el formato correcto."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // 🔑 CLAVE: Usar AsyncStorage para persistir sesión
    storage: AsyncStorage,

    // ✅ Persistir sesión incluso al cerrar la app
    persistSession: true,

    // Refrescar token automáticamente cuando expire
    autoRefreshToken: true,

    // NO detectar sesión en URL (para web)
    detectSessionInUrl: false,
  },
});