import Vue from 'vue'
import App from './App'
import router from './router'
// require("dotenv").config()

import * as VueGoogleMaps from "vue2-google-maps"

Vue.config.productionTip = false

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBir2F-YqC1VYxaWwVfmyIi1lYlPxk7k3Y',
    libraries: "places"
  }
});

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
