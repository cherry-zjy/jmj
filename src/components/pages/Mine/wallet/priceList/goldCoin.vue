<template>
    <div class="root"  :style="'min-height:'+goodsImgH +'px'">
      <!-- 点击签到 -->
      <div class="top">
        <div class="price">{{balance}}</div>
        <div class="tip">余额</div>
        <div class="btn">
          <button  @click="clickOpen(balance)">金币兑换红包</button>
        </div>
      </div>
      <div class="title">
        金币明细
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
            <p class="price-add" v-if="l.State === 0">+{{l.Price}} </p>
            <p class="price-jian" v-else>-{{l.Price}} </p>
          </div>
        </div>
      </div>
    </mt-loadmore>
      <!-- 确认收货 输入密码 -->
      <mt-popup v-model="popupVisible" popup-transition="popup-fade" class="orderPsw-popup">
        <div>
          <h2>请输入兑换金额</h2>
          <div class="input">
            <div>
              <input type="number" v-model="coinNum">
            </div>
          </div>
          <div class="footer">
            <p @click="popupVisible = false">取消</p>
            <p @click="CoinExchangeRedPacket()">确定</p>
          </div>
        </div>
      </mt-popup>
    </div>
</template>
<script>
import { Toast } from 'mint-ui'

export default {
  data () {
    return {
      goodsImgH: 0,
      popupVisible: false,
      page: 1,
      balance: 0,
      coinNum: 0,
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
          type: 2,
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
    },
    clickOpen (num) {
      this.popupVisible = true
      this.coinNum = ''
    },
    CoinExchangeRedPacket () {
      if (this.coinNum > this.balance) {
        Toast('兑换金额不能超过余额')
      } else if (!this.coinNum) {
        console.log(this.coinNum)
        Toast('请输入兑换金额')
      } else {
        this.$http.get('/api/User/CoinExchangeRedPacket', {
          price: this.coinNum
        })
          .then(res => {
            this.popupVisible = false
            Toast(res.Result)
            this.getInfo(1)
          })
      }
    }
  },
  beforeMount () {
    this.balance = JSON.parse(localStorage.getItem('userInfo')).GoldCoin
  },
  mounted () {
    this.goodsImgH = document.documentElement.clientHeight
    this.getInfo(this.page)
  }
}
</script>
<style scoped lang='scss'>
.root {
  // 点击签到
  .top {
    width: 100%;
    height: 4.4rem;
    text-align: center;
    background-color: #fff;
    padding-top: 0.9rem;
    .price {
      color: #ff4e5a;
      font-size: 0.8rem;
    }
    .tip {
      color: #4d4d4d;
      font-size: 0.346rem;
      line-height: 1rem;
    }
    .btn {
      button {
        background-color: #fff;
        outline: none;
        font-size: 0.4rem;
        text-align: center;
        height: 0.96rem;
        line-height: 0.96rem;
        color: #ff4e5a;
        padding: 0 1.333rem;
        border: 1px solid #ff4e5a;
      }
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
      border-bottom: 1px solid #e6e6e6;
      .left {
        color: #808080;
        line-height: 0.633rem;
        p:nth-child(1) {
          font-size: 0.4rem;
          line-height: 0.633rem;
        }
        p:nth-child(2) {
          font-size: 0.32rem;
        }
        .name {
          color: #333333;
        }
      }
      .right {
        text-align: right;
        line-height: 1.136rem;
        p {
          height: 100%;
        }
        .price-add {
          color: #ff4e5a;
        }
        .price-jian {
          color: #f7b500;
        }
      }
    }
  }
  .orderPsw-popup {
    top: 35%;
    width: 8rem;
    text-align: center;
    border-radius: 5px;
    padding: 0.4rem 0 0;
    div {
      h2 {
        color: #333333;
        font-size: 0.426rem;
        line-height: 1rem;
        margin-bottom: 0.2rem;
      }
      .input {
        width: 100%;
        padding: 0 0.5rem;
        border-bottom: 1px solid #e6e6e6;
        div {
          padding: 0.3rem 0;
          margin-bottom: 0.4rem;
          input {
            width: 100%;
            height: 1.1733rem;
            border-radius: 5px;
            text-align: center;
            border: 1px solid #efefef;
            -webkit-appearance: none;
          }
        }
      }
      .footer {
        display: flex;
        justify-content: space-between;
        p {
          width: 100%;
          text-align: center;
          line-height: 1.333rem;
          font-size: 0.4rem;
          color: #4d4d4d;
        }
        p:nth-child(2) {
          color: #f7b500;
          border-left: 1px solid #efefef;
        }
      }
    }
  }
}
</style>
