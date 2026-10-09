import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { radii } from '../theme/layout';
import { typography } from '../theme/typography';

export type RoomStatus = 'available' | 'occupied';

type StatusPillProps = {
  status: RoomStatus;
  label?: string;
};

const STATUS_STYLES = {
  available: {
    defaultLabel: 'Available now',
    background: colors.successSurface,
    text: colors.successText,
    dot: colors.successDot,
  },
  occupied: {
    defaultLabel: 'Occupied',
    background: colors.occupiedSurface,
    text: colors.occupiedText,
    dot: colors.occupiedDot,
  },
} as const;

export function StatusPill({ status, label }: StatusPillProps) {
  const config = STATUS_STYLES[status];
  const text = label ?? config.defaultLabel;

  return (
    <View
      accessible
      accessibilityLabel={text}
      style={[styles.pill, { backgroundColor: config.background }]}
    >
      {/* Dot size is not specified by Figma; 6px matches the screenshots. */}
      <View style={[styles.dot, { backgroundColor: config.dot }]} />
      <Text style={[typography.pillLabel, { color: config.text }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});