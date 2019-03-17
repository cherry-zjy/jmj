<template>
  <div style="width:100%">
    <div class="search">
      <div class="left">
        <input type="text" v-model="keywords" @change="changeVal()" placeholder="搜索您需要的商品">
        <img @click="keyWordsSearch()" src="../../../../static/images/search@2x.png" alt="">
      </div>
    </div>
    <div class="tab-bar">
      <div :class="!isClick1?'active':''" @click="isClickOne()">
        <p>综合
          <!-- <img :src="isClick1?'../../../../static/images/zhong@2x.png':'../../../../static/images/shang@2x.png'" alt=""> -->
        </p>
      </div>
      <div :class="!isClick2?'active':''" @click="isClickTwo()">
        <p>销量
          <!-- <img :src="isClick2?'../../../../static/images/zhong@2x.png':'../../../../static/images/shang@2x.png'" alt=""> -->
        </p>
      </div>
      <div :class="isClick3 !==0 ?'active':''" @click="isClickThree(isClick3)">
        <p>价格
          <img v-if="isClick3 === 0" src="../../../../static/images/zhong@2x.png" alt="">
          <img v-else-if="isClick3 === 1" src="../../../../static/images/shang@2x.png" alt="">
          <img v-else-if="isClick3 === 2" src="../../../../static/images/xia@2x.png" alt="">
        </p>
      </div>
    </div>
    <div class="root">
      <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore">
        <div :style="'min-height:'+allHeight +'px'" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
          infinite-scroll-distance="200" infinite-scroll-immediate-check='false'>
          <div class="for-list" v-for="(l,i) in AllList" :key="i">
            <router-link :to="'/nomalgoods/goodsdetail/'+l.Type+'/'+l.ID">
              <div class="list">
              <!-- <router-link :to='"/two99/goodsinfo/"+l.ID'> -->
              <div class="goods-img">
                <img :src="l.Image" :alt="l.Name">
              </div>
              <div class="goods-title">{{l.Name}} </div>
              <!-- </router-link> -->
              <div class="goods-author">
                <p class="left">
                  <span>￥{{l.Price}}</span>
                </p>
                <p class="right">
                  <!-- <img src="../../../../static/images/hot_numerical@2x.png" alt=""> -->
                </p>
                <div class="clear"></div>
              </div>
              </div>
            </router-link>
          </div>
          <div v-if="AllList.length === 0" style="text-align:center;padding-top:5rem;">
            <span style="color:#808080;font-size:0.346rem">暂无商品</span>
          </div>
        </div>
      </mt-loadmore>
    </div>
  </div>

