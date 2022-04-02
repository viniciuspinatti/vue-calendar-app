<template>
  <v-card class="pa-4">
    <v-card-title class="pa-0">
      {{
        action == "ADD"
          ? "Add new reminder for " + dayWeekWithMonthAndDayMonth
          : "Edit reminder for " + dayWeekWithMonthAndDayMonth
      }}
    </v-card-title>
    <v-row>
      <v-col cols="7">
        <v-text-field label="Description" maxlength="30" v-model="description" />
      </v-col>
      <v-col cols="5">
        <v-time-picker v-model="time"></v-time-picker>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import DateHelper from "@/helpers/DateHelper";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class Reminder extends Vue {
  @Prop({}) currentDateSelected!: string;
  @Prop({}) action!: "ADD" | "EDIT";

  description = "";
  time = "12:00";

  /* Computed */
  get dayWeekWithMonthAndDayMonth(): string {
    return DateHelper.dayWeekWithMonthAndDayMonth(this.currentDateSelected);
  }
}
</script>

<style scoped></style>
