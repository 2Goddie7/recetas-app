import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/src/data/services/supabaseClient";
import { Receta } from "../../models/Receta";

export class RecipesUseCase {
  /**
   * Obtener todas las recetas ordenadas por más recientes
   */
  async obtenerRecetas(): Promise<Receta[]> {
    const { data, error } = await supabase
      .from("recetas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error al obtener recetas:", error);
      return [];
    }

    return data as Receta[];
  }

  /**
   * Buscar recetas que contengan un ingrediente específico
   */
  async buscarPorIngrediente(ingrediente: string): Promise<Receta[]> {
    const { data, error } = await supabase
      .from("recetas")
      .select("*")
      .contains("ingredientes", [ingrediente.toLowerCase()])
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error en búsqueda:", error);
      return [];
    }

    return data as Receta[];
  }

  /**
   * Crear nueva receta
   */
  async crearReceta(
    titulo: string,
    descripcion: string,
    ingredientes: string[],
    chefId: string,
    imagenUri?: string
  ) {
    try {
      let imagenUrl: string | null = null;

      if (imagenUri) {
        imagenUrl = await this.subirImagen(imagenUri);
      }

      const { data, error } = await supabase
        .from("recetas")
        .insert({
          titulo,
          descripcion,
          ingredientes,
          chef_id: chefId,
          imagen_url: imagenUrl,
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, receta: data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * 🆕 Actualizar receta CON IMAGEN
   * 
   * NUEVO: Ahora permite actualizar la imagen de la receta
   */
  async actualizarReceta(
    id: string,
    titulo: string,
    descripcion: string,
    ingredientes: string[],
    imagenUri?: string // 👈 Nuevo parámetro opcional
  ) {
    try {
      let imagenUrl: string | undefined = undefined;

      // Si se proporciona una nueva imagen, subirla
      if (imagenUri) {
        imagenUrl = await this.subirImagen(imagenUri);
      }

      // Preparar datos de actualización
      const updateData: any = {
        titulo,
        descripcion,
        ingredientes,
      };

      // Solo actualizar imagen_url si se subió una nueva imagen
      if (imagenUrl) {
        updateData.imagen_url = imagenUrl;
      }

      const { data, error } = await supabase
        .from("recetas")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, receta: data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Eliminar receta
   */
  async eliminarReceta(id: string) {
    try {
      const { error } = await supabase.from("recetas").delete().eq("id", id);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Subir imagen al Storage de Supabase
   */
  private async subirImagen(uri: string): Promise<string> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;

      const { data, error } = await supabase.storage
        .from("recetas-fotos")
        .upload(fileName, blob, {
          contentType: "image/jpeg",
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("recetas-fotos").getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error("Error al subir imagen:", error);
      throw error;
    }
  }

  /**
   * Seleccionar imagen de la galería
   */
  async seleccionarImagen(): Promise<string | null> {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        alert("Necesitamos permisos para acceder a tus fotos");
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
      return null;
    }
  }

  /**
   * 🆕 Tomar foto con la cámara
   * 
   * NUEVO: Permite capturar fotos directamente con la cámara
   */
  async tomarFoto(): Promise<string | null> {
    try {
      // Pedir permisos de cámara
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        alert("Necesitamos permisos para acceder a tu cámara");
        return null;
      }

      // Abrir cámara
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error("Error al tomar foto:", error);
      return null;
    }
  }
}