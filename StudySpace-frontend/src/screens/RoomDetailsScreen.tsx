import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ROOMS } from '../data/rooms';
import { getRoomImage } from '../data/roomImages';
import type { RootStackParamList } from '../navigation/types';
import { useBookingStore } from '../store/bookingStore';
import { useRoomAvailability } from '../hooks/useRoomAvailability';
import { useCreateBooking } from '../hooks/useCreateBooking';
import { formatLocalDate } from '../utils/dates';
type RoomDetailsRouteProp = RouteProp<
  RootStackParamList,
  'RoomDetails'
>;

type TimeSlot = {
  id: string;
  start: string;
  end: string;
};

const TIME_SLOTS: readonly TimeSlot[] = [
  { id: '09-10', start: '9:00 AM', end: '10:00 AM' },
  { id: '10-11', start: '10:00 AM', end: '11:00 AM' },
  { id: '11-12', start: '11:00 AM', end: '12:00 PM' },
  { id: '12-01', start: '12:00 PM', end: '1:00 PM' },
  { id: '01-02', start: '1:00 PM', end: '2:00 PM' },
  { id: '02-03', start: '2:00 PM', end: '3:00 PM' },
];



function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
  });
}

function addDays(date: Date, amount: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

export function RoomDetailsScreen() {
    
  const navigation = useNavigation();
  const route = useRoute<RoomDetailsRouteProp>();
  const insets = useSafeAreaInsets();
  const createBookingMutation = useCreateBooking();

  const selectedDate = useBookingStore((state) => state.selectedDate);
const setSelectedDate = useBookingStore(
  (state) => state.setSelectedDate,
);
const {
  data: availability = [],
  isLoading: availabilityLoading,
  isError: availabilityError,
} = useRoomAvailability(route.params.roomId, selectedDate);

const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
const [showReview, setShowReview] = useState(false);
  useEffect(() => {
  console.log('showReview:', showReview);
}, [showReview]);

  const room = useMemo(
    () => ROOMS.find((item) => item.id === route.params.roomId),
    [route.params.roomId],
  );

  const dates = useMemo(
    () =>
      Array.from({ length: 5 }, (_, index) =>
        addDays(selectedDate, index - 2),
      ),
    [selectedDate],
  );

  if (!room) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundTitle}>Room not found</Text>
        <Pressable
          style={styles.backButtonSimple}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 125 + insets.bottom,
        }}
      >
        {/* HERO */}
        <View style={styles.hero}>
          <Image
            source={getRoomImage(room.id)}
            style={styles.heroImage}
            contentFit="cover"
          />

          <LinearGradient
            colors={[
              'rgba(10,26,18,0.42)',
              'rgba(10,26,18,0)',
              'rgba(10,26,18,0.15)',
            ]}
            locations={[0, 0.55, 1]}
            style={StyleSheet.absoluteFill}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            style={[
              styles.heroBackButton,
              { top: Math.max(18, insets.top) },
            ]}
          >
            <Text style={styles.heroBackText}>‹</Text>
          </Pressable>

          <View style={styles.photoCount}>
            <Text style={styles.photoGrid}>▦</Text>
            <Text style={styles.photoCountText}>1/4</Text>
          </View>
        </View>

        {/* MAIN CONTENT */}
        <View style={styles.content}>
          <View style={styles.availableBadge}>
            <View style={styles.availableDot} />
            <Text style={styles.availableText}>
              {room.status === 'available'
                ? 'Available now'
                : 'Currently occupied'}
            </Text>
          </View>

          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.roomTitle}>{room.name}</Text>

              <View style={styles.locationRow}>
                <Text style={styles.locationIcon}>⌖</Text>
                <Text style={styles.locationText}>
                  {room.building} · Floor {room.floor}
                </Text>
              </View>
            </View>

            <View style={styles.capacityCard}>
              <Text style={styles.usersIcon}>♙</Text>
              <Text style={styles.capacityNumber}>{room.seats}</Text>
              <Text style={styles.capacityLabel}>seats</Text>
            </View>
          </View>

          {/* FACILITIES */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.facilities}
          >
            {room.facilities.map((facility) => (
              <View key={facility} style={styles.facilityChip}>
                <Text style={styles.facilityIcon}>•</Text>
                <Text style={styles.facilityText}>{facility}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.divider} />

          {/* DATE */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Choose a date</Text>
            <Text style={styles.timezone}>GMT−4</Text>
          </View>

          <View style={styles.dateRow}>
            {dates.map((date, index) => {
              const isSelected =
                date.toDateString() === selectedDate.toDateString();

              return (
                <Pressable
                  key={date.toISOString()}
                  onPress={() => {
                    setSelectedDate(date);
                    setSelectedSlot(null);
                  }}
                  style={[
                    styles.dateCell,
                    isSelected && styles.dateCellSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateWeekday,
                      isSelected && styles.dateWeekdaySelected,
                    ]}
                  >
                    {formatDate(date).split(' ')[0]}
                  </Text>

                  <Text
                    style={[
                      styles.dateNumber,
                      isSelected && styles.dateNumberSelected,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* TIME SLOTS */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Select a time</Text>
          </View>

          <View style={styles.slotGrid}>
            {TIME_SLOTS.map((slot) => {
  const isSelected = selectedSlot === slot.id;

  const slotIndex = TIME_SLOTS.indexOf(slot) + 1;

const apiSlot = availability.find(
  (item) => item.slotId === slotIndex,
);

  const isAvailable = apiSlot?.available ?? false;

  return (
                <Pressable
  key={slot.id}
  disabled={!isAvailable}
  onPress={() => setSelectedSlot(slot.id)}
  style={[
    styles.slot,
    !isAvailable && styles.slotUnavailable,
    isSelected && styles.slotSelected,
  ]}
>
                  <View>
                    <Text
                      style={[
                        styles.slotStart,
                        isSelected && styles.slotStartSelected,
                      ]}
                    >
                      {slot.start}
                    </Text>

                    <Text
                      style={[
                        styles.slotEnd,
                        isSelected && styles.slotEndSelected,
                      ]}
                    >
                      {slot.end}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.slotArrow,
                      isSelected && styles.slotArrowSelected,
                    ]}
                  >
                    ›
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* LEGEND */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={styles.legendAvailable} />
              <Text style={styles.legendText}>Available</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={styles.legendSelected} />
              <Text style={styles.legendText}>Selected</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={styles.legendUnavailable} />
              <Text style={styles.legendText}>Unavailable</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* REVIEW BOOKING SHEET */}
{showReview && selectedSlot && (
  <View style={styles.reviewOverlay}>
  <View
    style={[
      styles.reviewSheet,
      { paddingBottom: 18 + insets.bottom },
    ]}
  >
      <View style={styles.sheetHandle} />

      <View style={styles.reviewHeader}>
        <View>
          <Text style={styles.reviewEyebrow}>FINAL STEP</Text>
          <Text style={styles.reviewTitle}>
            Review your booking
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close review booking"
          onPress={() => setShowReview(false)}
          style={styles.reviewClose}
        >
          <Text style={styles.reviewCloseText}>×</Text>
        </Pressable>
      </View>

      <View style={styles.reviewRoom}>
        <Image
          source={getRoomImage(room.id)}
          style={styles.reviewRoomImage}
          contentFit="cover"
        />

        <View style={styles.reviewRoomInfo}>
          <Text style={styles.reviewRoomName}>
            {room.name}
          </Text>

          <Text style={styles.reviewRoomLocation}>
            {room.building} · Floor {room.floor}
          </Text>

          <Text style={styles.reviewRoomStatus}>
            {room.status === 'available'
              ? 'Available'
              : 'Currently occupied'}
          </Text>
        </View>
      </View>

      <View style={styles.reviewDetails}>
        <View style={styles.reviewDetail}>
          <Text style={styles.reviewLabel}>DATE</Text>

          <Text style={styles.reviewValue}>
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.reviewDetail}>
          <Text style={styles.reviewLabel}>TIME</Text>

          <Text style={styles.reviewValue}>
            {
              TIME_SLOTS.find(
                (slot) => slot.id === selectedSlot,
              )?.start
            }
            {' – '}
            {
              TIME_SLOTS.find(
                (slot) => slot.id === selectedSlot,
              )?.end
            }
          </Text>
        </View>

        <View style={styles.reviewDetail}>
          <Text style={styles.reviewLabel}>CAPACITY</Text>

          <Text style={styles.reviewValue}>
            {room.seats} seats
          </Text>
        </View>

        <View style={styles.reviewDetail}>
          <Text style={styles.reviewLabel}>DURATION</Text>

          <Text style={styles.reviewValue}>
            1 hour
          </Text>
        </View>
      </View>

      <View style={styles.noConflict}>
        <Text style={styles.noConflictIcon}>✓</Text>

        <View style={styles.noConflictText}>
          <Text style={styles.noConflictTitle}>
            No conflicts found
          </Text>

          <Text style={styles.noConflictBody}>
            This time slot is available for your booking.
          </Text>
        </View>
      </View>

      <Pressable
  disabled={createBookingMutation.isPending}
  style={[
    styles.confirmButton,
    createBookingMutation.isPending &&
      styles.confirmButtonDisabled,
  ]}
  onPress={async () => {
  if (!selectedSlot || createBookingMutation.isPending) {
    return;
  }

  const slot = TIME_SLOTS.find(
    (item) => item.id === selectedSlot,
  );

  if (!slot) {
    return;
  }

  const slotId = TIME_SLOTS.indexOf(slot) + 1;

  try {
    const booking = await createBookingMutation.mutateAsync({
      roomId: room.id,
      date: formatLocalDate(selectedDate),
      slotId,
    });

    navigation.navigate('Confirmation', {
      bookingId: booking.bookingId,
      roomId: booking.roomId,
      date: selectedDate.toISOString(),
      slotId: selectedSlot,
    });
  } catch (error) {
    console.error('BOOKING_FAILED', error);
  }
}}
>
        <Text style={styles.confirmButtonText}>
          Confirm booking
        </Text>
      </Pressable>

      <Text style={styles.policyText}>
        By confirming, you agree to the room booking policy.
      </Text>
    </View>
  </View>
)}

      {/* FIXED BOOKING BAR */}
      <View
        style={[
          styles.bookingBar,
          { paddingBottom: 14 + insets.bottom },
        ]}
      >
        <View style={styles.bookingSummary}>
          <Text style={styles.summaryLabel}>
            {selectedSlot ? 'SELECTED TIME' : 'SELECT A TIME'}
          </Text>

          <Text style={styles.summaryValue}>
            {selectedSlot
              ? TIME_SLOTS.find((slot) => slot.id === selectedSlot)
                  ?.start
              : 'Choose a time slot'}
          </Text>
        </View>

        <Pressable
  disabled={!selectedSlot}
  onPress={() => {
  console.log('OPEN REVIEW');
  setShowReview(true);
}}
  style={[
    styles.reviewButton,
    !selectedSlot && styles.reviewButtonDisabled,
  ]}
>
          <Text
            style={[
              styles.reviewButtonText,
              !selectedSlot && styles.reviewButtonTextDisabled,
            ]}
          >
            Review booking
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F9F6',
  },

  hero: {
    height: 310,
    width: '100%',
    position: 'relative',
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  heroBackButton: {
    position: 'absolute',
    left: 18,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },

  heroBackText: {
    color: '#153D30',
    fontSize: 31,
    lineHeight: 34,
    fontWeight: '300',
    marginTop: -3,
  },

  photoCount: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    height: 42,
    paddingHorizontal: 13,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },

  photoGrid: {
    fontSize: 17,
    color: '#26372D',
  },

  photoCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#26372D',
  },

  content: {
    marginTop: -25,
    paddingTop: 26,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#F7F9F6',
  },

  availableBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 99,
    backgroundColor: '#E6F3E9',
  },

  availableDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#3C9B60',
  },

  availableText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#225B3D',
  },

  titleRow: {
    marginTop: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },

  titleContainer: {
    flex: 1,
  },

  roomTitle: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '800',
    color: '#14241D',
    letterSpacing: -1.1,
  },

  locationRow: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  locationIcon: {
    fontSize: 17,
    color: '#607068',
  },

  locationText: {
    fontSize: 12,
    color: '#7D8881',
  },

  capacityCard: {
    width: 68,
    height: 70,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E6E1',
    shadowColor: '#193126',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },

  usersIcon: {
    fontSize: 19,
    color: '#285D48',
  },

  capacityNumber: {
    marginTop: 1,
    fontSize: 17,
    fontWeight: '800',
    color: '#14241D',
  },

  capacityLabel: {
    fontSize: 9,
    color: '#879088',
  },

  facilities: {
    gap: 8,
    paddingTop: 20,
    paddingBottom: 24,
  },

  facilityChip: {
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EDF2ED',
  },

  facilityIcon: {
    fontSize: 16,
    color: '#285D48',
  },

  facilityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#26372D',
  },

  divider: {
    height: 1,
    backgroundColor: '#EDF0ED',
  },

  sectionHeader: {
    marginTop: 20,
    marginBottom: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#14241D',
  },

  timezone: {
    fontSize: 9,
    fontWeight: '600',
    color: '#879088',
  },

  dateRow: {
    flexDirection: 'row',
    gap: 7,
  },

  dateCell: {
    flex: 1,
    height: 65,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E6E1',
  },

  dateCellSelected: {
    backgroundColor: '#153D30',
    borderColor: '#153D30',
    shadowColor: '#153D30',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 3,
  },

  dateWeekday: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7D8881',
  },

  dateWeekdaySelected: {
    color: '#BAD0C4',
  },

  dateNumber: {
    marginTop: 3,
    fontSize: 17,
    fontWeight: '800',
    color: '#14241D',
  },

  dateNumberSelected: {
    color: '#FFFFFF',
  },

  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },

  slot: {
    width: '48.7%',
    height: 57,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E6E1',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  slotSelected: {
    backgroundColor: '#153D30',
    borderColor: '#153D30',
  },

  slotUnavailable: {
  backgroundColor: '#F0F1EF',
  borderColor: '#E7E9E7',
  opacity: 0.75,
},

  slotStart: {
    fontSize: 13,
    fontWeight: '700',
    color: '#14241D',
  },

  slotStartSelected: {
    color: '#FFFFFF',
  },

  slotEnd: {
    marginTop: 2,
    fontSize: 9,
    color: '#929B94',
  },

  slotEndSelected: {
    color: '#C7D8CF',
  },

  slotArrow: {
    fontSize: 22,
    color: '#929B94',
  },

  slotArrowSelected: {
    color: '#FFFFFF',
  },

  legend: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 17,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  legendAvailable: {
    width: 9,
    height: 9,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9E1DB',
  },

  legendSelected: {
    width: 9,
    height: 9,
    borderRadius: 3,
    backgroundColor: '#153D30',
  },

  legendUnavailable: {
    width: 9,
    height: 9,
    borderRadius: 3,
    backgroundColor: '#F0F1EF',
    borderWidth: 1,
    borderColor: '#E7E9E7',
  },

  legendText: {
    fontSize: 9,
    color: '#879088',
  },

  bookingBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 90,
    paddingHorizontal: 20,
    paddingTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderTopWidth: 1,
    borderTopColor: '#E1E6E1',
    shadowColor: '#193126',
    shadowOpacity: 0.10,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: -5,
    },
    elevation: 8,
  },
  reviewOverlay: {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 50,
  justifyContent: 'flex-end',
  backgroundColor: 'rgba(11,25,17,0.48)',
},

