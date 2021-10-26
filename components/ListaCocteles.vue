<template>
    <div class="pa-10">
        <Loader v-if="loading" />
        <v-row class="d-flex justify-space-around">
          <h4 v-if="coctelesFiltrados.length == 0 && !loading" class="textos primario--text">No se encontro ningun coctel</h4>
          <v-card v-for="coctel in coctelesFiltrados" id="ingredientes" :key="coctel._id" class="my-5 texto overflow-hidden" width="25vw" elevation="5" tile :to="`/coctel/${coctel.slug.current}`">
            <v-card-title class="textos primario--text align-end titulo">{{coctel.nombre}}<v-icon v-if="coctel.categoria.includes('Sin Alcohol')" class="pb-1 alt--text" right>{{sinAlcoholLogo}}</v-icon><v-icon  v-if="coctel.categoria.includes('Light')" class="pb-1 secundario--text" right>{{sinAzucar}}</v-icon></v-card-title>
            <v-card-subtitle class="d-flex inline textos alt--text"><p v-for="alcohol in coctel.nombreAlcohol" :key="alcohol.nombre">{{alcohol}}</p></v-card-subtitle>
            <v-img :src="coctel.img" width="100%" height="10vh" cover></v-img>
          </v-card>
        </v-row>
        <v-row v-if="incompletos" class="d-flex justify-space-around">
          <h2 class="texto--text titulo d-flex justify-center my-10">TRAGOS QUE SOLO TE FALTAN ALGUNOS INGREDIENTES PARA PODER PREPARAR</h2>
          <v-card v-for="coctel in coctelesIncompletos" id="ingredientes" :key="coctel[0]._id" class="my-5 text overflow-hidden" width="25vw" elevation="5" tile :to="`/coctel/${coctel[0].slug.current}`">
            <v-card-title class="textos primario--text align-end titulo">{{coctel[0].nombre}}<v-icon v-if="coctel[0].categoria.includes('Sin Alcohol')" class="pb-1 alt--text" right>{{sinAlcoholLogo}}</v-icon><v-icon  v-if="coctel[0].categoria.includes('Light')" class="pb-1 secundario--text" right>{{sinAzucar}}</v-icon></v-card-title>
            <v-card-subtitle class="d-flex inline textos alt--text"><p v-for="alcohol in coctel[0].nombreAlcohol" :key="alcohol.nombre">{{alcohol}}</p></v-card-subtitle>
            <p>{{coctel[1]}}</p>
            <v-img :src="coctel[0].img" width="100%" height="10vh" cover></v-img>
          </v-card>
        </v-row>
    </div>
</template>

<script>
import { groq } from "@nuxtjs/sanity";
import { mdiGlassCocktailOff, mdiAlphaLCircleOutline } from '@mdi/js';
const query = groq`*[_type == "coctel"] | order(nombre asc) {_id, nombre, "nombreAlcohol": alcohol[]->nombre, slug, "img": mainImage.asset->url, "categoria": categoria[]->titulo, ingredientes[]->{title, id}}`;
const light = groq`*[_type == "coctel" && "Light" in categoria[]->titulo] | order(nombre asc) {_id, nombre, slug, "nombreAlcohol": alcohol[]->nombre, "img": mainImage.asset->url, "categoria": categoria[]->titulo}`;
const sinAlcohol = groq`*[_type == "coctel" && "Sin Alcohol" in categoria[]->titulo] | order(nombre asc) {_id, nombre, slug, "nombreAlcohol": alcohol[]->nombre, "img": mainImage.asset->url, "categoria": categoria[]->titulo}`;
const both = groq`*[_type == "coctel" && "Sin Alcohol" in categoria[]->titulo  && "Light" in categoria[]->titulo] | order(nombre asc) {_id, nombre, slug, "nombreAlcohol": alcohol[]->nombre, "img": mainImage.asset->url, "categoria": categoria[]->titulo}`;

