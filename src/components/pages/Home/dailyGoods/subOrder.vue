<template>
    <div class="root" :style="'min-height:'+htmlH +'px'">
      <!-- 地址 -->
      <div class="top_address" @click="goAddress()">
        <img class='icon-address left' src="../../../../../static/images/icon_address@2x.png" alt="">
        <div class="left user-add">
          <p v-if="idHaveAdd">收货人：{{addressInfo.Name}}
            <span class="right">{{addressInfo.Phone}}</span>
          </p>
          <p v-if="idHaveAdd">收货地址：{{addressInfo.Province}}{{addressInfo.City}}{{addressInfo.Region}}{{addressInfo.Address}}</p>
          <p  v-if="!idHaveAdd" style="line-height:2.3rem;text-align:center">暂无地址，请选择</p>
        </div>
        <img class='icon-enter right' src="../../../../../static/images/enter@2x.png" alt="">
        <img class="border-line" src="../../../../../static/images/border@2x.png" alt="">
      </div>
      <div v-for="(l,i) in orderInfo.ProdList" :key="i">

      <!-- 商品信息 -->
      <div class="goods-info"  v-for="(item,index) in l.Product" :key="index">
        <div class="left">
          <img :src="item.ProductImage" alt="">
        </div>
        <div class="leftInfo">
          <div>
            <span class="left name">{{item.ProductName}}</span>
            <span class="right price">￥{{item.ProductPrice}} </span>
            <span class="clear"></span>
          </div>
          <div>
            <span class="left price">{{item.ProductSpecFirst}} {{item.ProductSpecSecond}} </span>
            <span class="right price">x{{item.ProductCount}}</span>
            <span class="clear"></span>
          </div>
          <!-- <div>需5000积分</div> -->
        </div>
        <div class="clear"></div>
      </div>
      <!-- 下单列表信息 -->
      <div class="list-info">
        <div class="list">
          <div class="left">商家活动</div>
          <div class="right">
            <span>{{l.ProductActivity}}</span>
            <img src="../../../../../static/images/enter@2x.png" alt="">
          </div>
          <div class="clear"></div>
        </div>
        <div class="list">
          <div class="left">配送方式</div>
          <div class="right">
            <span>包邮</span>
            <img src="../../../../../static/images/enter@2x.png" alt="">
          </div>
          <div class="clear"></div>
        </div>
        <div class="list" v-if="urlType == 0">
          <div class="left">免单购买</div>
          <div class="right">
            <span>此商品正在参加免单活动</span>
            <img src="../../../../../static/images/enter@2x.png" alt="">
          </div>
          <div class="clear"></div>
        </div>
        <router-link :to='"/mine/wallet/redpacket/"+urlID' v-else>
        <div class="list" >
          <div class="left">使用红包</div>
          <div class="right">
            <span v-if="choiceRed.Compliant">{{choiceRed.Compliant}}{{choiceRed.Price}}元红包</span>
              <span v-else>无</span>
            <img src="../../../../../static/images/enter@2x.png" alt="">
          </div>
          <div class="clear"></div>
        </div>
        </router-link>
        <div class="list" @click="choicePayType()">
          <div class="left">支付方式</div>
          <div class="right">
            <img class="img1" v-if="payTypeNum == 0" src="../../../../../static/images/wechat_big@2x.png" alt="">
            <img class="img1" v-else src="../../../../../static/images/money_big@2x.png" alt="">
            <span>{{payTypeNum == 0? '微信支付':'账户余额支付' }}</span>
            <img class="img2" src="../../../../../static/images/enter@2x.png" alt="">
          </div>
          <div class="clear"></div>
        </div>
        <div class="list-img" v-if="urlType == 0">
          <img src="../../../../../static/images/no_single_details@2x.png" alt="">
        </div>
      </div>
      </div>

      <!-- 底部分享好友 -->
      <div class="footer">
      <div class="tip">共{{orderInfo.SumCount}}件商品，小计：￥{{orderInfo.SumPrice}}</div>
      <div class="btn">
        <p class="price">实付金额：<span>￥{{orderInfo.SumPrice}}</span></p>
        <p class="sub" @click="SubOrder()">提交订单</p>
      </div>
    </div>

      <!-- 支付方式 引用公用组件 -->
      <mt-popup v-model="openPayType" position="bottom" class="popup-box">
        <div class="title">选择支付方式</div>
        <div class="payList weiXin" @click="clickPay(0)">
          <img src="../../../../../static/images/wechat_big@2x.png" alt="">
          <span>微信支付</span>
        </div>
        <div class="payList yuE" @click="clickPay(1)">
          <img src="../../../../../static/images/money_big@2x.png" alt="">
          <span> 账户余额支付</span>
        </div>
      </mt-popup>
       <!-- 确认收货 输入密码 -->
      <mt-popup v-model="popupVisible" popup-transition="popup-fade" class="orderPsw-popup">
        <div>
          <h2>输入支付密码</h2>
          <div class="input">
            <div>
              <input type="password" v-model="pswNum">
            </div>
            <p><span></span></p>
          </div>
          <div class="footer-tip">
            <p @click="popupVisible = false">取消</p>
            <p><button @click="ConfirmationOfReceipt($event)">确定</button></p>
          </div>
        </div>
      </mt-popup>
    </div>
