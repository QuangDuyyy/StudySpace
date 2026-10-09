import type { TextStyle } from 'react-native';
import { colors } from './colors';

/** Font family names registered in useAppFonts. */
export const fonts = {
  dm400: 'DMSans_400Regular',
  dm500: 'DMSans_500Medium',
  dm600: 'DMSans_600SemiBold',
  dm700: 'DMSans_700Bold',
  manrope600: 'Manrope_600SemiBold',
  manrope700: 'Manrope_700Bold',
  manrope800: 'Manrope_800ExtraBold',
} as const;

/** React Native letterSpacing is in px; the spec uses em. */
export const em = (fontSize: number, ratio: number): number => fontSize * ratio;

/**
 * Text styles from spec section 3.2. More styles are added as screens need them.
 * "Heading default" weights in the spec are mapped to Manrope 700.
 */
export const typography = {
  browseTitle: {
    fontFamily: fonts.manrope800,
    fontSize: 29,
    letterSpacing: em(29, -0.045),
    color: colors.textMain,
  },
  rootTitle: {
    fontFamily: fonts.manrope800,
    fontSize: 28,
    lineHeight: Math.round(28 * 1.12),
    letterSpacing: em(28, -0.04),
    color: colors.textMain,
  },
  sheetTitle: {
    fontFamily: fonts.manrope700,
    fontSize: 22,
    letterSpacing: em(22, -0.025),
    color: colors.textMain,
  },
  eyebrow: {
    fontFamily: fonts.dm700,
    fontSize: 11,
    letterSpacing: em(11, 0.14),
    textTransform: 'uppercase',
    // Eyebrow color is not specified by Figma; metadata gray matches the screenshots.
    color: colors.textMetadata,
  },
  buttonLabel: {
    fontFamily: fonts.dm700,
    fontSize: 12,
    color: '#FFFFFF',
  },
  pillLabel: {
    fontFamily: fonts.dm700,
    fontSize: 11,
  },
  navLabel: {
    fontFamily: fonts.dm600,
    fontSize: 9,
    letterSpacing: em(9, 0.01),
  },
} satisfies Record<string, TextStyle>;