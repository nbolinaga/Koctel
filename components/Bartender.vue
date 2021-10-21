<template>
  <div class="container">
    
    <h1 class="primario--text titulo d-flex justify-center">CONOCE A NUESTRO BARTENDER DE BOLSILLO</h1>
    <p class="texto--text textos px-12 mt-5 text-center">
      Este es nuestro bartender al alcance de tus manos.
      Simplemente coloca los ingredientes que tengas disponibles a tus manos y luego haz click en buscar.
      Asi de simple podras encontrar los diferentes cocteles que puedes preparar con lo que tienes disponible!.
    </p>
    <Loader v-if="loading" />
    <v-autocomplete
      v-model="newAlcoholNombre"
      class="pa-5"
      :items="alcoholes"
      clearable
      filled
      solo
      no-data-text="No existen Alcoholes con ese nombre"
      label="Añade un alcohol"
      hide-details
      item-text="nombre"
    ></v-autocomplete>
    <v-autocomplete
      v-model="newIngredienteNombre"
      class="pa-5"
      :items="mixers"
      clearable
      filled
      solo
      no-data-text="No existen Mixers con ese nombre"
      label="Añade un ingrediente"
      hide-details
      item-text="title"
    ></v-autocomplete>
    <div class="text-center">
      <v-btn
      class="mx-2"
      fab
      dark
      color="primario"
      @click="agregarIngrediente()"
      >
      <v-icon dark>
        mdi-plus
      </v-icon>
      </v-btn>
    </div>
    <v-list 
      class="pt-0"
      color="background"
      flat
    >
      <div
          v-for="ingrediente in ingredientes"
          :key="ingrediente.id"
      >
        <v-list-item>
            <template v-slot:default>
              <v-list-item-content>
                <v-list-item-title>{{ ingrediente.nombre }}</v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn
                  icon
                  @click="eliminarIngrediente(ingrediente.id)"
                >
                  <v-icon color="primario lighten-1">mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>

            </template>
        </v-list-item>
        <v-divider></v-divider>
      </div>
      <div class="text-center pa-10">
        <v-btn
          color="primario"
          x-large
          class="secundario--text"
          @click="buscar()"
        >BUSCAR</v-btn>
      </div>

    </v-list>
    <v-container class="ma-0 pt-10 background" fluid v-if="!loading">
            <h2 class="texto--text titulo d-flex justify-center">TRAGOS QUE PUEDES PREPARAR CON ESTOS INGREDIENTES</h2>
            <ListaCocteles :key="key" :ingredientes="ingredientes"/>
    </v-container>
  </div>
</template>
<script>
import { groq } from "@nuxtjs/sanity";
const query = groq`*[_type == "mixer"] | order(title asc) {...}`;
const query2 = groq`*[_type == "alcohol"] | order(nombre asc) {...}`;
export default {

  data() {
    return {
      mixers: [],
      alcoholes: [],
      newIngredienteNombre: "",
      newAlcoholNombre: "",
      ingredientes: [],
      key: false
    };
  },
  beforeMount() {
    this.fetchData();
    this.fetchData2();
  },
  methods:{
    agregarIngrediente(){
      if(this.newIngredienteNombre === "" && this.newAlcoholNombre === ""){
        return
      }
      if(this.newIngredienteNombre !== ""){
        if(!this.ingredientes.find(element => element.nombre === this.newIngredienteNombre)){
          const newIngrediente = {
          id: Date.now(),
          nombre: this.newIngredienteNombre
          }
          this.ingredientes.push(newIngrediente)
          this.newIngredienteNombre = ""
        }
      }
      if(this.newAlcoholNombre !== ""){
        if(!this.ingredientes.find(element => element.nombre === this.newAlcoholNombre)){
          const newIngrediente = {
          id: Date.now() + 1,
          nombre: this.newAlcoholNombre
          }
          this.ingredientes.push(newIngrediente)
          this.newAlcoholNombre = ""
        }
      }
    },
    eliminarIngrediente(id){
      this.ingredientes = this.ingredientes.filter(ingrediente => ingrediente.id !== id)
    },
    fetchData() {
      // this.error = this.mixers = null;
      this.loading = true;
      this.$sanity.fetch(query).then(
        (mixers) => {
          this.loading = false;
          this.mixers = mixers;
        },
        (error) => {
          this.error = error;
        }
      );
    },
    fetchData2() {
      // this.error = this.alcoholes = null;
      this.loading = true;
      this.$sanity.fetch(query2).then(
        (alcoholes) => {
          this.loading = false;
          this.alcoholes = alcoholes;
        },
        (error) => {
          this.error = error;
        }
      );
    },
    buscar(){
      this.key = !this.key;
    }
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