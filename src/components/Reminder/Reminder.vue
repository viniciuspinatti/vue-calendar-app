<template>
  <v-card class="pa-4">
    <v-card-title class="pa-0">
      {{ action == "ADD" ? "Add new reminder for " : "Edit reminder for "
      }}<span class="font-weight-bold ml-1">{{ dayWeekWithMonthAndDayMonth }}</span>
    </v-card-title>
    <v-row>
      <v-col cols="7">
        <v-text-field label="Description" maxlength="30" v-model="description" />
        <v-combobox
          label="Choose a city"
          :items="citiesList"
          v-model="citySelected"
          :item-text="citiesListText"
        ></v-combobox>
        <span class="body-1">Choose a color for reminder</span>
        <v-color-picker
          mode="hexa"
          v-model="color"
          hide-mode-switch
          show-swatches
          hide-canvas
          hide-sliders
          hide-inputs
          :swatches="[
            ['#B71C1C', '#C62828', '#D32F2F'],
            ['#01579B', '#0277BD', '#0288D1'],
            ['#1B5E20', '#2E7D32', '#388E3C'],
            ['#333333', '#37474F', '#455A64'],
            ['#E65100', '#4A148C', '#1A237E']
          ]"
        ></v-color-picker>
      </v-col>
      <v-col cols="5">
        <v-time-picker color="light-blue darken-1" v-model="time"></v-time-picker>
      </v-col>
    </v-row>
    <v-card-actions class="pt-4 pb-0 px-0">
      <v-row>
        <v-col cols="12" class="text-right">
          <v-btn outlined color="grey darken-4" class="mr-4" @click="close">Close</v-btn>
          <v-btn outlined color="light-blue darken-1">Save</v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import DateHelper from "@/helpers/DateHelper";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import cities from "@/const/cities.json";
import { actionsOpenWeather } from "@/store/OpenWeather";
import OpenWeather from "@/types/OpenWeather";

@Component({})
export default class Reminder extends Vue {
  @Prop({}) currentDateSelected!: string;
  @Prop({}) action!: "ADD" | "EDIT";
  @Prop({}) reminder!: Reminder.Reminder;

  id = 0;
  description = "";
  time = "12:00";
  citiesList: Reminder.City[] = cities;
  citySelected: Reminder.City | null = null;
  hasRangeForShowWeather = false;
  color = "#333333";
  weather: null | OpenWeather.SkyWithTemperature = null;

  /* Computed */
  get dayWeekWithMonthAndDayMonth(): string {
    return DateHelper.dayWeekWithMonthAndDayMonth(this.currentDateSelected);
  }

  /* Methods */
  citiesListText(city: {
    name: string;
    stateCode: string;
    country: string;
    lat: number;
    lon: number;
  }): string {
    return `${city.name}, ${city.stateCode} - ${city.country}`;
  }

  async updateWeather(pCity: Reminder.City): Promise<void> {
    /* Verify if the difference between current  */
    const diffBetweenSelectedAndCurrentDate = DateHelper.diffBetweenSystemCurrentDate(
      this.currentDateSelected
    );
    const diffIsInRageOfOpenWeatherResponse =
      diffBetweenSelectedAndCurrentDate >= 0 && diffBetweenSelectedAndCurrentDate <= 7;

    if (diffIsInRageOfOpenWeatherResponse) {
      await actionsOpenWeather.fetchOneCall(pCity.lat, pCity.lon);

      this.hasRangeForShowWeather = true;
    } else {
      this.hasRangeForShowWeather = false;
    }
  }

  close(): void {
    this.$emit("close");
  }

  @Watch("citySelected", { deep: true }) onCitySelected(
    newCitySelected: Reminder.City | null
  ): void {
    if (newCitySelected) {
      this.updateWeather(newCitySelected);
    }
  }

  @Watch("reminder", { immediate: true, deep: true }) onReminder(
    newReminder: Reminder.Reminder
  ): void {
    if (this.action == "ADD") {
      this.id = newReminder.id;
      this.description = newReminder.description;
      this.time = newReminder.time;
      this.citySelected = newReminder.city;
      this.color = newReminder.color;
      this.weather = newReminder.weather;
    }
  }
}
</script>

<style scoped></style>
