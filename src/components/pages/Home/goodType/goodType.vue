<template>
  <div style="width:100%">
    <!-- 二级分类 -->
    <!-- <div class="two-list">
      <span
        :class="twoType == i ? 'active' : '' "
        @click="choiceChange(i, l.ID)"
        v-for="(l, i) in ClassSecond"
        :key="i"
      >{{l.Name}}</span>
    </div> -->
    <Tabs v-model="twoType" @click="choiceChange">
      <Tab v-for="(l, i) in ClassSecond" :key="i" :title="l.Name"></Tab>
    </Tabs>
    <div class="root" :style="'min-height:'+allHeight +'px;margin-top:1.33rem;'">
      <!-- 搜索 -->
      <div class="search">
        <img src="../../../../../static/images/search@2x.png" alt>
        <input type="text" placeholder="搜索" v-model="keywords" @change="searchList()">
      </div>
      <!-- 列表 -->
      <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore">
        <div
          class
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="loading"
          infinite-scroll-distance="200"
          infinite-scroll-immediate-check="false"
        >
          <div class="for-list" v-for="(l,i) in ProductItemList" :key="i">
            <router-link :to="'/nomalgoods/goodsdetail/'+l.Type+'/'+l.ID">
              <div class="list">
                <div class="goods-img">
                  <img :src="l.Image" alt>
                </div>
                <div class="goods-title">{{l.Name}}</div>
                <div class="goods-author">
                  <p class="left">
                    <!-- <img src="../../../../../static/images/alipay_big@2x.png" alt=""> -->
                    <span>￥{{l.Price}}</span>
                  </p>
                  <p class="right">
                    <!-- <img src="../../../../../static/images/hot_numerical@2x.png" alt="">
                    <span>66</span>-->
                  </p>
                  <div class="clear"></div>
                </div>
              </div>
            </router-link>
          </div>
          <div v-if="ProductItemList.length === 0" style="text-align:center;padding-top:5rem;">
            <span style="color:#808080;font-size:0.346rem">暂无商品</span>
          </div>
        </div>
      </mt-loadmore>
    </div>
    <BackTop></BackTop>
  </div>
</template>
<script>
import { Indicator } from 'mint-ui'
import BackTop from '../../../common/backTop'
import { Tab, Tabs } from 'vant'
import 'vant/lib/Tab/style'
import 'vant/lib/Tabs/style'

