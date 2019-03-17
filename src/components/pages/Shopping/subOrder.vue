<template>
  <div class="root" :style="'min-height:'+htmlH +'px'">
    <!-- 地址 -->
    <div class="top_address" @click="goAddress()">
      <img class='icon-address left' src="../../../../static/images/icon_address@2x.png" alt="">
      <div class="left user-add">
        <p v-if="idHaveAdd">收货人：{{addressInfo.Name}}
          <span class="right">{{addressInfo.Phone}}</span>
        </p>
        <p v-if="idHaveAdd">收货地址：{{addressInfo.Province}}{{addressInfo.City}}{{addressInfo.Region}}{{addressInfo.Address}}</p>
        <p v-if="!idHaveAdd" style="line-height:2.3rem;text-align:center">暂无地址，请选择</p>
      </div>
      <img class='icon-enter right' src="../../../../static/images/enter@2x.png" alt="">
      <img class="border-line" src="../../../../static/images/border@2x.png" alt="">
    </div>
    <div style="margin-bottom:5.6rem;">
      <div v-for="(l,i) in orderInfo.ProdList" :key="i">
        <!-- 商品信息 -->
        <div class="overseas-list">
          <div class="left">{{l.ProductActivity}}</div>
          <div class="right">
            <!-- <span>认证成功</span>
          <img src="../../../../static/images/enter@2x.png" alt=""> -->
          </div>
          <div class="clear"></div>
        </div>
        <div class="goods-info" v-for="(item,index) in l.Product" :key="index">
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
          <div class="overseas-list" v-if="l.ProductActivity == '海外淘'">
            <div class="left">身份认证</div>
            <div class="right">
              <span  @click="goAuthen()">{{l.ProductAuthen?l.ProductAuthen:'点击去认证'}}</span>
              <img src="../../../../static/images/enter@2x.png" alt="">
            </div>
            <div class="clear"></div>
          </div>
          <div class="list">
            <div class="left">配送方式</div>
            <div class="right">
              <span>{{l.FreightFormwork === 0?'包邮':l.FreightFormwork}}</span>
              <img src="../../../../static/images/enter@2x.png" alt="">
            </div>
            <div class="clear"></div>
          </div>

          <div class="list">
            <div class="left"></div>
            <div class="right">
              <!-- <span v-if="l.ProductActivity == '一口价'">共计{{l.ProductCount}}件商品，小计：￥{{99*Math.floor(l.ProductCount/2)+l.ProductPrice*(l.ProductCount%2)}}</span> -->
              <span>共计{{l.SmailCount}}件商品，小计：￥{{l.SmaillSum}}</span>
            </div>
            <div class="clear"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部 -->
    <div class="footer">
      <div class="line" style="background-color:#faf9f7;height:0.5rem;"></div>
      <router-link :to='"/mine/wallet/coupon/"+urlID'>
        <!-- v-if="l.ProductActivity == '普通商品' || l.ProductActivity == '海外淘商品'" -->
        <div class="list">
          <div class="left">使用抵用券</div>
          <div class="right">
            <span v-if="choiceCoupon.Full">满{{choiceCoupon.Full}}优惠{{choiceCoupon.Price}}</span>
              <span v-else>无</span>
            <img src="../../../../static/images/enter@2x.png" alt="">
          </div>
          <div class="clear"></div>
        </div>
      </router-link>

      <router-link :to='"/mine/wallet/redpacket/"+urlID'>
        <div class="list">
          <div class="left">使用红包</div>
          <div class="right">
             <span v-if="choiceRed.Compliant">{{choiceRed.Compliant}}{{choiceRed.Price}}元红包</span>
              <span v-else>无</span>
            <img src="../../../../static/images/enter@2x.png" alt="">
          </div>
          <div class="clear"></div>
        </div>
      </router-link>
      <div class="list" @click="choicePayType()">
        <div class="left">支付方式</div>
        <div class="right">
          <img class="img1" v-if="payTypeNum == 0" src="../../../../static/images/wechat_big@2x.png" alt="">
          <img class="img1" v-else src="../../../../static/images/money_big@2x.png" alt="">
          <span>{{payTypeNum == 0? '微信支付':'账户余额支付' }}</span>
          <img class="img2" src="../../../../static/images/enter@2x.png" alt="">
        </div>
        <div class="clear"></div>
      </div>
      <div class="btn">
        <p class="price">实付金额：<span>￥{{orderInfo.SumPrice}}</span></p>
        <p class="sub" @click="SubOrder()">提交订单</p>
      </div>
    </div>
    <!-- 支付方式 引用公用组件 -->
    <mt-popup v-model="openPayType" position="bottom" class="popup-box">
      <div class="title">选择支付方式</div>
      <div class="payList weiXin" @click="clickPay(0)">
        <img src="../../../../static/images/wechat_big@2x.png" alt="">
        <span>微信支付</span>
      </div>
      <div class="payList yuE" @click="clickPay(1)">
        <img src="../../../../static/images/money_big@2x.png" alt="">
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
import {
  MessageBox,
  Toast
} from 'mint-ui'
export default {
  data () {
    return {
      htmlH: 0,
      // empty 0 售空 1 未空  2 海外
      urlType: Number(this.$route.params.empty),
      urlID: this.$route.params.id,
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
      choiceRed: {},
      Ordmodel: []
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
    goAuthen () {
      // 跳转身份认证
      this.$router.push('/mine/info/idcard/true')
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
          res.Result.ProdList.forEach(item1 => {
            if (item1.ProductActivity === '海外淘') {
              this.urlType = 2
            }
          })
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
          if (localStorage.getItem('choiceRed') || localStorage.getItem('choiceCoupon') || localStorage.getItem('choiceAddress') || localStorage.getItem('choiceAuthor')) {
            this.EditOrderPordISHB(this.urlType)
          }
        })
    },
    SubOrder () {
      if (this.payTypeNum === 1) {
        this.popupVisible = true
      } else {
        this.toPay()
      }
    },
    ConfirmationOfReceipt (e) {
      if (this.pswNum !== '') {
        e.target.disabled = true
        this.toPay()
        setTimeout(() => {
          e.target.disabled = false
        }, 1000)
      }
    },
    toPay () {
      if (this.getCookie('openid')) {
        this.$http.get('/api/APP_Home/UnifiedOrder', {
          orderID: this.urlID,
          openID: this.getCookie('openid'),
          ThirdPayType: this.payTypeNum === 1 ? -1 : 1,
          Token: this.$store.state.token || localStorage.getItem('token'),
          paypwd: md5(this.pswNum)
        })
          .then(res => {
            localStorage.removeItem('choiceAddress')
            localStorage.removeItem('choiceCoupon')
            localStorage.removeItem('choiceRed')
            localStorage.removeItem('choiceAuthor')
            if (res.Result.res === '支付成功') {
              Toast('支付成功')
              setTimeout(() => {
                this.$router.push('/mine/orderlist?typeIndex=2')
              }, 1000)
            } else {
              callpay(res.Result.res)
            }
          })
      } else {
        MessageBox.confirm('请先进行微信授权?').then(action => {
          localStorage.setItem('firstURL', this.$route.fullPath)
          this.$router.push('/author')
        })
      }
    },
    // 下单之前 修改订单的数据 用于地址 红包等选择
    // 选择了红包抵用券
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
          'RealName': ut === 2 ? JSON.parse(localStorage.getItem('choiceAuthor')).Name : -1
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
  mounted () {
    var htmlSize = getComputedStyle(window.document.documentElement)['font-size'].split('px')[0]
    this.htmlH = document.documentElement.clientHeight - Number(htmlSize) * 1.335 * 4 - 10
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
    border-bottom: 1px solid #efefef;

    // 左侧商品图
    .left {
      img {
        height: 1.8699rem;
        width: 1.8699rem;
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
          display: inline-block;
          width: 80%;
          font-size: 0.4rem;
          color: #262626;
          font-weight: 400;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .price {
          font-size: 0.3466rem;
          color: #808080;
        }
      }
    }
  }

  .overseas-list {
    height: 1.333rem;
    line-height: 1.333rem;
    padding: 0 0 0 0.265rem;
    background-color: #fff;
    margin-top: 1.5px;
    border-bottom: 1px solid #e6e6e6;

    .left {
      color: #333333;
      font-size: 0.4rem;
      font-weight: 400;
    }

    .right {
      color: #808080;
      font-size: 0.4rem;

      img {
        float: right;
        height: 0.7rem;
        margin-top: 0.315rem;
      }
    }
  }

  .list-info {
    padding-bottom: 0.265rem;

    .list {
      height: 1.333rem;
      line-height: 1.333rem;
      padding: 0 0 0 0.265rem;
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

        span {
          padding-right: 0.265rem;
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

    .list {
      height: 1.333rem;
      line-height: 1.333rem;
      padding: 0 0 0 0.265rem;
      background-color: #fff;
      // margin-top: 1.5px;
      border-bottom: 1px solid #efefef;

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
