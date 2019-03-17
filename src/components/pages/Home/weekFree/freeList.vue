<template>
  <div class="root">
    <!-- 每周免单列表 大图 -->
    <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore">
      <div class="goods-img"
      :style="'min-height:'+goodsImgH +'px'"
      v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="200"
         infinite-scroll-immediate-check='false'>
        <div class="for-img" v-for='(l,i) in AllList' :key="i">
          <router-link :to='"/goods/goodsdetail/0/"+l.ID'>
            <!-- <img src="../../../../../static/images/banner_one@2x.png" alt=""> -->
            <img v-lazy="l.ProdPoster" alt="">
          </router-link>
        </div>
        <div slot="top" class="mint-loadmore-top">
          <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
          <span v-show="topStatus === 'loading'">加载中...</span>
        </div>
      </div>
    </mt-loadmore>
    <router-link to="/freelist/about">
      <div class="help-info">
      </div>
    </router-link>

  </div>
</template>
<script>
export default {
  data () {
    return {
      isActicve: true,
      page: 1, // 第一页
      goodsImgH: 0,
      AllList: [],
      topStatus: '', // 上啦加载时的文本设置
      loading: false // 是否禁止无限加载

    }
  },
  components: {},
  methods: {
    loadTop () {
      this.page = 1
      this.getGetDailyFree(this.page)
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    loadMore () {
      this.loading = true
      this.page++
      this.getGetDailyFree(this.page)
    },
    getGetDailyFree (p) {
      this.$http.get('/api/APP_Product/GetDailyFree', {
        pageIndex: p,
        pageSize: 99
      })
        .then(function (response) {
          // 如果是第一页直接赋值。若不是第一页则合并数据
          if (p === 1) {
            this.AllList = response.Result.prod
            this.$refs.loadmore.onTopLoaded()
          } else {
            this.AllList = this.AllList.concat(response.Result.prod)
          }
          // 同时判断当前页是否是数据获取的最后一页。如果不是，则不禁止继续加载
          if (this.page < response.Result.page) {
            this.loading = false
          } else {
            this.loading = true
          }
        }.bind(this))
    }
  },
  mounted () {
    this.goodsImgH = document.documentElement.clientHeight
    this.getGetDailyFree(this.page)
  }
}

</script>
<style scoped lang='scss'>
.root {
  // 团购商品大图
  .goods-img {
    width: 100%;
    padding: 0.265rem 0.1866rem;
    background-color: #faf9f7;

    // margin-bottom: 1.333rem;
    .for-img {
      height: 3.7866rem;
      margin-bottom: 0.265rem;
      background: #fff;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .help-info {
    position: fixed;
    bottom: 2rem;
    right: 0.5rem;
    width: 1rem;
    height: 1rem;
    border-radius: 50% 50%;
    background-image: url("../../../../../static/images/about@2x.png");
    background-size: contain;
    background-repeat: no-repeat;
    animation: jump 1s infinite;
  }

  @keyframes jump {
    0% {
      transform: translate(0px, 0px);
    }

    50% {
      transform: translate(0px, -20px);
    }

    100% {
      transform: translate(0px, 0px);
    }
  }
}
</style>
