<template>
  <div class="root">
    <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore">
      <div
        :style="'min-height:'+allHeight +'px'"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="200"
        infinite-scroll-immediate-check="false"
      >
        <div class="for-list" v-for="(l,i) in AllList" :key="i">
          <div class="list" @click="addClick(l.ID)">
            <div class="goods-img">
              <img :src="l.ProductImage" alt>
            </div>
            <div class="goods-title">{{l.ProductName}}</div>
            <div class="goods-author">
              <p class="left">
                <img :src="l.Image" alt>
                <span>{{l.NickName}}</span>
              </p>
              <p class="right">
                <img src="../../../../static/images/hot_numerical@2x.png" alt>
                <span>{{l.UserKOL}}</span>
              </p>
              <div class="clear"></div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="AllList.length === 0" style="text-align:center;padding-top:5rem;">
        <span style="color:#808080;font-size:0.346rem">暂无商品</span>
      </div>
    </mt-loadmore>
    <!-- 回到顶部 -->
    <BackTop></BackTop>
  </div>
</template>
<script>
import { MessageBox } from 'mint-ui'
import BackTop from '../../common/backTop'
export default {
  data () {
    return {
      allHeight: 0,
      AllList: [],
      page: 1, // 第一页
      topStatus: '',
      loading: false
    }
  },
  activated () {
    this.$store.state.showNav = true
  },
  components: { BackTop },
  methods: {
    handleScroll () {
      this.scroll =
        document.documentElement && document.documentElement.scrollTop
    },
    // 下拉刷新
    loadTop () {
      // 下拉刷新的同时 将当前页面置为1
      this.page = 1
      this.getAllList(this.page)
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    // 上滑加载更多
    loadMore () {
      this.loading = true
      this.getAllList(this.page)
    },
    getAllList (p) {
      this.$http
        .get('/api/APP_Discover/DiscoverList', {
          pageIndex: p,
          pageSize: 10
        })
        .then(res => {
          if (p === 1) {
            this.AllList = res.Result.prod
            this.$refs.loadmore.onTopLoaded()
          } else {
            this.AllList = this.AllList.concat(res.Result.prod)
          }
          // 同时判断当前页是否是数据获取的最后一页。如果不是，则不禁止继续加载
          if (this.page < res.Result.page) {
            this.page++
            this.loading = false
          } else {
            this.loading = true
          }
        })
    },
    addClick (id) {
      this.$http
        .get('/api/APP_Discover/ClickDiscover', {
          prodComID: id
        })
        .then(res => {
          this.$router.push('/findlist/finddetail/' + id)
        })
    }
  },
  mounted () {
    // 获取当前页面的fontsize，计算剩余的首屏高度
    var htmlSize = getComputedStyle(window.document.documentElement)['font-size'].split('px')[0]
    this.allHeight =
      document.documentElement.clientHeight - Number(htmlSize) * 1.333
    if (this.$store.state.token || localStorage.getItem('token')) {
      this.getAllList(this.page)
    } else {
      MessageBox('温馨提示', '您还未登录')
      setTimeout(() => {
        window.location.href = '#/author'
      }, 1000)
    }
  },
  beforeRouteLeave (to, from, next) {
    let position = window.scrollY
    this.$store.state.scrollNum = position
    next()
  },
  watch: {
    $route: function (to, from) {
      if (from.path === '/login') {
        if (this.$store.state.token || localStorage.getItem('token')) {
          this.getAllList(this.page)
        } else {
          MessageBox('温馨提示', '您还未登录')
          setTimeout(() => {
            window.location.href = '#/author'
          }, 1000)
        }
      }
    }
  }
}
</script>
<style scoped lang='scss'>
.root {
  padding: 0.265rem 0 0.265rem 0.265rem;
  background-color: #faf9f7;
  margin-bottom: 1.333rem;

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
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .goods-author {
        font-size: 0.32rem;
        color: #808080;
        padding: 0.132rem 0.265rem 0.265rem;

        .left {
          line-height: 0.53rem;

          img {
            width: 0.53rem;
            height: 0.53rem;
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
