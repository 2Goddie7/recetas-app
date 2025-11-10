import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { PlatformPressable } from '@react-navigation/elements';

/**
 * HapticTab - Botón de Tab con vibración
 * 
 * Wrapper para los botones de tab que agrega feedback háptico
 * cuando el usuario presiona un tab.
 */
export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        // Vibración ligera al presionar
        if (process.env.EXPO_OS === 'ios') {
          // iOS: Vibración sutil
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else {
          // Android: Vibración por defecto
          Haptics.selectionAsync();
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}