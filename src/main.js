// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './vuex'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

const isDebug_mode = process.env.NODE_ENV !== 'production';

Vue.config.devtools = isDebug_mode;
Vue.config.silent = !isDebug_mode;

Vue.config.productionTip = false

Vue.use(VueI18n)
Vue.use(ElementUI)

import messages from './i18n'
const i18n = new VueI18n({locale: 'en', fallbackLocale: 'en', messages})

/* eslint-disable no-new */
new Vue({el: '#app', store, i18n, template: '<App/>', components: {
    App
  }})
