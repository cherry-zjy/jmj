<template>
  <div class="root" :style="'min-height:'+htmlH +'px'">
    <div class="top">
      <router-link to='/mine/wallet/balance'>
        <div class="price">{{userInfo.Balance}}</div>
        <div class="remark">余额</div>
      </router-link>
      <div>
        <button class="extract" @click="extract()">提现</button>
        <button class="charge" @click="charge()">充值</button>
      </div>
    </div>
    <div class="all-price">
      <div>
        <router-link to='/mine/wallet/brokerage'>
          <p class="price">{{userInfo.NotSettledCommission}}</p>
          <p class="remark">待结算佣金</p>
        </router-link>
      </div>
      <div>
        <router-link to='/mine/wallet/goldcoin'>
          <p class="price">{{userInfo.GoldCoin}}</p>
          <p class="remark">金币</p>
        </router-link>
      </div>
    </div>
    <router-link to="/mine/wallet/coupon">
      <div class="list">
        <div class="left">我的优惠券</div>
        <div class="right">
          <img src="../../../../../static/images/enter@2x.png" alt="">
        </div>
        <div class="clear"></div>
      </div>
    </router-link>
    <router-link to="/mine/wallet/redpacket">
      <div class="list">
        <div class="left">我的红包</div>
        <div class="right">
          <img src="../../../../../static/images/enter@2x.png" alt="">
        </div>
        <div class="clear"></div>
      </div>
    </router-link>

  </div>
</template>
<script>
export default {
  data () {
    return {
      htmlH: 0,
      userInfo: {}

    }
  },
  components: {},
  methods: {
    extract () {
      this.$router.push('/mine/wallet/extract')
    },
    charge () {
      this.$router.push('/mine/wallet/payin')
    },
    getUserInfo () {
      this.$http.get('/api/User/Info', {})
        .then(res => {
          this.userInfo = res.Result
          localStorage.setItem('userInfo', JSON.stringify(res.Result))
        })
    }
  },
  mounted () {
    this.htmlH = document.documentElement.clientHeight
    this.getUserInfo()
  }
}

</script>
<style scoped lang='scss'>
.root {
  background-color: #faf9f7;
  .top {
    height: 4.4rem;
    background-color: #fff;
    text-align: center;
    padding-top: 0.7rem;
    .price {
      font-size: 0.8rem;
      color: #f7b500;
    }
    .remark {
      color: #4d4d4d;
      font-size: 0.346rem;
      line-height: 0.7rem;
    }
    button {
      background-color: #fff;
      outline: none;
      font-size: 0.4rem;
      text-align: center;
      width: 2.666rem;
      height: 0.96rem;
      line-height: 0.96rem;
      border: none;
    }
    .extract {
      color: #f7b500;
      border: 1px solid #f7b500;
    }
    .charge {
      background-color: #f7b500;
      color: #fff;
      margin-left: 0.15rem;
    }
  }
  .all-price {
    display: flex;
    margin-bottom: 0.265rem;
    div {
      width: 100%;
      text-align: center;
      height: 2.4rem;
      padding-top: 0.64rem;
      border-top: 1px solid #efefef;
      background-color: #fff;
      .price {
        font-size: 0.48rem;
        color: #ff4e5a;
      }
      .remark {
        font-size: 0.346rem;
        color: #4d4d4d;
        margin-top: 0.15rem;
      }
    }
    div:nth-child(1) {
      border-right: 1px solid #efefef;
    }
  }
  .list {
    height: 1.333rem;
    line-height: 1.333rem;
    background-color: #fff;
    margin-bottom: 2px;
    .left {
      padding-left: 0.265rem;
      font-size: 0.4rem;
      color: #333333;
    }
    .right {
      display: flex;
      align-items: center;
      img {
        height: 0.7rem;
        margin-top: 0.3166rem;
      }
    }
  }
}
</style>
