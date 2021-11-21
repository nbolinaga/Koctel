<template>
  <div id="top" class="container" :min-height="$vuetify.breakpoint.mobile ? '2vh' : '30vh'">
    <LogoCompleto class="logoCompleto mt-md-10 mt-n16" fill="#FD3737" />
    <h2 id="subtitulo" class="titulo secundario--text d-flex justify-center">TU BARTENDER DE BOLSILLO</h2>
    <v-divider class="texto my-12"></v-divider>
    <Cocteles id="cocteles"/>
    <v-divider class="texto my-12"></v-divider>
    <Bartender id="bartender"/>
    <MapaMundi />
  </div>
</template>
<script>

</script>
<style lang="scss">
  .container {
    // min-height: 30vh;
    margin: 0 auto;
  }

  .logoCompleto{
    widows: auto;
    height: 40vh;
  }

  #cocteles, #bartender, #top{
    padding-top: 70px;
    margin-top: -70px;
  }
  #subtitulo{
    margin-top: -100px;
    padding-bottom: 100px;
  }
</style>