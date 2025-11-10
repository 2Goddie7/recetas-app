/**
 * Constantes de Tema
 * 
 * Define los colores para modo claro y oscuro
 */

const tintColorLight = '#4CAF50';
const tintColorDark = '#66BB6A';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = {
  regular: 'System',
  rounded: 'System', // En producción, usa fuentes personalizadas
  mono: 'Courier',
};