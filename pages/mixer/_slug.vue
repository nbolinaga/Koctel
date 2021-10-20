<template>
    <div>
        <Loader v-if="loading"></Loader>
        <v-container v-if="!loading" class="ma-0 pa-12  primario" fluid>
            <h2 class="secundario--text titulo d-flex justify-center">{{ingrediente.title}}</h2>
            <p class="secundario--text textos mt-5 text-center">{{ingrediente.description}}</p>
        </v-container>
         <v-container v-if="!loading" class="ma-0 pt-10 background" fluid>
            <h2 class="texto--text titulo d-flex justify-center">TRAGOS CON ESTE INGREDIENTE</h2>
            <ListaCocteles :ingrediente-filtro="ingrediente.title"/>
        </v-container>
    </div>
</template>

<script>
import { groq } from "@nuxtjs/sanity";
const query = groq`*[id.current == $slug]`;

export default {
    data() {
        return {
            ingrediente: {},
            loading: true
        }
    },
    beforeMount() {
      this.error = this.post = null;

      this.$sanity.fetch(query, { slug: this.$route.params.slug }).then(
        (ingrediente) => {
          this.loading = false;
          this.ingrediente = ingrediente[0];
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
        height: auto;
        margin: 0 auto;
    }
</style>