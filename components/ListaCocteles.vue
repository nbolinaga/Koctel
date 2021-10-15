<template>
    <div class="pa-10">
        <div class="loading" v-if="loading">Cargando...</div>
        <v-card class="my-5" v-for="coctel in cocteles" :key="coctel._id" :to="`/coctel/${coctel.slug.current}`">
            <v-img :src="coctel.img" height="10vh" class="white--text align-end"> <v-card-title class="textos">{{coctel.nombre}}</v-card-title></v-img> 
        </v-card>
    </div>
</template>

<script>
import { groq } from "@nuxtjs/sanity";
const query = groq`*[_type == "coctel"] {_id, nombre, slug, "nombreAlcohol" : alcohol->nombre, ingredientes[]->{title}, "img": mainImage.asset->url, "preparacion": preparacion[0].children[0].text}`;

export default {
    props:{
        ingredienteFiltro: {
            type: String,
            default: ''
        },
        alcoholFiltro: {
            type: String,
            default: ''
        }
    },
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

</style>