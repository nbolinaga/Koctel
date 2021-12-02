<template>
    <div>
        <Loader v-if="loading"></Loader>
        <v-container v-if="!loading" class="ma-0 pt-md-12 pa-0 pt-10 pt-md-0 texto" fluid>
            <img :src="user.photoURL" alt="" class="outline mt-5 rounded-circle">
            <h2 class="secundario--text titulo d-flex justify-center mt-3">{{user.displayName}}</h2>
            <h2 v-if="user.admin" class="alt--text titulo text-center my-2">Administrador</h2>
            <AdminTools v-if="user.admin"/>
            <h2 class="secundario--text titulo d-flex justify-center pt-10 px-2 px-md-0 text-center">Tus Alcoholes Disponibles</h2>
            <p class="alt--text titulo d-flex justify-center pt-4 px-md-0 text-center px-10">Haz click en un icono para agregar o quitar un alcohol</p>
            <v-simple-table class="mx-md-16 mx-6 mt-6" height="300px">
              <template #default>
                <thead>
                  <tr>
                    <th class="text-left">
                      Alcohol
                    </th>
                    <th class="text-left">
                      Disponibilidad
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(alcohol, index) in alcoholes"
                    :key="index"
                  >
                    <td width="100%">{{ alcohol.nombre }}</td>
                    <td>
                      <v-btn  class="ml-2" small @click="agregarAlcohol(alcohol)">
                          <v-icon v-if="checkActiveAlcohol(alcohol)" class="alt--text">mdi-check</v-icon>
                          <v-icon v-else class=" primario--text">mdi-close</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <h2 class="secundario--text titulo d-flex justify-center pt-10 px-md-0 text-center px-10">Tus Ingredientes Disponibles</h2>
            <p class="alt--text titulo d-flex justify-center pt-4 px-md-0 text-center px-10">Haz click en un icono para agregar o quitar un ingrediente</p>
            <v-simple-table class="mx-md-16 mx-6 mt-6" height="300px">
              <template #default>
                <thead>
                  <tr>
                    <th class="text-left">
                      Ingrediente
                    </th>
                    <th class="text-left">
                      Disponibilidad
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(ingrediente, index) in ingredientes"
                    :key="index"
                  >
                    <td width="100%">{{ ingrediente.title }}</td>
                    <td>
                      <v-btn class="ml-2" small @click="agregarIngrediente(ingrediente)">
                          <v-icon v-if="checkActiveIngrediente(ingrediente)" class="alt--text">mdi-check</v-icon>
                          <v-icon v-else class=" primario--text">mdi-close</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <CoctelesFavoritos :key="key" filtro-favoritos="true" :coctelesprorp="coctelesFavoritos" :userprop="user"/>
            <v-container>
              <h2 class="alt--text titulo text-center mt-6 mb-4">Ingredientes de Mi Grupo</h2>
              <p v-if="user.miGrupo.length == 0" class="primario--text titulo d-flex justify-center pt-4 px-md-0 text-center px-10">No tienes a nadie en tu grupo</p>
               <ul :key="totales" class="text-center ml-n6 mb-10">
                      <li v-for="(ingrediente, index) in ingredientesTotales" :key="index">{{getName(ingrediente)}}</li>
                    </ul>
              <h2 class="alt--text titulo text-center mb-6">Usuarios</h2>
            <v-expansion-panels v-if="!loading" tile popout class="mb-16">
              <v-expansion-panel v-for="(usuario,index) in users" :key="index">
                <v-expansion-panel-header>
                    <h4 class="ml-6">{{usuario.displayName}}<v-icon v-if="user.miGrupo.includes(usuario)" right class="secundario--text">mdi-account-star</v-icon></h4>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-img :src="usuario.photoURL" alt="" class="outline mt-5 d-md-flex float-md-right" width="100px"></v-img>
                    <ul class="text-left">
                      <h4 class="my-5">Ingredientes que tiene esta persona disponible</h4>
                      <li v-for="(ingrediente, index2) in usuario.tiene" :key="index2">{{getName(ingrediente)}}</li>
                    </ul>
                    <ul class="text-left">
                      <h4 class="my-5">Cocteles Favoritos de esta persona</h4>
                      <li v-for="(favorito, index3) in usuario.favoritos" :key="index3">{{getName(favorito)}}</li>
                    </ul>
                    <v-btn v-if="!user.miGrupo.includes(usuario)" class="secundario my-12" width="100%" @click="agregarUser(usuario)">Agregar a Mi Grupo</v-btn>
                    <v-btn v-if="user.miGrupo.includes(usuario)" class="primario my-12 " width="100%" @click="eliminar(usuario)">Eliminar de Mi Grupo</v-btn>
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
          if(user.tiene != null){
            user.tiene.forEach(ingrediente => {
              if(!totales.includes(ingrediente)){
                totales.push(ingrediente);
              }
            })
          }
        });
        return totales;
      }
    },
    watch: {
        user(){
          this.fetchData();
          this.getUsers();
          this.fetchDataIngredientes();
          this.fetchDataAlcoholes()
          this.totales = !this.totales
        },
    },
    beforeMount(){
      localStorage.getItem('user') ? this.userID = JSON.parse(localStorage.getItem('user')) : this.userID = null;
      
      if(this.userID != null){
      this.fetchUserData();
      } else {
      this.fetchData();
      this.getUsers();
      this.fetchDataIngredientes();
      this.fetchDataAlcoholes()
      } 
      
    },
    methods:{
    async getUsers(){
        const events = await this.$fire.firestore.collection('users')
        events.get().then((querySnapshot) => {
        const tempDoc = querySnapshot.docs.map((doc) => {
            return { ...doc.data() }
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
        this.user.miGrupo = doc.data().miGrupo;
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
          if(mixers.length > 0){
            mixers.forEach(mixer => {
              if(this.user.tiene.includes(mixer.id.current)){
                this.ingredientesDisponibles.push(mixer);
              }
            })
          }
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
      this.user.miGrupo.push(usuario);
      this.$fire.firestore.collection("users").doc(`${this.user.uid}`).update({
          miGrupo: this.user.miGrupo
      })
    },
    eliminar(usuario){
      this.user.miGrupo.splice(this.user.miGrupo.indexOf(usuario), 1);
      this.$fire.firestore.collection("users").doc(`${this.user.uid}`).update({
          miGrupo: this.user.miGrupo
      })
    },
    getName(ingrediente){
      const splitStr = ingrediente.replace(/-/g, ' ').toLowerCase().split(' ');
      for (let i = 0; i < splitStr.length; i++) {
          splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        return splitStr.join(' '); 
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
    .v-input__slot .v-label{
    color: #0B1828 !important;
    }
    ul{
      list-style: none;
    }
</style>