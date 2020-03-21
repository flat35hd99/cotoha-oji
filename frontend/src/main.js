import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import vuetify from './plugins/vuetify';
import firebase from 'firebase'

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyCuwxD6CSjU5FP-kMre0a0Rg-8BnAib6II",
  authDomain: "cotoha-oji.firebaseapp.com",
  databaseURL: "https://cotoha-oji.firebaseio.com",
  projectId: "cotoha-oji",
  storageBucket: "cotoha-oji.appspot.com",
  messagingSenderId: "353636430905",
  appId: "1:353636430905:web:57efa882a82b1309c889e8"
};

firebase.initializeApp(firebaseConfig)

Vue.prototype.$firebase = firebase

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
