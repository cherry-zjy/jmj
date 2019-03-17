<template>
  <div class="root">
    <!-- 顶部tabbar -->
    <div class="tab-bar">
      <div :class="isActicve?'active':''" @click="tabbarClick(1)">本日团购</div>
      <div :class="!isActicve?'active':''" @click="tabbarClick(2)">即将上线</div>
    </div>
    <!-- 团购倒计时 -->
    <div class="down-time">
      <div class="left" v-if="isActicve">团购中，先抢先得</div>
      <div class="left" v-else>即将上线，先抢先得</div>
      <div class="right">
        <span v-if="isActicve">距结束</span>
        <span v-else>距开始</span>
        <span class="time-box">{{hN}}</span>
        <span>时</span>
        <span class="time-box">{{mN}}</span>
        <span>分</span>
        <span class="time-box">{{sN}}</span>
        <span>秒</span>
      </div>
    </div>
    <!-- 团购商品 大图 -->
    <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore">
      <div class="goods-img" :style="'min-height:'+goodsImgH +'px'"
      v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="200"
         infinite-scroll-immediate-check='false'>
         <!-- <div class="for-img" v-if="isActicve">
            <router-link to="/bankcard/conversion">
              <img src="../../../../static/images/banner_one@2x.png" alt="">
            </router-link>
          </div> -->
          <!-- <div class="for-img" v-else>
            <router-link to="/bankcard/conversion/1">
              <img src="../../../../static/images/banner_one@2x.png" alt="">
            </router-link>
          </div> -->
        <div v-for='(l,i) in AllList' :key="i">
          <div class="for-img">
            <router-link :to='"/goods/goodsdetail/1/"+l.ID' v-if="!l.IsComingOnline">
              <img v-lazy="l.ProdPoster" alt="">
            </router-link>
            <router-link :to='"/goods/goodsdetail/1/"+l.ID+"/1/1"' v-if="l.IsComingOnline">
             <img v-lazy="l.ProdPoster" alt="">
            </router-link>
          </div>
        </div>
        <div v-if="AllList.length === 0" style="text-align:center;padding-top:5rem;">
          <span style="color:#808080;font-size:0.346rem">暂无商品</span>
        </div>
      </div>
    </mt-loadmore>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'

export default {
  data () {
    return {
      isActicve: true,
      goodsImgH: 0,
      sN: '00',
      mN: '00',
      hN: '00',
      AllList: [],
      timeDownNum: 0,
      page: 1, // 第一页
      topStatus: '',
      loading: false

    }
  },
  activated () {
    this.$store.state.showNav = true
    this.getTimeDown()
  },
  components: {Toast},
  methods: {
    // 下拉刷新
    loadTop () {
      // 下拉刷新的同时 将当前页面置为1
      this.page = 1
      this.getDailyGBuy(this.isActicve ? 1 : 2, this.page)
      // setTimeout(() => {
      //   this.$refs.loadmore.onTopLoaded()
      // }, 500)
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    // 上滑加载更多
    loadMore () {
      this.loading = true
      this.page++
      this.getDailyGBuy(this.isActicve ? 1 : 2, this.page)
    },
    // 获取时间倒计时
    getTimeDown () {
      var _this = this
      // 获取当前时间的时间戳
      var timestamp = Date.parse(new Date())
      // 获取当天 0 点的时间戳
      var timeStampO = new Date(new Date().setHours(0, 0, 0, 0)) / 1000
      // 获取次日零点的时间戳
      var timesEnd = (timeStampO + 86400) * 1000
      var timeDownNum = (timesEnd - timestamp) / 1000
      var timeDown = setInterval(() => {
        timeDownNum--
        if (timeDownNum <= 0) {
          clearInterval(timeDown)
        } else {
          _this.sN = _this.changeData(timeDownNum).split('-')[2]
          _this.mN = _this.changeData(timeDownNum).split('-')[1]
          _this.hN = _this.changeData(timeDownNum).split('-')[0]
        }
      }, 1000)
    },
    // 获取每日团购
    getDailyGBuy (t, p) {
      this.$http.get('/api/APP_Product/GetDayDealPosterList', {
        type: t,
        pageIndex: p,
        pageSize: 20
      })
        .then(function (response) {
          // 如果是第一页直接赋值。若不是第一页则合并数据
          if (p === 1) {
            this.AllList = response.Result.postlist
            this.$refs.loadmore.onTopLoaded()
          } else {
            this.AllList = this.AllList.concat(response.Result.postlist)
          }
          // 同时判断当前页是否是数据获取的最后一页。如果不是，则不禁止继续加载
          if (this.page < response.Result.page) {
            this.loading = false
          } else {
            this.loading = true
          }
        }.bind(this))
    },
    // 导航切换
    tabbarClick (num) {
      this.page = 1
      this.AllList = []
      this.$store.state.scrollNum = 0
      if (num === 1) {
        this.isActicve = true
      } else {
        this.isActicve = false
      }
      this.getDailyGBuy(num, this.page)
    }

  },
  mounted () {
    // 获取当前页面的fontsize，计算剩余的首屏高度
    var htmlSize = getComputedStyle(window.document.documentElement)['font-size'].split('px')[0]
    this.goodsImgH = document.documentElement.clientHeight - Number(htmlSize) * (0.933 + 1.333 + 1.333)
    // 获取当前页数据
    this.getDailyGBuy(this.isActicve ? 1 : 2, 1)
  },
  beforeRouteLeave (to, from, next) {
    let position = window.scrollY
    this.$store.state.scrollNum = position
    next()
  }
}

</script>
<style scoped lang='scss'>
.root {
  // 顶部tabbar
  .tab-bar {
    width: 100%;
    height: 1.333rem;
    display: flex;
    justify-content: space-around;
    line-height: 1.333rem;

    div {
      width: 50%;
      text-align: center;
      font-size: 0.4rem;
    }

    .active {
      color: #f7b500;
      border-bottom: 2px solid #f7b500;
    }
  }

  // 倒计时
  .down-time {
    width: 100%;
    padding: 0.1866rem 0.265rem;
    height: 0.933rem;
    font-size: 0.32rem;
    color: #999;
    background-color: #faf9f7;

    .left {
      line-height: 0.5598rem;
    }

    .right {
      span {
        line-height: 0.5598rem;
        text-align: center;
      }

      .time-box {
        display: inline-block;
        width: 0.666rem;
        height: 0.56rem;
        border-radius: 0.1rem;
        color: #fff;
        background-color: #f7b500;
      }
    }
  }

  // 团购商品大图
  .goods-img {
    width: 100%;
    padding: 0 0.265rem 0.1866rem;
    background-color: #faf9f7;
    margin-bottom: 1.333rem;

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
}
</style>
