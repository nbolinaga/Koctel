<template>
    <div>
        <Loader v-if="loading"></Loader>
        <v-container v-if="!loading" class="ma-0 pa-12  texto" fluid>
            <img :src="user.imageUrl" alt="" class="outline mt-5">
            <h2 class="secundario--text titulo d-flex justify-center">{{user.name}}</h2>
            <h2 class="primario--text titulo d-flex justify-center my-10">Tus cocteles favoritos</h2>
            <v-row class="d-flex justify-space-around alt mt-15">
                <coctelCard v-for="coctel in user.favoritos" :key="coctel._id" :coctel="coctel" :userprop="user"/>
            </v-row>
            
        </v-container>
    </div>
</template>

<script>
import { groq } from "@nuxtjs/sanity";
import { mdiGlassCocktailOff, mdiAlphaLCircleOutline } from '@mdi/js';

export default {
    data() {
        return {
            loading: true,
            userID: null,
            user: null,
            sinAlcoholLogo: mdiGlassCocktailOff,
            sinAzucar: mdiAlphaLCircleOutline,
        }
    },
    beforeMount() {
      localStorage.getItem('user') ? this.userID = JSON.parse(localStorage.getItem('user')) : this.userID = null;
      this.error = this.user = null;
      const query = groq`*[_id == '${this.userID}']{..., favoritos[]->{..., "img": mainImage.asset->url, "nombreAlcohol": alcohol[]->nombre,  "categoria": categoria[]->titulo}}`;
      this.$sanity.fetch(query).then(
        (user) => {
          this.loading = false;
          this.user = user[0];
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