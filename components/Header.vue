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
                <v-list-item-title class="nav-item">
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
            googleSignIn() {
                this.provider = new this.$fireModule.auth.GoogleAuthProvider()
                this.$fireModule.auth().signInWithPopup(this.provider).then(result => {
                localStorage.setItem('user', JSON.stringify(result.user))
                this.user = result.user;
                this.snackbar = true;
                this.$router.push('/')
                this.setUser();
                }).catch(e => {
                this.$snotify.error(e.message)
                })
            },
            async setUser(){
                const newUser = {
                    ratings: {},
                    favorites: []
                }
                const id = this.user.uid
                console.log(id)
                const usersCollection = this.$fireModule.firestore().collection('users');
                const user = await usersCollection.doc(id).get();
                return user.exists ? user.data() : usersCollection.doc(id).set(newUser);
            },
            logOut(){
                localStorage.setItem('user', null)
                this.user = null;
                this.snackbar = true;
                this.$router.push('/')
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