<template>
  <div class="weather-container">
    <img :src="weatherImageUrl" :alt="weather.main" />
    <div>
      <span class="text-h6">{{ weather.temp.toFixed(0) }} <sup>ºC</sup></span>
      <span class="body-2">{{ weather.main }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import OpenWeather from "../../types/OpenWeather";

@Component({})
export default class Weather extends Vue {
  @Prop({}) weather!: OpenWeather.SkyWithTemperature;

  get weatherImageUrl(): string {
    return `http://openweathermap.org/img/wn/${this.weather.icon}@2x.png`;
  }
}
</script>

<style scoped>
.weather-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.weather-container div span {
  display: block;
}
</style>
