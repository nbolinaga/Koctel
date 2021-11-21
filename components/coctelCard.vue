<template>
<v-card class="my-5 texto overflow-hidden" :width="$vuetify.breakpoint.mobile ? 'auto' : '25vw'" elevation="5" tile click.capture @click="goTo(`/coctel/${coctel.slug.current}`)">
    <v-card-title class="textos primario--text align-end titulo" truncate>{{coctel.nombre}}
        <v-icon v-if="coctel.categoria.includes('Sin Alcohol')" class="pb-1 alt--text" right>{{sinAlcoholLogo}}</v-icon>
        <v-icon  v-if="coctel.categoria.includes('Light')" class="pb-1 secundario--text" right>{{sinAzucar}}</v-icon>
        <v-spacer></v-spacer>
        <v-btn v-if="user != null" fab small @click.native.stop="like()">
            <v-icon v-if="liked" class="primario--text">mdi-heart</v-icon>
            <v-icon v-else class=" primario--text">mdi-heart-outline</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-subtitle class="d-flex inline textos alt--text font-weight-bold"><p v-for="alcohol in coctel.nombreAlcohol" :key="alcohol.nombre">{{alcohol}}</p></v-card-subtitle>
    <v-img :src="coctel.img" width="100%" :height="$vuetify.breakpoint.mobile ? '10vh' : '15vh'" gradient="to top, #EBFFFF30, #EBFFFF"><v-rating v-model="rating" readonly half-increments background-color="alt lighten-3" class="ml-1" color="alt"></v-rating></v-img>
</v-card>
</template>

<script>
import { mdiGlassCocktailOff, mdiAlphaLCircleOutline } from '@mdi/js';
export default {
    props:{coctel: {
        type: Object,
        default: null
      },
      userprop: {
        type: Object,
        default: null
      }
    },
    data() {
        return {
            user: null,
            sinAlcoholLogo: mdiGlassCocktailOff,
            sinAzucar: mdiAlphaLCircleOutline,
            liked: false,
            ratings: [],
        }
    },
    computed:{
        rating(){
            let ratingTotal = 0;
            let count = 0;
            this.ratings.forEach(rating => {
                ratingTotal += rating.value;
                count++;
            });
            return ratingTotal/count;
        }
    },
    mounted(){
        if(this.userprop != null){
            this.user = this.userprop
            if(this.user.favoritos.includes(this.coctel.slug.current)){
                this.liked = true
            }
        }
        this.$fire.firestore.collection('ratings').doc(`${this.coctel.slug.current}`).get().then(doc => {
            this.ratings = doc.data().ratings;
        });
    },
    methods:{
        goTo(url){
            this.$router.push(url);
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
        },
    }    
}
</script>

<style>
p + p::before{
  content: "-";
  padding: 3px;
}
</style>