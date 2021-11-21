<template>
    <div class="pa-md-10 pa-3">
        <Loader v-if="loading" />
        <v-row class="d-md-flex justify-space-around">
          <h4 v-if="coctelesFiltrados.length == 0 && !loading" class="textos primario--text mt-10">No se encontro ningun coctel</h4>
          <coctelCard v-for="coctel in coctelesFiltrados" :key="coctel._id" :coctel="coctel" :userprop="user"/>
        </v-row>
        <v-row class="d-md-flex justify-space-around">
          <h2 class="texto--text titulo d-flex justify-center my-10">TRAGOS QUE SOLO TE FALTAN ALGUNOS INGREDIENTES PARA PODER PREPARAR</h2>
          <coctelCard v-for="coctelInc in coctelesIncompletos" :key="coctelInc._id" :coctel="coctelInc" :userprop="user"/>
        </v-row>
    </div>
</template>

<script>
import { groq } from "@nuxtjs/sanity";
const query = groq`*[_type == "coctel"] | order(nombre asc) {_id, nombre, "nombreAlcohol": alcohol[]->nombre, slug, "img": mainImage.asset->url, "categoria": categoria[]->titulo, ingredientes[]->{title, id}}`;

export default {
    props:{
      ingredientes:{
        type: Array,
        default: null,
      },
    },
  data() {
    return {
      cocteles: [],
      coctelesFiltrados: [],
      coctelesIncompletos: [],
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
    //   this.error = this.cocteles = null;
      this.loading = true;
      this.$sanity.fetch(query).then(
        (cocteles) => {
          this.cocteles = cocteles;
          let counter = 0;
          let counterAlcohol = 0;
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
                this.coctelesIncompletos.push(coctel);
              }
            counter = 0;
            counterAlcohol = 0;
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