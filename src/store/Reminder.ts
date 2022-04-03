import Vue from "vue";

const state = Vue.observable({
  allReminders: [] as Reminder.Reminder[]
});

export const gettersReminder = {
  getAllReminders: (): Reminder.Reminder[] => {
    return state.allReminders;
  }
};

export const mutationsReminder = {
  setAllReminders: (allReminders: Reminder.Reminder[]): void => {
    state.allReminders = allReminders;
  },
  addNewReminder: (newReminder: Reminder.Reminder): void => {
    state.allReminders.push(newReminder);
  },
  updateReminder: (updatedReminder: Reminder.Reminder, position: number): void => {
    state.allReminders[position] = updatedReminder;
  }
};
