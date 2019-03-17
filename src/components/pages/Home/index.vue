<template>
  <div class="root">
    <!-- 搜索栏 -->
    <div style="position:fixed;top:0;width:100%;z-index:9999">
      <search-nav :isbtn="false"></search-nav>
    </div>
    <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore">
      <div
        class="goods-img"
        style="margin-top:1.12rem;"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="250"
        infinite-scroll-immediate-check="false"
      >
        <!-- 轮播图 -->
        <Home-Swipe :BannerList="BannerList"></Home-Swipe>
        <!-- tabbar 分类 -->
        <div class="tabbar-box">
          <div class="tabbar">
            <div class="tab-item" @click="goToType(0,l.ID)" v-for="(l,i) in ClassFirst" :key="i">
              <img :src="l.Logo" alt>
              <br>
              {{l.Name}}
            </div>
          </div>
        </div>
        <!-- 活动三张图 -->
        <div class="active-img">
          <div>
            <router-link to="/">
              <img src="../../../../static/images/tuangou.png" alt>
            </router-link>
          </div>
          <div>
            <router-link to="/home/freelist">
              <p>
                <img src="../../../../static/images/miandan.png" alt>
              </p>
            </router-link>
            <router-link to="/home/two99">
              <p>
                <img src="../../../../static/images/yikoujia.jpg" alt>
              </p>
            </router-link>
          </div>
        </div>
        <!-- 超值热卖 -->
        <div class="hot-sale">
          <p class="hot-title">
            <img src="../../../../static/images/hot_title.jpg" alt>
          </p>
          <!-- 循环遍历列表 -->
          <div class="for-list" v-for="(l,i) in hotsaleList" :key="i">
            <p class="hot-nav-mg" v-if="l.IsJump === true">
              <router-link :to="l.Url.indexOf('#') > 0?l.Url.split('#')[1]:l.Url">
                <img v-lazy="l.Image" alt="热卖大图">
                <!-- @click="JumpDetail(l.Url)" -->
              </router-link>
            </p>
            <p class="hot-nav-mg" v-else>
              <img v-lazy="l.Image" alt="热卖大图">
            </p>
            <div class="tabbar">
              <div class="tab-item" v-for="(item,index) in l.ProductList" :key="index">
                <router-link :to="'/nomalgoods/goodsdetail/'+item.Type+'/'+item.ProdID">
                  <div>
                    <p class="img">
                      <img v-lazy="item.Image" alt="商品图片">
                    </p>
                    <p class="goods-name">{{item.Name}}</p>
                    <p class="goods-info">{{item.Introduce}}</p>
                    <p class="goods-price">￥{{item.Price}}</p>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </mt-loadmore>
    <!-- 回到顶部 -->
    <BackTop></BackTop>
  </div>
</template>
<script>
import { Swipe, SwipeItem } from 'mint-ui'
import searchNav from '../../common/search'
import HomeSwipe from '../../common/swipe'
import BackTop from '../../common/backTop'

