<template>
<v-card class="my-5 texto overflow-hidden" width="25vw" elevation="5" tile click.capture @click="goTo(`/coctel/${coctel.slug.current}`)">
    <v-card-title class="textos primario--text align-end titulo">{{coctel.nombre}}
        <v-icon v-if="coctel.categoria.includes('Sin Alcohol')" class="pb-1 alt--text" right>{{sinAlcoholLogo}}</v-icon>
        <v-icon  v-if="coctel.categoria.includes('Light')" class="pb-1 secundario--text" right>{{sinAzucar}}</v-icon>
        <v-spacer></v-spacer>
        <v-btn v-if="user != null" fab small @click.native.stop="like()">
            <v-icon v-if="liked" class="primario--text">mdi-heart</v-icon>
            <v-icon v-else class=" primario--text">mdi-heart-outline</v-icon>
        </v-btn>
    </v-card-title>
    <v-card-subtitle class="d-flex inline textos alt--text font-weight-bold"><p v-for="alcohol in coctel.nombreAlcohol" :key="alcohol.nombre">{{alcohol}}</p></v-card-subtitle>
    <v-img :src="coctel.img" width="100%" height="15vh" gradient="to top, #EBFFFF30, #EBFFFF"><v-rating v-model="rating" readonly half-increments background-color="alt lighten-3" class="ml-1" color="alt"></v-rating></v-img>
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
            rating: 5,
            user: null,
            sinAlcoholLogo: mdiGlassCocktailOff,
            sinAzucar: mdiAlphaLCircleOutline,
            liked: false,
        }
    },
    mounted(){
        this.user = this.userprop
        this.liked = localStorage.getItem(this.coctel.slug.current)
    },
    methods:{
        goTo(url){
            this.$router.push(url);
        },
        like(){
            this.liked = !this.liked;
            if(this.liked){
                localStorage.setItem(this.coctel.slug.current, true);
                this.mutateAdd();
            }else{
                localStorage.removeItem(this.coctel.slug.current);
                this.mutateDelete();
            }
        },
        mutateAdd(){

            fetch(`https://s25qt0j9.api.sanity.io/v2021-06-07/data/mutate/production`, {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer skGixis99l1hlaib5goQrVR7h2n61F2CJU12bZxyyBUvczzlDlHZM5gWUVyFdbQnlfTSUBuEkV6B54tPHtQL61ipQMk4694KUbaGzuulRc6sVWbhL5yRb5mV6HKD0FsiuIp8o3GSUdF0AbBVv4jL8OGZlflEbpRVnTXzQBsDWghfJwxoCukV`
            },
            body: JSON.stringify({
                "mutations": [
                    {
                    "patch": {
                        "id": `${this.user.id}`,
                        "insert": {
                            "after": "favoritos[-1]",
                            "items": [
                                {
                                "_type": "reference",
                                "_ref": `${this.coctel._id}`
                                }
                            ]
                            }
                        }
                    }
                ]
            })
            })
            .then(response => response.json())
            .then(result => console.log(result))
            .catch(error => console.error(error))
        },
        mutateDelete(){
            fetch(`https://s25qt0j9.api.sanity.io/v2021-06-07/data/mutate/production`, {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer skGixis99l1hlaib5goQrVR7h2n61F2CJU12bZxyyBUvczzlDlHZM5gWUVyFdbQnlfTSUBuEkV6B54tPHtQL61ipQMk4694KUbaGzuulRc6sVWbhL5yRb5mV6HKD0FsiuIp8o3GSUdF0AbBVv4jL8OGZlflEbpRVnTXzQBsDWghfJwxoCukV`
            },
            body: JSON.stringify({
                "mutations": [
                    {
                    "patch": {
                        "id": `${this.user.id}`,
                        "unset": ["favoritos"]
                
                        }
                    }
                ]
            })
            })
            .then(response => response.json())
            .then(result => console.log(result))
            .catch(error => console.error(error))
        }
    }    
}
</script>

<style>
p + p::before{
  content: "-";
  padding: 3px;
}
</style>