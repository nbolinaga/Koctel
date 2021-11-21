<template>
  <div class="container">
    
    <h1 class="primario--text titulo d-md-flex justify-center text-left">CONOCE A NUESTRO BARTENDER DE BOLSILLO</h1>
    <p class="texto--text textos px-md-12 mt-5 text-md-center text-justify">
      Este es nuestro bartender al alcance de tus manos.
      Simplemente selecciona un ingrediente que tengas disponible a tus manos en el dropdown y luego haz click en agregar.
      Asi de simple podras encontrar los diferentes cocteles que puedes preparar con lo que tienes disponible!.
    </p>
    <Loader v-if="loading" />
    <v-autocomplete
      v-model="newAlcoholNombre"
      class="pa-5"
      :items="alcoholes"
      clearable
      dark
      no-data-text="No existen Alcoholes con ese nombre"
      label="Añade un alcohol"
      hide-details
      item-text="nombre"
      @keypress.enter="agregarIngrediente()"
    ></v-autocomplete>
    <v-autocomplete
      v-model="newIngredienteNombre"
      class="pa-5"
      :items="mixers"
      clearable
      dark
      no-data-text="No existen Mixers con ese nombre"
      label="Añade un ingrediente"
      hide-details
      item-text="title"
      @keypress.enter="agregarIngrediente()"
    ></v-autocomplete>
    <div class="text-center">
      <v-btn
      class="mx-2 my-5"
      dark
      color="primario"
      @click="agregarIngrediente()"
      >
      Agregar
      <v-icon dark right>
        mdi-plus
      </v-icon>
      </v-btn>
    </div>
    <v-list 
      class="pt-0"
      color="alt"
      flat
    >
      <div
          v-for="ingrediente in ingredientes"
          :key="ingrediente.id"
      >
        <v-list-item dark>
            <template #default>
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
    </v-list>
    <v-container v-if="!loading" class="ma-0 pt-10 alt" fluid>
      <h2 class="texto--text titulo d-flex justify-center">TRAGOS QUE PUEDES PREPARAR CON ESTOS INGREDIENTES</h2>
      <ListaBartender :key="key" :ingredientes="ingredientes"/>
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
  watch: {
    ingredientes(){
      this.buscar();
    }
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
  .v-input__slot .v-label{
    color: whitesmoke !important;
  }
</style>