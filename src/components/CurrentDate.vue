<template>
  <v-row no-gutters class="light-blue lighten-1">
    <v-col cols="12" class="text-center title white--text">
      <span style="color: #263238">{{ currentDateFormat }}</span>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import dayjs from "dayjs";

@Component
export default class CurrentDate extends Vue {
  @Prop() currentDate!: string;

  /* Computed */
  get currentDateFormat(): string {
    return `Today is ${dayjs(this.currentDate).format("dddd")}, ${dayjs(this.currentDate).format(
      "MMM"
    )} ${dayjs(this.currentDate).format("D")}`;
  }
}
</script>

<style scoped></style>
