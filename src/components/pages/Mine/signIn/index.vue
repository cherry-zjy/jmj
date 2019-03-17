<template>
  <div class="root">
    <!-- 签到 -->
    <!-- 顶部tabbar -->
    <div class="tab-bar">
      <div :class="isActicve?'active':''" @click="tabbarClick(2)">免单参团人数已满</div>
      <div :class="!isActicve?'active':''" @click="tabbarClick(1)">免单参团人数未满</div>
    </div>
    <!-- 团购倒计时 -->
    <div class="down-time">
      <div class="left">签到累计积分:{{Integration}}</div>
    </div>
    <!-- 团购商品 签到 -->
    <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore">
      <div class="goods" :style="'min-height:'+goodsImgH +'px'" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
        infinite-scroll-distance="200" infinite-scroll-immediate-check='false'>
        <div class="for-list" v-for="(l,i) in AllList" :key="i" v-if="isActicve">
          <div class="left">
            <img :src="l.ProdImage" alt="">
          </div>
          <div class="leftInfo">
            <div class="goods-name"><span class="left">{{l.ProdName}}</span></div>
            <div class="goods-price"><span class="left">￥{{l.ProdPrice}}</span></div>
            <div class="orther-info">
              <div>
                <p>人数已满，参团成功</p>
                <p>需要签到<span>{{l.ProdSignTimes}}</span>次</p>
                <p>需要花费<span>{{l.ProdNtegrate}}</span>积分</p>
              </div>
              <div class="backSub" @click="backSub(l.OrderProdID, l.ProdNtegrate)" v-if="l.IsFull">返款申请</div>
              <div class="backSub" @click="signSub(l.OrderProdID)" v-if="!l.IsFull">签到</div>
            </div>
            <img class="isSuccess"  v-if="l.IsFull" src="../../../../../static/images/complete@2x.png" alt="">
          </div>
          <div class="clear"></div>
        </div>
        <div class="for-list" v-for="(l,i) in AllList" :key="i" v-if="!isActicve">
          <div class="left">
             <img :src="l.ProdImage" alt="">
          </div>
          <div class="leftInfo">
             <div class="goods-name"><span class="left">{{l.ProdName}}</span></div>
            <div class="goods-price"><span class="left">￥{{l.ProdPrice}}</span></div>
            <div class="orther-info">
              <div>
                <p>还需参团{{l.ProdNumOfMem}}人</p>
                <p>需要签到<span>{{l.ProdSignTimes}}</span>次</p>
                <p>需要花费<span>{{l.ProdNtegrate}}</span>积分</p>
              </div>
              <div class="backSub" @click="goShare(l)">去分享</div>
            </div>
          </div>
          <div class="clear"></div>
        </div>
      </div>
    </mt-loadmore>
    <!-- 确认 -->
    <mt-popup v-model="popupVisible" popup-transition="popup-fade" class="orderPsw-popup">
      <div>
        <h2>确定<span style="color:#F7B500">{{ProdNtegrate}}</span>积分返款</h2>
        <div class="footer">
          <p @click="popupVisible = false">取消</p>
          <p @click="Rebate()">确认</p>
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import wx from 'weixin-js-sdk'
import { Toast } from 'mint-ui'

