<template>
  <v-app :style="{background: $vuetify.theme.themes[theme].alt}">
    <Header v-if="$vuetify.breakpoint.mobile ? false : true"/>
    <HeaderMobile v-if="$vuetify.breakpoint.mobile ? true : false" class="d-block"/>
    <v-main>
      <Nuxt class="mt-md-10 mt-n6" fluid/>
    </v-main>
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

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;600&family=Raleway:ital,wght@0,400;0,500;1,300&display=swap');
@import '../assets/variables.scss';

.titulo{
  font-family: $titulos;
  font-weight: 600;
}
.textos{
  font-family: $texto;
  font-weight: 300;
}
</style>