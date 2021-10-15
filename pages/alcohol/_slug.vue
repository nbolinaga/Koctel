<template>
    <div>
         <Loader v-if="loading"></Loader>
        <v-container class="ma-0 pa-0" fluid v-if="!loading">
            <v-container class="ma-0 pa-12  primario" fluid v-if="!loading">
            <h2 class="secundario--text titulo d-flex justify-center">{{alcohol.nombre}}</h2>
            <p class="secundario--text textos mt-5 text-center">{{alcohol.descripcion}}</p>
         </v-container>
         <v-container class="ma-0 pt-10 background" fluid v-if="!loading">
            <h2 class="texto--text titulo d-flex justify-center">TRAGOS CON ESTE ALCOHOL</h2>
            <ListaCocteles/>
        </v-container>
        </v-container>
    </div>
</template>

<script>
import { groq } from "@nuxtjs/sanity";
const query = groq`*[id.current == $slug]`;

export default {
    data() {
        return {
            alcohol: {},
            loading: true
        }
    },
    beforeMount() {
        this.error = this.post = null;

      this.$sanity.fetch(query, { slug: this.$route.params.slug }).then(
        (alcohol) => {
          this.loading = false;
          this.alcohol = alcohol[0];
        },
        (error) => {
          this.error = error;
        }
      );
    },
}
</script>

<style lang="scss">
    .container {
        width: 100vw;
        margin: 0 auto;
    }
</style>