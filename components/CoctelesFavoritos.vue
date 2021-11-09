<template>
    <div class="pa-10">
        <Loader v-if="loading" />
        <v-row class="d-flex justify-space-around alt">
          <h4 v-if="cocteles.length == 0 && !loading" class="textos primario--text">No se encontro ningun coctel favorito</h4>
          <coctelCard v-for="coctel in cocteles" :key="coctel._id" :coctel="coctel" :userprop="user"/>
        </v-row>
    </div>
</template>

<script>
export default {
  props: {
      coctelesprorp: {
          type: Array,
          default: null
      },
      userprop: {
        type: Object,
        default: null
      }
  },
  data() {
    return {
      counter: 0,
      cocteles: [],
      loading: true,
      user: null
    };
  },
  beforeMount(){
    this.user = this.userprop;
    this.cocteles = this.coctelesprorp;
    this.loading = false;
  },
}

</script>

<style lang="scss" scoped>

#ingredientes{
  overflow-y: scroll;
}
</style>