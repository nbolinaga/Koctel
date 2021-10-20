<template>
  <div class="container">
    <div class="loading" v-if="loading">Cargando...</div>
    <h1 class="primario--text titulo d-flex justify-center">CONOCE A NUESTRO BARTENDER DE BOLSILLO</h1>
    <p class="texto--text textos px-12 mt-5 text-center">
      Este es nuestro bartender al alcance de tus manos.
      Simplemente coloca los ingredientes que tengas disponibles a tus manos y luego haz click en buscar.
      Asi de simple podras encontrar los diferentes cocteles que puedes preparar lo que tienes disponible!.
    </p>
    
    <v-autocomplete
      v-model="newIngredienteNombre"
      class="pa-5"
      :items="mixersAlcohol"
      clearable
      filled
      solo
      no-data-text="No existen Mixers o Alcoholes con ese nombre"
      label="Añade un ingrediente"
      hide-details
    ></v-autocomplete>
    <div class="text-center">
      <v-btn
      class="mx-2"
      fab
      dark
      color="primario"
      @click="agregarIngrediente()"
      :disabled="tengoData"
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
                  @click="eliminarIngrediente(ingrediente.id)"
                  icon
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
        >BUSCAR</v-btn>
      </div>

    </v-list>
    <v-container class="ma-0 pt-10 background" fluid v-if="!loading">
            <h2 class="texto--text titulo d-flex justify-center">TRAGOS QUE PUEDES PREPARAR CON ESTOS INGREDIENTES</h2>
            <ListaCocteles/>
    </v-container>
  </div>
</template>
<script>


export default {

  data() {
    return {
      mixersAlcohol: ["Agua","Ron","Limon","Hielo","CocaCola","Vodka"],
      newIngredienteNombre: "",
      ingredientes: [],
    };
  },
  beforeMount() {
  },
  methods:{
    agregarIngrediente(){
      const newIngrediente = {
        id: Date.now(),
        nombre: this.newIngredienteNombre
      }
      this.ingredientes.push(newIngrediente)
    },
    eliminarIngrediente(id){
      this.ingredientes = this.ingredientes.filter(ingrediente => ingrediente.id !== id)
    },
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