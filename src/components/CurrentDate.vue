<template>
  <v-row no-gutters class="light-blue lighten-1">
    <v-col cols="12" class="text-center title white--text">
      <span style="color: #263238">{{ currentDateFormat }}</span>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DateHelper from "@/helpers/DateHelper";

@Component
export default class CurrentDate extends Vue {
  @Prop() currentDate!: string;

  /* Computed */
  get currentDateFormat(): string {
    return `Today is ${DateHelper.dayWeekWithMonthAndDayMonth(this.currentDate)}`;
  }
}
</script>

<style scoped></style>
