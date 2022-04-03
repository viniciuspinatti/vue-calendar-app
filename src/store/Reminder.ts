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
  }
};
