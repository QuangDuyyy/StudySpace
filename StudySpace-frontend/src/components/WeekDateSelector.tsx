import { memo, useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { colors } from '../theme/colors';
import { shadows } from '../theme/layout';
import { em, fonts } from '../theme/typography';
import { formatFullDate, getWeekDays, isSameDay, type WeekDay } from '../utils/dates';

type DateCellProps = {
  day: WeekDay;
  selected: boolean;
  duration: number;
  onPress: (date: Date) => void;
};

const DateCell = memo(function DateCell({ day, selected, duration, onPress }: DateCellProps) {
  const progress = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: selected ? 1 : 0,
      duration,
      easing: Easing.ease,
      // Background and text colors cannot use the native driver.
      useNativeDriver: false,
    }).start();
  }, [progress, selected, duration]);

  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(21,61,48,0)', colors.primary900],
  });
  const weekdayColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textMuted, colors.dateWeekdaySelected],
  });
  const numberColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.dateNumber, '#FFFFFF'],
  });
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -1] });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={formatFullDate(day.date)}
      accessibilityState={{ selected }}
      onPress={() => onPress(day.date)}
    >
      <Animated.View
        style={[
          styles.cell,
          { backgroundColor, transform: [{ translateY }] },
          selected && shadows.selectedDate,
        ]}
      >
        <Animated.Text style={[styles.weekday, { color: weekdayColor }]}>
          {day.weekday}
        </Animated.Text>
        <Animated.Text style={[styles.number, { color: numberColor }]}>
          {day.dayOfMonth}
        </Animated.Text>
        {day.isToday && <View style={styles.todayDot} />}
      </Animated.View>
    </Pressable>
  );
});

type WeekDateSelectorProps = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
};

export function WeekDateSelector({ selectedDate, onSelectDate }: WeekDateSelectorProps) {
  const reducedMotion = useReducedMotion();
  const days = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

  return (
    <View style={styles.strip}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        {days.map((day) => (
          <DateCell
            key={day.date.toISOString()}
            day={day}
            selected={isSameDay(day.date, selectedDate)}
            duration={reducedMotion ? 1 : 200}
            onPress={onSelectDate}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    marginBottom: 25,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.dateStripBorder,
    backgroundColor: colors.dateStripBackground,
    ...shadows.dateStrip,
  },
  scroll: {
    borderRadius: 17,
    overflow: 'hidden',
  },
  content: {
    gap: 6,
    padding: 7,
  },
  cell: {
    width: 62,
    height: 57,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    borderRadius: 12,
  },
  weekday: {
    fontFamily: fonts.dm700,
    fontSize: 8,
    letterSpacing: em(8, 0.06),
    textTransform: 'uppercase',
  },
  number: {
    fontFamily: fonts.manrope700,
    fontSize: 15,
  },
  todayDot: {
    position: 'absolute',
    bottom: 5,
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.today,
  },
});