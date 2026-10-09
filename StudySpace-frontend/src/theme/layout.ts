import type { ViewStyle } from 'react-native';

export const MAX_APP_WIDTH = 460;
export const MIN_APP_WIDTH = 320;
export const NAV_HEIGHT = 80;

/** Key spacing values, spec section 3.3. */
export const spacing = {
  browseX: 18,
  rootX: 20,
  detailX: 20,
  successX: 22,
  searchGap: 10,
  chipGap: 7,
  roomListGap: 18,
  bookingListGap: 14,
  dateGap: 7,
  slotGap: 9,
  sheetX: 20,
  sheetTop: 10,
  sheetBottom: 18,
  rootBottom: 104,
  navX: 26,
} as const;

/** Radii, spec section 3.4. */
export const radii = {
  facility: 7,
  compact: 12,
  dateCard: 13,
  cta: 14,
  search: 17,
  roomCard: 23,
  bookingCard: 22,
  ticket: 20,
  sheetTop: 28,
  pill: 99,
} as const;

type ShadowSpec = {
  x?: number;
  y: number;
  blur: number;
  color: string;
  opacity: number;
};

/**
 * Converts a CSS box-shadow (x y blur color/alpha) to React Native props.
 * iOS shadowRadius is roughly half of the CSS blur radius.
 * Android elevation is not specified by Figma; this is an approximation.
 */
export const makeShadow = ({ x = 0, y, blur, color, opacity }: ShadowSpec): ViewStyle => ({
  shadowColor: color,
  shadowOffset: { width: x, height: y },
  shadowOpacity: opacity,
  shadowRadius: blur / 2,
  elevation: Math.round(blur / 8),
});

/** Shadows used so far, spec section 3.5. rgba(r,g,b,a) is split into hex + opacity. */
export const shadows = {
  frame: makeShadow({ y: 0, blur: 70, color: '#192D22', opacity: 0.13 }),
  bottomNav: makeShadow({ y: -8, blur: 30, color: '#1D2F25', opacity: 0.05 }),
  sheet: makeShadow({ y: -20, blur: 60, color: '#08170F', opacity: 0.2 }),
  selected: makeShadow({ y: 7, blur: 16, color: '#153D30', opacity: 0.19 }),
    avatar: makeShadow({ y: 7, blur: 18, color: '#1D4635', opacity: 0.16 }),
  filterButton: makeShadow({ y: 8, blur: 20, color: '#1C4836', opacity: 0.17 }),
  search: makeShadow({ y: 8, blur: 24, color: '#21392C', opacity: 0.07 }),
  selectedChip: makeShadow({ y: 5, blur: 12, color: '#173F31', opacity: 0.15 }),
  dateStrip: makeShadow({ y: 5, blur: 18, color: '#273A2F', opacity: 0.04 }),
  selectedDate: makeShadow({ y: 6, blur: 14, color: '#153D30', opacity: 0.2 }),
  roomCard: makeShadow({ y: 10, blur: 30, color: '#22352A', opacity: 0.075 }),
} as const;