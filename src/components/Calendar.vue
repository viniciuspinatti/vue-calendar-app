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
        v-for="day in week"
        :key="day"
        class="calender-columns-container-item day"
        @click="dateClickSelected = day"
      >
        <span class="ml-2">{{ monthDay(day) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import dayjs from "dayjs";
import CurrentDate from "./CurrentDate.vue";
import DateHelper from "@/helpers/DateHelper";

@Component({
  components: {
    CurrentDate
  }
})
export default class Calendar extends Vue {
  currentDate = dayjs().format("YYYY-MM-DD");
  columnsForWeeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  allDays: string[] = [];
  dateClickSelected: string | null = null;

  mounted(): void {
    this.allDays = DateHelper.generateAllMonthDays(this.currentDate);
  }

  /* Computed */
  get allDaysGroupedByWeeks(): string[][] {
    let weeks: string[][] = [];
    for (let i = 0; i < this.allDays.length; i = i + 7) weeks.push(this.allDays.slice(i, i + 7));
    return weeks;
  }

  /* Methods */
  monthDay(pDate: string): string {
    return dayjs(pDate).format("D");
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
