<template>
  <div>
    <CurrentDate :currentDate="currentDate" />
    <v-row no-gutters>
      <v-col cols="12" class="text-center title white--text">
        <span style="color: #263238">{{ currentMonthFullName(currentDateSelected) }}</span>
      </v-col>
    </v-row>
    <div class="calender-columns-container">
      <div
        v-for="week in columnsForWeeks"
        :key="week"
        class="body-1 calender-columns-container-item white--text text-center grey darken-4 week"
      >
        {{ week }}
      </div>
    </div>
    <div
      class="calender-columns-container"
      v-for="(week, weekNum) in allDaysGroupedByWeeks"
      :key="weekNum"
    >
      <div
        class="calender-columns-container-item day"
        v-for="day in week"
        :key="day.date"
        @click="clickToAddReminder(day.date)"
      >
        <div style="min-height: 30px; display: flex; align-items: center">
          <v-row no-gutters>
            <v-col cols="9" class="mt-2">
              <span class="ml-2" :class="customClasses(day.date)">{{ monthDay(day.date) }}</span>
            </v-col>
            <v-col cols="2" v-if="day.reminders.length">
              <v-btn
                class="text-right"
                color="red darken-2"
                icon
                @click.stop="deleteAllByDate(day.date)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <div
          v-for="rem in day.reminders"
          :key="rem.id"
          class="pl-5 body-2 white--text day-reminders"
          :style="{ 'background-color': rem.color, 'max-width': '90%' }"
          :title="rem.description"
          @click.stop="clickToEditReminder(rem)"
        >
          {{ rem.description }}
        </div>
      </div>
    </div>
    <v-dialog max-width="750" v-model="showAddReminderDialog">
      <Reminder
        :currentDateSelected="currentDateSelected"
        :reminder="reminder"
        @close="closeDialogAndResetReminder()"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import dayjs from "dayjs";
import CurrentDate from "./CurrentDate.vue";
import DateHelper from "../helpers/DateHelper";
import Reminder from "./Reminder/Reminder.vue";
import CalendarReminder from "../types/CalendarReminder";
import { gettersReminder, mutationsReminder } from "../store/Reminder";

@Component({
  components: {
    CurrentDate,
    Reminder
  }
})
export default class Calendar extends Vue {
  currentDate = dayjs().format("YYYY-MM-DD");
  columnsForWeeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  allDays: CalendarReminder.DayWithReminders[] = [];
  showAddReminderDialog = false;
  currentDateSelected = dayjs().format("YYYY-MM-DD");
  reminder: null | Reminder.Reminder = null;

  mounted(): void {
    this.generateDaysWithReminders();
  }

  /* Computed */
  get allDaysGroupedByWeeks(): CalendarReminder.DayWithReminders[][] {
    let weeks: CalendarReminder.DayWithReminders[][] = [];
    for (let i = 0; i < this.allDays.length; i = i + 7) weeks.push(this.allDays.slice(i, i + 7));
    return weeks;
  }

  get allReminders(): Reminder.Reminder[] {
    return gettersReminder.getAllReminders();
  }

  /* Methods */
  generateDaysWithReminders(): void {
    const allDays = DateHelper.generateAllMonthDays(this.currentDateSelected);
    const allDaysWithReminders: CalendarReminder.DayWithReminders[] = [];

    allDays.forEach((day) => {
      /* Filter reminders for this day in loop.
      Parse and stringify to break any reference that could be affect object directly in reminders list stored */
      const remindersInThisDay: Reminder.Reminder[] = JSON.parse(
        JSON.stringify(this.allReminders.filter((reminder) => reminder.date == day))
      );

      /* Time was saved in 24h format, so in this case can use string localeCompare to sort */
      remindersInThisDay.sort((a, b) => {
        return a.time.localeCompare(b.time);
      });

      allDaysWithReminders.push({
        date: day,
        reminders: remindersInThisDay
      });
    });

    this.allDays = allDaysWithReminders;
  }

  monthDay(pDate: string): string {
    return dayjs(pDate).format("D");
  }

  currentMonthFullName(pDate: string): string {
    return dayjs(pDate).format("MMMM");
  }

  monthD(pDate: string): string {
    return dayjs(pDate).format("D");
  }

  clickToAddReminder(pDate: string): void {
    /* Default values to create new reminder */
    this.reminder = {
      id: null,
      description: "",
      time: "12:00",
      city: null,
      color: "#333333",
      weather: null,
      date: this.currentDateSelected
    };

    this.currentDateSelected = pDate;
    this.showAddReminderDialog = true;
  }

  clickToEditReminder(pReminderToEdit: Reminder.Reminder): void {
    /* Get all values from current reminder */
    this.reminder = {
      id: pReminderToEdit.id,
      description: pReminderToEdit.description,
      time: pReminderToEdit.time,
      city: pReminderToEdit.city,
      color: pReminderToEdit.color,
      weather: pReminderToEdit.weather,
      date: pReminderToEdit.date
    };

    this.showAddReminderDialog = true;
  }

  closeDialogAndResetReminder(): void {
    this.showAddReminderDialog = false;
    this.reminder = null;
  }

  deleteAllByDate(pDate: string): void {
    const allIdsRemindersInDate = this.allReminders
      .filter((rem) => rem.date == pDate)
      .map((rem) => rem.id);
    allIdsRemindersInDate.forEach((id) => mutationsReminder.removeReminder(id as number));
  }

  customClasses(pDate: string): string[] {
    const classes: string[] = [];

    if (this.currentDate == pDate) {
      classes.push("font-weight-bold", "text-decoration-underline");
    }

    if (dayjs(pDate).format("M") == dayjs(this.currentDateSelected).format("M")) {
      classes.push("black--text");
    } else {
      classes.push("text--disabled");
    }
    return classes;
  }

  @Watch("allReminders", { immediate: true, deep: true }) onAllReminders(): void {
    this.generateDaysWithReminders();
  }
}
</script>

<style scoped>
.calender-columns-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.calender-columns-container-item {
  width: 14.28571%;
}
.columns-for-weeks-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: #023535;
}
.week {
  border: none !important;
}
.day {
  border-bottom: 1px solid #ccc;
  height: 100px;
  max-height: 100px;
  cursor: pointer;
  overflow-y: auto;
}
.day-reminders {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
