<template>
  <div class="container">
    <LogoCompleto class="logoCompleto mt-10" fill="#FD3737"/>
    <h2 id="subtitulo" class="titulo secundario--text d-flex justify-center">TU BARTENDER DE BOLSILLO</h2>
    <v-divider class="texto my-12"></v-divider>
    <Cocteles id="cocteles"/>
    <v-divider class="texto my-12"></v-divider>
    <Bartender id="bartender"/>
  </div>
</template>
<script>

</script>
<style lang="scss">
  .container {
    min-height: 30vh;
    margin: 0 auto;
  }

  .logoCompleto{
    widows: auto;
    height: 40vh;
  }
  #cocteles, #bartender{
    padding-top: 70px;
    margin-top: -70px;
  }
  #subtitulo{
    margin-top: -100px;
    padding-bottom: 100px;
  }
</style>