</template>
<script>
import md5 from 'js-md5'
import { Toast, MessageBox } from 'mint-ui'

export default {
  data () {
    return {
      htmlH: 0,
      // 判断url携带的type 1：每日团购 0 每周免单
      urlType: this.$route.params.type,
      urlID: this.$route.params.id,
      headID: null,
      // 是否展开支付下拉框选择
      openPayType: false,
      popupVisible: false,
      pswNum: '',
      payTypeNum: 0,
      orderInfo: {},
      addressInfo: {},
      // 已经存在地址
      idHaveAdd: true,
      choiceCoupon: {},
      choiceRed: {}
    }
  },
  components: {},
  methods: {
    // 点击打开支付方式
    choicePayType () {
      this.openPayType = true
    },
    // 点击选中支付
    clickPay (n) {
      this.payTypeNum = n
      this.openPayType = false
    },
    goAddress () {
      // 跳转收货地址，设置默认地址
      this.$router.push('/mine/info/address/true')
    },
    getOrderInfo1 () {
      this.$http.get('/api/APP_Product/GenerateOrderData', {
        orderID: this.urlID
      })
        .then(res => {
          this.orderInfo = res.Result
          if (localStorage.getItem('choiceAddress')) {
            this.addressInfo = JSON.parse(localStorage.getItem('choiceAddress'))
          } else {
            this.addressInfo = res.Result
          }
          if (localStorage.getItem('choiceCoupon')) {
            this.choiceCoupon = JSON.parse(localStorage.getItem('choiceCoupon'))
          }
          if (localStorage.getItem('choiceRed')) {
            this.choiceRed = JSON.parse(localStorage.getItem('choiceRed'))
          }
        })
    },
    getOrderInfo () {
      this.$http.get('/api/APP_Product/GenerateOrderData', {
        orderID: this.urlID
      })
        .then(res => {
          this.orderInfo = res.Result
          if (localStorage.getItem('choiceAddress')) {
            this.idHaveAdd = true
            this.addressInfo = JSON.parse(localStorage.getItem('choiceAddress'))
          } else {
            this.addressInfo = res.Result
            if (res.Result.Phone === '') {
              this.idHaveAdd = false
            }
          }
          if (localStorage.getItem('choiceCoupon')) {
            this.choiceCoupon = JSON.parse(localStorage.getItem('choiceCoupon'))
          }
          if (localStorage.getItem('choiceRed')) {
            this.choiceRed = JSON.parse(localStorage.getItem('choiceRed'))
          }
          if (localStorage.getItem('choiceRed') || localStorage.getItem('choiceCoupon') || localStorage.getItem('choiceAddress')) {
            this.EditOrderPordISHB(this.urlType)
          }
        })
    },
    SubOrder () {
      if (this.idHaveAdd) {
        if (this.payTypeNum === 1) {
          this.$http.get('/api/User/Info', {})
            .then(res => {
              if (res.Result.HasPayPwd) {
                this.popupVisible = true
              } else {
                MessageBox('温馨提示', '您还未设置支付密码')
                setTimeout(() => {
                  this.$router.push('/mine/editpsw/2')
                }, 1500)
              }
            })
        } else {
          this.toPay()
        }
      } else {
        MessageBox('温馨提示', '您还未选择收货地址')
      }
    },
    ConfirmationOfReceipt (e) {
      if (this.pswNum !== '') {
        this.popupVisible = false
        e.target.disabled = true
        this.toPay()
        setTimeout(() => {
          e.target.disabled = false
        }, 1000)
      }
    },
    toPay () {
      this.$http.get('/api/APP_Home/UnifiedOrder', {
        orderID: this.urlID,
        openID: this.getCookie('openid') ? this.getCookie('openid') : -1,
        ThirdPayType: this.payTypeNum === 1 ? -1 : 1,
        Token: this.$store.state.token || localStorage.getItem('token'),
        paypwd: md5(this.pswNum)
      })
        .then(res => {
          // 如果是每周免单，调用callPayDaily 支付成功跳转订单成功页
          if (Number(this.urlType) === 0) {
            localStorage.setItem('dailyBuyID', this.urlID)
            if (res.Result.res === '支付成功') {
              Toast('支付成功')
              if (res.Result.headID !== '') {
                setTimeout(() => {
                  this.$router.push('/goods/suborder/success?headid=' + res.Result.headID)
                }, 1000)
              } else {
                setTimeout(() => {
                  this.$router.push('/goods/suborder/success')
                }, 1000)
              }
            } else {
              if (res.Result.headID !== '') {
                callpayDaily(res.Result.res, res.Result.headID)
              } else {
                callpayDaily(res.Result.res)
              }
            }
          } else {
            if (res.Result.res === '支付成功') {
              Toast('支付成功')
              setTimeout(() => {
                this.$router.push('/mine/orderlist?typeIndex=2')
              }, 1000)
            } else {
              callpay(res.Result.res)
            }
          }
        })
    },
    // 下单之前 修改订单的数据 用于地址 红包等选择
    EditOrderPordISHB (ut) {
      if (this.addressInfo.Name) {
        this.$http.post('/api/APP_Product/EditOrderPord', {
          orderID: this.urlID,
          'Name': this.addressInfo.Name,
          'Phone': this.addressInfo.Phone,
          'Province': this.addressInfo.Province,
          'City': this.addressInfo.City,
          'Region': this.addressInfo.Region,
          'Address': this.addressInfo.Address,
          'ProductspecID': -1,
          'PayType': this.payTypeNum === 1 ? -1 : 1,
          'ProductspecCount': -1,
          'VoucherID': this.choiceCoupon.ID ? this.choiceCoupon.ID : -1,
          'RedPacketID': this.choiceRed.ID ? this.choiceRed.ID : -1,
          'RealName': ut === 2 ? this.addressInfo.Name : -1
        })
          .then(res => {
            this.popupVisible = false
            this.getOrderInfo1()
          })
      } else {
        Toast('请选择收货地址')
      }
    }
  },
  beforeMount () {
    // this.addressInfo = JSON.parse(localStorage.getItem('choiceAddress'))
  },
  mounted () {
    this.htmlH = document.documentElement.clientHeight
    this.headID = this.$route.query.headid ? this.$route.query.headid : null
    this.getOrderInfo()
  }
}
</script>
<style scoped lang='scss'>
.root {
  background-color: #faf9f7;
  // 地址
  .top_address {
    width: 100%;
    height: 2.931rem;
    padding: 0.265rem 0.265rem 0;
    background-color: #fff;
    margin-bottom: 0.265rem;
    position: relative;
    .icon-address {
      width: 0.5rem;
      margin-top: 0.9rem;
    }
    .icon-enter {
      height: 0.7rem;
      margin-top: 0.8rem;
    }
    .user-add {
      width: 82%;
      p {
        padding: 0 0.265rem;
        color: #333333;
        font-size: 0.4rem;
        line-height: 1.1rem;
      }
      p:nth-child(2) {
        line-height: 0.55rem;
      }
    }
    .border-line {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 0.133rem;
    }
  }
  // 商品信息
  .goods-info {
    height: 2.4rem;
    padding: 0.265rem;
    background: #fff;
    // 左侧商品图
    .left {
      img {
        height: 1.8699rem;
        border: 1px solid #e5e5e5;
        margin-right: 0.2rem;
      }
    }
    // 左侧商品信息
    .leftInfo {
      height: 100%;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      div {
        overflow: hidden;
        color: #808080;
        font-size: 0.373rem;
        .left {
          color: #262626;
          font-size: 0.4rem;
        }
        .name {
          font-size: 0.4rem;
          color: #262626;
          font-weight: 400;
        }
        .price {
          font-size: 0.3466rem;
          color: #808080;
        }
      }
    }
  }
  .list-info {
    padding-bottom: 2.5rem;
    .list {
      height: 1.333rem;
      line-height: 1.333rem;
      padding: 0 0.265rem;
      background-color: #fff;
      margin-top: 1.5px;
      .left {
        color: #333333;
        font-size: 0.4rem;
        font-weight: 400;
      }
      .right {
        color: #808080;
        font-size: 0.4rem;
        overflow: hidden;
        img {
          float: right;
          height: 0.7rem;
          margin-top: 0.315rem;
        }
        .img1 {
          float: left;
          height: 0.7rem;
          margin-top: 0.315rem;
          margin-right: 0.265rem;
        }
      }
    }
    .list-img {
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    font-size: 0.4rem;
    font-weight: 400;
    line-height: 1.333rem;
    .tip {
      text-align: right;
      color: #808080;
      line-height: 1rem;
      font-size: 0.346rem;
      background-color: #faf9f7;
      padding: 0 0.265rem;
    }
    .btn {
      height: 1.333rem;
      line-height: 1.333rem;
      display: flex;
      font-weight: 400;
      justify-content: space-between;
      .price {
        width: 60%;
        padding: 0 0.265rem;
        color: #333333;
        background-color: #fff;
        span {
          color: #f7b500;
        }
      }
      .sub {
        width: 40%;
        text-align: center;
        color: #fff;
        background-color: #f7b500;
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
        display: flex;
        justify-content: space-between;
        input {
          width: 100%;
          height: 1.1733rem;
          border-radius: 5px;
          text-align: center;
          border: 1px solid #ccc;
          -webkit-appearance: none;
          margin-bottom: 0.265rem;
        }
      }
      p {
        text-align: right;
        color: #808080;
        font-size: 0.346rem;
        line-height: 1rem;
      }
    }
    .footer-tip {
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
          border: none;
          font-size: 0.4rem;
          width: 100%;
          height: 100%;
          background-color: #fff;
        }
      }
    }
  }
}
</style>
