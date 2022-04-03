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
  },
  removeReminder: (idReminder: number): void => {
    const idx = state.allReminders.findIndex((reminder) => reminder.id == idReminder);
    if (idx > -1) {
      state.allReminders.splice(idx, 1);
    }
  }
};
