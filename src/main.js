import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/filters'
import GlobalMixins from '@/mixins'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import {faCloud, faCloudSun, faCloudRain, faSun, faSnowflake} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Autocomplete from 'vue2-autocomplete-js'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/assets/css/style.scss'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
library.add(faCloud, faCloudSun, faCloudRain, faSun, faSnowflake)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('autocomplete', Autocomplete);

Vue.config.productionTip = false

Vue.mixin(GlobalMixins)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
