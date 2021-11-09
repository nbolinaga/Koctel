<template>
    <div>
        <Loader v-if="loading"></Loader>
        <v-container v-if="!loading" class="ma-0 pa-12  texto" fluid>
            <h2 class="secundario--text titulo d-flex justify-center">{{pais.nombre}}</h2>
            <img :src="pais.img" alt="" class="outline mt-5">
        </v-container>
         <v-container v-if="!loading" class="ma-0 pt-10 alt" fluid>
            <h2 class="texto--text titulo d-flex justify-center">TRAGOS DE ESTE PAIS</h2>
            <ListaCocteles :pais="pais.nombre"/>
        </v-container>
    </div>
</template>

<script>
import { groq } from "@nuxtjs/sanity";
const query = groq`*[id.current == $slug]{..., "img": bandera.asset->url}`;

export default {
    data() {
        return {
            pais: {},
            loading: true
        }
    },
    beforeMount() {
      this.error = this.post = null;

      this.$sanity.fetch(query, { slug: this.$route.params.slug }).then(
        (pais) => {
          this.loading = false;
          this.pais = pais[0];
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
    .outline {
        display: block;
        margin: 0 auto;
    }
</style>