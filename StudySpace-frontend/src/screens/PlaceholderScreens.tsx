import { useState } from 'react';

import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getRoomImage } from '../data/roomImages';
import { ROOMS } from '../data/rooms';
import { colors } from '../theme/colors';
import { spacing } from '../theme/layout';
import { typography } from '../theme/typography';
import type { Booking } from '../api/roomsApi';
import { useBookings } from '../hooks/useBookings';
import { useCancelBooking } from '../hooks/useCancelBooking';
type PlaceholderScreenProps = {
  eyebrow: string;
  title: string;
};

/** Temporary profile screen. Replaced by the real screen later. */
function PlaceholderScreen({
  eyebrow,
  title,
}: PlaceholderScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: Math.max(27, insets.top),
        },
      ]}
    >
      <Text style={typography.eyebrow}>{eyebrow}</Text>
      <Text style={typography.rootTitle}>{title}</Text>
    </View>
  );
}

type BookingView = 'upcoming' | 'previous';

export function MyBookingsScreen() {
  const insets = useSafeAreaInsets();

  const {
    data: bookings = [],
    isLoading: bookingsLoading,
    isError: bookingsError,
  } = useBookings();

  const [view, setView] = useState<BookingView>('upcoming');

  const [showDetails, setShowDetails] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  
const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

const cancelMutation = useCancelBooking();

const handleKeepBooking = () => {
  if (cancelMutation.isPending) return;

  cancelMutation.reset();
  setShowCancelConfirmation(false);
};

const handleConfirmCancel = () => {
  if (!selectedBooking || cancelMutation.isPending) return;

  cancelMutation.mutate(selectedBooking.bookingId, {
    onSuccess: () => {
      setShowCancelConfirmation(false);
      setShowDetails(false);
    },
  });
};


  const sortedBookings = [...bookings].sort(
  (a, b) =>
    new Date(b.createdAt).getTime() -
    new Date(a.createdAt).getTime(),
);

  const upcomingBookings = sortedBookings.filter(
    (booking) =>
      booking.status === 'CONFIRMED' && !booking.completed,
  );
  console.log(
  'SORTED UPCOMING:',
  upcomingBookings.map((booking) => ({
    room: booking.roomName,
    createdAt: booking.createdAt,
    date: booking.date,
    startTime: booking.startTime,
  })),
);

  const previousBookings = sortedBookings.filter(
    (booking) =>
      booking.status === 'CONFIRMED' && booking.completed,
  );
  console.log('MY BOOKINGS TOTAL:', bookings.length);
console.log('MY BOOKINGS UPCOMING:', upcomingBookings.length);
console.log('MY BOOKINGS PREVIOUS:', previousBookings.length);

  return (
    <View
      style={[
        styles.myBookingsScreen,
        {
          paddingTop: Math.max(27, insets.top),
          paddingBottom: 104 + insets.bottom,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <Text style={styles.eyebrow}>YOUR SCHEDULE</Text>

        <Text style={styles.title}>My bookings</Text>

        {/* SEGMENTED CONTROL */}
        <View style={styles.segmentedControl}>
          <Pressable
            style={[
              styles.segment,
              view === 'upcoming' && styles.segmentActive,
            ]}
            onPress={() => setView('upcoming')}
          >
            <Text
              style={[
                styles.segmentText,
                view === 'upcoming' && styles.segmentTextActive,
              ]}
            >
              Upcoming
            </Text>

            {view === 'upcoming' && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>
                  {upcomingBookings.length}
                </Text>
              </View>
            )}
          </Pressable>

          <Pressable
            style={[
              styles.segment,
              view === 'previous' && styles.segmentActive,
            ]}
            onPress={() => setView('previous')}
          >
            <Text
              style={[
                styles.segmentText,
                view === 'previous' && styles.segmentTextActive,
              ]}
            >
              Previous
            </Text>
          </Pressable>
        </View>

        {/* LOADING */}
        {bookingsLoading && (
          <View style={styles.emptyUpcoming}>
            <Text style={styles.emptyDescription}>
              Loading bookings...
            </Text>
          </View>
        )}

        {/* ERROR */}
        {!bookingsLoading && bookingsError && (
          <View style={styles.emptyUpcoming}>
            <Text style={styles.emptyTitle}>
              Unable to load bookings
            </Text>

            <Text style={styles.emptyDescription}>
              Please check your connection and try again.
            </Text>
          </View>
        )}

        {/* CONTENT */}
    
        {!bookingsLoading && !bookingsError && (
          view === 'upcoming' ? (
            upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <UpcomingBooking
                  key={booking.bookingId}
                  booking={booking}
                  onViewDetails={() => {
                    setSelectedBooking(booking);
                    setShowDetails(true);
                  }}
                  onCancel={() => {
                    setSelectedBooking(booking);
                    setShowCancelConfirmation(true);
                  }}
                />
              ))
            ) : (
              <EmptyUpcoming />
            )
          ) : (
            <PreviousBookings bookings={previousBookings} />
          )
        )}

        <BookingDetailsSheet
          visible={showDetails}
          booking={selectedBooking}
          onClose={() => setShowDetails(false)}
          onCancel={() => {
            setShowDetails(false);
            setShowCancelConfirmation(true);
          }}
        />

        
<CancelConfirmation
  visible={showCancelConfirmation}
  roomName={selectedBooking?.roomName}
  isCancelling={cancelMutation.isPending}
  errorMessage={cancelMutation.error?.message ?? null}
  onKeep={handleKeepBooking}
  onCancel={handleConfirmCancel}
/>

      </ScrollView>
    </View>
  );
}
function formatTime(time: string): string {
  const [hourString, minute] = time.split(':');

  const hour = Number(hourString);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute} ${period}`;
}
function UpcomingBooking({
  booking,
  onViewDetails,
  onCancel,
}: {
  booking: Booking;
  onViewDetails: () => void;
  onCancel: () => void;
}) {
  const bookingDate = new Date(booking.date);

  const timeText = `${formatTime(
    booking.startTime,
  )}–${formatTime(booking.endTime)}`;

  return (
    <View style={styles.bookingList}>
      <Pressable
        style={({ pressed }) => [
          styles.bookingCard,
          pressed && styles.bookingCardPressed,
        ]}
      >
        {/* IMAGE */}
        <Image
          source={getRoomImage(booking.roomId)}
          style={styles.bookingImage}
          contentFit="cover"
        />

        {/* DATE TILE */}
        <View style={styles.dateTile}>
          <Text style={styles.dateDay}>
            {bookingDate.getDate()}
          </Text>

          <Text style={styles.dateMonth}>
            {bookingDate
              .toLocaleDateString('en-US', {
                month: 'short',
              })
              .toUpperCase()}
          </Text>
        </View>

        {/* CARD BODY */}
        <View style={styles.bookingBody}>
          <View style={styles.bookingHeaderRow}>
            <View>
              <Text style={styles.statusText}>
                {booking.status === 'CONFIRMED'
                  ? 'CONFIRMED'
                  : booking.status}
              </Text>

              <Text style={styles.relativeText}>
                {booking.completed ? 'Completed' : 'Upcoming'}
              </Text>
            </View>
          </View>

          <Text style={styles.bookingRoomName}>
            {booking.roomName}
          </Text>

          <View style={styles.metadataRow}>
            <Text style={styles.metadataIcon}>⌖</Text>

            <Text style={styles.metadataText}>
              {booking.location}
            </Text>
          </View>

          <View style={styles.metadataRow}>
            <Text style={styles.metadataIcon}>◷</Text>

            <Text style={styles.metadataText}>
              {bookingDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}{' '}
              · {timeText}
            </Text>
          </View>

          {/* ACTIONS */}
          <View style={styles.actions}>
            <Pressable
              style={styles.viewDetailsButton}
              onPress={onViewDetails}
            >
              <Text style={styles.viewDetailsText}>
                View Details
              </Text>
            </Pressable>

            {!booking.completed && (
              <Pressable
                style={styles.cancelButton}
                onPress={onCancel}
              >
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    </View>
  );
}
function BookingDetailsSheet({
  visible,
  booking,
  onClose,
  onCancel,
}: {
  visible: boolean;
  booking: Booking | null;
  onClose: () => void;
  onCancel: () => void;
}) {
  const room = booking
    ? ROOMS.find((item) => item.id === booking.roomId)
    : undefined;

  const bookingDate = booking
    ? new Date(booking.date)
    : null;

  const slotTimes: Record<number, string> = {
  1: '9:00 AM – 10:00 AM',
  2: '10:00 AM – 11:00 AM',
  3: '11:00 AM – 12:00 PM',
  4: '12:00 PM – 1:00 PM',
  5: '1:00 PM – 2:00 PM',
  6: '2:00 PM – 3:00 PM',
};

  const timeText = booking
    ? slotTimes[booking.slotId] ?? 'Unknown time'
    : 'Unknown time';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.detailsOverlay}>
        <Pressable
          style={styles.detailsBackdrop}
          onPress={onClose}
        />

        <View style={styles.detailsSheet}>
          {/* HEADER */}
          <View style={styles.detailsHeader}>
            <View>
              <Text style={styles.detailsEyebrow}>
                BOOKING DETAILS
              </Text>

            <Text style={styles.detailsTitle}>
  {room?.name ?? 'Unknown room'}
</Text>
            </View>

            <Pressable
              style={styles.detailsClose}
              onPress={onClose}
            >
              <Text style={styles.detailsCloseText}>
                ×
              </Text>
            </Pressable>
          </View>

          {/* IMAGE */}
          <Image
            source={booking ? getRoomImage(booking.roomId) : undefined}
            style={styles.detailsImage}
            contentFit="cover"
          />

          {/* STATUS */}
          <View style={styles.detailsStatusRow}>
            <View style={styles.detailsCheck}>
              <Text style={styles.detailsCheckText}>
                ✓
              </Text>
            </View>

            <View>
              <Text style={styles.detailsStatus}>
                Confirmed
              </Text>

              <Text style={styles.detailsBookingId}>
                <Text style={styles.detailsBookingId}>
  Booking ID · {booking?.bookingId ?? 'Unknown'}
</Text>
              </Text>
            </View>
          </View>

          {/* DETAILS */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailsCell}>
              <Text style={styles.detailsLabel}>
                DATE
              </Text>

              <Text style={styles.detailsValue}>
                <Text style={styles.detailsValue}>
  {bookingDate
    ? bookingDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown date'}
</Text>
              </Text>
            </View>

            <View style={styles.detailsCell}>
              <Text style={styles.detailsLabel}>
                TIME
              </Text>

              <Text style={styles.detailsValue}>
                <Text style={styles.detailsValue}>
  {timeText}
</Text>
              </Text>
            </View>

            <View
              style={[
                styles.detailsCell,
                styles.detailsLocationCell,
              ]}
            >
              <Text style={styles.detailsLabel}>
                LOCATION
              </Text>

              <Text style={styles.detailsValue}>
                <Text style={styles.detailsValue}>
  {room
    ? `${room.building} · Floor ${room.floor}`
    : 'Unknown location'}
</Text>
              </Text>
            </View>
          </View>

          {/* CANCEL — UI ONLY FOR NOW */}
          <Pressable
            style={styles.detailsCancelButton}
            onPress={onCancel}
          >
            <Text style={styles.detailsCancelText}>
              Cancel booking
            </Text>
          </Pressable>

          <Text style={styles.detailsPolicy}>
            Cancellation releases this room for other students.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

function CancelConfirmation({
  visible,
  roomName,
  isCancelling,
  errorMessage,
  onKeep,
  onCancel,
}: {
  visible: boolean;
  roomName: string | undefined;
  isCancelling: boolean;
  errorMessage: string | null;
  onKeep: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onKeep}
    >
      <View style={styles.cancelOverlay}>
        <Pressable
          style={styles.cancelBackdrop}
          onPress={onKeep}
          disabled={isCancelling}
        />

        <View style={styles.cancelSheet}>
          <View style={styles.warningCircle}>
            <Text style={styles.warningIcon}>×</Text>
          </View>

          <Text style={styles.cancelTitle}>
            Cancel this booking?
          </Text>

          <Text style={styles.cancelDescription}>
            {`Are you sure you want to cancel your booking for ${
              roomName ?? 'this room'
            }? This room will become available to other students.`}
          </Text>

          {errorMessage !== null && (
            <Text style={styles.cancelError}>
              {errorMessage}
            </Text>
          )}

          <View style={styles.cancelActions}>
            <Pressable
              style={styles.keepButton}
              onPress={onKeep}
              disabled={isCancelling}
            >
              <Text style={styles.keepButtonText}>
                Keep booking
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.confirmCancelButton,
                isCancelling &&
                  styles.confirmCancelButtonDisabled,
              ]}
              onPress={onCancel}
              disabled={isCancelling}
            >
              <Text style={styles.confirmCancelText}>
                {isCancelling
                  ? 'Cancelling…'
                  : 'Cancel booking'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function EmptyUpcoming() {
  return (
    <View style={styles.emptyUpcoming}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>□</Text>
      </View>

      <Text style={styles.emptyTitle}>
        No upcoming bookings
      </Text>

      <Text style={styles.emptyDescription}>
        You don't have any upcoming room bookings.
      </Text>

      <Pressable style={styles.emptyBrowseButton}>
        <Text style={styles.emptyBrowseText}>
          Browse available rooms
        </Text>
      </Pressable>
    </View>
  );
}

function PreviousBookings({
  bookings,
}: {
  bookings: readonly Booking[];
}) {
  return (
    <View style={styles.previousList}>
      {bookings.length === 0 ? (
        <View style={styles.emptyUpcoming}>
          <Text style={styles.emptyTitle}>
            No previous bookings
          </Text>

          <Text style={styles.emptyDescription}>
            Your completed bookings will appear here.
          </Text>
        </View>
      ) : (
        bookings.map((booking) => {
          const bookingDate = new Date(booking.date);

          const timeText = `${formatTime(
            booking.startTime,
          )}–${formatTime(booking.endTime)}`;

          return (
            <PreviousRow
              key={booking.bookingId}
              room={booking.roomName}
              date={`${bookingDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })} · ${timeText}`}
            />
          );
        })
      )}

      {bookings.length > 0 && (
        <View style={styles.caughtUp}>
          <Text style={styles.caughtUpText}>
            You’re all caught up
          </Text>
        </View>
      )}
    </View>
  );
}

type PreviousRowProps = {
  room: string;
  date: string;
};

function PreviousRow({
  room,
  date,
}: PreviousRowProps) {
  return (
    <View style={styles.previousRow}>
      <View style={styles.previousIcon}>
        <Text style={styles.previousIconText}>⌂</Text>
      </View>

      <View style={styles.previousContent}>
        <Text style={styles.previousRoom}>
          {room}
        </Text>

        <Text style={styles.previousDate}>
          {date}
        </Text>

        <Text style={styles.previousStatus}>
          Completed
        </Text>
      </View>
    </View>
  );
}

export function ProfileScreen() {
  return (
    <PlaceholderScreen
      eyebrow="Account"
      title="Profile"
    />
  );
}

const styles = StyleSheet.create({
  /* =========================
     MY BOOKINGS
  ========================= */

  myBookingsScreen: {
    flex: 1,
    backgroundColor: '#F8FAF7',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  eyebrow: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#879088',
  },

  title: {
    marginTop: 4,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: '#14241D',
  },

  /* =========================
     SEGMENTED CONTROL
  ========================= */

  segmentedControl: {
    width: '100%',
    height: 49,
    marginTop: 22,
    padding: 5,
    flexDirection: 'row',
    borderRadius: 15,
    backgroundColor: '#EAEEEA',
  },

  segment: {
    flex: 1,
    height: 39,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  segmentActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#2A3E32',
    shadowOpacity: 0.09,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },

  segmentText: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '700',
    color: '#818B84',
  },

  segmentTextActive: {
    color: '#274B3A',
  },

  countBadge: {
    width: 18,
    height: 18,
    marginLeft: 4,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E4EDE6',
  },

  countText: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '700',
    color: '#274B3A',
  },

  /* =========================
     UPCOMING
  ========================= */

  bookingList: {
    marginTop: 19,
    gap: 14,
  },

  bookingCard: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E6E1',

    shadowColor: '#23382B',
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 10,
    },

    elevation: 2,
  },

  bookingCardPressed: {
    transform: [{ scale: 0.985 }],
  },

  bookingImage: {
    width: '100%',
    height: 132,
    backgroundColor: '#E9EEEA',
  },

  dateTile: {
    position: 'absolute',
    top: 11,
    left: 11,
    width: 45,
    height: 49,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.94)',

    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  dateDay: {
    fontSize: 18,
    lineHeight: 21,
    fontWeight: '800',
    color: '#14241D',
  },

  dateMonth: {
    marginTop: 1,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: '#738077',
  },

  bookingBody: {
    paddingHorizontal: 15,
    paddingTop: 14,
    paddingBottom: 15,
  },

  bookingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statusText: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '700',
    color: '#2F6648',
  },

  relativeText: {
    marginTop: 2,
    fontSize: 9,
    lineHeight: 11,
    color: '#858F88',
  },

  bookingRoomName: {
    marginTop: 6,
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '800',
    color: '#14241D',
  },

  metadataRow: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  metadataIcon: {
    width: 15,
    fontSize: 13,
    lineHeight: 15,
    textAlign: 'center',
    color: '#7F8A82',
  },

  metadataText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 14,
    color: '#7F8A82',
  },

  actions: {
    marginTop: 13,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#EDF0ED',
  },

  viewDetailsButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: '#153D30',
  },

  viewDetailsText: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  cancelButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: '#F8ECE9',
  },

  cancelText: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
    color: '#A15442',
  },

  /* =========================
     PREVIOUS
  ========================= */
emptyUpcoming: {
  marginTop: 19,
  paddingHorizontal: 25,
  paddingVertical: 45,
  alignItems: 'center',
},

emptyIcon: {
  width: 60,
  height: 60,
  borderRadius: 19,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#E8EFE9',
},

emptyIconText: {
  fontSize: 28,
  color: '#738077',
},

emptyTitle: {
  marginTop: 15,
  fontSize: 17,
  lineHeight: 21,
  fontWeight: '800',
  color: '#14241D',
},

emptyDescription: {
  marginTop: 6,
  maxWidth: 250,
  fontSize: 11,
  lineHeight: 17,
  color: '#858F88',
  textAlign: 'center',
},

emptyBrowseButton: {
  marginTop: 18,
  paddingHorizontal: 16,
  paddingVertical: 11,
  borderRadius: 10,
  backgroundColor: '#153D30',
},

emptyBrowseText: {
  fontSize: 10,
  fontWeight: '700',
  color: '#FFFFFF',
},

  previousList: {
    marginTop: 20,
  },

  previousRow: {
    minHeight: 72,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E8E4',
  },

  previousIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBEFEB',
  },

  previousIconText: {
    fontSize: 18,
    color: '#738077',
  },

  previousContent: {
    flex: 1,
  },

  previousRoom: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '700',
    color: '#26372D',
  },

  previousDate: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 14,
    color: '#8B948E',
  },

  previousStatus: {
    marginTop: 2,
    fontSize: 9,
    lineHeight: 12,
    color: '#869088',
  },

  caughtUp: {
    marginTop: 28,
    alignItems: 'center',
  },

  caughtUpText: {
    fontSize: 11,
    lineHeight: 14,
    color: '#97A099',
  },
    screen: {
    flex: 1,
    paddingHorizontal: spacing.rootX,
    backgroundColor: colors.surfaceApp,
  },

  detailsOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(11,25,17,0.48)',
  },

  detailsBackdrop: {
...StyleSheet.absoluteFill,
  },

  detailsSheet: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#FBFCFA',
  },

  detailsHeader: {
    minHeight: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  detailsEyebrow: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: '#879088',
  },

  detailsTitle: {
    marginTop: 2,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    color: '#14241D',
  },

  detailsClose: {
    width: 35,
    height: 35,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF1EE',
  },

  detailsCloseText: {
    fontSize: 24,
    color: '#526158',
  },

  detailsImage: {
    width: '100%',
    height: 120,
    marginTop: 15,
    borderRadius: 15,
    backgroundColor: '#E9EEEA',
  },

  detailsStatusRow: {
    marginTop: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  detailsCheck: {
    width: 31,
    height: 31,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2EFE6',
  },

  detailsCheckText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#347051',
  },

  detailsStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2F6648',
  },

  detailsBookingId: {
    marginTop: 2,
    fontSize: 8,
    color: '#8A948D',
  },

  detailsGrid: {
    marginTop: 13,
    padding: 13,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E1E6E1',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  detailsCell: {
    width: '50%',
    minHeight: 57,
    paddingRight: 8,
  },

  detailsLocationCell: {
    width: '100%',
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EDF0ED',
  },

  detailsLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#879088',
  },

  detailsValue: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '600',
    color: '#26372D',
  },

  detailsCancelButton: {
    width: '100%',
    height: 46,
    marginTop: 14,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EAD9D5',
    backgroundColor: '#FFFAFA',
  },

  detailsCancelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A35544',
  },

    detailsPolicy: {
    marginTop: 7,
    fontSize: 8,
    color: '#8A948D',
    textAlign: 'center',
  },

  cancelOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(11,25,17,0.48)',
  },

  cancelBackdrop: {
  ...StyleSheet.absoluteFill,
  },

  cancelSheet: {
    width: '100%',
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 24,
    alignItems: 'center',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#FBFCFA',
  },

  warningCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8E9E5',
  },

  warningIcon: {
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '600',
    color: '#A65847',
  },

  cancelTitle: {
    marginTop: 14,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    color: '#14241D',
    textAlign: 'center',
  },

  cancelDescription: {
    maxWidth: 330,
    marginTop: 7,
    fontSize: 11,
    lineHeight: 17,
    color: '#748078',
    textAlign: 'center',
  },

  cancelActions: {
    width: '100%',
    marginTop: 20,
    flexDirection: 'row',
    gap: 9,
  },

  keepButton: {
    flex: 1,
    height: 47,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DFE5E0',
    backgroundColor: '#FFFFFF',
  },

  keepButtonText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#405249',
  },

  confirmCancelButton: {
    flex: 1,
    height: 47,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EAD9D5',
    backgroundColor: '#A75948',
  },

  
confirmCancelText: {
  fontSize: 10,
  fontWeight: '700',
  color: '#FFFFFF',
},

confirmCancelButtonDisabled: {
  opacity: 0.6,
},

cancelError: {
  maxWidth: 330,
  marginTop: 12,
  fontSize: 10,
  lineHeight: 15,
  fontWeight: '600',
  color: '#A65847',
  textAlign: 'center',
},
});


