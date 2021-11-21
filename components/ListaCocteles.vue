<template>
    <div class="pa-5">
        <Loader v-if="loading" />
        <v-row class="d-md-flex justify-space-around d-block">
          <h4 v-if="cocteles.length == 0 && !loading" class="textos primario--text">No se encontro ningun coctel</h4>
          <coctelCard v-for="coctel in cocteles" :key="coctel._id" :coctel="coctel" :userprop="user"/>
        </v-row>
    </div>
</template>

<script>
import { groq } from "@nuxtjs/sanity";

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
      porAlcohol:{
        type: Boolean,
        default: false
      },
    },
  data() {
    return {
      cocteles: [],
      userID: null,
      user: null,
      loading: false
    };
  },
  watch: {
    user(){
      this.fetchData();
    }
  },
  beforeMount(){
    localStorage.getItem('user') ? this.userID = JSON.parse(localStorage.getItem('user')) : this.userID = null;
    if(this.userID != null){
      this.fetchUserData();
    } else {
      this.fetchData();
    }
    
  },
  methods:{
    fetchUserData(){
      this.$fire.firestore.collection('users').doc(`${this.userID}`).get().then(doc => {
        this.user = doc.data();
      });
    },
    fetchData() {
      let toFetch = groq`*[_type == "coctel"] | order(nombre asc) {_id, nombre, "nombreAlcohol": alcohol[]->nombre, slug, "img": mainImage.asset->url, "categoria": categoria[]->titulo, ingredientes[]->{title, id}}`;
      this.loading = true;
      if(this.lightFiltro === true){
        toFetch =  groq`*[_type == "coctel" && "Light" in categoria[]->titulo] | order(nombre asc) {_id, nombre, slug, "nombreAlcohol": alcohol[]->nombre, "img": mainImage.asset->url, "categoria": categoria[]->titulo}`;
      }
      if(this.sinAlcoholFiltro === true){
        toFetch =  groq`*[_type == "coctel" && "Sin Alcohol" in categoria[]->titulo] | order(nombre asc) {_id, nombre, slug, "nombreAlcohol": alcohol[]->nombre, "img": mainImage.asset->url, "categoria": categoria[]->titulo}`;
      }
      if(this.sinAlcoholFiltro === true && this.lightFiltro === true){
        toFetch = groq`*[_type == "coctel" && "Sin Alcohol" in categoria[]->titulo  && "Light" in categoria[]->titulo] | order(nombre asc) {_id, nombre, slug, "nombreAlcohol": alcohol[]->nombre, "img": mainImage.asset->url, "categoria": categoria[]->titulo}`;
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