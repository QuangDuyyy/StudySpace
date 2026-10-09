import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon } from './icons/Icon';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { shadows } from '../theme/layout';

type FilterDropdownProps = {
  title: string;
  options: readonly string[];
  selected: string;
  onSelect: (value: string) => void;
};

export function FilterDropdown({
  title,
  options,
  selected,
  onSelect,
}: FilterDropdownProps) {
  return (
    <View style={styles.dropdown}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        <Icon
          name="chevronRight"
          size={13}
          color={colors.textMuted}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator
        nestedScrollEnabled
        style={styles.options}
        contentContainerStyle={styles.optionsContent}
      >
        {options.map((option) => {
          const isSelected = option === selected;

          return (
            <Pressable
              key={option}
              accessibilityRole="menuitem"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelect(option)}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>

              {isSelected && (
                <Icon
                  name="check"
                  size={17}
                  color={colors.primary700}
                />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    width: 320,
    height: 268,
    padding: 7,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.searchBorder,
    backgroundColor: 'rgba(255,255,255,0.98)',
    ...shadows.search,
    overflow: 'hidden',
  },

  header: {
    height: 31,
    paddingHorizontal: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontFamily: fonts.dm700,
    fontSize: 8,
    letterSpacing: 0.64,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },

  options: {
    flex: 1,
  },

  optionsContent: {
    paddingBottom: 4,
  },

  option: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 11,
    borderRadius: 10,
  },

  optionSelected: {
    backgroundColor: '#E6EEE8',
  },

  optionText: {
    fontFamily: fonts.dm600,
    fontSize: 11,
    color: colors.textInput,
  },

  optionTextSelected: {
    color: colors.primary700,
  },
});