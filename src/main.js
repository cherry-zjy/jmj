// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'

import Vue from 'vue'
// 全局引入mint： npm install --save mint-ui
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
// 按需引入iview ui 需要全部引入css
// import 'iview/dist/styles/iview.css'
import App from './App'
import router from './router'
import store from './store/index'

import axios from './axios/index'
// import WX from 'weixin-js-sdk'
import base from './domain'
Vue.use(base)
// 使用mint（全局）
Vue.use(Mint)

Vue.prototype.$http = axios
Vue.config.productionTip = false
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
// 全局定义 cookie方法
Vue.prototype.setCookie = function (name, value) {
  var Days = 30
  var exp = new Date()
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
}

Vue.prototype.getCookie = function (name) {
  var arr = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if ((arr = document.cookie.match(reg))) {
    return arr[2]
  } else {
    return null
  }
}
Vue.prototype.delCookie = function (name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = this.setCookie(name)
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}
router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title
  var navList = ['/dailygbuy', '/find', '/home', '/shopping', '/mine']
  navList.forEach(item => {
    if (to.path !== item) {
      return store.commit('showHide', false)
    }
  })
  // 判断是否是以下页面。去判断是否存在token（是否已经登录，）
  if (to.path.indexOf('find') > 0 || to.path.indexOf('shopping') > 0 || to.path.indexOf('mine') > 0) {
    // 判断当前是否存在token，如果不存在且没有openid
    // if (!localStorage.getItem('token')) {
    //   next('/author')
    //   return false
    // }
  }

  // if (!Vue.prototype.getCookie('openid') && to.path !== '/author') {
  //   // 保存用户第一次进入的url
  //   localStorage.setItem('firstURL', to.fullPath)
  //   next('/author')
  //   next()
  //   return false
  // }
  next()
})

// // 登录后跳转方法
Vue.prototype.goFirstURL = () => {
  let url = localStorage.getItem('firstURL')
  // 判断存储的url不存在，或者 包含author
  if (!url || url.indexOf('/author') !== -1) {
    router.push('/') // 跳转到默认页面
  } else {
    // if (url === '/') {
    //   url = '/dailygbuy'
    // }
    localStorage.setItem('firstURL', '/')
    router.push(url)
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
