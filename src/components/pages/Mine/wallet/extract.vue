<template>
  <div class="root" :style="'height:'+clientHeight +'px'">
    <div class="title">
      <div class="list" @click="choicePayType()">
        <div class="left" v-if="type == 1">
          <img src="../../../../../static/images/withdrawal_bank_card@2x.png" alt>
          <span>银行卡</span>
        </div>
        <div class="left" v-if="type == 2">
          <img src="../../../../../static/images/withdrawal_alipay@2x.png" alt>
          <span>支付宝</span>
        </div>
        <div class="right">
          <img src="../../../../../static/images/enter@2x.png" alt>
        </div>
        <div class="clear"></div>
      </div>
      <!-- <div class="list" @click="choicePayType()">
          <div class="left">支付方式</div>
          <div class="right">
            <img class="img1" v-if="payTypeNum == 0" src="../../../../../static/images/wechat_big@2x.png" alt="">
            <img class="img1" v-else src="../../../../../static/images/money_big@2x.png" alt="">
            <span>{{payTypeNum == 0? '微信支付':'账户余额支付' }}</span>
            <img class="img2" src="../../../../../static/images/enter@2x.png" alt="">
          </div>
          <div class="clear"></div>
      </div>-->
    </div>
    <div class="people">
      <div>
        <label for="peopleName">户名</label>
        <input id="peopleName" type="text" v-model="accountName" placeholder="请输入收款人户名">
      </div>
      <div class="border-top">
        <label for="peopleNum">账号</label>
        <input id="peopleNum" type="text" v-model="cardnumber" placeholder="请输入收款人账号">
      </div>
      <div class="border-top" v-if="type == 1">
        <label for="bankName">银行名称</label>
        <input id="bankName" type="text" v-model="bankName" placeholder="请输入所属银行">
      </div>
    </div>
    <div class="price">
      <h2>提现金额</h2>
      <div class="input">
        <span>￥</span>
        <input type="number" v-model="price" @input="priceInput()">
      </div>
      <div class="tip">
        <p class="left">
          <span class="nomal">可提现金额 {{userInfo.Balance}}</span>
          <!-- <span class="error">提现金额超过余额，请重新输入金额</span> -->
        </p>
        <p class="right" @click="price = userInfo.Balance">全部提现</p>
        <p class="clear"></p>
      </div>
    </div>
    <div class="btn">
      <p @click="WithdrawDeposit()">确认提现</p>
    </div>
    <!-- 确认收货 输入密码 -->
    <div>
      <mt-popup v-model="popupVisible" popup-transition="popup-fade" class="orderPsw-popup">
        <div>
          <h2>支付密码</h2>
          <div class="price-info">
            <p class="title-tip">提现金额</p>
            <p class="price-tip">￥{{this.price}}</p>
          </div>
          <div class="input">
            <div>
              <input type="password" v-model="payPwd">
            </div>
            <p class="forget">
              <router-link to="/mine/editpsw/1">
                <span>忘记密码</span>
              </router-link>
            </p>
          </div>
          <div class="footer">
            <p @click="popupVisible = false">取消</p>
            <p>
              <button @click="toDo($event)">确定</button>
            </p>
          </div>
        </div>
      </mt-popup>
    </div>

    <!-- 支付方式 引用公用组件 -->
    <mt-popup v-model="openPayType" position="bottom" class="popup-box">
      <div class="title">提现到</div>
      <div class="payList weiXin" @click="clickPay(1)">
        <img src="../../../../../static/images/withdrawal_bank_card@2x.png" alt>
        <span>银行卡</span>
      </div>
      <div class="payList yuE" @click="clickPay(2)">
        <img src="../../../../../static/images/withdrawal_alipay@2x.png" alt>
        <span>支付宝</span>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import { Toast, Indicator } from 'mint-ui'
