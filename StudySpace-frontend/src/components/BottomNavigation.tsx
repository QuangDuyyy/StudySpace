import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Icon, type IconName } from './icons/Icon';
import { colors } from '../theme/colors';
import { NAV_HEIGHT, shadows, spacing } from '../theme/layout';
import { typography } from '../theme/typography';

type TabConfig = { label: string; icon: IconName };

const TAB_CONFIG: Readonly<Record<string, TabConfig | undefined>> = {
  Browse: { label: 'Browse', icon: 'compass' },
  MyBookings: { label: 'My Bookings', icon: 'calendar' },
  Profile: { label: 'Profile', icon: 'user' },
};

type TabButtonProps = TabConfig & {
  focused: boolean;
  onPress: () => void;
};

function TabButton({ label, icon, focused, onPress }: TabButtonProps) {
  const tint = focused ? colors.activeText : colors.navInactive;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: focused }}
      onPress={onPress}
      style={styles.tab}
    >
      <View style={[styles.iconSurface, focused && styles.iconSurfaceActive]}>
        <Icon name={icon} size={22} color={tint} />
        {focused && <View style={styles.activeDot} />}
      </View>
      <Text style={[typography.navLabel, { color: tint }]}>{label}</Text>
    </Pressable>
  );
}

/** Custom tab bar replacing React Navigation's default, per spec section 5. */
export function BottomNavigation({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    // Zero-height in-flow wrapper; the bar overlays content so it can blur what scrolls beneath.
    <View style={styles.anchor} pointerEvents="box-none">
      <View
        accessibilityRole="tablist"
        accessibilityLabel="Main navigation"
        style={[styles.bar, { height: NAV_HEIGHT + insets.bottom, paddingBottom: insets.bottom }]}
      >
        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, styles.barTint]} />
        <View style={styles.row}>
          {state.routes.map((route, index) => {
            const config = TAB_CONFIG[route.name];
            if (!config) return null;
            const focused = state.index === index;

            const handlePress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            return (
              <TabButton key={route.key} {...config} focused={focused} onPress={handlePress} />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: colors.navBorder,
    ...shadows.bottomNav,
  },
  barTint: {
    backgroundColor: colors.navBackground,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 11,
    paddingHorizontal: spacing.navX,
  },
  tab: {
    alignItems: 'center',
    minWidth: 80,
    gap: 4,
  },
  iconSurface: {
    width: 38,
    height: 31,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  iconSurfaceActive: {
    backgroundColor: colors.navActiveSurface,
  },
  activeDot: {
    position: 'absolute',
    bottom: -5,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.navActiveDot,
  },
});