<template>
  <div class="container">
    <v-switch
      v-model="lightFiltro"
      :label="`Solo Light`"
    ></v-switch>
     <v-switch
      v-model="sinAlcohol"
      :label="`Sin Alcohol`"
    ></v-switch>
    <v-autocomplete v-if="!loading" v-model="nombre" :label="`Buscar por Nombre`" :items="cocteles" item-text="nombre" clearable></v-autocomplete>
    <ListaCocteles :key="key" :light-filtro="lightFiltro" :sin-alcohol-filtro="sinAlcohol" :nombre="nombre"/>
  </div>
</template>
<script>
import { groq } from "@nuxtjs/sanity";
const query = groq`*[_type == "coctel"] | order(nombre asc) {_id, nombre, "nombreAlcohol": alcohol[]->nombre, slug, "img": mainImage.asset->url, "categoria": categoria[]->titulo}`;

export default {
    data() {
      return {
        key: false,
        lightFiltro: false,
        sinAlcohol: false,
        nombre: null,
        cocteles: [],
        loading: false,
      }
    },
    watch: {
      lightFiltro(val) {
        this.key = !this.key;
      },
      sinAlcohol(val) {
        this.key = !this.key;
      },
      nombre(val) {
        this.key = !this.key;
      }
    },
    beforeMount() {
    this.fetchData();
  },
  methods:{
    fetchData() {
      this.error = this.cocteles = null;
      this.loading = true;
      this.$sanity.fetch(query).then(
        (cocteles) => {
          this.loading = false;
          this.cocteles = cocteles;
        },
        (error) => {
          this.error = error;
        }
      );
    },
  },
}
</script>
<style lang="scss">
  .container {
    min-height: 30vh;
    margin: 0 auto;
  }
</style>