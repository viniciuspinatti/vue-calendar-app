<template>
  <v-card class="pa-4">
    <v-card-title class="py-0 px-2 mb-1" :style="{ color: color, 'border-radius': '0px' }">
      {{ action == "ADD" ? "Add new reminder for " : "Edit reminder for "
      }}<span class="font-weight-bold ml-1">{{ dayWeekWithMonthAndDayMonth }}</span>
    </v-card-title>
    <v-row>
      <v-col cols="7">
        <v-text-field
          label="Description"
          maxlength="30"
          data-testid="reminder-description"
          v-model="description"
        />
        <v-combobox
          label="Choose a city"
          :items="citiesList"
          v-model="citySelected"
          :item-text="citiesListText"
          data-testid="reminder-city-selected"
        ></v-combobox>
        <p class="body-1 mb-0">Choose a color for reminder</p>
        <v-color-picker
          mode="hexa"
          v-model="color"
          hide-mode-switch
          show-swatches
          hide-canvas
          hide-sliders
          hide-inputs
          data-testid="reminder-color"
          :swatches="[
            ['#B71C1C', '#C62828', '#D32F2F'],
            ['#01579B', '#0277BD', '#0288D1'],
            ['#1B5E20', '#2E7D32', '#388E3C'],
            ['#333333', '#37474F', '#455A64'],
            ['#E65100', '#4A148C', '#1A237E']
          ]"
        ></v-color-picker>
        <p class="body-1 mb-2" style="display: block">Weather Forecast</p>
        <v-row
          v-if="citySelected && !isUpdatingWeather"
          class="pl-3"
          data-testid="reminder-weather"
        >
          <Weather :weather="weather" v-if="hasRangeForShowWeather && weather" />
          <v-alert v-else class="mt-1" icon="mdi-alert" color="orange darken-3" outlined dense
            >Weather forecast not available for this date</v-alert
          >
        </v-row>
      </v-col>
      <v-col cols="5">
        <v-time-picker data-testid="reminder-time" :color="color" v-model="time"></v-time-picker>
      </v-col>
    </v-row>
    <v-card-actions class="pt-4 pb-0 px-0">
      <v-row>
        <v-col cols="12" class="text-right">
          <v-btn outlined color="grey darken-4" class="mr-4" @click="close">Close</v-btn>
          <v-btn outlined color="red darken-2" class="mr-4" v-if="action == 'EDIT'" @click="remove">
            Delete
          </v-btn>
          <v-btn outlined color="light-blue darken-1" @click="addOrUpdateReminder()"
            >{{ action == "ADD" ? "Add" : "Update" }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import DateHelper from "../../helpers/DateHelper";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import cities from "@/const/cities.json";
import { actionsOpenWeather, gettersOpenWeather } from "@/store/OpenWeather";
import OpenWeather from "../../types/OpenWeather";
import Weather from "@/components/Reminder/Weather.vue";
import { gettersReminder, mutationsReminder } from "@/store/Reminder";

@Component({
  components: {
    Weather
  }
})
export default class Reminder extends Vue {
  @Prop({}) currentDateSelected!: string;
  @Prop({}) reminder!: Reminder.Reminder;

  id = 0;
  description = "";
  time = "12:00";
  citiesList: Reminder.City[] = cities;
  citySelected: Reminder.City | null = null;
  hasRangeForShowWeather = false;
  color = "#333333";
  weather: null | OpenWeather.SkyWithTemperature = null;
  isUpdatingWeather = false;
  action: "ADD" | "EDIT" = "ADD";

  /* Computed */
  get dayWeekWithMonthAndDayMonth(): string {
    return DateHelper.dayWeekWithMonthAndDayMonth(this.currentDateSelected);
  }

  get allReminders(): Reminder.Reminder[] {
    return gettersReminder.getAllReminders();
  }

  get skyWeatherForCurrentSystemDateUpTo7Days(): OpenWeather.SkyWithTemperature[] {
    return gettersOpenWeather.getSkyWeatherForCurrentSystemDateUpTo7Days();
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
    this.isUpdatingWeather = true;
    /* Verify if the difference between current systeam and selected date is between 0 and 7. 
    This is needed because open weather with free account just return to me 7 days forward*/
    const diffBetweenSelectedAndCurrentDate = DateHelper.diffBetweenSystemCurrentDate(
      this.currentDateSelected
    );

    const diffIsInRageOfOpenWeatherResponse =
      diffBetweenSelectedAndCurrentDate >= 0 && diffBetweenSelectedAndCurrentDate <= 7;

    if (diffIsInRageOfOpenWeatherResponse) {
      await actionsOpenWeather.fetchOneCall(pCity.lat, pCity.lon);

      this.weather =
        this.skyWeatherForCurrentSystemDateUpTo7Days[diffBetweenSelectedAndCurrentDate];

      this.hasRangeForShowWeather = true;
    } else {
      this.hasRangeForShowWeather = false;
    }
    this.isUpdatingWeather = false;
  }

  addOrUpdateReminder(): void {
    const customReminder = {
      id: this.id,
      description: this.description,
      time: this.time,
      city: this.citySelected,
      color: this.color,
      weather: this.weather,
      date: this.currentDateSelected
    };

    if (this.action == "ADD") {
      mutationsReminder.addNewReminder(customReminder);
    } else {
      const idxReminder = this.allReminders.findIndex((reminder) => reminder.id == this.id);
      if (idxReminder > -1) {
        mutationsReminder.updateReminder(customReminder, idxReminder);
      }
    }

    this.close(true);
  }

  remove(): void {
    mutationsReminder.removeReminder(this.id);
    this.close(true);
  }

  close(pNeededRegenerateReminders = false): void {
    this.$emit("close", pNeededRegenerateReminders);
  }

  @Watch("citySelected", { deep: true }) onCitySelected(
    newCitySelected: Reminder.City | null
  ): void {
    if (newCitySelected) {
      this.updateWeather(newCitySelected);
    }
  }

  @Watch("reminder", { immediate: true, deep: true }) onReminder(
    newReminder: Reminder.Reminder | null
  ): void {
    /* Reminder in calendar will reset to null after close dialog */
    if (newReminder) {
      if (!newReminder.id) {
        this.action = "ADD";

        /* If reminders list is empty, will create the first reminder with 1. Else plus 1 in the last id; */
        this.id = this.allReminders.length
          ? (this.allReminders[this.allReminders.length - 1].id as number) + 1
          : 1;
      } else {
        this.action = "EDIT";

        this.id = newReminder.id;
      }
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
