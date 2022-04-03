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
        :key="day"
        @click="clickToAddReminder(day)"
      >
        <span class="ml-2">{{ monthDay(day) }}</span>
      </div>
      <!-- <v-dialog max-width="750" v-for="day in week" :key="day">
        <template v-slot:activator="{ on }">
          <div
            class="calender-columns-container-item day"
            v-on="on"
            @click="clickToAddReminder(day)"
          >
            <span class="ml-2">{{ monthDay(day) }}</span>
          </div>
        </template>
        <Reminder :currentDateSelected="currentDateSelected" :action="'ADD'" />
      </v-dialog> -->
    </div>
    <v-dialog max-width="750" v-model="showAddReminderDialog">
      <Reminder
        :currentDateSelected="currentDateSelected"
        :action="'ADD'"
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
  allDays: string[] = [];
  showAddReminderDialog = false;
  currentDateSelected = dayjs().format("YYYY-MM-DD");
  reminder: null | Reminder.Reminder = null;

  mounted(): void {
    this.allDays = DateHelper.generateAllMonthDays(this.currentDate);
  }

  /* Computed */
  get allDaysGroupedByWeeks(): string[][] {
    let weeks: string[][] = [];
    for (let i = 0; i < this.allDays.length; i = i + 7) weeks.push(this.allDays.slice(i, i + 7));
    return weeks;
  }

  get allReminders(): Reminder.Reminder[] {
    return gettersReminder.getAllReminders();
  }

  /* Methods */
  monthDay(pDate: string): string {
    return dayjs(pDate).format("D");
  }

  clickToAddReminder(pDate: string): void {
    const remindersListSize = this.allReminders.length;

    this.reminder = {
      id: remindersListSize ? this.allReminders[remindersListSize - 1].id + 1 : 1,
      description: "",
      time: "12:00",
      city: null,
      color: "#333333",
      weather: null
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
  /* border-left: 1px solid black; */
  border-bottom: 1px solid black;
  height: 100px;
  cursor: pointer;
}
.day:hover {
  background-color: #29b6f6;
}
</style>
