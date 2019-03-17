// 创建一个store
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 创建存储对象
export default new Vuex.Store({
  // state 所有的状态（组件公用的数据）不能直接使用
  state: {
    scrollNum: 0,
    // 默认隐藏底部导航
    showNav: false,
    token: ''
  },

  mutations: {
    showHide (state, bool) {
      return (state.showNav = bool)
    }
  }
})
