import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { shadows } from '../theme/layout';
import { em, fonts } from '../theme/typography';

export function BrowseHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.branding}>
        <View style={styles.logo}>
          <Text style={styles.logoLetter}>N</Text>
        </View>
        <Text style={styles.university} numberOfLines={1}>
          NORTHBRIDGE UNIVERSITY
        </Text>
      </View>

      <View style={styles.greetingRow}>
        <Text style={styles.greeting}>Good morning, Alex</Text>
        <View
          accessible
          accessibilityRole="image"
          accessibilityLabel="Alex Morgan, online"
          style={styles.avatar}
        >
          <Text style={styles.initials}>AM</Text>
          <View style={styles.onlineDot} />
        </View>
      </View>

      <Text style={styles.title} accessibilityRole="header">
        Where will you study?
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 22,
  },
  branding: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    transform: [{ translateX: -3 }, { translateY: 18 }],
  },
  logo: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderBottomRightRadius: 9,
    borderBottomLeftRadius: 2,
    backgroundColor: colors.primary900,
  },
  logoLetter: {
    fontFamily: fonts.manrope800,
    fontSize: 12,
    color: colors.logoCream,
  },
  university: {
    // Spec weight is 800; DM Sans 800 is not loaded, so 700 is used.
    fontFamily: fonts.dm700,
    fontSize: 10,
    letterSpacing: em(10, 0.115),
    color: colors.brandText,
  },
  greetingRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  greeting: {
    fontFamily: fonts.dm500,
    fontSize: 12,
    color: colors.textSecondary,
  },
  avatar: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: colors.primary700,
    ...shadows.avatar,
  },
  initials: {
    fontFamily: fonts.dm700,
    fontSize: 13,
    color: '#FFFFFF',
  },
  onlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.surfaceOnlineBorder,
    backgroundColor: colors.online,
  },
  title: {
    maxWidth: 310,
    fontFamily: fonts.manrope800,
    fontSize: 29,
    letterSpacing: em(29, -0.045),
    color: colors.textMain,
  },
});