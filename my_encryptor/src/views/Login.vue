<template>
  <div>
    <h3>Por favor inicia sesión con Google para continuar</h3>
    <button @click="login">Login con Google</button>
  </div>
</template>


<script>
import firebase from "firebase";
export default {
  methods: {
    login() {
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result=> {
          var token = result.credential.accessToken;
          var user = result.user;
          this.$router.push('/')
        })
        .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
        });
    }
  }
};
</script>