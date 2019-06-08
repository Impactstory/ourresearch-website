
// from https://github.com/vuetifyjs/vue-cli-plugin-vuetify/issues/3
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'



import Vuetify from 'vuetify'


import VueScrollTo from 'vue-scrollto'
import VueAnalytics from 'vue-analytics'
import VueMoment from 'vue-moment'
import VueTyperPlugin from 'vue-typer'
import FlagIcon from 'vue-flag-icon'

// http://www.7te.net/zp-ui/#/sparkline
import Sparkline from 'vue-sparklines'



import 'vuetify/dist/vuetify.min.css'




Vue.use(Vuetify, {
  theme: {
    accent: '#FF8064',
    secondary: '#343434',
    primary: '#8c9eff'
  }
})
Vue.use(VueScrollTo)
Vue.use(VueAnalytics, {
  id: "UA-23384030-8",
  router
})
Vue.use(VueMoment);
Vue.use(VueTyperPlugin)
Vue.use(FlagIcon)
Vue.use(Sparkline)



Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
