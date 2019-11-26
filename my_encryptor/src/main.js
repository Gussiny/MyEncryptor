import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'
var bigInt = require("big-integer");

Vue.config.productionTip = false
require("firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyChc747hYCpi1eZF8LNquzxvg4d4Kssxow",
  authDomain: "my-encryptor.firebaseapp.com",
  databaseURL: "https://my-encryptor.firebaseio.com",
  projectId: "my-encryptor",
  storageBucket: "my-encryptor.appspot.com",
  messagingSenderId: "545907644805",
  appId: "1:545907644805:web:0408aad8f88ca21b204cec"
};
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
window.db = db;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
