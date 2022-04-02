<template>
  <v-app id="app">
    <v-main class="grey darken-4">
      <v-container id="calendar-container" class="center pa-0 grey lighten-5">
        <Calendar />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Calendar from "./components/Calendar.vue";

@Component({
  components: {
    Calendar
  }
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

#calendar-container {
  width: 60%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
