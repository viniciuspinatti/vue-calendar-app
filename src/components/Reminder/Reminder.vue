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
      </v-col>
      <v-col cols="5">
        <v-time-picker color="light-blue darken-1" v-model="time"></v-time-picker>
      </v-col>
    </v-row>
    <v-card-actions class="pt-4 pb-0 px-0">
      <v-row>
        <v-col cols="12" class="text-right">
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

@Component({})
export default class Reminder extends Vue {
  @Prop({}) currentDateSelected!: string;
  @Prop({}) action!: "ADD" | "EDIT";

  description = "";
  time = "12:00";
  citiesList: Reminder.City[] = cities;
  citySelected: Reminder.City | null = null;
  hasRangeForShowWeather = false;

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

  @Watch("citySelected", { deep: true }) onCitySelected(
    newCitySelected: Reminder.City | null
  ): void {
    if (newCitySelected) {
      this.updateWeather(newCitySelected);
    }
  }
}
</script>

<style scoped></style>
