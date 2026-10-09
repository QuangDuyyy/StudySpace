import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from './icons/Icon';
import { colors } from '../theme/colors';
import { radii, shadows } from '../theme/layout';
import { fonts } from '../theme/typography';

type FilterChipProps = {
  label: string;
  selected?: boolean;
  /** Dimension chips (Building, Capacity, ...) show a down chevron. */
  showChevron?: boolean;
  onPress?: () => void;
};

export function FilterChip({
  label,
  selected = false,
  showChevron = false,
  onPress,
}: FilterChipProps) {
  const textColor = selected ? '#FFFFFF' : colors.chipText;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      {showChevron && (
        <View style={styles.chevron}>
          <Icon name="chevronRight" size={13} color={textColor} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    backgroundColor: colors.chipBackground,
  },
  chipSelected: {
    borderColor: colors.primary800,
    backgroundColor: colors.primary800,
    ...shadows.selectedChip,
  },
  label: {
    fontFamily: fonts.dm600,
    fontSize: 11,
  },
  chevron: {
    opacity: 0.6,
    transform: [{ rotate: '90deg' }],
  },
});