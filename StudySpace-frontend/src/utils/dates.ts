const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export type WeekDay = {
  date: Date;
  /** "Mon", "Tue", ... (uppercased by the text style). */
  weekday: string;
  dayOfMonth: number;
  isToday: boolean;
};

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** The Monday-to-Sunday week that contains `anchor`. */
export function getWeekDays(anchor: Date, today: Date = new Date()): WeekDay[] {
  const daysSinceMonday = (anchor.getDay() + 6) % 7;

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(
      anchor.getFullYear(),
      anchor.getMonth(),
      anchor.getDate() - daysSinceMonday + index,
    );
    return {
      date,
      weekday: WEEKDAY_NAMES[date.getDay()].slice(0, 3),
      dayOfMonth: date.getDate(),
      isToday: isSameDay(date, today),
    };
  });
}

/** "October 2025" */
export function formatMonthYear(date: Date): string {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

/** "Tuesday, October 14, 2025" */
export function formatFullDate(date: Date): string {
  return `${WEEKDAY_NAMES[date.getDay()]}, ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}