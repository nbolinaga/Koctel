<template>
    <v-app-bar color="secundario" fixed flat>
        <LogoLargo fill="#9C3B3B" class="logoHeader"/>
        <v-spacer></v-spacer>
        <v-list class="d-flex flex-row">
            <v-list-item v-for="(item, index) in menu" :key="index" nuxt="true" :to="item.link" active-class="detalles--text" class="titulo no-background-hover">
                <v-list-item-title class="nav-item">
                    <v-icon class="pb-1">{{ item.icon }}</v-icon>
                    {{ item.text }}
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-app-bar>
</template>

<script>
export default {
    data() {
        return {
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
                {
                    text: 'ALEATORIO',
                    icon: 'mdi-shuffle-variant ',
                    link: '/aleatorio'}
            ]
        }
    },
}
</script>

<style lang="scss">
    .logoHeader {
        width: auto;
        height: 3.5vh;
    }
    .nav-item{
        font-size: 2vh;
    }
    .no-background-hover::before {
        background-color: transparent;
    }
</style>