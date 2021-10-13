<template>
  <div class="container">
    <h1>Prueba Cocteles</h1>
      <div class="d-flex justify-center">
        <div v-for="coctel in cocteles" :key="coctel.nombre" class="ma-5 primary pa-10" style="width: 25vw;">
          <h2 class="white-text pa-3">{{ coctel.nombre }}</h2>
          <v-img :src="coctel.img" alt="" class="" width="100%"></v-img>
          <ul>
            <li class="blue--text mt-3">{{coctel.nombreAlcohol}}</li>
            <li v-for="ingrediente in coctel.ingredientes" :key="ingrediente.title">{{ingrediente.title}}</li>
          </ul>
          <p class="mt-5">{{coctel.preparacion}}</p>
        </div>
    </div>
  </div>
</template>

<script>
import { groq } from "@nuxtjs/sanity";
import sanity from "@sanity/client"
import imageUrlBuilder from '@sanity/image-url';
const imageBuilder = imageUrlBuilder(sanity);


export default {
  async asyncData({ $sanity }) {
    const query = groq`*[_type == "coctel"] {_id, nombre, "nombreAlcohol" : alcohol->nombre, ingredientes[]->{title}, "img": mainImage.asset->url, "preparacion": preparacion[0].children[0].text}`;
    const cocteles = await $sanity.fetch(query);
    return { cocteles };
  },
  methods: {
    imageUrlFor(source) {
      return imageBuilder.image(source);
    }
  }
};
</script>

<style>

</style>