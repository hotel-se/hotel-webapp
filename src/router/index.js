import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Search.vue'
import Results from '@/pages/Results.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/:query',
      name: 'Results',
      props: true,
      component: Results
    },
  ]
})
