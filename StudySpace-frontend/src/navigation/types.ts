import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Browse: undefined;
  MyBookings: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  RoomDetails: { roomId: string };
  Confirmation: {
  bookingId: string;
  roomId: string;
  date: string;
  slotId: string;
};
};

/** Makes useNavigation() and navigate() typed everywhere without per-call generics. */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}