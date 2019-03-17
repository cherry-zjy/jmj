<template>
  <div class="root" :style="'min-height:'+clientHeight +'px'">
    <div class="title">
      <div class="list">
        <div class="left">
          <img src="../../../../../static/images/wechat_big@2x.png" alt="">
          <span>微信</span>
        </div>
        <div class="right">
          <img src="../../../../../static/images/enter@2x.png" alt="">
        </div>
        <div class="clear"></div>
      </div>
    </div>
    <div class="price">
        <h2>充值金额</h2>
        <div class="input">
          <span>￥</span>
          <input type="number" v-model="payNum">
        </div>
    </div>
    <div class="btn">
      <p @click="subBtn()">确认充值</p>
    </div>
  </div>
</template>
<script>
import { MessageBox } from 'mint-ui'

export default {
  data () {
    return {
      clientHeight: 0,
      payNum: null
    }
  },
  components: {},
  methods: {
    // 立即充值 生成订单号
    subBtn () {
      if (this.payNum) {
        // 判断是否存在openid，用于微信支付
        if (this.getCookie('openid')) {
          this.$http.get('/api/User/Recharge', {
            price: this.payNum,
            paytype: 2
          })
            .then(res => {
              this.toPay(res.Result)
            })
        } else {
          MessageBox.confirm('请先进行微信授权?').then(action => {
            localStorage.setItem('firstURL', this.$route.fullPath)
            this.$router.push('/author')
          })
        }
      }
    },
    toPay (id) {
      this.$http.get('/api/APP_Home/UnifiedOrder', {
        orderID: id,
        openID: this.getCookie('openid') ? this.getCookie('openid') : -1,
        ThirdPayType: 1,
        Token: this.$store.state.token || localStorage.getItem('token')
      })
        .then(res => {
          callpayPayIn(res.Result.res)
        })
    }
  },
  mounted () {
    this.clientHeight = document.documentElement.clientHeight
  }
}

</script>
<style scoped lang='scss'>
.root {
  background-color: #faf9f7;
  .title {
    height: 1.6rem;
    line-height: 1rem;
    background-color: #fff;
    padding: 0.3rem;
    .left {
      padding-left: 0.265rem;
      font-size: 0.4rem;
      color: #333333;
      img {
        float: left;
        height: 1rem;
        width: 1rem;
        margin-right: 0.265rem;
      }
    }
    .right {
      img {
        height: 0.7rem;
        margin-top: 0.15rem;
      }
    }
  }
  .price {
    padding: 0 0.265rem;
    padding-bottom: 1.173rem;
    background-color: #fff;
    border-top: 1px solid #efefef;

    h2 {
      line-height: 1.333rem;
      font-size: 0.4rem;
      color: #333333;
      font-weight: 400;
    }
    .input {
      font-size: 0.96rem;
      color: #262626;
      display: flex;
      span {
        flex: auto;
      }
      input {
        font-size: 0.96rem;
        width: 100%;
        border: none;
        padding-left: 0.3rem;
      }
    }
  }
  .btn {
    margin-top: 1.333rem;
    padding: 0 0.265rem;
    p {
      background-color: #f7b500;
      font-size: 0.4rem;
      color: #fff;
      text-align: center;
      line-height: 1.1733rem;
    }
  }
}
</style>
