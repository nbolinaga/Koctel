<template>
    <div>
        <Loader v-if="loading"></Loader>
        <v-container v-if="!loading" class="ma-0 pt-md-12 pa-0 pt-6 texto" fluid>
            <img :src="user.photoURL" alt="" class="outline mt-5 rounded-circle">
            <h2 class="secundario--text titulo d-flex justify-center mt-3">{{user.displayName}}</h2>
            <AdminTools v-if="user.admin"/>
            <h2 class="primario--text titulo d-flex justify-center pt-10 px-2 px-md-0 text-center">Tus Alcoholes Disponibles</h2>
            <p class="text-center pb-6">Click para agregar o quitar un alcohol</p>
            <v-row justify="center" align="center" class="px-6 px-md-16">
              <v-chip v-for="(alcohol, index) in alcoholes" :key="index" class="mx-5 my-2 alt white--text" :input-value="checkActiveAlcohol(alcohol)" filter  label @click="agregarAlcohol(alcohol)">{{alcohol.nombre}}</v-chip>
            </v-row>
            <h2 class="primario--text titulo d-flex justify-center pt-10 px-2 px-md-0 text-center">Tus Ingredientes Disponibles</h2>
            <p class="text-center pb-6">Click para agregar o quitar un ingrediente</p>
            <v-row justify="center" align="center" class="px-6 px-md-16">
              <v-chip v-for="(ingrediente, index) in ingredientes" :key="index" class="mx-5 my-2 alt white--text" :input-value="checkActiveIngrediente(ingrediente)" filter label  @click="agregarIngrediente(ingrediente)">{{ingrediente.title}}</v-chip>
            </v-row>
            <h2 class="primario--text titulo d-flex justify-center my-10">Tus cocteles favoritos</h2>
            <CoctelesFavoritos :key="key" filtro-favoritos="true" :coctelesprorp="coctelesFavoritos" :userprop="user"/>
            <v-container>
              <h2 class="alt--text titulo text-center mt-6 mb-4">Ingredientes de Mi Grupo</h2>
               <ul class="text-center ml-n6 mb-10">
                      <li v-for="(ingrediente, index) in ingredientesTotales" :key="index">{{ingrediente}}</li>
                    </ul>
              <h2 class="alt--text titulo text-center mb-6">Usuarios</h2>
            <v-expansion-panels tile popout>
              <v-expansion-panel v-for="(usuario,index) in users" :key="index">
                <v-expansion-panel-header>
                    <h4>{{usuario.displayName}}<v-icon v-if="grupo.includes(usuario) === true" right class="secundario--text">mdi-account-star</v-icon></h4>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <img :src="usuario.photoURL" alt="" class="outline mt-5">
                    <ul class="text-center">
                      <h4 class="my-5">Ingredientes que tiene esta persona disponible</h4>
                      <li v-for="(ingrediente, index2) in usuario.tiene" :key="index2">{{ingrediente}}</li>
                    </ul>
                    <ul class="text-center">
                      <h4 class="my-5">Cocteles Favoritos de esta persona</h4>
                      <li v-for="(favorito, index3) in usuario.favoritos" :key="index3">{{favorito}}</li>
                    </ul>
                    <v-btn v-if="grupo.includes(usuario) === false" @click="agregarUser(usuario)" class="secundario mt-6">Agregar a Mi Grupo</v-btn>
                    <v-btn v-if="grupo.includes(usuario) === true" @click="eliminar(usuario)" class="primario mt-6">Eliminar de Mi Grupo</v-btn>
                </v-expansion-panel-content>
              </v-expansion-panel >
            </v-expansion-panels>
          </v-container>
        </v-container>

    </div>
</template>

<script>
import { groq } from "@nuxtjs/sanity";
import { mdiGlassCocktailOff, mdiAlphaLCircleOutline } from '@mdi/js';
const query = groq`*[_type == "coctel"] | order(nombre asc) {_id, nombre, "nombreAlcohol": alcohol[]->nombre, slug, "img": mainImage.asset->url, "categoria": categoria[]->titulo, ingredientes[]->{title, id}}`;

const query2 = groq`*[_type == "mixer"] | order(title asc) {...}`;
const query3 = groq`*[_type == "alcohol"] | order(nombre asc) {...}`;

