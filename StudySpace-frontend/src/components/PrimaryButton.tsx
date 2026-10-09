import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { radii, shadows } from '../theme/layout';
import { typography } from '../theme/typography';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** Spec: 50px for the booking bar / confirmation, 51px in the review sheet. */
  height?: number;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  height = 50,
  style,
}: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { height },
        disabled ? styles.disabled : shadows.selected,
        // Press feedback is not specified by Figma; a light opacity change is used.
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={typography.buttonLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: radii.cta,
    backgroundColor: colors.primary900,
  },
  disabled: {
    backgroundColor: colors.disabledCta,
  },
  pressed: {
    opacity: 0.9,
  },
});