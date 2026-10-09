import { memo, useCallback, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { FacilityChip } from './FacilityChip';
import { Icon } from './icons/Icon';
import { StatusPill } from './StatusPill';
import { getRoomImage } from '../data/roomImages';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { colors } from '../theme/colors';
import { radii, shadows } from '../theme/layout';
import { em, fonts } from '../theme/typography';
import type { Room } from '../types/room';
import { getRoomLocation } from '../utils/rooms';

const IMAGE_HEIGHT = 182;
const PRESS_SCALE = 0.985;

type RoomCardProps = {
  room: Room;
  onPress: (roomId: string) => void;
};

export const RoomCard = memo(function RoomCard({ room, onPress }: RoomCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const reducedMotion = useReducedMotion();
  const location = getRoomLocation(room);
  const statusLabel = room.status === 'available' ? 'Available now' : 'Occupied';
  const nextColor = room.status === 'available' ? colors.nextAvailable : colors.occupiedNext;

  const animateTo = useCallback(
    (toValue: number) => {
      Animated.timing(scale, {
        toValue,
        duration: reducedMotion ? 1 : 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    },
    [scale, reducedMotion],
  );

  return (
    <Animated.View style={[styles.shadowWrap, { transform: [{ scale }] }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${room.name}, ${location}, ${statusLabel}, ${room.seats} seats, ${room.nextLabel}`}
        onPress={() => onPress(room.id)}
        onPressIn={() => animateTo(PRESS_SCALE)}
        onPressOut={() => animateTo(1)}
        style={styles.card}
      >
        <View style={styles.imageWrap}>
          <Image
            source={getRoomImage(room.id)}
            style={styles.image}
            contentFit="cover"
            transition={200}
            accessible
            accessibilityLabel={`Photo of ${room.name}`}
          />
          {/* Gradient colors are not specified by Figma; only its 42% height is. */}
          <LinearGradient
            colors={['rgba(10,26,18,0)', 'rgba(10,26,18,0.28)']}
            style={styles.imageOverlay}
          />
          <View style={styles.badge}>
            <StatusPill status={room.status} />
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {room.name}
            </Text>
            <View style={styles.arrow}>
              <Icon name="chevronRight" size={18} color={colors.arrowIcon} />
            </View>
          </View>

          <View style={styles.locationRow}>
            <Icon name="mapPin" size={16} color={colors.textMetadata} />
            <Text style={styles.location}>{location}</Text>
          </View>

          <View style={styles.facilities}>
            {room.facilities.slice(0, 3).map((facility) => (
              <FacilityChip key={facility} label={facility} />
            ))}
          </View>

          <View style={styles.footer}>
            <View style={styles.capacity}>
              <Icon name="users" size={16} color={colors.textMetadata} />
              <Text style={styles.capacityText}>{room.seats} seats</Text>
            </View>
            <Text style={[styles.next, { color: nextColor }]}>{room.nextLabel}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: radii.roomCard,
    backgroundColor: colors.surfaceCard,
    ...shadows.roomCard,
  },
  card: {
    overflow: 'hidden',
    borderRadius: radii.roomCard,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surfaceCard,
  },
  imageWrap: {
    height: IMAGE_HEIGHT,
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '42%',
  },
  badge: {
    position: 'absolute',
    top: 14,
    left: 14,
  },
  body: {
    paddingTop: 16,
    paddingHorizontal: 17,
    paddingBottom: 17,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    fontFamily: fonts.manrope800,
    fontSize: 18,
    letterSpacing: em(18, -0.025),
    color: colors.textMain,
  },
  arrow: {
    width: 29,
    height: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: colors.arrowSurface,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
  },
  location: {
    fontFamily: fonts.dm400,
    fontSize: 12,
    color: colors.textMetadata,
  },
  facilities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  capacity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  capacityText: {
    fontFamily: fonts.dm400,
    fontSize: 12,
    color: colors.textMetadata,
  },
  next: {
    fontFamily: fonts.dm700,
    fontSize: 9,
  },
});