namespace CalendarReminder {
  type DayWithReminders = {
    date: string;
    reminders: Reminder.Reminder[];
  };
}
export = CalendarReminder;
export as namespace CalendarReminder;
