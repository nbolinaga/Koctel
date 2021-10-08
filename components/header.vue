<template>
  <v-app-bar flat dense class="flex-grow-0 px-15" color="accent">
      <v-toolbar-title class="primary--text">Koctel</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip v-if="!$vuetify.theme.dark" bottom>
            <template v-slot:activator="{ on }">
            <v-btn v-on="on" color="primary" x-small fab @click="darkMode">
                <v-icon color="white" class="mr-1">mdi-moon-waxing-crescent</v-icon>
            </v-btn>
            </template>
            <span>Dark Mode On</span>
        </v-tooltip>
        <v-tooltip v-else bottom>
            <template v-slot:activator="{ on }">
            <v-btn v-on="on" color="primary" x-small fab @click="darkMode">
                <v-icon color="white">mdi-white-balance-sunny</v-icon>
            </v-btn>
            </template>
            <span>Dark Mode Off</span>
        </v-tooltip>
  </v-app-bar>
</template>

<script>

export default {
  data() {
    return {
    }
  },
  methods: {
    darkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    }
  }
}
</script>

<style>

</style>