<template>
    <v-app-bar color="secundario" fixed flat class="overflow-hidden">
        <LogoLargo fill="#9C3B3B" class="logoHeader"/>
        <v-spacer></v-spacer>
        <v-list class="d-flex flex-row" >
            <v-list-item v-for="(item, index) in menu" :key="index" nuxt :to="item.link" active-class="detalles--text" class="titulo no-background-hover">
                <v-list-item-title class="nav-item">
                    <v-icon class="pb-1">{{ item.icon }}</v-icon>
                    {{ item.text }}
                </v-list-item-title>
            </v-list-item>
            <v-list-item active-class="detalles--text" class="titulo no-background-hover">
                <v-list-item-title class="nav-item" @click="getAleatorio">
                    <v-icon class="pb-1">{{ aleatorio.icon }}</v-icon>
                    {{ aleatorio.text }}
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-app-bar>
</template>

<script>
import { groq } from "@nuxtjs/sanity";
const query = groq`*[_type == "coctel"] {slug}`;
export default {
    data() {
        return {
            listaSlug: [],
            menu: [
                {
                    text: 'INICIO',
                    icon: 'mdi-home',
                    link: '/'},
                {
                    text: 'COCTELES',
                    icon: 'mdi-glass-cocktail',
                    link: '/cocteles'},
                {
                    text: 'BARTENDER',
                    icon: 'mdi-account',
                    link: '/bartender'},
            ],
            aleatorio: {
                text: 'ALEATORIO',
                icon: 'mdi-shuffle-variant'}
            }
        },
        beforeMount(){
            this.fetchData();
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
                console.log(this.listaSlug[random].slug.current);
                this.$router.push({ path: `/coctel/${this.listaSlug[random].slug.current}` })
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