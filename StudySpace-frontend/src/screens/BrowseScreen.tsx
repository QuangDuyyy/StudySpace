import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItemInfo } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookSpaceSection } from '../components/BookSpaceSection';
import { BrowseHeader } from '../components/BrowseHeader';
import { FilterChipRow } from '../components/FilterChipRow';
import { NoResults } from '../components/NoResults';
import { RoomCard } from '../components/RoomCard';
import { RoomListHeader } from '../components/RoomListHeader';
import { RoomListSkeleton } from '../components/RoomListSkeleton';
import { RoomListError } from '../components/RoomListError';
import { SearchRow } from '../components/SearchRow';
import { useRooms } from '../hooks/useRooms';
import { colors } from '../theme/colors';
import { spacing } from '../theme/layout';
import type { Room } from '../types/room';
import { searchRooms } from '../utils/rooms';
import type { FilterState } from '../types/filters';
import { DEFAULT_FILTERS } from '../types/filters';
import { filterRooms } from '../utils/filters';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useBookingStore } from '../store/bookingStore';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type {
  MainTabParamList,
  RootStackParamList,
} from '../navigation/types';
const TOP_GRADIENT_HEIGHT = 330;
const NO_ROOMS: readonly Room[] = [];

function RoomSeparator() {
  return <View style={styles.separator} />;
}

const keyExtractor = (room: Room) => room.id;

export function BrowseScreen() {
  const navigation =
  useNavigation<NativeStackNavigationProp<MainTabParamList>>();

const rootNavigation =
  navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
  

  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

const selectedDate = useBookingStore((state) => state.selectedDate);
const setSelectedDate = useBookingStore(
  (state) => state.setSelectedDate,
);

const {
  data: rooms = [],
  isLoading: roomsLoading,
  isError: roomsError,
  refetch: refetchRooms,
} = useRooms(selectedDate);



  const visibleRooms = useMemo(() => {
  const searchedRooms = searchRooms(rooms, query);

  return filterRooms(searchedRooms, filters);
}, [rooms, query, filters]);

const activeFilterCount = useMemo(() => {
  let count = 0;

  if (filters.building !== 'All buildings') count += 1;
  if (filters.capacity !== 'Any') count += 1;
  if (filters.availability !== 'Any') count += 1;
  if (filters.facilities !== 'Any') count += 1;

  return count;
}, [filters]);

  // Room Details is registered in Step 5; until then a tap does nothing.
const handleRoomPress = useCallback(
  (roomId: string) => {
    rootNavigation?.navigate('RoomDetails', {
      roomId,
    });
  },
  [rootNavigation],
);

  const renderRoom = useCallback(
    ({ item }: ListRenderItemInfo<Room>) => <RoomCard room={item} onPress={handleRoomPress} />,
    [handleRoomPress],
  );

  // Built as an element (not an inline component) so the TextInput keeps focus while typing.
  const listHeader = (
    <View>
      <BrowseHeader />
      <SearchRow
        query={query}
        onChangeQuery={setQuery}
        activeFilterCount={activeFilterCount}
        onPressFilter={() => undefined}
      />
      <FilterChipRow
  filters={filters}
  onChange={setFilters}
/>
      <BookSpaceSection
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onPressCalendar={() => undefined}
      />
      <RoomListHeader count={visibleRooms.length} />
    </View>
  );

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={[colors.surfaceBrowseTop, colors.surfaceApp]}
        style={styles.topGradient}
      />
      <FlatList
        data={roomsLoading ? NO_ROOMS : visibleRooms}
        keyExtractor={keyExtractor}
        renderItem={renderRoom}
        ItemSeparatorComponent={RoomSeparator}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
  roomsLoading ? (
    <RoomListSkeleton />
  ) : roomsError ? (
    <RoomListError onRetry={() => refetchRooms()} />
  ) : (
    <NoResults onClear={() => setQuery('')} />
  )
}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        initialNumToRender={3}
        windowSize={7}
        contentContainerStyle={{
  paddingTop: Math.max(58, insets.top + 18),
  paddingHorizontal: spacing.browseX,
  paddingBottom: spacing.rootBottom + insets.bottom,
}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surfaceApp,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: TOP_GRADIENT_HEIGHT,
  },
  separator: {
    height: spacing.roomListGap,
  },
});