import md5 from 'js-md5'
export default {
  data () {
    return {
      clientHeight: 0,
      popupVisible: false,
      openPayType: false,
      accountName: '',
      cardnumber: '',
      bankName: null,
      type: 2,
      price: '',
      payPwd: '',
      userInfo: {}
    }
  },
  components: {},
  methods: {
    WithdrawDeposit () {
      if (this.type === 1) {
        if (
          this.accountName === '' ||
          this.cardnumber === '' ||
          this.price === '' ||
          this.bankName === ''
        ) {
          Toast('请完善信息')
        } else {
          this.popupVisible = true
        }
      } else {
        if (
          this.accountName === '' ||
          this.cardnumber === '' ||
          this.price === ''
        ) {
          Toast('请完善信息')
        } else {
          this.popupVisible = true
        }
      }
    },
    // 点击打开支付方式
    choicePayType () {
      this.openPayType = true
    },
    // 点击选中支付
    clickPay (n) {
      this.type = n
      this.openPayType = false
    },
    toDo (e) {
      if (this.payPwd !== '') {
        this.popupVisible = false
        e.target.disabled = true
        Indicator.open()
        this.$http
          .get('/api/User/WithdrawDeposit', {
            type: this.type,
            accountName: this.accountName,
            cardnumber: this.cardnumber,
            bankName: this.bankName,
            price: this.price,
            payPwd: md5(this.payPwd)
          })
          .then(res => {
            Indicator.close()
            Toast(res.Result)
            this.$router.go(-1)
          })
        setTimeout(() => {
          e.target.disabled = false
          Indicator.close()
        }, 1000)
      }
    },
    priceInput () {
      if (this.price > this.userInfo.Balance) {
        this.price = this.userInfo.Balance
      }
    }
  },
  beforeMount () {
    this.$http.get('/api/User/Info', {}).then(res => {
      this.userInfo = res.Result
    })
  },
  mounted () {
    this.clientHeight = document.documentElement.clientHeight
  }
}
</script>
<style scoped lang='scss'>
.root {
  background-color: #faf9f7;
  overflow: hidden;
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
  .people {
    margin: 0.265rem 0;
    background-color: #fff;
    div {
      display: flex;
      padding: 0.333rem 0.265rem;
      line-height: 0.667rem;
      label {
        width: 1.333rem;
        flex: auto;
        text-align: center;
        font-size: 0.4rem;
        color: #333333;
      }
      input {
        width: 100%;
        padding-left: 0.265rem;
        border: none;
        font-size: 0.4rem;
      }
    }
    .border-top {
      border-top: 1px solid #efefef;
    }
  }
  .price {
    padding: 0 0.265rem;
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
    .tip {
      line-height: 1.1733rem;
      padding: 0 0.265rem;
      font-size: 0.32rem;
      border-top: 1px solid #efefef;
      .left {
        .nomal {
          color: #808080;
        }
        .error {
          color: #ff4e5a;
        }
      }
      .right {
        color: #ff4e5a;
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
  .orderPsw-popup {
    position: absolute !important;
    top: 35%;
    width: 8rem;
    text-align: center;
    border-radius: 5px;
    div {
      h2 {
        color: #333333;
        font-size: 0.426rem;
        line-height: 1.333rem;
      }
      .price-info {
        border-top: 1px solid #efefef;
        padding-top: 0.265rem;
        .title-tip {
          color: #808080;
          font-size: 0.3466rem;
          text-align: center;
        }
        .price-tip {
          color: #f7b500;
          font-size: 0.48rem;
          text-align: center;
          margin-bottom: 0.265rem;
        }
      }
      .input {
        width: 100%;
        padding: 0 0.5rem;
        border-bottom: 1px solid #e6e6e6;
        div {
          display: flex;
          justify-content: space-between;
          input {
            width: 100%;
            height: 1.1733rem;
            border-radius: 5px;
            text-align: center;
            border: 1px solid #ccc;
            -webkit-appearance: none;
          }
        }
        .forget {
          text-align: right;
          color: #808080;
          font-size: 0.346rem;
          line-height: 1rem;
          span {
            color: #808080;
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
          border-left: 1px solid #efefef;
          button {
            color: #f7b500;
            font-size: 0.4rem;
            border: none;
            width: 100%;
            height: 100%;
            background-color: #fff;
          }
        }
      }
    }
  }
  .popup-box {
    width: 100%;
    background-color: #fff;

    div {
      height: 1.333rem;
      color: #262626;
      font-size: 0.4266rem;
      line-height: 1.333rem;
      border-bottom: 1px solid #e6e6e6;
    }

    .title {
      text-align: center;
    }

    .payList {
      padding-left: 0.5rem;

      img {
        width: 1.013rem;
        height: 1.013rem;
        float: left;
        margin-top: 0.16rem;
        margin-right: 0.265rem;
      }
    }
  }
}
</style>
