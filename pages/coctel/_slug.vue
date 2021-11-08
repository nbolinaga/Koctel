<template>
    <div>
        <Loader v-if="loading"></Loader>
        <v-container v-if="!loading" class="ma-0 pa-0" fluid>
            <v-row no-gutters class="ma-0 pa-0" >
                <v-col cols="12" md="4">
                    <v-img :src="coctel.img" alt="" height="100%" width="auto" cover>
                        <v-btn v-if="userID != null" fab big  class="ma-5 float-right" @click.native.stop="like()">
                            <v-icon v-if="liked" class="primario--text">mdi-heart</v-icon>
                            <v-icon v-else class=" primario--text">mdi-heart-outline</v-icon>
                        </v-btn>
                    </v-img>
                </v-col>
                <v-col cols="12" md="8" class="texto pt-10">
                    <v-rating v-model="rating" readonly half-increments background-color="secundario lighten-3" color="secundario" small class="d-flex justify-center"></v-rating>
                    <h2 class="primario--text titulo d-flex justify-center">{{coctel.nombre}}</h2>
                    <v-list class="texto mx-0 px-0 my-2">
                        <v-list-item v-for="(alcohol, index) in coctel.alcohol" :key="alcohol.id" class="my-n5 mx-12 no-background-hover" nuxt :to="`/alcohol/${alcohol.id.current}`" :ripple="false">
                             <v-list-item-title class="alt--text d-flex justify-center textosDetalles" ><div v-if="alcohol.nombre != 'Sin Alcohol'" class="mr-1">{{coctel.cantidades[index]}} - </div>{{alcohol.nombre}}</v-list-item-title>
                        </v-list-item>
                        <v-list-item></v-list-item>
                        <v-list-item v-for="(ingrediente, index) in coctel.ingredientes" :key="ingrediente._id"  class="my-n5 no-background-hover" nuxt :to="`/mixer/${ingrediente.id.current}`" :ripple="false">
                            <v-list-item-title class="secundario--text d-flex justify-center textos">{{coctel.cantidades[index+coctel.alcohol.length]}} - {{ingrediente.title}}</v-list-item-title>
                        </v-list-item>
                        <v-list-item class="mt-10 no-background-hover" nuxt :to="`/pais/${coctel.pais.id.current}`" :ripple="false">
                            <v-list-item-title  id="pais" class="primario--text d-flex justify-center titulo">{{coctel.pais.nombre}}</v-list-item-title>
                        </v-list-item>
                        <v-list-item v-if="userID != null" class="d-flex justify-center mt-10 mb-5">
                            <v-rating v-model="rating" half-increments background-color="alt lighten-3" color="alt" large></v-rating>
                        </v-list-item>
                        
                    </v-list>
                </v-col>
            </v-row>
            <h3 class="detalles--text titulo d-flex justify-center mt-10">Preparacion</h3>
            <p class="texto--text textos px-12 mt-5 mx-12 text-center mb-12">{{coctel.preparacion}}</p>
            <div v-for="(comentario, index) in comentarios" :key="index" class="d-flex justify-center alt--text white"><h4>{{comentario.texto}} </h4> <p> - {{comentario.user}}</p></div>
        </v-container>
    </div>
</template>

<script>
import { groq } from "@nuxtjs/sanity";
const query = groq`*[slug.current == $slug] {_id, nombre, slug, "pais": pais->{...}, "alcohol" : alcohol[]->{nombre,id}, ingredientes[]->{title, id}, "img": mainImage.asset->url, "preparacion": preparacion[0].children[0].text, "cantidades": cantidades[]}`;

export default {
    data() {
        return {
            coctel: {},
            loading: true,
            rating: 5,
            userID: null,
            user: null,
            liked: false,
            comentarios: ["hello", "world"]
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
    methods: { 
        fetchUserData(){
            this.$fire.firestore.collection('users').doc(`${this.userID}`).get().then(doc => {
                this.user = doc.data();
            });
            
        },
        fetchData(){
            this.$sanity.fetch(query, { slug: this.$route.params.slug }).then(
            coctel => {
            this.coctel = coctel[0];
             if(this.userID != null){
                 if(this.user.favoritos.includes(this.coctel.slug.current)){
                this.liked = true;
                }
             }
            this.loading = false;
            this.$fire.firestore.collection('comentarios').doc(`${this.coctel.slug.current}`).get().then(doc => {
                this.comentarios = doc.data().comentarios;
            });
            },
            (error) => {
            this.error = error;
            });
            
        },
        like(){
            this.liked = !this.liked;
            if(this.liked){
                this.user.favoritos.push(this.coctel.slug.current);
                localStorage.setItem(this.coctel.slug.current, true);
                this.$fire.firestore.collection("users").doc(`${this.user.uid}`).update({
                    favoritos: this.user.favoritos
                })
            }else{
                this.user.favoritos.splice(this.user.favoritos.indexOf(`${this.coctel.slug.current}`), 1);
                localStorage.removeItem(this.coctel.slug.current);
                this.$fire.firestore.collection("users").doc(`${this.user.uid}`).update({
                    favoritos: this.user.favoritos
                })
            }
        }
    }
}
</script>

<style lang="scss">
    .container {
        width: 100vw;
        margin: 0 auto;
    }
    .textosDetalles{
        font-weight: 500;
    }
    #pais{
        font-size: 1.5em;
    }
</style>