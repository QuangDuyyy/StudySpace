import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { MAX_APP_WIDTH, MIN_APP_WIDTH, shadows } from '../theme/layout';

type AppFrameProps = { children: ReactNode };

/**
 * Caps the app at 460px and centers it (matters on iPad/web; a no-op on phones).
 * The web radial gradient has no native equivalent, so the outer area is a flat color.
 */
export function AppFrame({ children }: AppFrameProps) {
  return (
    <View style={styles.outer}>
      <View style={styles.frame}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.outerBackground,
  },
  frame: {
    flex: 1,
    width: '100%',
    minWidth: MIN_APP_WIDTH,
    maxWidth: MAX_APP_WIDTH,
    overflow: 'hidden',
    backgroundColor: colors.surfaceApp,
    ...shadows.frame,
  },
});