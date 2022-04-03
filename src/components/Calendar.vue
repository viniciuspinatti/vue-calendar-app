<template>
  <div>
    <CurrentDate :currentDate="currentDate" />
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
        <div>
          <span
            class="mt-1 ml-2"
            :style="{ 'text-decoration': day.date == currentDate ? 'underline' : 'none' }"
            :class="day.date == currentDate ? ['font-weight-bold'] : []"
            >{{ monthDay(day.date) }}</span
          >
        </div>
      </div>
    </div>
    <v-dialog max-width="750" v-model="showAddReminderDialog">
      <Reminder
        :currentDateSelected="currentDateSelected"
        :reminder="reminder"
        @close="showAddReminderDialog = false"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import dayjs from "dayjs";
import CurrentDate from "./CurrentDate.vue";
import DateHelper from "@/helpers/DateHelper";
import Reminder from "./Reminder/Reminder.vue";
import CalendarReminder from "@/types/CalendarReminder";
import { gettersReminder } from "@/store/Reminder";

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

  get allReminders(): Reminder.ReminderAdded[] {
    return gettersReminder.getAllReminders();
  }

  /* Methods */
  generateDaysWithReminders(): void {
    const allDays = DateHelper.generateAllMonthDays(this.currentDate);
    const allDaysWithReminders: CalendarReminder.DayWithReminders[] = [];

    allDays.forEach((day) => {
      const remindersInThisDay = this.allReminders.filter((reminder) => reminder.date == day);
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

  clickToAddReminder(pDate: string): void {
    this.reminder = {
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
  border-bottom: 1px solid black;
  height: 100px;
  cursor: pointer;
}
</style>
