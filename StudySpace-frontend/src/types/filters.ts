import type { Facility } from './room';

export type BuildingFilter =
  | 'All buildings'
  | 'Anderson Hall'
  | 'Baker Hall'
  | 'Morrison Library'
  | 'Innovation Center'
  | 'Dawson Hall'
  | 'Evans Hall'
  | 'Franklin Hall'
  | 'Green Hall'
  | 'Hamilton Hall';

export type CapacityFilter = 'Any' | '6+' | '8+' | '12+';

export type AvailabilityFilter =
  | 'Any'
  | 'Available now'
  | 'Occupied';

export type FacilityFilter = 'Any' | Facility;

export type FilterState = {
  building: BuildingFilter;
  capacity: CapacityFilter;
  availability: AvailabilityFilter;
  facilities: FacilityFilter;
};

export const DEFAULT_FILTERS: FilterState = {
  building: 'All buildings',
  capacity: 'Any',
  availability: 'Any',
  facilities: 'Any',
};