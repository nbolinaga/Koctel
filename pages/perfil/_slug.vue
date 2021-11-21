<template>
    <div>
        <Loader v-if="loading"></Loader>
        <v-container v-if="!loading" class="ma-0 pt-md-12 pa-0 texto" fluid>
            <img :src="user.photoURL" alt="" class="outline mt-5 rounded-circle">
            <h2 class="secundario--text titulo d-flex justify-center mt-3">{{user.displayName}}</h2>
            <AdminTools v-if="user.admin"/>
            <h2 class="primario--text titulo d-flex justify-center my-10">Tus cocteles favoritos</h2>
            <CoctelesFavoritos :key="key" filtro-favoritos="true" :coctelesprorp="coctelesFavoritos" :userprop="user"/>
        </v-container>

    </div>
</template>

<script>
import { groq } from "@nuxtjs/sanity";
import { mdiGlassCocktailOff, mdiAlphaLCircleOutline } from '@mdi/js';
const query = groq`*[_type == "coctel"] | order(nombre asc) {_id, nombre, "nombreAlcohol": alcohol[]->nombre, slug, "img": mainImage.asset->url, "categoria": categoria[]->titulo, ingredientes[]->{title, id}}`;

export default {
    
    data() {
        return {
            loading: true,
            userID: null,
            user: null,
            sinAlcoholLogo: mdiGlassCocktailOff,
            sinAzucar: mdiAlphaLCircleOutline,
            coctelesFavoritos: []
        }
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
      this.error = this.cocteles = null;

      this.$sanity.fetch(query).then(
        (cocteles) => {
          cocteles.forEach(coctel => {
              if(this.user.favoritos.includes(coctel.slug.current)){
                this.coctelesFavoritos.push(coctel);
              }
          })
            this.loading = false;
          })
        .catch(error => {
          this.error = error;
        }
      );
    },
}}
</script>

<style lang="scss">
    .container {
        width: 100vw;
        height: auto;
        margin: 0 auto;
    }
    .outline {
        display: block;
        margin: 0 auto;
    }
</style>