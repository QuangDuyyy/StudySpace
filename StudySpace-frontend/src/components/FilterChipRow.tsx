import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { FilterChip } from './FilterChip';
import { FilterDropdown } from './FilterDropdown';
import type { FilterState } from '../types/filters';
import { spacing } from '../theme/layout';

type FilterChipRowProps = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
};

type ChipId =
  | 'all'
  | 'building'
  | 'capacity'
  | 'availability'
  | 'facilities';

type ChipConfig = {
  id: ChipId;
  label: string;
  showChevron: boolean;
};

const CHIPS: readonly ChipConfig[] = [
  { id: 'all', label: 'All', showChevron: false },
  { id: 'building', label: 'Building', showChevron: true },
  { id: 'capacity', label: 'Capacity', showChevron: true },
  { id: 'availability', label: 'Availability', showChevron: true },
  { id: 'facilities', label: 'Facilities', showChevron: true },
];

const BUILDING_OPTIONS = [
  'All buildings',
  'Anderson Hall',
  'Baker Hall',
  'Morrison Library',
  'Innovation Center',
  'Dawson Hall',
  'Evans Hall',
  'Franklin Hall',
  'Green Hall',
  'Hamilton Hall',
] as const;

const CAPACITY_OPTIONS = [
  'Any',
  '6+',
  '8+',
  '12+',
] as const;

const AVAILABILITY_OPTIONS = [
  'Any',
  'Available now',
  'Occupied',
] as const;

const FACILITY_OPTIONS = [
  'Any',
  'Display',
  'Whiteboard',
  'Power outlets',
  'Quiet zone',
] as const;




function getChipLabel(
  id: ChipId,
  filters: FilterState,
): string {
  switch (id) {
    case 'building':
      return filters.building === 'All buildings'
        ? 'Building'
        : filters.building;

    case 'capacity':
      return filters.capacity === 'Any'
        ? 'Capacity'
        : filters.capacity;

    case 'availability':
      return filters.availability === 'Any'
        ? 'Availability'
        : filters.availability;

    case 'facilities':
      return filters.facilities === 'Any'
        ? 'Facilities'
        : filters.facilities;

    case 'all':
      return 'All';
  }
}

function isChipSelected(
  id: ChipId,
  filters: FilterState,
): boolean {
  switch (id) {
    case 'all':
      return (
        filters.building === 'All buildings' &&
        filters.capacity === 'Any' &&
        filters.availability === 'Any' &&
        filters.facilities === 'Any'
      );

    case 'building':
      return filters.building !== 'All buildings';

    case 'capacity':
      return filters.capacity !== 'Any';

    case 'availability':
      return filters.availability !== 'Any';

    case 'facilities':
      return filters.facilities !== 'Any';
  }
}

function getSelectedValue(
  id: ChipId,
  filters: FilterState,
): string {
  switch (id) {
    case 'building':
      return filters.building;

    case 'capacity':
      return filters.capacity;

    case 'availability':
      return filters.availability;

    case 'facilities':
      return filters.facilities;

    case 'all':
      return '';
  }
}
function getDropdownTitle(id: ChipId): string {
  switch (id) {
    case 'building':
      return 'Building';

    case 'capacity':
      return 'Capacity';

    case 'availability':
      return 'Availability';

    case 'facilities':
      return 'Facilities';

    case 'all':
      return '';
  }
}
export function FilterChipRow({
  filters,
  onChange,
}: FilterChipRowProps) {
  const [openChip, setOpenChip] = useState<ChipId | null>(null);

 

  const handleChipPress = (id: ChipId) => {
    if (id === 'all') {
      onChange({
        building: 'All buildings',
        capacity: 'Any',
        availability: 'Any',
        facilities: 'Any',
      });

      setOpenChip(null);
      return;
    }

    setOpenChip((current) => (current === id ? null : id));
  };

  const handleSelect = (id: ChipId, value: string) => {
    if (id === 'building') {
      onChange({
        ...filters,
        building: value as FilterState['building'],
      });
    }

    if (id === 'capacity') {
      onChange({
        ...filters,
        capacity: value as FilterState['capacity'],
      });
    }

    if (id === 'availability') {
      onChange({
        ...filters,
        availability: value as FilterState['availability'],
      });
    }

    if (id === 'facilities') {
      onChange({
        ...filters,
        facilities: value as FilterState['facilities'],
      });
    }

    setOpenChip(null);
  };

  const getOptions = (id: ChipId): readonly string[] => {
    switch (id) {
      case 'building':
        return BUILDING_OPTIONS;

      case 'capacity':
        return CAPACITY_OPTIONS;

      case 'availability':
        return AVAILABILITY_OPTIONS;

      case 'facilities':
        return FACILITY_OPTIONS;

      case 'all':
        return [];
    }
  };

const showDropdown =
  openChip !== null &&
  openChip !== 'all';

  return (
    <View
  style={styles.container}
    >
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={styles.scroll}
  contentContainerStyle={styles.content}
>
        {CHIPS.map((chip) => (
          <View key={chip.id}>
            <FilterChip
              label={getChipLabel(chip.id, filters)}
              selected={isChipSelected(chip.id, filters)}
              showChevron={chip.showChevron}
              onPress={() => handleChipPress(chip.id)}
            />
          </View>
        ))}
      </ScrollView>

{showDropdown && (
  <View style={styles.dropdownOverlay}>
    <FilterDropdown
      title={getDropdownTitle(openChip)}
      options={getOptions(openChip)}
      selected={getSelectedValue(openChip, filters)}
      onSelect={(value) => handleSelect(openChip, value)}
    />
  </View>
)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 50,
  },

  scroll: {
    marginHorizontal: -spacing.browseX,
    flexGrow: 0,
  },

  content: {
    gap: spacing.chipGap,
    paddingTop: 11,
    paddingBottom: 22,
    paddingHorizontal: spacing.browseX,
  },

  dropdownOverlay: {
    position: 'absolute',
    top: 63,
    left: '50%',
    width: 320,
    marginLeft: -160,
    zIndex: 100,
    elevation: 20,
  },
});
