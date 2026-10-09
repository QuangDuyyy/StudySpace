import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getRoomImage } from '../data/roomImages';
import type { RootStackParamList } from '../navigation/types';
import { ROOMS } from '../data/rooms';

type ConfirmationRouteProp = RouteProp<
  RootStackParamList,
  'Confirmation'
>;

export function ConfirmationScreen() {
  const navigation = useNavigation();
  const route = useRoute<ConfirmationRouteProp>();
  const insets = useSafeAreaInsets();

  const {
  bookingId,
  roomId,
  date,
  slotId,
} = route.params;
const room = ROOMS.find((item) => item.id === roomId);
const slotTimes: Record<string, string> = {
  '09-10': '9:00 AM – 10:00 AM',
  '10-11': '10:00 AM – 11:00 AM',
  '11-12': '11:00 AM – 12:00 PM',
  '12-01': '12:00 PM – 1:00 PM',
  '01-02': '1:00 PM – 2:00 PM',
  '02-03': '2:00 PM – 3:00 PM',
};
console.log('CONFIRMATION roomId:', roomId);
console.log('CONFIRMATION image:', getRoomImage(roomId));
  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.content,
          {
            paddingTop: Math.max(70, insets.top + 34),
paddingBottom: 30 + insets.bottom,
          },
        ]}
      >
        {/* SUCCESS VISUAL */}
        <View style={styles.successVisual}>
          <View style={styles.successOuter}>
            <View style={styles.successMiddle}>
              <View style={styles.successCircle}>
                <Text style={styles.check}>✓</Text>
              </View>
            </View>
          </View>
        </View>

        {/* HEADER */}
        <Text style={styles.eyebrow}>BOOKING CONFIRMED</Text>

        <Text style={styles.title}>
          Your room is ready
        </Text>

        <Text style={styles.description}>
          Your study room has been successfully booked.
        </Text>

        {/* BOOKING TICKET */}
        <View style={styles.ticket}>
          <Image
  source={getRoomImage(roomId)}
  style={styles.ticketImage}
  contentFit="cover"
  transition={200}
  onLoad={() => {
    console.log('CONFIRMATION IMAGE LOADED');
  }}
  onError={(error) => {
    console.log('CONFIRMATION IMAGE ERROR:', error);
  }}
/>

          <View style={styles.ticketBody}>
            <Text style={styles.roomName}>{room?.name ?? 'Unknown room'}</Text>

<Text style={styles.location}>
  {room?.building} · Floor {room?.floor}
</Text>

            <View style={styles.details}>
              <View style={styles.detailColumn}>
                <Text style={styles.label}>
                  DATE
                </Text>

                <Text style={styles.value}>
  {new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}
</Text>
              </View>

              <View style={styles.detailColumn}>
                <Text style={styles.label}>
                  TIME
                </Text>

                <Text style={styles.value}>
  {slotTimes[slotId] ?? 'Unknown time'}
</Text>
              </View>
            </View>

            <View style={styles.bookingId}>
              <Text style={styles.label}>
                BOOKING ID
              </Text>

              <Text style={styles.bookingIdValue}>
                {bookingId}
              </Text>
            </View>
          </View>
        </View>

        {/* PRIMARY ACTION */}
        <Pressable
  style={({ pressed }) => [
    styles.primaryButton,
    pressed && styles.primaryButtonPressed,
  ]}
  onPress={() =>
    navigation.navigate('MainTabs', {
      screen: 'MyBookings',
    })
  }
>
          <Text style={styles.primaryButtonText}>
            View my bookings
          </Text>
        </Pressable>

        {/* SECONDARY ACTION */}
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.backButtonText}>
            Back to browse
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

  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 22,
    alignItems: 'center',
    backgroundColor: '#F7F9F6',
  },

  /* =========================
     SUCCESS
  ========================= */

  successVisual: {
    width: 100,
    height: 100,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  successOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6F3E9',
  },

  successMiddle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D2E9D8',
  },

  successCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D6A4F',
    shadowColor: '#153D30',
    shadowOpacity: 0.18,
    shadowRadius: 9,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 4,
  },

  check: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: -2,
  },

  /* =========================
     HEADER
  ========================= */

  eyebrow: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#879088',
  },

  title: {
    marginTop: 5,
    fontSize: 27,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.7,
    color: '#14241D',
    textAlign: 'center',
  },

  description: {
    marginTop: 7,
    maxWidth: 310,
    fontSize: 13,
    lineHeight: 19,
    color: '#607068',
    textAlign: 'center',
  },

  /* =========================
     TICKET
  ========================= */

  ticket: {
    width: '100%',
    marginTop: 22,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E6E1',

    shadowColor: '#193126',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 2,
  },

  ticketImage: {
    width: '100%',
    height: 128,
    backgroundColor: '#E9EEEA',
  },

  ticketBody: {
    paddingHorizontal: 17,
    paddingTop: 15,
    paddingBottom: 14,
  },

  roomName: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: '#14241D',
  },

  location: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 15,
    color: '#7D8881',
  },

  details: {
    width: '100%',
    marginTop: 15,
    flexDirection: 'row',
    gap: 12,
  },

  detailColumn: {
    flex: 1,
  },

  label: {
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: '#879088',
  },

  value: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    color: '#26372D',
  },

  bookingId: {
    marginTop: 13,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: '#DFE5E0',
    borderStyle: 'dashed',
  },

  bookingIdValue: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: '#26372D',
  },

  /* =========================
     ACTIONS
  ========================= */

  primaryButton: {
    width: '100%',
    height: 50,
    marginTop: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#153D30',
  },

  primaryButtonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.92,
  },

  primaryButtonText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  backButton: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  backButtonText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    color: '#285D48',
  },
});