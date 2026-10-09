import { useFonts } from 'expo-font';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import {
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';
import { fonts } from '../theme/typography';

/** Loads DM Sans 400–700 and Manrope 600–800. Returns true when ready. */
export function useAppFonts(): boolean {
  const [loaded] = useFonts({
    [fonts.dm400]: DMSans_400Regular,
    [fonts.dm500]: DMSans_500Medium,
    [fonts.dm600]: DMSans_600SemiBold,
    [fonts.dm700]: DMSans_700Bold,
    [fonts.manrope600]: Manrope_600SemiBold,
    [fonts.manrope700]: Manrope_700Bold,
    [fonts.manrope800]: Manrope_800ExtraBold,
  });
  return loaded;
}