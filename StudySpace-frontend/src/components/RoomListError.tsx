import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from './icons/Icon';
import { colors } from '../theme/colors';
import { em, fonts } from '../theme/typography';

type RoomListErrorProps = {
  onRetry: () => void;
};

export function RoomListError({ onRetry }: RoomListErrorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconSurface}>
        <Icon name="search" size={28} color={colors.textMetadata} />
      </View>

      <Text style={styles.heading}>Unable to load rooms</Text>

      <Text style={styles.body}>
        Something went wrong while loading the rooms.
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Retry loading rooms"
        onPress={onRetry}
        style={styles.button}
      >
        <Text style={styles.buttonLabel}>Try again</Text>
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
    backgroundColor: colors.primary900,
  },
  buttonLabel: {
    fontFamily: fonts.dm700,
    fontSize: 12,
    color: '#FFFFFF',
  },
});