export default {
    props:{
      alcoholFiltro: {
        type: String,
        default: ''
      },
      ingredienteFiltro: {
          type: String,
          default: ''
      },
      sinAlcoholFiltro: {
          type: Boolean,
          default: false
      },
      lightFiltro: {
        type: Boolean,
        default: false
      },
      nombre:{
        type: String,
        default: null
      },
      pais:{
        type: String,
        default: null
      },
      ingredientes:{
        type: Array,
        default: null,
      },
      incompletos: {
        type: Boolean,
        default: false
      }
    },
  data() {
    return {
      cocteles: [],
      coctelesFiltrados: [],
      coctelesIncompletos: [],
      sinAlcoholLogo: mdiGlassCocktailOff,
      sinAzucar: mdiAlphaLCircleOutline
    };
  },
  beforeMount() {
    this.fetchData();
  },
  methods:{
    fetchData() {
      let toFetch = query;
      this.error = this.cocteles = null;
      this.loading = true;
      if(this.lightFiltro === true){
        toFetch = light;
      }
      if(this.sinAlcoholFiltro === true){
        toFetch = sinAlcohol;
      }
      if(this.sinAlcoholFiltro === true && this.lightFiltro === true){
        toFetch = both;
      }
      if(this.nombre !== null){
        toFetch = groq`*[_type == "coctel" && nombre == "${this.nombre}"] {_id, nombre, "nombreAlcohol": alcohol[]->nombre, slug, "img": mainImage.asset->url, "categoria": categoria[]->titulo}`;
      }
      if(this.pais !== null){
        toFetch = groq`*[_type == "coctel" && pais->nombre == "${this.pais}"] {_id, nombre, slug, "nombreAlcohol": alcohol[]->nombre, "img": mainImage.asset->url, "categoria": categoria[]->titulo}`;
      }
      if(this.ingredienteFiltro !== ''){
        toFetch = groq`*[_type == "coctel" && "${this.ingredienteFiltro}" in ingredientes[]->title] {_id, nombre, slug, "nombreAlcohol": alcohol[]->nombre, "img": mainImage.asset->url, "categoria": categoria[]->titulo, "ingredientesNombres": ingredientes[]->title}`;
      }
      if(this.alcoholFiltro !== ''){
        toFetch = groq`*[_type == "coctel" && "${this.alcoholFiltro}" in alcohol[]->nombre] {_id, nombre, slug, "nombreAlcohol": alcohol[]->nombre, "img": mainImage.asset->url, "categoria": categoria[]->titulo}`;
      }
      this.$sanity.fetch(toFetch).then(
        (cocteles) => {
          this.loading = false;
          this.cocteles = cocteles;
          let counter = 0;
          let counterAlcohol = 0;
          let faltante = null;
          if(this.ingredientes !== null){
            this.cocteles.forEach(coctel =>{
              coctel.ingredientes.forEach(ingrediente =>{
                this.ingredientes.forEach(ingredienteCompare =>{
                  if(ingredienteCompare.nombre === ingrediente.title){
                    counter++;
                  }
                })
              })
              coctel.nombreAlcohol.forEach(alcohol =>{
                this.ingredientes.forEach(ingredienteCompare =>{
                  if(ingredienteCompare.nombre === alcohol){
                    counterAlcohol++;
                  }
                })
              })
              if(counter === coctel.ingredientes.length && counterAlcohol === coctel.nombreAlcohol.length){
                this.coctelesFiltrados.push(coctel);
              }
              if(((coctel.ingredientes.length - counter) + (coctel.nombreAlcohol.length - counterAlcohol)) <= 2 && ((coctel.ingredientes.length - counter) + (coctel.nombreAlcohol.length - counterAlcohol)) !== 0){

                this.coctelesIncompletos.push([coctel, faltante]);
              }
            counter = 0;
            counterAlcohol = 0;
            faltante = null;
            })
          } else {
            this.coctelesFiltrados = this.cocteles;
          }
        this.loading=false;
        },
        (error) => {
          this.error = error;
        }
      );
    },
  }
}

</script>

<style lang="scss" scoped>
p + p::before{
  content: "-";
  padding: 3px;
}
#ingredientes{
  overflow-y: scroll;
}
</style>