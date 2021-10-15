<template>
    <div>
        <Loader v-if="loading"></Loader>
        <v-container class="ma-0 pa-0" fluid v-if="!loading">
            <v-row no-gutters class="ma-0 pa-0">
                <v-col cols="12" md="4">
                    <v-img :src="coctel.img" alt="" height="70vh"/>
                </v-col>
                <v-col cols="12" md="8" class="primario pt-10" height="70vh" >
                    <h2 class="secundario--text titulo d-flex justify-center">{{coctel.nombre}}</h2>
                    <v-list class="primario mx-0 px-0 my-2">
                        <v-list-item class="mt-2 mb-5 no-background-hover" nuxt :to="`/alcohol/${coctel.idAlcohol.current}`" :ripple="false">
                             <v-list-item-title class="detalles--text d-flex justify-center textosDetalles secundario py-2">{{coctel.nombreAlcohol}}</v-list-item-title>
                        </v-list-item>
                        <v-list-item v-for="ingrediente in coctel.ingredientes" :key="ingrediente._id"  class="my-n5 no-background-hover" nuxt :to="`/mixer/${ingrediente.id.current}`" :ripple="false">
                            <v-list-item-title class="links--text d-flex justify-center textos">{{ingrediente.title}}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                    <h3 class="secundario--text titulo d-flex justify-center mt-10">Preparacion</h3>
                    <p class="secundario--text textos px-12 mt-5 text-center">{{coctel.preparacion}}</p>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { groq } from "@nuxtjs/sanity";
const query = groq`*[slug.current == $slug] {_id, nombre, slug, "nombreAlcohol" : alcohol->nombre, "idAlcohol" : alcohol->id, ingredientes[]->{title, id}, "img": mainImage.asset->url, "preparacion": preparacion[0].children[0].text}`;

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
    .textosDetalles{
        font-weight: 500;
    }
</style>