import Vue from 'vue'
import App from './App'
import router from './router'
import { MapInstaller } from '@progress/kendo-map-vue-wrapper'

Vue.config.productionTip = false

Vue.use(MapInstaller)

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
