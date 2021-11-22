<template>
  <div class="container">
    <h2 class="titulo primario--text mb-8">Nuestros cocteles</h2>
    <p class="textos texto--text text-md-left text-justify">A continuación encontrarás nuestra gran gama de cocteles de todas partes del mundo, donde te ofrecemos tragos desde los más populares hasta cocteles sin alcohol o sin azúcar. En Koctel siempre estamos actualizando nuestro catálogo de cocteles con los más nuevos</p>
    <div class="d-flex">
      <v-switch v-model="lightFiltro" dark :label="`Solo Light`" :disabled="alcohol != null || nombre != null"></v-switch>
      <v-icon class="pb-2 primario--text" right>{{sinAzucar}}</v-icon>
    </div>
    <div class="d-flex">
      <v-switch v-model="sinAlcohol" dark :label="`Sin Alcohol`" :disabled="alcohol != null || nombre != null"></v-switch>
      <v-icon class="pb-2 detalles--text" right>{{sinAlcoholLogo}}</v-icon>
    </div>
    <v-autocomplete  v-if="!loading" v-model="nombre" dark :label="sinAlcohol || lightFiltro ? `Desactivar filtros antes de usar` : `Buscar por Nombre`" :items="cocteles" item-text="nombre" clearable :disabled="lightFiltro == true || sinAlcohol == true"></v-autocomplete>
    <v-autocomplete  v-if="!loading" v-model="alcohol" dark :label="sinAlcohol || lightFiltro ? `Desactivar filtros antes de usar`: `Buscar por Alcohol`" :items="alcoholes" item-text="nombre" clearable :disabled="lightFiltro == true || sinAlcohol == true"></v-autocomplete>
    <ListaCocteles :key="key" :light-filtro="lightFiltro" :sin-alcohol-filtro="sinAlcohol" :nombre="nombre" :alcohol="alcohol" :pais="pais"/>
  </div>
</template>
<script>
import { groq } from "@nuxtjs/sanity";
import { mdiGlassCocktailOff, mdiAlphaLCircleOutline } from '@mdi/js';
const query = groq`*[_type == "coctel"] | order(nombre asc) {_id, nombre, "nombreAlcohol": alcohol[]->nombre, slug, "img": mainImage.asset->url, "categoria": categoria[]->titulo}`;
const alcohol = groq`*[_type == "alcohol"] | order(nombre asc)`;
const pais = groq`*[_type == "pais"] | order(nombre asc)`;

export default {
    data() {
      return {
        key: false,
        lightFiltro: false,
        sinAlcohol: false,
        nombre: null,
        alcohol: null,
        pais: null,
        cocteles: [],
        alcoholes: [],
        paises:[],
        loading: false,
        sinAlcoholLogo: mdiGlassCocktailOff,
        sinAzucar: mdiAlphaLCircleOutline,
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
      },
      alcohol(val) {
        this.key = !this.key;
      },
      pais(val) {
        this.key = !this.key;
      }
    },
    beforeMount() {
    this.fetchData();
    this.fetchAlcoholes();
    this.fetchPaises();
  },
  methods:{
    fetchData() {
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
    fetchAlcoholes() {
      this.loading = true;
      this.$sanity.fetch(alcohol).then(
        (alcoholes) => {
          this.loading = false;
          this.alcoholes = alcoholes;
        },
        (error) => {
          this.error = error;
        }
      );
    },
    fetchPaises() {
      this.loading = true;
      this.$sanity.fetch(pais).then(
        (paises) => {
          this.loading = false;
          this.paises = paises;
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
@import '../assets/variables.scss';
  .container {
    min-height: 30vh;
    margin: 0 auto;
  }
  .v-input__slot .v-label{
    color: whitesmoke !important;
  }
</style>