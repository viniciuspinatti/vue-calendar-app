import dayjs from "dayjs";

export default class DateHelper {
  static _isoMask = "YYYY-MM-DD";

  static generateAllMonthDays(pDate: string): string[] {
    /* We found the year-month of the date parameter */
    const dayWeekOfFirstMonthDay = dayjs(dayjs(pDate).format("YYYY-MM") + "-01").day();
    const daysInCurrentMonth = dayjs(pDate).daysInMonth();

    let maxDaysShowCalendar = 0;

    /* If the month first day is on Saturday, we need plus one week to show in calendar.
    If the month first day is on Friday and the month has 31 days, we do the same.
    Else we need just 5 weeks (5 * 7 = 35) */
    if (dayWeekOfFirstMonthDay == 6 || (dayWeekOfFirstMonthDay == 5 && daysInCurrentMonth == 31)) {
      maxDaysShowCalendar = 42;
    } else {
      maxDaysShowCalendar = 35;
    }

    /* Discover before month days to do show the final days if current month starts in a middle of week */
    const beforeMonth = dayjs(pDate).subtract(1, "month");
    const daysInBeforeMonth = beforeMonth.daysInMonth();

    /* Push all days in format YYYY-MM-DD to this array */
    const allDays: string[] = [];

    /* First we add the last days of before month */
    for (let i = 0; i < dayWeekOfFirstMonthDay; i++) {
      allDays.unshift(
        dayjs(`${dayjs(beforeMonth).format("YYYY-MM")}-${daysInBeforeMonth - i}`).format(
          this._isoMask
        )
      );
    }

    /* Second we add the days of current month */
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      allDays.push(dayjs(`${dayjs(pDate).format("YYYY-MM")}-${i}`).format(this._isoMask));
    }

    const nextMonth = dayjs(pDate).add(1, "month");

    /* For last we add the days of next month */
    let dayNextMonth = 1;
    for (let i = allDays.length; i < maxDaysShowCalendar; i++) {
      allDays.push(
        dayjs(`${dayjs(nextMonth).format("YYYY-MM")}-${dayNextMonth}`).format(this._isoMask)
      );
      dayNextMonth++;
    }

    return allDays;
  }

  static dayWeekWithMonthAndDayMonth(pDate: string): string {
    return `${dayjs(pDate).format("dddd")}, ${dayjs(pDate).format("MMM")} ${dayjs(pDate).format(
      "D"
    )}`;
  }

  static diffBetweenSystemCurrentDate(pDate: string): number {
    return dayjs().diff(pDate, "day");
  }
}
