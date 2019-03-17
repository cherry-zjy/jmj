<template>
    <div class="root">
      <!-- 点击签到 -->
      <div class="top">
        <div class="price">{{balance}}</div>
        <div class="tip">待结算佣金</div>
      </div>
      <div class="title">
        佣金记录
      </div>
     <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore">
      <div class="list"
      v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="200"
         infinite-scroll-immediate-check='false'>
        <div class="for-list" v-for="(l,i) in AllList" :key="i">
          <div class="left">
           <p class="name">{{l.ProdName}} </p>
            <p>{{l.CreateTime}}</p>
          </div>
          <div class="right">
            <p class="price-add" v-if="l.State === 0">+{{l.Price}}</p>
            <p class="price-jian" v-else>-{{l.Price}}</p>
            <!-- <p>商品金额:￥{{l.ProdPrice}}</p> -->
          </div>
        </div>
      </div>
      </mt-loadmore>
    </div>
</template>
<script>
export default {
  data () {
    return {
      page: 1,
      balance: 888,
      AllList: [],
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
      this.getInfo(this.page)
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    // 上滑加载更多
    loadMore () {
      this.loading = true
      this.page++
      this.getInfo(this.page)
    },
    getInfo (p) {
      this.$http.get('api/User/GetMyCoin',
        {
          type: 3,
          pageIndex: p,
          pageSize: 10
        })
        .then(response => {
          // 如果是第一页直接赋值。若不是第一页则合并数据
          if (p === 1) {
            this.AllList = response.Result.coinlist
            this.$refs.loadmore.onTopLoaded()
          } else {
            this.AllList = this.AllList.concat(response.Result.coinlist)
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
    this.balance = JSON.parse(localStorage.getItem('userInfo')).NotSettledCommission
    this.getInfo(this.page)
  }
}
</script>
<style scoped lang='scss'>
.root {
  // 点击签到
  .top {
    width: 100%;
    height: 3.733rem;
    text-align: center;
    background-color: #fff;
    padding-top: 1.1rem;
    .price {
      color: #ff4e5a;
      font-size: 0.8rem;
    }
    .tip {
      color: #4d4d4d;
      font-size: 0.346rem;
    }
  }
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
      height: 1.566rem;
      display: flex;
      justify-content: space-between;
      font-size: 0.4rem;
      padding: 0.2rem;
      color: #808080;
      border-bottom: 1px solid #e6e6e6;
      .left {
        line-height: 0.633rem;
        width: 6.5rem;
        p:nth-child(1) {
          font-size: 0.4rem;
          line-height: 0.633rem;
        }
        p:nth-child(2) {
          font-size: 0.32rem;
        }
        .name {
          color: #333333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
        }
      }
      .right {
        text-align: right;
        line-height: 0.633rem;
        font-size: 0.306rem;
        .price-add {
          color: #ff4e5a;
          font-size: 0.386rem;
        }
        .price-jian {
          color: #f7b500;
        }
      }
    }
  }
}
</style>
