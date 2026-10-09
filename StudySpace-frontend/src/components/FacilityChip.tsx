import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { radii } from '../theme/layout';
import { fonts } from '../theme/typography';

type FacilityChipProps = { label: string };

/** Room-card size (spec 6.14). The larger Room Details chip is added in Step 5. */
export function FacilityChip({ label }: FacilityChipProps) {
  return (
    <View style={styles.chip}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: radii.facility,
    backgroundColor: colors.surfaceFacility,
  },
  label: {
    fontFamily: fonts.dm600,
    fontSize: 8,
    color: colors.facilityText,
  },
});