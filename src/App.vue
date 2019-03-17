<template>
  <div id="app">
    <Nav-Bar v-if="$store.state.showNav"></Nav-Bar>
    <keep-alive exclude="test-keep-alive">
      <!-- <transition :name="animationType"> -->
      <router-view v-if="$route.meta.keepAlive"></router-view>
      <!-- </transition> -->
    </keep-alive>
    <!-- <transition :name="animationType"> -->
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- </transition> -->
  </div>
</template>

<script>
// 引入底部导航（需要对路径进行判断，做隐藏）
import NavBar from './components/common/navBar.vue'
export default {
  name: 'App',
  data: function () {
    return {
      animationType: ''
    }
  },
  components: {
    NavBar
  },
  watch: {
    $route: function (to, from) {
      // 切换路由，页面置顶
      var toNum = to.path.split('/').length
      var fromNum = from.path.split('/').length
      if (from.path !== '/') {
        if (toNum === fromNum) {
          // 平级切换
          // window.scrollY = 0
          // this.animationType = ''
        } else if (toNum > fromNum) {
          // 进入
          // window.scrollY = 0
          // this.animationType = 'routein'
        } else {
          // 退出
          // this.animationType = 'routeout'
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import "./components/common/base.scss";
@import "./components/common/mintChange.scss";
.root {
  width: 100%;
}
.shareImg {
  // width: 65%;
  box-shadow: 2px 2px 2px #000;
}
/*进入动画*/
.routein-enter-active {
  z-index: 10;
}
.routein-enter-active,
.routein-leave-active {
  transition: all 0.7s;
  position: absolute;
}

.routein-enter {
  transform: translateX(100%);
}

.routein-leave-active {
  transform: translateX(-100%);
}
/*退出动画*/

.routeout-enter-active,
.routeout-leave-active {
  transition: all 0.7s;
  position: absolute;
}

.routeout-enter {
  transform: translateX(-100%);
}

.routeout-leave-active {
  transform: translateX(100%);
  z-index: 9999;
}

/*tab动画*/

.tabani-enter-active,
.tabani-leave-active {
  transition: all 0.3s;
}

.tabani-enter,
.tabani-leave-active {
  transform: translateY(50%);
}

.qqq-enter-active,
.qqq-leave-active {
  transition: all 0.7s;
  position: absolute;
}

.qqq-leave-active {
  transform: translateY(-100%);
}
.qqq-enter {
  transform: translateY(100%);
  position: absolute;
}
.van-tabs {
  width: 100%;
  height: 1.33rem;
  line-height: 1.33rem;
  font-size: 0.4rem;
  color: #4d4d4d;
  background-color: #fff;
  white-space: nowrap;
  padding: 0 0.265rem;
  position: fixed !important;
  top: 0;
  z-index: 9999;
  .van-tabs__line {
    display: none;
  }
  .van-tabs__nav--line {
    padding: 0 0.265rem;
  }
  .van-tab--active {
    color: #f7b500;
  }
  .van-tab {
    flex-basis: none !important;
    flex: none !important;
  }
}
.author_qr {
  width: 80%;
  border-radius: 5px;
  position: fixed;
  top: 50%;
  left: 50%;
}
</style>
