/**
 * Calculates US Federal Holidays dynamically for a given year.
 */

interface Holiday {
  name: string;
  dateStr: string; // YYYY-MM-DD
}

/**
 * Finds the N-th occurrence of a specific weekday in a month.
 * @param year e.g. 2026
 * @param month 0-indexed month (0 = Jan, 11 = Dec)
 * @param dayOfWeek 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 * @param n N-th occurrence (1st, 2nd, 3rd, etc.)
 */
function getNthWeekdayOfMonth(year: number, month: number, dayOfWeek: number, n: number): string {
  const date = new Date(year, month, 1);
  let count = 0;
  while (date.getMonth() === month) {
    if (date.getDay() === dayOfWeek) {
      count++;
      if (count === n) {
        return formatDateKey(year, month, date.getDate());
      }
    }
    date.setDate(date.getDate() + 1);
  }
  return '';
}

/**
 * Finds the last occurrence of a specific weekday in a month.
 */
function getLastWeekdayOfMonth(year: number, month: number, dayOfWeek: number): string {
  const date = new Date(year, month + 1, 0); // Last day of month
  while (date.getMonth() === month) {
    if (date.getDay() === dayOfWeek) {
      return formatDateKey(year, month, date.getDate());
    }
    date.setDate(date.getDate() - 1);
  }
  return '';
}

export function formatDateKey(year: number, month: number, day: number): string {
  const y = year.toString();
  const m = (month + 1).toString().padStart(2, '0');
  const d = day.toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getUSFederalHolidays(year: number): Record<string, string> {
  const holidays: Record<string, string> = {};

  // New Year's Day (Jan 1)
  holidays[formatDateKey(year, 0, 1)] = "New Year's Day";

  // Martin Luther King Jr. Day (3rd Monday in January)
  const mlk = getNthWeekdayOfMonth(year, 0, 1, 3);
  if (mlk) holidays[mlk] = "Martin Luther King Jr. Day";

  // Washington's Birthday / Presidents' Day (3rd Monday in February)
  const presidents = getNthWeekdayOfMonth(year, 1, 1, 3);
  if (presidents) holidays[presidents] = "Presidents' Day";

  // Memorial Day (Last Monday in May)
  const memorial = getLastWeekdayOfMonth(year, 4, 1);
  if (memorial) holidays[memorial] = "Memorial Day";

  // Juneteenth National Independence Day (June 19)
  holidays[formatDateKey(year, 5, 19)] = "Juneteenth";

  // Independence Day (July 4)
  holidays[formatDateKey(year, 6, 4)] = "Independence Day";

  // Labor Day (1st Monday in September)
  const labor = getNthWeekdayOfMonth(year, 8, 1, 1);
  if (labor) holidays[labor] = "Labor Day";

  // Columbus Day (2nd Monday in October)
  const columbus = getNthWeekdayOfMonth(year, 9, 1, 2);
  if (columbus) holidays[columbus] = "Columbus Day";

  // Veterans Day (November 11)
  holidays[formatDateKey(year, 10, 11)] = "Veterans Day";

  // Thanksgiving Day (4th Thursday in November)
  const thanksgiving = getNthWeekdayOfMonth(year, 10, 4, 4);
  if (thanksgiving) holidays[thanksgiving] = "Thanksgiving Day";

  // Christmas Day (December 25)
  holidays[formatDateKey(year, 11, 25)] = "Christmas Day";

  return holidays;
}
