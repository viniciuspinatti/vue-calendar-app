import Vue from "vue";

const state = Vue.observable({
  allReminders: [] as Reminder.ReminderAdded[]
});

export const gettersReminder = {
  getAllReminders: (): Reminder.ReminderAdded[] => {
    return state.allReminders;
  }
};

export const mutationsReminder = {
  setAllReminders: (allReminders: Reminder.ReminderAdded[]): void => {
    state.allReminders = allReminders;
  },
  addNewReminder: (newReminder: Reminder.ReminderAdded): void => {
    state.allReminders.push(newReminder);
  },
  updateReminder: (updatedReminder: Reminder.ReminderAdded, position: number): void => {
    state.allReminders[position] = updatedReminder;
  }
};
