<template>
    <div class="root" :style="'min-height:'+htmlH +'px'">
      <!-- 地址 -->
      <div class="top_address">
        <img class='icon-address left' src="../../../../../static/images/icon_address@2x.png" alt="">
        <div class="left user-add">
          <p>收货人：{{orderInfo.Name}}
            <span class="right">{{orderInfo.Phone}}</span>
          </p>
          <p>收货地址：{{orderInfo.Address}}</p>
        </div>
        <img class='icon-enter right' src="../../../../../static/images/enter@2x.png" alt="">
        <img class="border-line" src="../../../../../static/images/border@2x.png" alt="">
      </div>
      <div v-for="(l,i) in orderInfo.ProdList" :key="i">

      <!-- 商品信息 -->
      <div class="goods-info"  v-for="(ll,ii) in l.Product" :key="ii">
        <div class="left">
          <img :src="ll.ProductImage" alt="">
        </div>
        <div class="leftInfo">
          <div>
            <span class="left name">{{ll.ProductName}}</span>
            <span class="right price">￥{{ll.ProductPrice}} </span>
            <span class="clear"></span>
          </div>
          <div>
            <span class="left price">{{ll.ProductSpecFirst}},{{ll.ProductSpecSecond}} </span>
            <span class="right price">x{{ll.ProductCount}}</span>
            <span class="clear"></span>
          </div>
          <!-- <div>需5000积分</div> -->
        </div>
        <div class="clear"></div>
      </div>
      <!-- 下单列表信息 -->
      <div class="list-info">
        <div class="list">
          <div class="left">免单购买</div>
          <div class="right">
            <span>此商品正在参加免单活动</span>
            <img src="../../../../../static/images/enter@2x.png" alt="">
          </div>
          <div class="clear"></div>
        </div>
        <div class="list-img">
          <img src="../../../../../static/images/no_single_details@2x.png" alt="">
        </div>
      </div>
      </div>

      <!-- 底部分享好友 -->
      <div class="footer" @click="goShare()">分享邀请好友参与免单</div>
    </div>
</template>
<script>
import { Toast } from 'mint-ui'
import wx from 'weixin-js-sdk'

export default {
  data () {
    return {
      htmlH: 0,
      // 判断url携带的type 1：每日团购 0 每周免单
      dailyBuyID: '',
      payTypeNum: 0,
      orderInfo: {},
      addressInfo: {},
      // 微信分享 参数
      pageurl: location.href.split('#')[0],
      headID: this.$route.query.headid,
      signature: '',
      // 微信分享全局验证码
      nonceStr: '',
      titleWX: '',
      descWX: '',
      linkWX: '',
      imgUrlWX: ''
    }
  },
  components: {Toast},
  methods: {
    getOrderInfo () {
      this.$http.get('/api/APP_Product/GenerateOrderData', {
        orderID: this.dailyBuyID
      })
        .then(res => {
          this.orderInfo = res.Result
          // this.imgUrlWX = this.orderInfo.ProdList[0].Product[0].ProductImage
          this.titleWX = this.orderInfo.ProdList[0].Product[0].ProductName
          this.descWX = this.orderInfo.ProdList[0].Product[0].ProductName + ',每周免单商品，拼团购买，更优惠！'
          // this.titleWX = '免单商品'
          // this.descWX = ',每周免单商品，拼团购买，更优惠！'
          this.imgUrlWX = 'http://jmjwx.kimijia.com/static/images/logo.png'
          this.linkWX = 'http://jmjwx.kimijia.com/#/goods/goodsdetail/2/' + this.orderInfo.ProdList[0].Product[0].ProdID + '?headid=' + this.headID
        })
    },
    // 去分享
    goShare () {
      this.$http.get('/api/APP_Home/GetBankTicketAndToken')
        .then(res => {
          this.setCookie('api_ticket', res.Result.api_ticket)
          this.bkl(res.Result.api_ticket)
          Toast('点击右上角小圆点分享')
        })
    },
    createCode () {
      this.nonceStr = ''
      var codeLength = 16 // 验证码的长度
      // 所有候选组成验证码的字符，当然也可以用中文的
      var selectChar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'l', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Y', 'Z']
      for (var i = 0; i < codeLength; i++) {
        var charIndex = Math.floor(Math.random() * 60)
        this.nonceStr += selectChar[charIndex]
      }
    },
    bkl (ticket) {
      var timestamp1 = Date.parse(new Date())
      this.signature = 'jsapi_ticket=' + ticket + '&noncestr=' + this.nonceStr + '&timestamp=' + timestamp1 + '&url=' + this.pageurl
      this.signature = hex_sha1(this.signature)
      wx.config({
        debug: false,
        appId: 'wxe9a8a7ae3c3bf3cc',
        timestamp: timestamp1,
        nonceStr: this.nonceStr,
        signature: this.signature,
        jsApiList: [
          'checkJsApi',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareWeibo',
          'onMenuShareQZone',
          'hideMenuItems',
          'showMenuItems',
          'hideAllNonBaseMenuItem',
          'showAllNonBaseMenuItem'
        ]
      })
      var tt = this
      // 分享
      wx.ready(function () {
        wx.hideMenuItems({
          menuList: [
            'menuItem:share:qq',
            'menuItem:share:QZone',
            'menuItem:favorite',
            'menuItem:openWithQQBrowser',
            'menuItem:openWithSafari',
            'menuItem:share:email'
          ]
        })
        wx.showMenuItems({
          menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline'] // 要显示的菜单项，所有menu项见附录3
        })
        wx.onMenuShareTimeline({
          title: tt.titleWX, // 分享标题
          link: tt.linkWX, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: tt.imgUrlWX, // 分享图标
          success: function () {
          },
          cancel: function () {
          }
        })
        wx.onMenuShareAppMessage({
          title: tt.titleWX, // 分享标题
          desc: tt.descWX, // 分享
          link: tt.linkWX, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: tt.imgUrlWX, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
          },
          cancel: function () {
          }
        })
      })
      wx.error(function (res) {
        console.log(res)
        // alert("微信appid授权错误");
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，
        // 也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      })
    }
  },
  beforeMount () {
    this.dailyBuyID = localStorage.getItem('dailyBuyID')
  },
  mounted () {
    this.htmlH = document.documentElement.clientHeight
    this.getOrderInfo()
    setTimeout(() => {
      this.createCode()
      this.$http.get('/api/APP_Home/GetBankTicketAndToken')
        .then(res => {
          this.setCookie('api_ticket', res.Result.api_ticket)
          this.bkl(res.Result.api_ticket)
        })
    }, 500)
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
    background-color: #f7b500;
    color: #fff;
    font-size: 0.4rem;
    font-weight: 400;
    text-align: center;
    line-height: 1.333rem;
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
        color: #f7b500;
      }
    }
  }
}
</style>
