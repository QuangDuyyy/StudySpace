import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { em, fonts } from '../theme/typography';

type RoomListHeaderProps = { count: number };

export function RoomListHeader({ count }: RoomListHeaderProps) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.title} accessibilityRole="header">
          Available near you
        </Text>
        <Text style={styles.subtitle}>{count} spaces · Updated just now</Text>
      </View>
      {/* Spec: no implemented interaction, so this is plain text rather than a button. */}
      <Text style={styles.mapView}>Map view</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    fontFamily: fonts.manrope800,
    fontSize: 17,
    letterSpacing: em(17, -0.025),
    color: colors.textMain,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: fonts.dm400,
    fontSize: 12,
    color: colors.roomListSubtitle,
  },
  mapView: {
    fontFamily: fonts.dm700,
    fontSize: 12,
    color: colors.primary600,
  },
});