reviewSheet: {
  backgroundColor: '#FBFCFA',
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  paddingTop: 10,
  paddingHorizontal: 20,
  zIndex: 51,
  elevation: 51,
},

sheetHandle: {
  alignSelf: 'center',
  width: 38,
  height: 4,
  borderRadius: 99,
  backgroundColor: '#D5DBD6',
  marginBottom: 17,
},

reviewHeader: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
},

reviewEyebrow: {
  fontSize: 9,
  fontWeight: '700',
  letterSpacing: 1.3,
  color: '#879088',
},

reviewTitle: {
  marginTop: 4,
  fontSize: 22,
  fontWeight: '800',
  color: '#14241D',
},

reviewClose: {
  width: 35,
  height: 35,
  borderRadius: 18,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#EEF1EE',
},

reviewCloseText: {
  fontSize: 23,
  lineHeight: 25,
  color: '#526159',
},

reviewRoom: {
  marginTop: 17,
  padding: 10,
  borderRadius: 15,
  borderWidth: 1,
  borderColor: '#E1E6E1',
  backgroundColor: '#FFFFFF',
  flexDirection: 'row',
  gap: 11,
},

reviewRoomImage: {
  width: 57,
  height: 52,
  borderRadius: 10,
},

reviewRoomInfo: {
  flex: 1,
  justifyContent: 'center',
},

