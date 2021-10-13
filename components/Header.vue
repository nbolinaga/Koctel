<template>
    <v-app-bar color="secundario" fixed flat>
        <v-app-bar-title>
            <LogoLargo fill="#9C3B3B" class="logoHeader"/>
        </v-app-bar-title>
        <v-spacer></v-spacer>
        <v-list class="d-flex flex-row">
            <v-list-item v-for="(item, index) in menu" :key="index" nuxt="true" :to="item.link" active-class="detalles--text" class="no-background-hover">
                <v-list-item-title >
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
                    text: 'Inicio',
                    icon: 'mdi-home',
                    link: '/'},
                {
                    text: 'Cocteles',
                    icon: 'mdi-glass-cocktail',
                    link: '/cocteles'},
                {
                    text: 'Bartender',
                    icon: 'mdi-account',
                    link: '/bartender'},
                {
                    text: 'Aleatorio',
                    icon: 'mdi-shuffle-variant ',
                    link: '/aleatorio'}
            ]
        }
    },
}
</script>

<style lang="scss">
    .logoHeader {
        width: 4vmax;
        height: 100%;
    }
    .no-background-hover::before {
        background-color: transparent;
    }
</style>