<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h1>Prueba Cocteles</h1>
        <div v-for="coctel in cocteles" :key="coctel.nombre" class="mt-10">
          <h2 class="red--text text--darken-2 pa-3">{{ coctel.nombre }}</h2>
          <v-img :src="coctel.img" alt="" class="" width="200"></v-img>
          <ul>
            <li class="blue--text mt-3">{{coctel.nombreAlcohol}}</li>
            <li v-for="ingrediente in coctel.ingredientes" :key="ingrediente.title">{{ingrediente.title}}</li>
          </ul>
        </div>
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
    const query = groq`*[_type == "coctel"] {_id, nombre, "nombreAlcohol" : alcohol->nombre, ingredientes[]->{title}, "img": mainImage.asset->url}`;
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