export default {
  data () {
    return {
      BannerList: [],
      ClassFirst: [],
      hotsaleList: [],
      page: 1, // 第一页
      topStatus: '',
      loading: false
    }
  },
  activated () {
    this.$store.state.showNav = true
  },
  components: {
    Swipe,
    SwipeItem,
    searchNav,
    HomeSwipe,
    BackTop
  },
  methods: {
    JumpDetail (url) {
      if (url.indexOf('#') > 0) {
        this.$router.push(url.split('#')[1])
      } else {
        window.location.href = url
      }
    },
    // 下拉刷新
    loadTop () {
      // 下拉刷新的同时 将当前页面置为1
      this.page = 1
      this.GetHotSaleList(this.page)
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    // 上滑加载更多
    loadMore () {
      this.loading = true
      this.page++
      this.GetHotSaleList(this.page)
    },
    goToType (n, id) {
      this.$router.push('/goodtype/' + n + '/' + id)
    },
    // 获取首页数据
    GetHotSaleList (p) {
      this.$http
        .get('/api/APP_Home/SuperHotSaleList', {
          pageIndex: p,
          pageSize: 5
        })
        .then(response => {
          this.$refs.loadmore.onTopLoaded()
          // this.BannerList = response.Result.banner
          // this.ClassFirst = response.Result.home
          // 如果是第一页直接赋值。若不是第一页则合并数据
          if (p === 1) {
            this.hotsaleList = response.Result.hotsale
            this.$refs.loadmore.onTopLoaded()
          } else {
            this.hotsaleList = this.hotsaleList.concat(response.Result.hotsale)
          }
          // 同时判断当前页是否是数据获取的最后一页。如果不是，则不禁止继续加载
          if (this.page < response.Result.page) {
            // this.page++
            this.loading = false
          } else {
            this.loading = true
          }
        })
    },
    // 获取banner
    // 获取首页数据
    GetBannerList () {
      this.$http
        .get('/api/APP_Home/GetBannerList', {
          type: 1,
          pageIndex: 1,
          pageSize: 99
        })
        .then(response => {
          this.BannerList = response.Result.banner
        })
    },
    // 获取板块
    GetClassList () {
      this.$http
        .get('/api/APP_Home/GetHomeClaList', {
        })
        .then(response => {
          this.ClassFirst = response.Result
        })
    }
  },
  mounted () {
    this.GetBannerList()
    this.GetClassList()
    this.GetHotSaleList(this.page)
  }
  // beforeRouteLeave (to, from, next) {
  //   let position = window.scrollY
  //   console.log(position)
  //   // let position = {
  //   //   x: window.pageXOffset,
  //   //   y: window.pageYOffset
  //   // }
  //   this.$store.state.scrollNum = position
  //   next()
  // }
}
</script>
<style scoped lang='scss'>
.root {
  margin-bottom: 1.4rem;

  // tabbar 分类滑动滚动条
  .tabbar-box {
    height: 2.413rem;
    padding: 0.133rem 0.265rem;

    .tabbar {
      height: 100%;
      display: -webkit-box;
      overflow-x: auto;
      /*适应苹果*/
      -webkit-overflow-scrolling: touch;
      .tab-item {
        // width: 2.213rem;
        width: 22.13%;
        height: 100%;
        text-align: center;
        background-color: #fff;
        img {
          width: 65%;
        }
      }
    }

    /*隐藏掉滚动条*/
    .tabbar::-webkit-scrollbar {
      display: none;
    }
  }

  // 活动 三张图
  .active-img {
    height: 5.375rem;
    padding: 0.265rem;
    display: flex;
    justify-content: space-around;

    div {
      width: 49%;
      height: 100%;
      background-color: #efefef;
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
      p {
        height: 2.38rem;
        img {
          width: 100%;
          height: 100%;
        }
      }

      p:nth-child(2) {
        position: absolute;
        bottom: 0;
        width: 100%;
      }
    }
  }

  // 超值热卖
  .hot-sale {
    padding: 0 0.265rem 0.133rem;

    // 热卖标题
    .hot-title {
      height: 0.833rem;
      text-align: center;
      img {
        height: 100%;
      }
    }

    // 循环遍历
    .for-list {
      margin-top: 0.2685rem;

      // 热卖顶部大图
      .hot-nav-mg {
        width: 100%;
        height: 3.785rem;
        background-color: #efefef;
        img {
          width: 100%;
          height: 100%;
        }
      }

      // 热卖分类
      .tabbar {
        // height: 4.077rem;
        padding: 0.265rem 0 0;
        // box-sizing: content-box;
        display: -webkit-box;
        overflow-x: auto;
        /*适应苹果*/
        -webkit-overflow-scrolling: touch;

        .tab-item {
          width: 2.533rem;
          height: 100%;
          background-color: #fff;
          line-height: 0.44rem;
          p {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .img {
            width: 2.4rem;
            height: 2.4rem;
            background-color: #fff;
            margin-bottom: 0.133rem;
            img {
              width: 100%;
              height: 100%;
            }
          }

          .goods-name {
            color: #333333;
            font-size: 0.3456rem;
          }

          .goods-info {
            color: #999;
            font-size: 0.2933rem;
          }

          .goods-price {
            color: #ff4e5a;
            font-size: 0.32rem;
          }
        }
      }

      /*隐藏掉滚动条*/
      .tabbar::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>
