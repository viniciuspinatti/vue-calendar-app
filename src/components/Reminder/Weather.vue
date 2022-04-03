<template>
  <v-row no-gutters align="center">
    <v-col cols="8"> </v-col>
    <v-col cols="4"><v-img :src="weatherImageUrl"></v-img></v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as OpenWeather from "@/types/OpenWeather";

@Component({})
export default class Weather extends Vue {
  @Prop({}) weather!: OpenWeather.SkyWeather;

  get weatherImageUrl(): string {
    return `http://openweathermap.org/img/wn/${this.weather.icon}@2x.png`;
  }
}
</script>

<style scoped></style>
