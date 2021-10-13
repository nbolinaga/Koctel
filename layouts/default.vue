<template>
  <v-app :style="{background: $vuetify.theme.themes[theme].background}">>
    <Header />
    <Nuxt/>
  </v-app>
</template>

<script>
  export default {
  name: 'App',
  computed:{
    theme(){
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    }
  }
};
</script>