</template>
<script>
export default {
  data () {
    return {
      allHeight: 0,
      keywords: '',
      isClick1: true,
      isClick2: true,
      isClick3: 0,
      // 获取列表数据
      AllList: [],
      page: 1,
      topStatus: '',
      loading: false

    }
  },
  components: {},
  methods: {
    isClickOne () {
      this.isClick1 = !this.isClick1
      this.page = 1
      this.GetFixedPriceList(this.page)
    },
    isClickTwo () {
      this.isClick2 = !this.isClick2
      this.page = 1
      this.GetFixedPriceList(this.page)
    },
    isClickThree (num) {
      if (num === 2) {
        this.isClick3 = 0
      } else {
        this.isClick3 = num + 1
      }
      this.page = 1
      this.GetFixedPriceList(this.page)
    },
    changeVal () {
      this.page = 1
      this.AllList = []
      // this.$router.replace('/home/searchpage/searchgoods/' + this.keywords)
      this.GetFixedPriceList(this.page)
    },
    keyWordsSearch () {
      this.page = 1
      this.AllList = []
      this.GetFixedPriceList(this.page)
    },
    // 下拉刷新
    loadTop () {
      // 下拉刷新的同时 将当前页面置为1
      this.page = 1
      this.GetFixedPriceList(this.page)
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    // 上滑加载更多
    loadMore () {
      this.loading = true
      this.page++
      this.GetFixedPriceList(this.page)
    },
    // 获取商品列表
    GetFixedPriceList (p) {
      this.$http.get('/api/APP_Home/HomeSearch', {
        colligate: this.isClick1 === true ? 0 : 1,
        price: this.isClick3,
        sales: this.isClick2 === true ? 0 : 1,
        pageIndex: p,
        pageSize: 4,
        sear: this.keywords ? this.keywords : '-1'
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
    // 获取当前页面的fontsize，计算剩余的首屏高度
    var htmlSize = getComputedStyle(window.document.documentElement)['font-size'].split('px')[0]
    this.allHeight = document.documentElement.clientHeight - Number(htmlSize) * 1.333
    // 获取当前页数据
    this.keywords = this.$route.params.keywords
    this.GetFixedPriceList(1)
  },
  // 监听当前页面的id是否变化 或者通过路由守卫来动态设置meta.keepAlive     beforeRouteEnter    beforeRouteLeave
  activated: function () {
    let k = this.$route.params.keywords
    if (this.keywords !== k) {
      this.keywords = this.$route.params.keywords
      this.GetFixedPriceList(1)
    }
  }
}

</script>
<style scoped lang='scss'>
@import "../../common/base.scss";

// 搜索栏
.search {
  width: 100%;
  padding: 0.1733rem 0.265rem;
  height: 1.12rem;
  display: flex;
  border-bottom: 1px solid #e6e6e6;
  background-color: #fff;

  .left {
    padding-left: 0.5467rem;
    border: none;
    border-radius: 0.5rem;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    position: relative;

    input {
      border: none;
      width: 90%;
      height: 100%;
      border-radius: 0.5rem;
      background-color: #f5f5f5;
      font-size: 0.345rem;
    }

    input::-webkit-input-placeholder {
      color: #808080;
    }

    img {
      margin-left: 0.25rem;
      width: 0.5065rem;
      position: absolute;
      top: 0.1125rem;
      right: 0.265rem;
      z-index: 1000;
    }
  }
}

// 顶部tabbar
.tab-bar {
  width: 100%;
  height: 1.333rem;
  display: flex;
  justify-content: space-around;
  line-height: 1.333rem;

  div {
    width: 100%;
    text-align: center;
    font-size: 0.4rem;

    p {
      display: inline-block;
      color: #4d4d4d;
      font-size: 0.4rem;

      img {
        float: right;
        width: 0.6rem;
        margin-top: 0.3665rem;
      }
    }
  }

  .active {
    p {
      display: inline-block;
      color: #f7b500;
      font-size: 0.4rem;
    }
  }
}

.root {
  padding: 0.265rem 0 0.265rem 0.265rem;
  background-color: #faf9f7;

  .for-list {
    width: 4.865rem;
    display: inline-block;
    background-color: #faf9f7;
    padding-right: 0.265rem;
    padding-bottom: 0.265rem;

    .list {
      width: 100%;
      background-color: #fff;

      .goods-img {
        width: 100%;
        height: 4rem;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .goods-title {
        font-size: 0.4rem;
        color: #333333;
        padding: 0.265rem 0.265rem 0;
        height: 1.35rem;
        line-height: 0.6rem;
        overflow: hidden;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space:normal !important;
        // display: -webkit-box;
        // -webkit-line-clamp: 2;
        // -webkit-box-orient: vertical;
      }

      .goods-author {
        font-size: 0.32rem;
        color: #808080;
        padding: 0.132rem 0.265rem 0.265rem;

        .left {
          line-height: 0.53rem;

          img {
            width: 0.53rem;
            border-radius: 50%;
            float: left;
            margin-right: 0.1rem;
          }

          span {
            line-height: 0.59rem;
            color: #FF4E5A;
          }
        }

        .right {
          line-height: 0.53rem;

          img {
            width: 0.43rem;
            border-radius: 50%;
            float: left;
            margin-right: 0.1rem;
          }

          span {
            line-height: 0.55rem;
          }
        }
      }
    }
  }

  @media screen and (min-width: 540px) {
    .for-list {
      width: 33.3%;

      .goods-img {
        width: 100%;
      }
    }
  }
}
</style>