export default {
    
    data() {
        return {
            loading: true,
            userID: null,
            user: null,
            ingredientes: [],
            alcoholes: [],
            ingredientesDisponibles: [],
            alcoholesDisponibles: [],
            sinAlcoholLogo: mdiGlassCocktailOff,
            sinAzucar: mdiAlphaLCircleOutline,
            coctelesFavoritos: [],
            users: [],
            totales: false,
            grupo: []
        }
    },
    computed:{
      ingredientesTotales(){
        const totales = [];
        this.user.tiene.forEach(ingrediente => {
          if(!totales.includes(ingrediente)){
            totales.push(ingrediente);
          }
        });
        this.user.miGrupo.forEach(user => {
          user.tiene.forEach(ingrediente => {
            if(!totales.includes(ingrediente)){
              totales.push(ingrediente);
            }
          })
        });
        return totales;
      }
    },
    watch: {
        user(){
          this.fetchData();
          this.fetchDataIngredientes();
          this.fetchDataAlcoholes()
        },
    },
    beforeMount(){
      localStorage.getItem('user') ? this.userID = JSON.parse(localStorage.getItem('user')) : this.userID = null;
      this.getUsers();
      if(this.userID != null){
      this.fetchUserData();
      } else {
      this.fetchData();
      this.fetchDataIngredientes();
      this.fetchDataAlcoholes()
      } 
    },
    methods:{
     getUsers(){
        const events = this.$fire.firestore.collection('users')
        events.get().then((querySnapshot) => {
        const tempDoc = querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() }
            })
            tempDoc.forEach(element => {
              if(element.id !== this.userID){
                this.users.push(element);
              }
            });
        })
    },
    fetchUserData(){
      this.$fire.firestore.collection('users').doc(`${this.userID}`).get().then(doc => {
        this.user = doc.data();
        this.grupo = this.user.miGrupo;
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
    fetchDataIngredientes() {
      this.loading = true;
      this.$sanity.fetch(query2).then(
        (mixers) => {
          this.ingredientes = mixers
          mixers.forEach(mixer => {
              if(this.user.tiene.includes(mixer.id.current)){
                this.ingredientesDisponibles.push(mixer);
              }
          })
          this.loading = false;
        },
        (error) => {
          this.error = error;
        }
      );
    },
    fetchDataAlcoholes() {
      this.loading = true;
      this.$sanity.fetch(query3).then(
        (alcoholes) => {
          this.alcoholes = alcoholes
          alcoholes.forEach(alcohol => {
              if(this.user.tiene.includes(alcohol.id.current)){
                this.alcoholesDisponibles.push(alcohol);
              }
          })
          this.loading = false;
        },
        (error) => {
          this.error = error;
        }
      );
    },
    checkActiveIngrediente(ingrediente) {
        if(this.ingredientesDisponibles.includes(ingrediente)){
          return true;
      }
    },
    checkActiveAlcohol(alcohol) {
        if(this.alcoholesDisponibles.includes(alcohol)){
          return true;
      }
    },
    agregarAlcohol(alcohol){
      if(this.alcoholesDisponibles.includes(alcohol)){
        this.alcoholesDisponibles.splice(this.alcoholesDisponibles.indexOf(alcohol), 1);
        this.user.tiene.splice(this.user.tiene.indexOf(alcohol.id.current), 1);
      } else {
        this.alcoholesDisponibles.push(alcohol);
        this.user.tiene.push(alcohol.id.current);
      }
      this.$fire.firestore.collection("users").doc(`${this.user.uid}`).update({
          tiene: this.user.tiene
      })
    },
    agregarIngrediente(ingrediente){
      if(this.ingredientesDisponibles.includes(ingrediente)){
        this.ingredientesDisponibles.splice(this.ingredientesDisponibles.indexOf(ingrediente), 1);
        this.user.tiene.splice(this.user.tiene.indexOf(ingrediente.id.current), 1);
      } else {
        this.ingredientesDisponibles.push(ingrediente);
        this.user.tiene.push(ingrediente.id.current);
      }
      this.$fire.firestore.collection("users").doc(`${this.user.uid}`).update({
          tiene: this.user.tiene
      })
    },
    agregarUser(usuario){
      this.grupo.push(usuario);
      this.$fire.firestore.collection("users").doc(`${this.user.uid}`).update({
          miGrupo: this.grupo
      })
    },
    eliminar(usuario){
      this.grupo.splice( this.grupo.indexOf(usuario), 1);
      this.$fire.firestore.collection("users").doc(`${this.user.uid}`).update({
          miGrupo: this.grupo
      })
    }
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
    .v-input__slot .v-label{
    color: #0B1828 !important;
    }
    ul{
      list-style: none;
    }
</style>