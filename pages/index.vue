<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h1>Koctel Main Page</h1>
        <h3 class='primario--text'>{{cocteles != null ? 'Conectado': 'No Conectado'}}</h3>
        <p>{{cocteles}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { groq } from "@nuxtjs/sanity";
// import sanity from "@sanity/client"
export default {
  
  async asyncData({ $sanity }) {
    const query = groq`*[_type == "coctel"]`;
    const cocteles = await $sanity.fetch(query).catch(() => console.log("Error"));
    return { cocteles };
  }
};
</script>
