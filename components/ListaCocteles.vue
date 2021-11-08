<template>
    <div class="pa-10">
        <Loader v-if="loading" />
        <v-row class="d-flex justify-space-around">
          <h4 v-if="coctelesFiltrados.length == 0 && !loading" class="textos primario--text">No se encontro ningun coctel</h4>
          <coctelCard v-for="coctel in coctelesFiltrados" :key="coctel._id" :coctel="coctel" :userprop="user"/>
        </v-row>
        <v-row v-if="incompletos" class="d-flex justify-space-around">
          <h2 class="texto--text titulo d-flex justify-center my-10">TRAGOS QUE SOLO TE FALTAN ALGUNOS INGREDIENTES PARA PODER PREPARAR</h2>
          <coctelCard v-for="coctel in coctelesIncompletos && !loading" :key="coctel._id" :coctel="coctel[0]" :userprop="user"/>
        </v-row>
    </div>
</template>

<script>
import { groq } from "@nuxtjs/sanity";
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
      counter: 0,
      rating: 5,
      cocteles: [],
      coctelesFiltrados: [],
      coctelesIncompletos: [],
      userID: null,
      user: null,
      loading: false
    };
  },
  beforeMount(){
    localStorage.getItem('user') ? this.userID = JSON.parse(localStorage.getItem('user')) : this.userID = null;
    if(this.userID != null){
      this.fetchUserData();
    }
  },
  mounted(){
    this.fetchData();
  },
  methods:{
    fetchUserData(){
      const query = groq`*[_id == '${this.userID}']{...}`;
        this.$sanity.fetch(query).then(user => {
          this.user = user[0];
        });
    },
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

#ingredientes{
  overflow-y: scroll;
}
</style>