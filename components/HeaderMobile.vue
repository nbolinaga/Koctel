<template>
    <div>
        <v-card id="mobileHeader" @click="open = !open" class="px-12 primario">
            <v-icon v-if="!open" class="white--text float-right">mdi-menu</v-icon>
            <v-icon v-if="open" class="white--text float-right">mdi-close</v-icon>
        </v-card> 
        <div v-if="open" class="d-flex justify-center modal">
            <ul id="nav" class="alt">
                <li v-for="(item, index) in menu" :key="index" @click="goToRoute(item.link)" active-class="alt--text" class="ml-n4 titulo texto--text no-background-hover"><v-icon class="pb-1 secundario--text mr-2">{{ item.icon }}</v-icon>{{ item.text }}</li>
                <li active-class="alt--text" class="ml-n4 titulo texto--text no-background-hover" @click="getAleatorio"><v-icon class="pb-1 secundario--text mr-2">{{ aleatorio.icon }}</v-icon>{{ aleatorio.text }}</li>
                <li v-if="user != null" active-class="alt--text" class="ml-n4 titulo texto--text no-background-hover" @click="getPerfil"><v-icon class="pb-1 secundario--text mr-2">{{ perfil.icon }}</v-icon>{{ perfil.text }}</li>
                <li class="mr-4">
                    <v-btn  v-if="user == null" fab color="primario" x-small @click="googleSignIn" ><v-icon class="white--text">mdi-google</v-icon></v-btn>
                    <v-btn  v-if="user != null" color="primario" class="white--text" small @click="logOut" >Salir <v-icon class="white--text" right>mdi-logout</v-icon></v-btn>
                    <v-snackbar v-model="snackbar" timeout="1000" absolute bottom color="alt" tile>
                        <h5 v-if="user != null" text-center>Ingresado Exitosamente</h5>
                        <h5 v-else text-center>Desconectado Exitosamente</h5>
                    </v-snackbar>
                </li>
            </ul>
        </div>
    </div>
    
</template>

<script>
import { groq } from "@nuxtjs/sanity";
const query = groq`*[_type == "coctel"] {slug}`;
export default {
    data() {
        return {
            open: false,
            snackbar: false,
            user: null,
            listaSlug: [],
            menu: [
                {
                    text: 'INICIO',
                    icon: 'mdi-home',
                    link: '/',
                    show: true},
                {
                    text: 'COCTELES',
                    icon: 'mdi-glass-cocktail',
                    link: '/#cocteles',
                    show: true},
                {
                    text: 'BARTENDER',
                    icon: 'mdi-account',
                    link: '/#bartender',
                    show: true},
                {
                    text: 'MAPA',
                    icon: 'mdi-map',
                    link: '/#mapa',
                    show: true}   
            ],
            aleatorio: {
                text: 'ALEATORIO',
                icon: 'mdi-shuffle-variant'},

            perfil:{
                text: 'PERFIL',
                icon: 'mdi-account-circle'}
            }
        },
        watch:{
            user(val){
                this.key = !this.key;
            }
        },
        beforeMount(){
            this.fetchData();
            localStorage.getItem('user') ? this.user = JSON.parse(localStorage.getItem('user')) : this.user = null;
        },
        methods: {
            fetchData() {
            this.error = this.listaSlug = null;
            this.loading = true;

            this.$sanity.fetch(query).then(
                (cocteles) => {
                this.loading = false;
                this.listaSlug = cocteles;
                },
                (error) => {
                this.error = error;
                }
                );
            },
            getAleatorio() {
                const random = Math.floor(Math.random() * this.listaSlug.length);
                this.$router.push({ path: `/coctel/${this.listaSlug[random].slug.current}` })
                this.open = false;
            },
            getPerfil() {
                this.$router.push({ path: `/perfil/${this.user.uid}` })
                this.open = false;
            },
            googleSignIn() {
                this.provider = new this.$fireModule.auth.GoogleAuthProvider()
                this.$fireModule.auth().signInWithPopup(this.provider).then(result => {
                    this.user = result.user;
                    localStorage.setItem('user', JSON.stringify(result.user.uid))
                    this.snackbar = true;
                    this.$fire.firestore.collection('users').doc(`${result.user.uid}`).get().then(doc => {
                        if(!doc.exists){
                            this.createUser()
                        }
                        else {
                            this.getPerfil();
                        }
                    });
                }).catch(e => {
                this.$snotify.error(e.message)
                })
            },
            logOut(){
                localStorage.clear();
                this.user = null;
                this.snackbar = true;
                this.$router.push('/#top').then(()=>{
                     window.location.reload(true);
                })
            },
            createUser(){
                this.$fire.firestore.collection("users").doc(`${this.user.uid}`).set(
                    {
                    uid: this.user.uid,
                    email: this.user.email,
                    displayName: this.user.displayName,
                    photoURL: this.user.photoURL,
                    favoritos: [],
                    ratings: [{}],
                    admin: false
                }
                ).then(() => {
                    window.location.reload(true);
                });
            },
            goToRoute(route){
                this.$router.push(`${route}`);
                this.open = false;
            }
        }
    }
</script>

<style lang="scss">
#mobileHeader{
    position: fixed !important;
    z-index: 999;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -50%);
}
.modal{
        width: 100vw;
        height: 100vh;
        background-color: rgba($color: #000000, $alpha: .70);
        position: fixed !important;
        top: 0;
        left: 0;
        z-index: 997;
    }
#nav{
    position: fixed !important;
    bottom: 8vh;
    left: 50%;
    transform: translate(-50%, 0%);
    z-index: 998;
    list-style: none;
    text-align: center;
    padding-top: 50px;
    width: 100vw;

    li{
        height: 50px;
    }
    a{
        text-decoration: none;
    }

    
}
</style>