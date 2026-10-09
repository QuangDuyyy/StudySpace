import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from './icons/Icon';
import { colors } from '../theme/colors';
import { em, fonts } from '../theme/typography';

type NoResultsProps = { onClear: () => void };

export function NoResults({ onClear }: NoResultsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconSurface}>
        <Icon name="search" size={28} color={colors.textMetadata} />
      </View>
      <Text style={styles.heading}>No rooms found</Text>
      <Text style={styles.body}>Try another room name or remove a filter.</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Clear search"
        onPress={onClear}
        style={styles.button}
      >
        <Text style={styles.buttonLabel}>Clear search</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 45,
    paddingHorizontal: 30,
  },
  iconSurface: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    // Surface color is not specified by Figma.
    backgroundColor: colors.surfaceFacility,
  },
  heading: {
    marginTop: 16,
    fontFamily: fonts.manrope700,
    fontSize: 18,
    letterSpacing: em(18, -0.025),
    color: colors.textMain,
  },
  body: {
    marginTop: 6,
    textAlign: 'center',
    fontFamily: fonts.dm400,
    fontSize: 13,
    color: colors.textMetadata,
  },
  button: {
    marginTop: 18,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    // Button color is not specified by Figma; primary green matches other CTAs.
    backgroundColor: colors.primary900,
  },
  buttonLabel: {
    fontFamily: fonts.dm700,
    fontSize: 12,
    color: '#FFFFFF',
  },
});