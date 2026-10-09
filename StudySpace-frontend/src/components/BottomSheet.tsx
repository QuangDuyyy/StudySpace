import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { colors } from '../theme/colors';
import { MAX_APP_WIDTH, radii, shadows, spacing } from '../theme/layout';

const BACKDROP_MS = 200;
const SHEET_MS = 300;
const SHEET_EASING = Easing.bezier(0.2, 0.75, 0.25, 1);

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  /** Screen-reader label for the backdrop (e.g. "Close", "Keep booking"). */
  closeLabel?: string;
  children: ReactNode;
};

type SheetContentProps = Omit<BottomSheetProps, 'visible'>;

/** Mounted only while the Modal is visible, so the entrance animation runs on every open. */
function SheetContent({ onClose, closeLabel = 'Close', children }: SheetContentProps) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const [sheetHeight, setSheetHeight] = useState(windowHeight);
  const backdropProgress = useRef(new Animated.Value(0)).current;
  const slideProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(backdropProgress, {
        toValue: 1,
        duration: reducedMotion ? 1 : BACKDROP_MS,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(slideProgress, {
        toValue: 1,
        duration: reducedMotion ? 1 : SHEET_MS,
        easing: SHEET_EASING,
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [backdropProgress, slideProgress, reducedMotion]);

  const translateY = slideProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [sheetHeight, 0],
  });

  return (
    <View style={styles.root}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: backdropProgress }]}>
        {/* Spec: 3px backdrop blur. Blur is iOS-only here; Android gets the tint alone. */}
        {Platform.OS === 'ios' && (
          <BlurView intensity={6} tint="default" style={StyleSheet.absoluteFill} />
        )}
        <View style={[StyleSheet.absoluteFill, styles.backdropTint]} />
      </Animated.View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={closeLabel}
        onPress={onClose}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        accessibilityViewIsModal
        onLayout={(event) => setSheetHeight(event.nativeEvent.layout.height)}
        style={[
          styles.sheet,
          { paddingBottom: spacing.sheetBottom + insets.bottom, transform: [{ translateY }] },
        ]}
      >
        <View style={styles.handle} />
        {children}
      </Animated.View>
    </View>
  );
}

export function BottomSheet({ visible, onClose, closeLabel, children }: BottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <SheetContent onClose={onClose} closeLabel={closeLabel}>
        {children}
      </SheetContent>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdropTint: {
    backgroundColor: colors.backdrop,
  },
  sheet: {
    width: '100%',
    maxWidth: MAX_APP_WIDTH,
    alignSelf: 'center',
    paddingTop: spacing.sheetTop,
    paddingHorizontal: spacing.sheetX,
    borderTopLeftRadius: radii.sheetTop,
    borderTopRightRadius: radii.sheetTop,
    backgroundColor: colors.surfaceSheet,
    ...shadows.sheet,
  },
  handle: {
    alignSelf: 'center',
    width: 38,
    height: 4,
    marginBottom: 18,
    borderRadius: radii.pill,
    backgroundColor: colors.sheetHandle,
  },
});