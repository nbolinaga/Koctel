<template>
    <div>
        <Loader v-if="loading"></Loader>
        <v-container v-if="!loading" class="ma-0 pa-12  texto" fluid>
            <img :src="user.imageUrl" alt="" class="outline mt-5">
            <h2 class="secundario--text titulo d-flex justify-center">{{user.name}}</h2>
        </v-container>
    </div>
</template>

<script>
import { groq } from "@nuxtjs/sanity";


export default {
    data() {
        return {
            loading: true,
            userID: null,
            user: null
        }
    },
    beforeMount() {
      localStorage.getItem('user') ? this.userID = JSON.parse(localStorage.getItem('user')) : this.userID = null;
      this.error = this.user = null;
      const query = groq`*[_id == '${this.userID}']{...}`;
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