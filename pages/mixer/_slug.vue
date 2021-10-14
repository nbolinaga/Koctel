<template>
    <div>
        <div class="loading" v-if="loading">Cargando...</div>
        <v-container class="ma-0 pa-12  primario" fluid v-if="!loading">
            <h2 class="secundario--text titulo d-flex justify-center">{{ingrediente.title}}</h2>
            <p class="secundario--text textos mt-5 text-center">{{ingrediente.description}}</p>
        </v-container>
         <v-container class="ma-0 pt-10 background" fluid v-if="!loading">
            <h2 class="texto--text titulo d-flex justify-center">TRAGOS CON ESTE INGREDIENTE</h2>
            <p>{{cocteles}}</p>
        </v-container>
    </div>
</template>

<script>
import { groq } from "@nuxtjs/sanity";
const query = groq`*[id.current == $slug]`;
const coctelesQuery = groq`*[_type == "coctel"]{..., "test": alcohol->{id{current}}}`;

export default {
    data() {
        return {
            cocteles: [],
            ingrediente: {},
            loading: true
        }
    },
    beforeMount() {
      this.error = this.post = null;

      this.$sanity.fetch(query, { slug: this.$route.params.slug }).then(
        (ingrediente) => {
          this.ingrediente = ingrediente[0];
        },
        (error) => {
          this.error = error;
        }
      );

      this.$sanity.fetch(coctelesQuery).then(
        (cocteles) => {
          this.loading = false;
          this.cocteles = cocteles;
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