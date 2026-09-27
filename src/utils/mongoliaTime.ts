/**
 * Utility functions for Mongolian Time Zone (Asia/Ulaanbaatar, UTC+8)
 * Ensures calendar events and date filters are accurately synchronized
 * with Mongolia's standard time.
 */

import { CalendarEvent } from '../types';

export interface MongoliaTimeInfo {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  hour: number;
  minute: number;
  yearMonth: string; // e.g. "2026-09"
  monthName: string; // e.g. "9-р сар"
  dateString: string; // e.g. "2026-09-10"
  academicYear: string; // e.g. "2026-2027"
}

/**
 * Gets the current date & time specifically in the Asia/Ulaanbaatar timezone (UTC+8).
 */
export function getMongoliaTime(date: Date = new Date()): MongoliaTimeInfo {
  // Format to parts in Asia/Ulaanbaatar timezone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ulaanbaatar',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const formattedStr = formatter.format(date); // e.g. "2026-09-10, 15:45"
  const [datePart, timePart] = formattedStr.split(', ');
  const [yearStr, monthStr, dayStr] = datePart.split('-');
  const [hourStr, minuteStr] = (timePart || '00:00').split(':');

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const hour = parseInt(hourStr || '0', 10);
  const minute = parseInt(minuteStr || '0', 10);

  const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
  const monthName = `${month}-р сар`;

  // Academic year in Mongolia starts in September (month >= 8 or 9)
  const academicYear = month >= 8 ? `${year}-${year + 1}` : `${year - 1}-${year}`;

  return {
    year,
    month,
    day,
    hour,
    minute,
    yearMonth,
    monthName,
    dateString: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    academicYear
  };
}

export interface MonthWindowItem {
  code: string; // e.g. "2026-09"
  name: string; // e.g. "9-р сар"
  monthNum: number; // 9
  year: number; // 2026
  isCurrent: boolean;
  label: string; // e.g. "Энэ сар (9-р сар)"
}

/**
 * Returns the active 1-2 months window according to Mongolia time.
 * Defaults to current month + next month (the next 1-2 months period in Mongolia).
 * Also returns previous month code if needed for historical context.
 */
export function getMongoliaTargetMonths(): {
  current: MonthWindowItem;
  next: MonthWindowItem;
  prev: MonthWindowItem;
  windowCodes: string[]; // e.g. ["2026-09", "2026-10"]
  extendedCodes: string[]; // e.g. ["2026-08", "2026-09", "2026-10"]
  academicYear: string;
} {
  const mn = getMongoliaTime();

  // Current month
  const current: MonthWindowItem = {
    code: mn.yearMonth,
    name: mn.monthName,
    monthNum: mn.month,
    year: mn.year,
    isCurrent: true,
    label: `Энэ сар (${mn.monthName})`
  };

  // Next month (+1)
  const nextMonthNum = mn.month === 12 ? 1 : mn.month + 1;
  const nextYear = mn.month === 12 ? mn.year + 1 : mn.year;
  const nextCode = `${nextYear}-${String(nextMonthNum).padStart(2, '0')}`;
  const nextName = `${nextMonthNum}-р сар`;
  const next: MonthWindowItem = {
    code: nextCode,
    name: nextName,
    monthNum: nextMonthNum,
    year: nextYear,
    isCurrent: false,
    label: `Ирэх сар (${nextName})`
  };

  // Previous month (-1)
  const prevMonthNum = mn.month === 1 ? 12 : mn.month - 1;
  const prevYear = mn.month === 1 ? mn.year - 1 : mn.year;
  const prevCode = `${prevYear}-${String(prevMonthNum).padStart(2, '0')}`;
  const prevName = `${prevMonthNum}-р сар`;
  const prev: MonthWindowItem = {
    code: prevCode,
    name: prevName,
    monthNum: prevMonthNum,
    year: prevYear,
    isCurrent: false,
    label: `Өмнөх сар (${prevName})`
  };

  return {
    current,
    next,
    prev,
    windowCodes: [current.code, next.code],
    extendedCodes: [prev.code, current.code, next.code],
    academicYear: mn.academicYear
  };
}

/**
 * Checks whether a calendar event belongs to any of the target Mongolia month codes.
 * Highly robust: handles "YYYY-MM", "MM", and matches inside dateRange strings.
 */
export function isEventInMongoliaMonths(ev: CalendarEvent, targetCodes: string[]): boolean {
  if (!ev) return false;

  for (const code of targetCodes) {
    // 1. Direct match on ev.month (e.g. "2026-09" === "2026-09")
    if (ev.month === code) return true;

    const [yearStr, monthStr] = code.split('-');
    const monthNum = parseInt(monthStr, 10);

    // 2. Event month without year (e.g. "09" or "9")
    if (ev.month === monthStr || ev.month === String(monthNum)) {
      return true;
    }

    // 3. Event month containing the code
    if (ev.month && ev.month.includes(code)) {
      return true;
    }

    // 4. Match inside dateRange (e.g. "2026.09.10 - 09.15" or "2026-09-10")
    if (ev.dateRange) {
      if (
        ev.dateRange.includes(code) ||
        ev.dateRange.includes(`${yearStr}.${monthStr}`) ||
        ev.dateRange.includes(`${yearStr}/${monthStr}`)
      ) {
        return true;
      }
    }

    // 5. Match by month name if year matches or is omitted
    if (ev.monthName && (ev.monthName === `${monthNum}-р сар` || ev.monthName.includes(`${monthNum}-р сар`))) {
      if (ev.month && ev.month.includes('-')) {
        const evYear = ev.month.split('-')[0];
        if (evYear === yearStr) return true;
      } else {
        return true;
      }
    }
  }

  return false;
}

/**
 * Generates month presets for admin and filters covering the current school year
 * based on Mongolia timezone.
 */
export function generateMongoliaMonthPresets(): { code: string; name: string; isCurrent?: boolean }[] {
  const mn = getMongoliaTime();
  // If month is >= 8 (August or later), school year starts this year. Else last year.
  const startYear = mn.month >= 8 ? mn.year : mn.year - 1;

  // Mongolian school calendar order: 9, 10, 11, 12, 1, 2, 3, 4, 5, 6
  const schoolMonths = [
    { month: 9, year: startYear },
    { month: 10, year: startYear },
    { month: 11, year: startYear },
    { month: 12, year: startYear },
    { month: 1, year: startYear + 1 },
    { month: 2, year: startYear + 1 },
    { month: 3, year: startYear + 1 },
    { month: 4, year: startYear + 1 },
    { month: 5, year: startYear + 1 },
    { month: 6, year: startYear + 1 }
  ];

  return schoolMonths.map(({ month, year }) => {
    const code = `${year}-${String(month).padStart(2, '0')}`;
    const isCurrent = code === mn.yearMonth;
    return {
      code,
      name: `${month}-р сар (${year})${isCurrent ? ' • Энэ сар' : ''}`,
      isCurrent
    };
  });
}
