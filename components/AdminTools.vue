<template>
  <v-container>
      <h2 class="alt--text titulo text-center my-2">Administrador</h2>
        <!-- <v-timeline tile class="alt--text pt-16">
            <v-timeline-item v-for="(comentarioUser, index) in comments" :key="index" color="primario">
                <template #icon>
                    <v-avatar>
                    <img :src="comentarioUser[1].photoURL ? comentarioUser[1].photoURL : `https://i.pravatar.cc/64/${index}`">
                    </v-avatar>
                </template>
                    <template  #opposite >
                    <span class="primario--text" v-text="comentarioUser[1].date"></span>
                </template>
                <v-card class="elevation-15 texto pa-6" tile>
                    <v-card-title class="text-justify">{{comentarioUser[1].texto}}<v-spacer></v-spacer><v-btn right fab x-small color="secundario" class="texto--text mt-5" @click="deleteComment(comentarioUser[0],comentarioUser[2], index)"><v-icon >mdi-trash-can-outline</v-icon></v-btn></v-card-title>
                    <v-card-text tile class="alt texto--text pl-5 pt-5 mt-5 text-center"> - {{comentarioUser[1].user}} - </v-card-text>
                </v-card>
            </v-timeline-item>
        </v-timeline> -->
    <v-expansion-panels tile popout>
      <h3 class="mt-10 mb-5">Usuarios</h3>
      <v-expansion-panel v-for="(user,index) in users" :key="index">
        <v-expansion-panel-header>
            <h4>{{user.displayName}}</h4>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
            <img :src="user.photoURL" alt="" class="outline mt-5">
            <h5>{{user.id}}</h5>
            <v-btn right medium color="secundario" class="texto--text mt-5" @click="deleteUserConfirm()">Borrar Usuario</v-btn>
            <div v-if="confirm">
                <h4 class="mt-10 texto">¿Estas Seguro que quieres borrar el usuario?</h4>
                <v-btn right medium color="red" class="texto--text mt-5" @click="deleteUserCancel()">Cancelar</v-btn>
                <v-btn right medium color="green" class="texto--text mt-5" @click="deleteUser(user.id)">Borrar</v-btn>
            </div>
        </v-expansion-panel-content>
      </v-expansion-panel >
    </v-expansion-panels>
  </v-container>
</template>

<script>
export default {
    data() {
        return {
           users: {},
           comments: [],
           confirm: false
        }
    },
    beforeMount() {
        this.getComments();
        this.getUsers();
    },
    methods: {
        getComments(){
            this.$fire.firestore.collection('comentarios').get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    doc.data().comentarios.forEach((comentario, index) => {
                        this.comments.push([doc.id, comentario, index]);
                    })
                });
            });

            
       },
       async getUsers(){
            const events = await this.$fire.firestore.collection('users')
            events.get().then((querySnapshot) => {
            const tempDoc = querySnapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() }
                })
                this.users = tempDoc
            })
       },
       deleteComment(id, index, localIndex){
           this.comments.splice(localIndex, 1);
           this.$fire.firestore.collection("comentarios").doc(id).get().then((doc) => {
               const comentariosNuevos = doc.data().comentarios;
               comentariosNuevos.splice(index, 1);
               this.$fire.firestore.collection("comentarios").doc(id).update({
                   comentarios: comentariosNuevos
               });
           });
        },
        deleteUserCancel(){
            this.confirm = false;
        },
        deleteUserConfirm(){
            this.confirm = true
        },
        deleteUser(id){
            this.$fire.firestore.collection("users").doc(id).delete()
            this.confirm = false
            window.location.reload(true);
        }
    }
}
</script>

<style>

</style>