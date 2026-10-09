import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Icon } from './icons/Icon';
import { colors } from '../theme/colors';
import { radii, shadows } from '../theme/layout';
import { fonts } from '../theme/typography';

type SearchRowProps = {
  query: string;
  onChangeQuery: (query: string) => void;
  activeFilterCount: number;
  onPressFilter: () => void;
};

export function SearchRow({
  query,
  onChangeQuery,
  activeFilterCount,
  onPressFilter,
}: SearchRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.search}>
        <Icon name="search" size={21} color={colors.searchIcon} />
        <TextInput
          accessibilityLabel="Search rooms"
          placeholder="Search rooms..."
          placeholderTextColor={colors.searchPlaceholder}
          value={query}
          onChangeText={onChangeQuery}
          returnKeyType="search"
          autoCorrect={false}
          style={styles.input}
        />
        {query.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={12}
            onPress={() => onChangeQuery('')}
          >
            <Icon name="x" size={17} color={colors.searchIcon} />
          </Pressable>
        )}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          activeFilterCount > 0 ? `Filters, ${activeFilterCount} active` : 'Filters'
        }
        onPress={onPressFilter}
        style={styles.filterButton}
      >
        <Icon name="sliders" size={21} color="#FFFFFF" />
        {activeFilterCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{activeFilterCount}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  search: {
    flex: 1,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    borderRadius: radii.search,
    borderWidth: 1,
    borderColor: colors.searchBorder,
    backgroundColor: colors.surfaceCard,
    ...shadows.search,
  },
  input: {
    flex: 1,
    height: '100%',
    padding: 0,
    // Input font size is not specified by Figma; 14 matches the screenshots.
    fontFamily: fonts.dm400,
    fontSize: 14,
    color: colors.textInput,
  },
  filterButton: {
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.search,
    backgroundColor: colors.primary850,
    ...shadows.filterButton,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -3,
    width: 19,
    height: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.surfaceOnlineBorder,
    backgroundColor: colors.warning,
  },
  badgeText: {
    fontFamily: fonts.dm700,
    fontSize: 10,
    color: colors.filterBadgeText,
  },
});