export default {
  data () {
    return {
      allHeight: 0,
      urlType: this.$route.params.type,
      urlID: this.$route.params.id,
      twoType: Number(this.$route.query.typeIndex)
        ? Number(this.$route.query.typeIndex)
        : 0,
      page: 1,
      choiceID: '',
      keywords: '',
      ClassSecond: [],
      ProductItemList: [],
      topStatus: '',
      loading: false
    }
  },
  components: { BackTop, Tab, Tabs },
  methods: {
    // 下拉刷新
    loadTop () {
      // 下拉刷新的同时 将当前页面置为1
      this.page = 1
      this.GetProductItemList(
        this.ClassSecond[this.twoType].ID,
        this.page,
        this.keywords ? this.keywords : -1
      )
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    // 上滑加载更多
    loadMore () {
      this.loading = true
      this.GetProductItemList(
        this.ClassSecond[this.twoType].ID,
        this.page,
        this.keywords ? this.keywords : -1
      )
    },
    choiceChange (n, title) {
      let id = this.ClassSecond[n].ID
      this.twoType = n
      this.keywords = ''
      this.page = 1
      this.choiceID = id
      this.$store.state.scrollNum = 0
      this.ProductItemList = []
      Indicator.open()
      this.$router.replace('/goodtype/0/' + this.urlID + '?typeIndex=' + n)
      this.GetProductItemList(id, 1, this.keywords ? this.keywords : -1)
    },
    // 获取二级分类
    GetClassSecond () {
      this.$http
        .get('/api/APP_Product/GetClassSecond', {
          modelID: this.urlID
        })
        .then(response => {
          this.ClassSecond = response.Result
          this.choiceID = response.Result[0].ID
          this.GetProductItemList(
            response.Result[this.twoType].ID,
            this.page,
            this.keywords ? this.keywords : -1
          )
        })
    },
    // 获取商品类目列表
    GetProductItemList (id, p, sear) {
      this.$http
        .get('/api/APP_Product/GetProductItemList', {
          itemID: id,
          pageIndex: p,
          pageSize: 10,
          sear: sear
        })
        .then(response => {
          Indicator.close()
          // 如果是第一页直接赋值。若不是第一页则合并数据
          if (p === 1) {
            this.ProductItemList = response.Result.prodList
            this.$refs.loadmore.onTopLoaded()
          } else {
            this.ProductItemList = this.ProductItemList.concat(
              response.Result.prodList
            )
          }
          // 同时判断当前页是否是数据获取的最后一页。如果不是，则不禁止继续加载
          if (this.page < response.Result.page) {
            this.loading = false
            this.page++
          } else {
            this.loading = true
          }
        })
    },
    searchList () {
      this.GetProductItemList(
        this.ClassSecond[this.twoType].ID,
        1,
        this.keywords ? this.keywords : -1
      )
    }
  },
  mounted () {
    // 获取当前页面的fontsize，计算剩余的首屏高度
    var htmlSize = getComputedStyle(window.document.documentElement)['font-size'].split('px')[0]
    this.allHeight =
      document.documentElement.clientHeight - Number(htmlSize) * 1.333
    this.GetClassSecond()
  },
  // 监听当前页面的id是否变化 或者通过路由守卫来动态设置meta.keepAlive     beforeRouteEnter    beforeRouteLeave
  activated: function () {
    let id = this.$route.params.id
    let indexNum = Number(this.$route.query.typeIndex)
      ? Number(this.$route.query.typeIndex)
      : 0
    if (this.urlID !== id) {
      // 将该页面的id和新获取的id进行比对，如果不一致，说明页面应该进行数据刷新
      this.urlID = id
      this.twoType = indexNum
      this.page = 1
      this.ProductItemList = []
      this.GetClassSecond()
    }
    if (this.twoType !== indexNum) {
      // 将该页面的id和新获取的id进行比对，如果不一致，说明页面应该进行数据刷新
      this.urlID = id
      this.twoType = indexNum
      this.page = 1
      this.ProductItemList = []
      this.GetClassSecond()
    }
    if (this.urlID !== id && this.twoType !== indexNum) {
      this.urlID = id
      this.twoType = indexNum
      this.page = 1
      this.ProductItemList = []
      this.GetClassSecond()
    }
  },
  watch: {
    $route (to, from) {
      // 通过监听路由变化 刷新页面会出现卡顿
      if (from.path === '/home') {
        // this.$router.go(0)
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    let position = window.scrollY
    this.$store.state.scrollNum = position
    next()
  }
}
</script>
<style scoped lang='scss'>
// 二级分类
.two-list {
  width: 100%;
  height: 1.33rem;
  line-height: 1.33rem;
  font-size: 0.4rem;
  color: #4d4d4d;
  overflow-x: scroll;
  background-color: #fff;
  white-space: nowrap;
  padding: 0 0.265rem;
  position: fixed;
  top: 0;
  z-index: 9999;
  span {
    display: inline-block;
    // width: 22%;
    padding: 0 3%;
    text-align: center;
  }

  .active {
    color: #f7b500;
  }
}

.root {
  padding: 0.265rem 0 0.265rem 0.265rem;
  background-color: #faf9f7;

  // 搜索
  .search {
    width: 100%;
    height: 0.88rem;
    margin-bottom: 0.265rem;
    padding-right: 0.265rem;
    position: relative;

    img {
      position: absolute;
      left: 0.4rem;
      top: 0.2rem;
      height: 0.48rem;
      width: 0.48rem;
      z-index: 100;
    }

    input {
      z-index: 90;
      width: 100%;
      height: 100%;
      border-radius: 0.44rem;
      outline: none;
      border: none;
      font-size: 0.346rem;
      // text-align: center;
      padding-left: 1.165rem;
    }

    input::-webkit-input-placeholder {
      color: #808080;
      font-size: 0.346rem;
    }
  }

  // 列表
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
        height: 100%;

        img {
          width: 100%;
          height: 4.865rem;
        }
      }

      .goods-title {
        font-size: 0.4rem;
        color: #333333;
        padding: 0.265rem 0.265rem 0;
        height: 1.35rem;
        line-height: 0.6rem;
        overflow: hidden;
      }

      .goods-author {
        font-size: 0.4rem;
        color: #ff4e5a;
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
