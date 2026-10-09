import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { colors } from '../theme/colors';
import { radii, shadows, spacing } from '../theme/layout';

const SHIMMER_MS = 1200;

type ShimmerProps = { style?: StyleProp<ViewStyle> };

/** A grey block with a highlight sweeping across it (spec: 1.2s, infinite). */
function Shimmer({ style }: ShimmerProps) {
  const reducedMotion = useReducedMotion();
  const [width, setWidth] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reducedMotion) return undefined;
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: SHIMMER_MS,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [progress, reducedMotion]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={[styles.block, style]} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}>
        {/* Skeleton colors are not specified by Figma. */}
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.7)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

function RoomCardSkeleton() {
  return (
    <View style={styles.card}>
      <Shimmer style={styles.image} />
      <View style={styles.body}>
        <Shimmer style={styles.titleBar} />
        <Shimmer style={styles.locationBar} />
        <View style={styles.chips}>
          <Shimmer style={styles.chip} />
          <Shimmer style={styles.chip} />
          <Shimmer style={styles.chip} />
        </View>
      </View>
    </View>
  );
}

/** Two skeleton cards, shown for 650ms on launch (spec 6.15). */
export function RoomListSkeleton() {
  return (
    <View
      accessible
      accessibilityLabel="Loading rooms"
      accessibilityRole="progressbar"
      style={styles.list}
    >
      <RoomCardSkeleton />
      <RoomCardSkeleton />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.roomListGap,
  },
  block: {
    overflow: 'hidden',
    backgroundColor: colors.surfaceSubtle,
  },
  card: {
    overflow: 'hidden',
    borderRadius: radii.roomCard,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surfaceCard,
    ...shadows.roomCard,
  },
  image: {
    height: 164,
  },
  body: {
    padding: 18,
    gap: 10,
  },
  titleBar: {
    width: '55%',
    height: 18,
    borderRadius: 6,
  },
  locationBar: {
    width: '38%',
    height: 12,
    borderRadius: 6,
  },
  chips: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    width: 56,
    height: 20,
    borderRadius: radii.facility,
  },
});