export default {
  data () {
    return {
      AllList: [],
      Integration: 0,
      isActicve: true,
      goodsImgH: 0,
      popupVisible: false,
      page: 1, // 第一页
      topStatus: '',
      loading: false,
      OrderProdID: '',
      ProdNtegrate: '',
      // 微信分享 参数
      pageurl: location.href.split('#')[0],
      signature: '',
      // 微信分享全局验证码
      nonceStr: '',
      titleWX: '',
      descWX: '',
      linkWX: '',
      imgUrlWX: ''
    }
  },
  components: {},
  methods: {
    // 下拉刷新
    loadTop () {
      // 下拉刷新的同时 将当前页面置为1
      this.page = 1
      this.getAllList(this.page, this.isActicve ? 2 : 1)
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    // 上滑加载更多
    loadMore () {
      this.loading = true
      this.page++
      this.getAllList(this.page, this.isActicve ? 2 : 1)
    },
    backSub (id, jifen) {
      this.popupVisible = true
      this.OrderProdID = id
      this.ProdNtegrate = jifen
    },
    signSub (id) {
      this.$router.push('/mine/signin/' + id)
    },
    Rebate () {
      this.$http.get('/api/User/Rebate', {
        signID: this.OrderProdID
      })
        .then(res => {
          // this.getAllList(1, 2)
          this.$router.push('/mine/sign/success')
        })
    },
    getAllList (p, t) {
      this.$http.get('/api/User/GetUserSignInList', {
        type: t,
        pageIndex: p,
        pageSize: 10
      })
        .then(res => {
          this.Integration = res.Result.Integration
          if (p === 1) {
            this.AllList = res.Result.prodList
            this.$refs.loadmore.onTopLoaded()
          } else {
            this.AllList = this.AllList.concat(res.Result.postlist)
          }
          // 同时判断当前页是否是数据获取的最后一页。如果不是，则不禁止继续加载
          if (this.page < res.Result.page) {
            this.loading = false
          } else {
            this.loading = true
          }
        })
    },
    // 导航切换
    tabbarClick (num) {
      this.page = 1
      this.AllList = []
      if (num !== 1) {
        this.isActicve = true
      } else {
        this.isActicve = false
      }
      this.getAllList(this.page, num)
    },
    // 去分享
    goShare (l) {
      // this.imgUrlWX = l.ProdImage
      this.titleWX = l.ProdName
      this.descWX = l.ProdName + ',每周免单商品，拼团购买，更优惠！'
      this.imgUrlWX = 'http://jmjwx.kimijia.com/static/images/logo.png'
      this.linkWX = 'http://jmjwx.kimijia.com/#/goods/goodsdetail/2/' + l.ProdID + '?token=0&headid=' + l.HeadID
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
  mounted () {
    // 获取当前页面的fontsize，计算剩余的首屏高度
    var htmlSize = getComputedStyle(window.document.documentElement)['font-size'].split('px')[0]
    this.goodsImgH = document.documentElement.clientHeight - Number(htmlSize) * (0.933 + 1.333)
    this.getAllList(this.page, this.isActicve ? 2 : 1)
    this.createCode()
  }
}

</script>
<style scoped lang='scss'>
.root {
  // 顶部tabbar
  .tab-bar {
    width: 100%;
    height: 1.333rem;
    display: flex;
    justify-content: space-around;
    line-height: 1.333rem;

    div {
      width: 50%;
      text-align: center;
      font-size: 0.4rem;
    }

    .active {
      color: #f7b500;
      border-bottom: 2px solid #f7b500;
    }
  }

  //
  .down-time {
    width: 100%;
    padding: 0.1866rem 0.265rem;
    height: 0.933rem;
    font-size: 0.32rem;
    color: #999;
    background-color: #faf9f7;

    .left {
      line-height: 0.5598rem;
    }

    .right {
      span {
        line-height: 0.5598rem;
        text-align: center;
      }

      .time-box {
        display: inline-block;
        width: 0.666rem;
        height: 0.56rem;
        border-radius: 0.1rem;
        color: #fff;
        background-color: #f7b500;
      }
    }
  }

  // 团购商品大图
  .goods {
    width: 100%;
    padding: 0 0.265rem 0.1866rem;
    background-color: #faf9f7;
    // margin-bottom: 1.333rem;

    .for-list {
      width: 100%;
      height: 3.463rem;
      padding: 0.265rem;
      background-color: #fff;
      margin-bottom: 0.265rem;

      .left {
        height: 100%;
        img {
          height: 100%;
          width: 2.933rem;
          margin-right: 0.26rem;
        }
      }

      .leftInfo {
        height: 100%;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        position: relative;

        .goods-name {
          font-size: 0.4rem;
          color: #333333;
          span {
            display: inline-block;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .goods-price {
          color: #ff4e5a;
          font-size: 0.346rem;
        }

        .orther-info {
          color: #808080;
          font-size: 0.32rem;
          position: relative;

          p {
            line-height: 0.5rem;

            span {
              color: #f7b500;
            }
          }

          .backSub {
            width: 2rem;
            height: 0.8rem;
            line-height: 0.8rem;
            font-size: 0.346rem;
            color: #fff;
            text-align: center;
            background-color: #f7b500;
            position: absolute;
            bottom: 0;
            right: 0.265rem;
          }
        }

        .isSuccess {
          position: absolute;
          top: 0;
          right: 0;
          width: 1.333rem;
          height: 1.333rem;
        }
      }
    }
  }

  .orderPsw-popup {
    top: 35%;
    width: 8rem;
    text-align: center;
    border-radius: 5px;

    div {
      h2 {
        color: #333333;
        font-size: 0.426rem;
        line-height: 2.133rem;
      }

      .footer {
        display: flex;
        justify-content: space-between;
        border-top: 1px solid #e6e6e6;

        p {
          width: 100%;
          text-align: center;
          line-height: 1.333rem;
          font-size: 0.4rem;
          color: #4d4d4d;
        }

        p:nth-child(2) {
          color: #f7b500;
          border-left: 1px solid #e6e6e6;
        }
      }
    }
  }
}
</style>
