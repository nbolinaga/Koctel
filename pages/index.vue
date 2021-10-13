<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h1>Koctel Main Page</h1>
        <p>{{cocteles}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { groq } from "@nuxtjs/sanity";
import sanity from "@sanity/client"

export default {
  async asyncData({ $sanity }) {
    const query = groq`*[_type == "coctel"]`;
    const cocteles = await $sanity.fetch(query);
    return { cocteles };
  }
};
</script>
