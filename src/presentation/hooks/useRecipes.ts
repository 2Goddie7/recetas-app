import { useEffect, useState } from "react";
import { Receta } from "../../domain/models/Receta";
import { RecipesUseCase } from "../../domain/useCases/recipes/RecipesUseCase";

const recipesUseCase = new RecipesUseCase();

/**
 * useRecipes - Hook de Gestión de Recetas
 * 
 * ACTUALIZACIONES:
 * - actualizar() ahora acepta imagenUri opcional
 * - Nuevo método: tomarFoto()
 */
export function useRecipes() {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarRecetas();
  }, []);

  /**
   * Cargar todas las recetas
   */
  const cargarRecetas = async () => {
    setCargando(true);
    const data = await recipesUseCase.obtenerRecetas();
    setRecetas(data);
    setCargando(false);
  };

  /**
   * Buscar recetas por ingrediente
   */
  const buscar = async (ingrediente: string) => {
    setCargando(true);
    const data = await recipesUseCase.buscarPorIngrediente(ingrediente);
    setRecetas(data);
    setCargando(false);
  };

  /**
   * Crear nueva receta
   */
  const crear = async (
    titulo: string,
    descripcion: string,
    ingredientes: string[],
    chefId: string,
    imagenUri?: string
  ) => {
    const resultado = await recipesUseCase.crearReceta(
      titulo,
      descripcion,
      ingredientes,
      chefId,
      imagenUri
    );

    if (resultado.success) {
      await cargarRecetas();
    }

    return resultado;
  };

  /**
   * 🆕 Actualizar receta existente - AHORA CON IMAGEN
   */
  const actualizar = async (
    id: string,
    titulo: string,
    descripcion: string,
    ingredientes: string[],
    imagenUri?: string // 👈 Nuevo parámetro opcional
  ) => {
    const resultado = await recipesUseCase.actualizarReceta(
      id,
      titulo,
      descripcion,
      ingredientes,
      imagenUri
    );

    if (resultado.success) {
      await cargarRecetas();
    }

    return resultado;
  };

  /**
   * Eliminar receta
   */
  const eliminar = async (id: string) => {
    const resultado = await recipesUseCase.eliminarReceta(id);

    if (resultado.success) {
      await cargarRecetas();
    }

    return resultado;
  };

  /**
   * Seleccionar imagen de galería
   */
  const seleccionarImagen = async () => {
    return await recipesUseCase.seleccionarImagen();
  };

  /**
   * 🆕 Tomar foto con la cámara
   */
  const tomarFoto = async () => {
    return await recipesUseCase.tomarFoto();
  };

  return {
    recetas,
    cargando,
    cargarRecetas,
    buscar,
    crear,
    actualizar,
    eliminar,
    seleccionarImagen,
    tomarFoto, // 👈 Nuevo método exportado
  };
}