reviewRoomName: {
  fontSize: 12,
  fontWeight: '800',
  color: '#14241D',
},

reviewRoomLocation: {
  marginTop: 2,
  fontSize: 9,
  color: '#7D8881',
},

reviewRoomStatus: {
  marginTop: 3,
  fontSize: 8,
  fontWeight: '700',
  color: '#3C9B60',
},

reviewDetails: {
  marginTop: 14,
  borderRadius: 15,
  borderWidth: 1,
  borderColor: '#E1E6E1',
  backgroundColor: '#FFFFFF',
  flexDirection: 'row',
  flexWrap: 'wrap',
  overflow: 'hidden',
},

reviewDetail: {
  width: '50%',
  minHeight: 67,
  paddingHorizontal: 13,
  paddingVertical: 11,
  borderWidth: 0.5,
  borderColor: '#EDF0ED',
  justifyContent: 'center',
},

reviewLabel: {
  fontSize: 8,
  fontWeight: '700',
  letterSpacing: 0.7,
  color: '#879088',
},

reviewValue: {
  marginTop: 4,
  fontSize: 10,
  fontWeight: '600',
  color: '#26372D',
},

noConflict: {
  marginTop: 13,
  padding: 11,
  borderRadius: 12,
  backgroundColor: '#E9F2EB',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 9,
},

