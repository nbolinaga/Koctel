<template>
  <div class="container">
    <LogoCompleto class="logoCompleto mt-10" fill="#9C3B3B"/>
    <div class="loading" v-if="loading">Cargando...</div>
    <v-btn v-for="coctel in cocteles" :key="coctel._id" :to="`/coctel/${coctel.slug.current}`">{{coctel.nombre}}</v-btn>
  </div>
</template>
<script>
import { groq } from "@nuxtjs/sanity";
const query = groq`*[_type == "coctel"] {_id, nombre, slug, "nombreAlcohol" : alcohol->nombre, ingredientes[]->{title}, "img": mainImage.asset->url, "preparacion": preparacion[0].children[0].text}`;

export default {
  data() {
    return {
      cocteles: [],
    };
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

  .logoCompleto{
    widows: auto;
    height: 40vh;
  }
</style>