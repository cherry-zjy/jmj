<template>
    <div class="root" :style="'min-height:'+goodsImgH +'px'">
      <div class="title">
        兑换列表
      </div>
      <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore">
      <div class="list"
      v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="200"
         infinite-scroll-immediate-check='false'>
        <div class="for-list" v-for="(l,i) in allList" :key="i">
          <div class="left">
            <p class="name">{{l.ProductName}}</p>
            <p>{{l.ExchangePrice}}</p>
            <p>{{l.CreateTime}}</p>
          </div>
          <div class="right">
            <p class="status" v-if="l.State !== '审核通过'">{{l.State}}</p>
            <p class="status" v-else style="color:#F7B500">审核通过</p>
            <p>{{l.ExchangeWay}}</p>
          </div>
        </div>
        <div v-if="allList.length === 0" style="text-align:center;padding-top:5rem;">
            <span style="color:#808080;font-size:0.346rem">暂无记录</span>
          </div>
      </div>
      </mt-loadmore>
    </div>
</template>
<script>
export default {
  data () {
    return {
      goodsImgH: 0,
      page: 1,
      allList: [],
      topStatus: '',
      loading: false
    }
  },
  components: {},
  methods: {
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
      this.page++
      this.getAllList(this.page)
    },
    getAllList (p) {
      this.$http.get('/api/User/GetUserExchangeList', {
        pageIndex: p,
        pageSize: 999
      })
        .then(response => {
          // 如果是第一页直接赋值。若不是第一页则合并数据
          if (p === 1) {
            this.allList = response.Result.exchangelist
            this.$refs.loadmore.onTopLoaded()
          } else {
            this.allList = this.allList.concat(response.Result.exchangelist)
          }
          // 同时判断当前页是否是数据获取的最后一页。如果不是，则不禁止继续加载
          if (this.page < response.Result.page) {
            this.loading = false
          } else {
            this.loading = true
          }
        })
    }
  },
  mounted () {
    this.goodsImgH = document.documentElement.clientHeight
    this.getAllList(this.page)
  }
}
</script>
<style scoped lang='scss'>
.root {
  // 签到记录
  .title {
    height: 1.0133rem;
    line-height: 1.0133rem;
    padding: 0 0.265rem;
    font-size: 0.346rem;
    color: #808080;
    background: #faf9f7;
  }
  .list {
    .for-list {
      height: 2.133rem;
      line-height: 0.633rem;
      display: flex;
      justify-content: space-between;
      font-size: 0.4rem;
      padding: 0.2rem;
      border-bottom: 1px solid #e6e6e6;
      div {
        color: #808080;
        p:nth-child(1) {
          font-size: 0.4rem;
        }
        p:nth-child(2) {
          font-size: 0.32rem;
        }
        p:nth-child(3) {
          font-size: 0.32rem;
        }
      }
      .right {
        text-align: right;
      }
      .name {
        color: #333333;
      }
      .status {
        color: #ff4e5a;
      }
    }
  }
}
</style>
