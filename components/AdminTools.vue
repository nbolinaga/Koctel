<template>
  <div class="alt mt-5 pa-5 pa-md-15 pb-10">
      <h2 class="white--text titulo text-center my-2">Herramientas de Administrador</h2>
    <v-expansion-panels tile popout>
      <h3 class="mt-10 mb-5 primario--text">Eliminar Usuarios</h3>
      <v-expansion-panel v-for="(user,index) in users" :key="index" >
        <v-expansion-panel-header>
            <h4>{{user.displayName}}</h4>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
            <img :src="user.photoURL" alt="" class="outline mt-5">
            <h5>{{user.id}}</h5>
            <v-btn right medium color="secundario" class="texto--text mt-5" @click="deleteUserConfirm()">Eliminar Usuario</v-btn>
            <div v-if="confirm">
                <h4 class="mt-10 texto">¿Estas Seguro que quieres borrar el usuario?</h4>
                <v-btn right medium color="red" class="texto--text mt-5" @click="deleteUserCancel()">Cancelar</v-btn>
                <v-btn right medium color="green" class="texto--text mt-5" @click="deleteUser(user.id)">Eliminar</v-btn>
            </div>
        </v-expansion-panel-content>
      </v-expansion-panel >
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
    data() {
        return {
           users: {},
           confirm: false
        }
    },
    beforeMount() {
        this.getUsers();
    },
    methods: {
       async getUsers(){
            const events = await this.$fire.firestore.collection('users')
            events.get().then((querySnapshot) => {
            const tempDoc = querySnapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() }
                })
                this.users = tempDoc
            })
       },
        deleteUserCancel(){
            this.confirm = false;
        },
        deleteUserConfirm(){
            this.confirm = true
        },
        deleteUser(id){
            this.$fire.firestore.collection("users").doc(id).delete().then(function() {
                window.location.reload(true);
                this.confirm = false
            })   
        }
    }
}
</script>

<style>

</style>