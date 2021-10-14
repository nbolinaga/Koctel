<template>
    <div>
        <div class="loading" v-if="loading">Cargando...</div>
        <v-container class="ma-0 pa-0" fluid v-if="!loading">
            <v-row no-gutters class="ma-0 pa-0">
                <v-col cols="12" md="4">
                    <v-img :src="coctel.img" alt="" height="70vh"/>
                </v-col>
                <v-col cols="12" md="8" class="primario pt-10" height="70vh" >
                    <h2 class="secundario--text titulo d-flex justify-center">{{coctel.nombre}}</h2>
                    <ul class="mx-0 px-0 my-2">
                        <li v-for="ingrediente in coctel.ingredientes" :key="ingrediente" class="my-2 links--text textos d-flex justify-center">
                            {{ingrediente.title}}
                        </li>
                    </ul>
                    <h3 class="secundario--text titulo d-flex justify-center mt-10">Preparacion</h3>
                    <p class="secundario--text textos px-12 mt-5 text-center">{{coctel.preparacion}}</p>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { groq } from "@nuxtjs/sanity";
const query = groq`*[slug.current == $slug] {_id, nombre, slug, "nombreAlcohol" : alcohol->nombre, ingredientes[]->{title}, "img": mainImage.asset->url, "preparacion": preparacion[0].children[0].text}`;

export default {
    data() {
        return {
            coctel: {},
            loading: true
        }
    },
    beforeMount() {
        this.error = this.post = null;

      this.$sanity.fetch(query, { slug: this.$route.params.slug }).then(
        (coctel) => {
          this.loading = false;
          this.coctel = coctel[0];
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
    .outline {
        outline: 3px solid red;
    }
</style>