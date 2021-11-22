<template>
  <div id="top" class="container">
    <LogoCompleto class="logoCompleto mt-md-10 mt-6 pa-10 pa-md-0" fill="#FD3737"/>
    <h2 id="subtitulo" class="secundario--text d-flex justify-center text-center text-md-h5 text-body-1">TU BARTENDER DE BOLSILLO</h2>
    <v-divider class="texto my-12"></v-divider>
    <Cocteles id="cocteles"/>
    <v-divider class="texto my-12"></v-divider>
    <Bartender id="bartender"/>
    <h2 id="mapa" class="titulo primario--text ml-5 text-left text-md-center ml-md-5">COCTELES ALREDEDOR DEL MUNDO</h2>
    <h4 class="titulo white--text mt-5 ml-5 text-left text-md-center ml-md-5">Click-and-Drag para moverte en el mapa</h4>
    <h4 class="titulo white--text mb-5 ml-5 text-left text-md-center ml-md-5">Scroll para hacer zoom al mapa</h4>
    <MapaMundi/>
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
  }

  #cocteles, #bartender, #top, #mapa{
    padding-top: 70px;
    margin-top: -70px;
  }
  #subtitulo{
    margin-top: -100px;
    padding-bottom: 100px;
  }
</style>