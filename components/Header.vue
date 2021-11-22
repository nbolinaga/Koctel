<template>
    <v-app-bar :key="key" color="secundario" fixed flat class="overflow-hidden">
        <LogoLargo fill="#FFFFFF" class="logoHeader"/>
        <v-spacer></v-spacer>
        <v-list class="d-flex flex-row secundario" >
            <v-list-item v-for="(item, index) in menu" :key="index" nuxt :to="item.link" active-class="alt--text" class="titulo texto--text no-background-hover">
                <v-list-item-title class="nav-item">
                    <v-icon class="pb-1 ">{{ item.icon }}</v-icon>
                    {{ item.text }}
                </v-list-item-title>
            </v-list-item>
            <v-list-item active-class="alt--text" class="titulo texto--text no-background-hover">
                <v-list-item-title class="nav-item" @click="getAleatorio">
                    <v-icon class="pb-1">{{ aleatorio.icon }}</v-icon>
                    {{ aleatorio.text }}
                </v-list-item-title>
            </v-list-item>
            <v-list-item v-if="user != null" active-class="alt--text" class="titulo texto--text no-background-hover">
                <v-list-item-title class="nav-item" @click="getPerfil">
                    <v-icon class="pb-1">{{ perfil.icon }}</v-icon>
                    {{ perfil.text }}
                </v-list-item-title>
            </v-list-item>
        </v-list>
        <v-spacer></v-spacer>
        <v-btn  v-if="user == null" fab color="primario" x-small @click="googleSignIn" ><v-icon class="white--text">mdi-google</v-icon></v-btn>
        <v-btn  v-if="user != null" color="primario" class="white--text" small @click="logOut" >Salir <v-icon class="white--text" right>mdi-logout</v-icon></v-btn>
        <v-snackbar v-model="snackbar" timeout="1000" absolute bottom color="alt" tile>
            <h5 v-if="user != null" text-center>Ingresado Exitosamente</h5>
            <h5 v-else text-center>Desconectado Exitosamente</h5>
        </v-snackbar>
    </v-app-bar>
</template>

<script>
import { groq } from "@nuxtjs/sanity";
const query = groq`*[_type == "coctel"] {slug}`;
export default {
    data() {
        return {
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
            },
            getPerfil() {
                this.$router.push({ path: `/perfil/${this.user.uid}` })
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
            }
        }
    }
</script>

<style lang="scss">
    .logoHeader {
        width: auto;
        height: 3.5vh;
    }
    .nav-item{
        font-size: 2vh;
        cursor: pointer;
    }
    .no-background-hover::before {
        background-color: transparent;
        color: $links;
    }
</style>