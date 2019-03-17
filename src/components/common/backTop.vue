<template>
  <div class="backTop" v-if="isscroll">
    <img class="backTopImg" src="../../../static/images/top.png" @click="scrollBackTop">
  </div>
</template>
<script>
export default {
  data () {
    return { isscroll: false }
  },
  components: {},
  methods: {
    // 又快到慢的回到顶部
    scrollBackTop () {
      var scrollToptimer = setInterval(function () {
        var top = document.body.scrollTop || document.documentElement.scrollTop
        var speed = top / 4
        if (document.body.scrollTop !== 0) {
          document.body.scrollTop -= speed
        } else {
          document.documentElement.scrollTop -= speed
        }
        if (top === 0) {
          clearInterval(scrollToptimer)
        }
      }, 30)
    }
  },
  mounted () {
    var tt = this
    window.onscroll = function () {
      // 变量t是滚动条滚动时，距离顶部的距离
      var t = document.documentElement.scrollTop || document.body.scrollTop
      if (t > 400) {
        tt.isscroll = true
      } else {
        tt.isscroll = false
      }
    }
  },
  activated () {
    var tt = this
    tt.isscroll = false
    window.onscroll = function () {
      // 变量t是滚动条滚动时，距离顶部的距离
      var t = document.documentElement.scrollTop || document.body.scrollTop
      if (t > 400) {
        tt.isscroll = true
      } else {
        tt.isscroll = false
      }
    }
  }
}
</script>
<style scoped lang='scss'>
.backTop {
  position: fixed;
  bottom: 1.6rem;
  right: 0.6rem;
  width: 1.2rem;
  height: 1.2rem;
  padding: 0.2rem;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
