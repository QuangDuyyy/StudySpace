import type { ReactElement } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../../theme/colors';

export type IconName =
  | 'compass'
  | 'calendar'
  | 'user'
  | 'x'
  | 'check'
  | 'search'
  | 'sliders'
  | 'chevronRight'
  | 'mapPin'
  | 'users';

/** Spec section 19: 24x24 viewBox, no fill, round caps/joins, stroke 1.9. */
const ICON_SHAPES: Record<IconName, ReactElement> = {
  compass: (
    <>
      <Circle cx={12} cy={12} r={10} />
      <Path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
    </>
  ),
  calendar: (
    <>
      <Path d="M8 2v4" />
      <Path d="M16 2v4" />
      <Rect x={3} y={4} width={18} height={18} rx={2} />
      <Path d="M3 10h18" />
    </>
  ),
  user: (
    <>
      <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <Circle cx={12} cy={7} r={4} />
    </>
  ),
  x: (
    <>
      <Path d="M18 6 6 18" />
      <Path d="m6 6 12 12" />
    </>
  ),
  check: <Path d="M20 6 9 17l-5-5" />,
  search: (
    <>
      <Circle cx={11} cy={11} r={8} />
      <Path d="m21 21-4.3-4.3" />
    </>
  ),
  sliders: (
    <>
      <Path d="M20 7h-9" />
      <Path d="M14 17H5" />
      <Circle cx={17} cy={17} r={3} />
      <Circle cx={8} cy={7} r={3} />
    </>
  ),
  chevronRight: <Path d="m9 18 6-6-6-6" />,
  mapPin: (
    <>
      <Path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <Circle cx={12} cy={10} r={3} />
    </>
  ),
  users: (
    <>
      <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <Circle cx={9} cy={7} r={4} />
      <Path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
};

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function Icon({
  name,
  size = 20,
  color = colors.textMain,
  strokeWidth = 1.9,
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {ICON_SHAPES[name]}
    </Svg>
  );
}