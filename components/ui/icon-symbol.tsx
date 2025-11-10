import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';

/**
 * IconSymbol - Componente de íconos multiplataforma
 * 
 * Usa SF Symbols en iOS y Material Icons en Android/Web
 */

// Mapeo de nombres de SF Symbols a Material Icons
const ICON_MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'fork.knife': 'restaurant',
  'plus': 'add',
  'camera.fill': 'camera-alt',
  'photo': 'photo',
} as const;

export type IconSymbolName = keyof typeof ICON_MAPPING;

interface IconSymbolProps {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}

/**
 * Componente que renderiza íconos adaptados a la plataforma
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: IconSymbolProps) {
  // Obtener el nombre del ícono de Material Icons
  const iconName = ICON_MAPPING[name] || 'help-outline';

  return (
    <MaterialIcons
      name={iconName as any}
      size={size}
      color={color as string}
      style={style as any}
    />
  );
}