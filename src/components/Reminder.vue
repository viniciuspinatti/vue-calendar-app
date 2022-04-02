<template>
  <v-dialog v-model="dialog" persistent max-width="400">
    <v-card> </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from "vue-property-decorator";

@Component({})
export default class Reminder extends Vue {
  @PropSync("show") show!: boolean;

  close() {
    this.show = false;
    this.$emit("close");
  }
}
</script>

<style scoped></style>
