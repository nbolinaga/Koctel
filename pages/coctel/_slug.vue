<template>
    <div>
        <Loader v-if="loading"></Loader>
        <v-container v-if="!loading" class="ma-0 pa-0" fluid>
            <v-row no-gutters class="ma-0 pa-0" >
                <v-col cols="12" md="4">
                    <v-img :src="coctel.img" alt="" height="100%" width="auto" cover/>
                </v-col>
                <v-col cols="12" md="8" class="primario pt-10">
                    <h2 class="secundario--text titulo d-flex justify-center">{{coctel.nombre}}</h2>
                    <v-list class="primario mx-0 px-0 my-2 mb-10">
                        <v-list-item v-for="(alcohol, index) in coctel.alcohol" :key="alcohol.id" class="my-n5 mx-12 no-background-hover" nuxt :to="`/alcohol/${alcohol.id.current}`" :ripple="false">
                             <v-list-item-title class="detalles--text d-flex justify-center secundario textosDetalles" ><div v-if="alcohol.nombre != 'Sin Alcohol'" class="mr-1">{{coctel.cantidades[index]}} - </div>{{alcohol.nombre}}</v-list-item-title>
                        </v-list-item>
                        <v-list-item></v-list-item>
                        <v-list-item v-for="(ingrediente, index) in coctel.ingredientes" :key="ingrediente._id"  class="my-n5 no-background-hover" nuxt :to="`/mixer/${ingrediente.id.current}`" :ripple="false">
                            <v-list-item-title class="links--text d-flex justify-center textos">{{coctel.cantidades[index+coctel.alcohol.length]}} - {{ingrediente.title}}</v-list-item-title>
                        </v-list-item>
                        <v-list-item class="mt-10 no-background-hover" nuxt :to="`/pais/${coctel.pais.id.current}`" :ripple="false">
                            <v-list-item-title  id="pais" class="background--text d-flex justify-center titulo">{{coctel.pais.nombre}}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-col>
            </v-row>
            <h3 class="detalles--text titulo d-flex justify-center mt-10">Preparacion</h3>
            <p class="texto--text textos px-12 mt-5 mx-12 text-center mb-12">{{coctel.preparacion}}</p>
        </v-container>
    </div>
</template>

<script>
import { groq } from "@nuxtjs/sanity";
const query = groq`*[slug.current == $slug] {_id, nombre, slug, "pais": pais->{...}, "alcohol" : alcohol[]->{nombre,id}, ingredientes[]->{title, id}, "img": mainImage.asset->url, "preparacion": preparacion[0].children[0].text, "cantidades": cantidades[]}`;

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
    #pais{
        font-size: 1.5em;
    }
</style>