noConflictIcon: {
  width: 18,
  height: 18,
  borderRadius: 9,
  textAlign: 'center',
  lineHeight: 18,
  backgroundColor: '#3C9B60',
  color: '#FFFFFF',
  fontSize: 11,
  fontWeight: '800',
},

noConflictText: {
  flex: 1,
},

noConflictTitle: {
  fontSize: 10,
  fontWeight: '700',
  color: '#2F6648',
},

noConflictBody: {
  marginTop: 2,
  fontSize: 8,
  color: '#607068',
},

confirmButton: {
  marginTop: 14,
  height: 51,
  borderRadius: 14,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#153D30',
},
confirmButtonDisabled: {
  opacity: 0.65,
},

confirmButtonText: {
  fontSize: 11,
  fontWeight: '700',
  color: '#FFFFFF',
},

policyText: {
  marginTop: 7,
  textAlign: 'center',
  fontSize: 8,
  color: '#879088',
},

  bookingSummary: {
    flex: 1,
  },

  summaryLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#879088',
  },

  summaryValue: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '600',
    color: '#26372D',
  },

  reviewButton: {
    minWidth: 145,
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#153D30',
  },

  reviewButtonDisabled: {
    backgroundColor: '#CBD2CD',
  },

  reviewButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  reviewButtonTextDisabled: {
    color: '#FFFFFF',
  },

  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F9F6',
  },

  notFoundTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#14241D',
  },

  backButtonSimple: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 13,
    backgroundColor: '#153D30',
  },

  backButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});