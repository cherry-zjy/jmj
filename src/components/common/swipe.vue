<template>
      <div class="bannerAll">
        <mt-swipe>
          <mt-swipe-item v-for="(l,i) in BannerList" :key="i">
            <img :src="l.Image" :alt='"banner图"+i' v-if="l.IsJump === true" @click="JumpDetail(l.Url)">
            <img :src="l.Image" :alt='"banner图"+i' v-else>
          </mt-swipe-item>
          <!-- <mt-swipe-item>
            <img src="../../../static/images/banner_one@2x.png" alt="">
          </mt-swipe-item>
          <mt-swipe-item>
            <img src="../../../static/images/banner_two@2x.png" alt="">
          </mt-swipe-item>
          <mt-swipe-item>
            <img src="../../../static/images/banner_three@2x.png" alt="">
          </mt-swipe-item> -->
        </mt-swipe>
      </div>
</template>
<script>
export default {
  props: ['BannerList'],
  data () {
    return {

    }
  },
  components: {},
  methods: {
    JumpDetail (url) {
      window.location.href = url
    }
  },
  mounted () {}
}
</script>
<style scoped lang='scss'>
// 轮播图 css，
.bannerAll {
  height: 4.2rem;
  .mint-swipe {
    height: 4rem;
    padding: 0.265rem;
    box-sizing: border-box;
    overflow: visible !important;
    .mint-swipe-items-wrap {
      background-color: #efefef !important;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
