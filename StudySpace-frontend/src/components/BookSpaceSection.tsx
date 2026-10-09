import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from './icons/Icon';
import { WeekDateSelector } from './WeekDateSelector';
import { colors } from '../theme/colors';
import { em, fonts } from '../theme/typography';
import { formatMonthYear } from '../utils/dates';

type BookSpaceSectionProps = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onPressCalendar: () => void;
};

export function BookSpaceSection({
  selectedDate,
  onSelectDate,
  onPressCalendar,
}: BookSpaceSectionProps) {
  const monthYear = formatMonthYear(selectedDate);

  return (
    <View>
      <View style={styles.header}>
        <View>
          <Text style={styles.title} accessibilityRole="header">
            Book a space
          </Text>
          <Text style={styles.subtitle}>Choose a day to see live availability</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Choose a date, ${monthYear}`}
          onPress={onPressCalendar}
          hitSlop={8}
          style={styles.monthControl}
        >
          <Text style={styles.monthText}>{monthYear}</Text>
          <Icon name="calendar" size={15} color={colors.monthControl} />
        </Pressable>
      </View>

      <WeekDateSelector selectedDate={selectedDate} onSelectDate={onSelectDate} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontFamily: fonts.manrope800,
    fontSize: 16,
    letterSpacing: em(16, -0.025),
    color: colors.textMain,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: fonts.dm400,
    fontSize: 10,
    color: colors.textMuted,
  },
  monthControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  monthText: {
    fontFamily: fonts.dm700,
    fontSize: 10,
    color: colors.monthControl,
  },
});