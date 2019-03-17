<template>
  <div class="root">
    <!-- 每周免单商品 -->
    <!-- 商品轮播 -->
    <div class='swipe-box'>
      <mt-swipe @change="handleChange">
      <mt-swipe-item v-for="(l,i) in ProdDetail.Image" :key="i">
        <img :src="l" alt="" style="width:100%;height:100%">
      </mt-swipe-item>
    </mt-swipe>
      <!-- <p class="num-index">{{swiperNum}}/{{ProdDetail.Image.length}}</p> -->
    </div>
    <!-- 商品信息 -->
    <div class="goods">
      <!-- 金额 -->
      <div class="goods-price">
        <div class="left">
          <!-- <p class="price" v-if="urlType === 0||urlType === 2">￥{{ProdDetail.Pirce}}</p> -->
          <!-- <p class="price" v-if="urlType == 1">￥{{ProdDetail.SpecialPrice}}</p> -->
          <p class="price">￥{{ProdDetail.Pirce}}</p>
          <p v-if="urlType === 0||urlType === 2" class="right weekBuy"><span>{{ProdDetail.RoleMsg}}</span></p>
          <p v-else class="right dayBuy">每日团购<br><span class="through">￥{{ProdDetail.SpecialPrice}}</span></p>
        </div>
        <div class="right info" v-if="urlType === 0||urlType === 2">{{ProdDetail.NumOfMem}}人免单团</div>
        <div class="right info" v-else>
          <div class="down-time">
            <span>倒计时</span>
            <span class="time-box">{{hN}}</span>
            <span>时</span>
            <span class="time-box">{{mN}}</span>
            <span>分</span>
            <span class="time-box">{{sN}}</span>
            <span>秒</span>
          </div>
        </div>
        <div class="clear"></div>
      </div>
      <!-- 具体信息 -->
      <div class="goods-info">
        <p class="title">{{ProdDetail.Title}}</p>
        <p class="des">{{ProdDetail.Introduce}}</p>
        <p class="num">
          <span>快递：{{ProdDetail.Express}}</span>
          <span>库存：{{ProdDetail.Stock}}</span>
          <span>销量：{{ProdDetail.Sales}}</span>
        </p>
      </div>
      <!-- 选择规格 -->
      <div class="choice-size" @click="openPopup">
        <p class="left">选择规格
          <span>({{SpecificationString}})</span>
        </p>
        <p class="right">···</p>
      </div>
      <div class="share-logo" v-if="showLogo" @click="$router.push('/')">
        <div class="left">
          <img src="../../../../../static/images/logo.png" alt>
          <span>极美家商城</span>
        </div>
        <div class="right">
          <img src="../../../../../static/images/enter@2x.png" alt>
        </div>
        <div class="clear"></div>
      </div>
      <mt-popup v-model="popupVisible" position="bottom" class="popup-box">
        <div class="goods">
          <div>
            <img :src="SpecificationImage" alt=""  @click="previewImage(0,[SpecificationImage])">
          </div>
          <div>
            <p class="price">￥{{SpecificationPrice}}</p>
            <p class="stock">库存:{{SpecificationStock}}</p>
            <p class="size">选择:{{SpecificationString?SpecificationString:"暂未选择"}}</p>
          </div>
          <p class="clear"></p>
        </div>
        <div class="size-num">
          <div v-if="!ProdDetail.IsHide">
            <div class="size-one" v-if="!ProdDetail.Specification[0].MyHide">
            <h3>{{ProdDetail.Specification[0].SpecTypeName}}</h3>
            <div class="list">
              <div v-if="!l.MyHide" v-for="(l,i) in ProdDetail.Specification" :key="i" track-by="$index" :class="isChoiceOne== i?'active':''"
                @click="choiceOne(i)">{{l.SpecName}}</div>
            </div>
          </div>
          <div class="size-two" v-if="!ProdDetail.Specification[0].IsHide">
            <h3>{{ProdDetail.Specification[isChoiceOne].prodspecSecond[0].SpecTypeName}}</h3>
            <div class="list">
              <div v-for="(ll,ii) in ProdDetail.Specification[isChoiceOne].prodspecSecond" :key="ii" track-by="$index"
                :class="isChoiceTwo== ii?'active':''" @click="choiceTwo(ii,ll.ID,ll.Price,ll.Stock)">{{ll.SpecName}}</div>
            </div>
          </div>
          </div>
          <div class="add-num">
            <h3 class="left">购买数量</h3>
            <div class="right">
              <img class="left" @click="reduction()" src="../../../../../static/images/icon_shopping_cart_reduction@2x.png"
                alt="">
              <span>{{num}}</span>
              <img class="right"  v-if="urlType== 1" @click="add()" src="../../../../../static/images/icon_shopping_cart_increase@2x.png"
                alt="">
                <img class="right"  v-else src="../../../../../static/images/icon_shopping_cart_increase@2x.png" alt="">
            </div>
            <div class="clear"></div>
          </div>
        </div>
        <div class="btn" @click="openBuy()"  v-if='!urlComing'>立即购买</div>
        <div class="btn" v-else>敬请期待</div>
      </mt-popup>
      <!-- 商品图文 评价 -->
      <div class="detail-comment">
        <div class="tabbar">
          <div :class="isActicve?'active':''" @click="tabbarClick(0)">商品信息</div>
          <div :class="!isActicve?'active':''" @click="tabbarClick(1)">用户评价</div>
        </div>
        <div class="detail-box" v-show="isActicve" v-html="decodeURIComponent(ProdDetail.Detail)"></div>
        <div class="comment" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="30"
          infinite-scroll-immediate-check='false' v-show="!isActicve">
          <div class="for-list" v-if="AllList.length<1" style="text-align:center;line-height:1.333rem;">
              暂无评价
            </div>
            <div class="for-list" v-else v-for="(l,i) in AllList" :key="i">
              <div class="top">
                <div class="left">
                  <img :src="l.HeadPortrait" alt="">{{l.NickName}}
                </div>
                <div class="right">
                  <div class="star-box">
                    <div class="star-back">
                      <img class="star-img" v-for="(n ,i) in 5" :key="i" src="../../../../../static/images/star@2x.png" />
                    </div>
                    <div class="star-front">
                      <img class="star-img" v-for="(n ,i) in l.Star" :key="i" src="../../../../../static/images/star_selected@2x.png"/>
                    </div>
                  </div>
                </div>
                <div class="clear"></div>
              </div>
              <div class="text">{{l.Comment}}</div>
              <div class="img">
                <img v-for="(item,ii) in l.Image" :key="ii" :src="item" alt=""  @click="previewImage(ii,l.Image)">
              </div>
            </div>
        </div>
      </div>
      <!-- 底部收藏和购买 -->
      <div class="nav-btn">
        <div class="collect left" @click="collectClick()">
          <img v-if="!isCollect" src="../../../../../static/images/collection@2x.png" alt="">
          <img v-else src="../../../../../static/images/collection_selected@2x.png" alt="">
          <br>
          <span>{{isCollect?'已收藏':"收藏"}}</span>
        </div>
        <div class="btn right" @click="openBuy()" v-if='!urlComing'>
          <span v-if="urlType== 0">开团免单</span>
          <span v-if="urlType== 1">立即购买</span>
          <span v-if="urlType== 2">参团免单</span>
        </div>
        <div class="btn right" v-else>
          <span>敬请期待</span>
        </div>
        <div class="clear"></div>
      </div>
    </div>
    <!-- 分享 -->
    <div class="share-icon" @click="openShare()">
      <img src="../../../../../static/images/share.png" alt="">
    </div>
    <mt-popup v-model="popupShare" position="bottom" class="popup-share" ref='shareQrcodeImg'>
      <div class="share">
        <img v-if="!isHideTitle" class="over" @click="popupShare = false" src="../../../../../static/images/over@2x.png" alt="">
        <!-- <h2 v-if="!isHideTitle" >会员plus专享，购买后返现￥{{ProdDetail.Commission}}</h2>
        <p v-if="!isHideTitle" >邀请10名好友完成注册，免费升级会员plus</p> -->
        <!-- 引用图文分享 -->
        <shareImg :goodsPlusCommission="goodsPlusCommission" :goodsImg='goodsImg' :goodsTitle="goodsTitle" :goodsPrice='goodsPrice' :shareUrl="shareUrl" @clickOnShare='clickOnShare($event)'></shareImg>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import shareImg from '../../../common/shareImg.vue'
import {
  Toast,
  MessageBox
} from 'mint-ui'
import wx from 'weixin-js-sdk'

export default {
  data () {
    return {
      // 判断url携带的type 1：每日团购 0 每周免单 2每周免单中的参团免单
      urlType: Number(this.$route.params.type),
      urlID: this.$route.params.id,
      urlCommonID: this.$route.params.commonID,
      urlComing: this.$route.params.iscoming,
      headID: null,
      sN: '00',
      mN: '00',
      hN: '00',
      // 商品信息
      ProdDetail: {
        Image: [],
        Specification: [{
          SpecName: '',
          SpecTypeName: '',
          prodspecSecond: [{
            SpecName: '',
            SpecTypeName: ''
          }]
        }]
      },
      swiperNum: 1,
      // 规格选择
      popupVisible: false,
      popupShare: false,
      isHideTitle: false,
      isShare: false,
      // 是否展示分享页的logo
      showLogo: false,
      goodsImg: '',
      goodsPlusCommission: '',
      goodsTitle: '',
      goodsPrice: 0,
      shareUrl: window.location.href,
      // 商品和评价显示
      isActicve: true,
      // 是否收藏
      isCollect: false,
      // 商品规格1的是否选中
      isChoiceOne: 0,
      // 商品规格2的是否选中
      isChoiceTwo: 0,
      // 购物车数量
      num: 1,
      // 选中规格时商品的图片，默认最外层的Image
      SpecificationImage: '',
      // 选中规格时商品的金额。默认最外层的Price
      SpecificationPrice: 0,
      // 选中规格时商品的金额。默认最外层的Stock
      SpecificationStock: 0,
      SpecificationID: '',
      // 选中的商品规格。默认空
      SpecificationString: '',
      // 商品评价
      AllList: [],
      page: 1, // 第一页
      loading: true,
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
  components: {
    shareImg
  },
  created () {
    this.getTimeDown()
  },
  methods: {
    previewImage (index, list) {
      wx.previewImage({
        current: list[index], // 当前显示图片的http链接
        urls: list // 需要预览的图片http链接列表
      })
    },
    handleChange (n) {
      this.swiperNum = n + 1
    },
    // 获取时间倒计时
    getTimeDown () {
      var _this = this
      // 获取当前时间的时间戳
      var timestamp = Date.parse(new Date())
      // 获取当天 0 点的时间戳
      var timeStampO = new Date(new Date().setHours(0, 0, 0, 0)) / 1000
      // 获取次日零点的时间戳
      var timesEnd = (timeStampO + 86400) * 1000
      var timeDownNum = (timesEnd - timestamp) / 1000
      var timeDown = setInterval(() => {
        timeDownNum--
        if (timeDownNum <= 0) {
          clearInterval(timeDown)
        } else {
          _this.sN = _this.changeData(timeDownNum).split('-')[2]
          _this.mN = _this.changeData(timeDownNum).split('-')[1]
          _this.hN = _this.changeData(timeDownNum).split('-')[0]
        }
      }, 1000)
    },
    tabbarClick (num) {
      if (num === 1) {
        this.isActicve = false
        this.loading = false
        this.GetProdutCommontList(1)
      } else {
        this.loading = true
        this.isActicve = true
      }
    },
    openPopup () {
      this.popupVisible = true
      this.SpecificationID = this.ProdDetail.Specification[this.isChoiceOne].prodspecSecond[this.isChoiceTwo].ID
      this.SpecificationPrice = this.ProdDetail.Specification[this.isChoiceOne].prodspecSecond[this.isChoiceTwo].Price
      this.SpecificationStock = this.ProdDetail.Specification[this.isChoiceOne].prodspecSecond[this.isChoiceTwo].Stock
      this.SpecificationImage = this.ProdDetail.Specification[this.isChoiceOne].prodspecSecond[this.isChoiceTwo].Image
      this.SpecificationString = this.ProdDetail.Specification[this.isChoiceOne].SpecName + ' ' + this.ProdDetail.Specification[this.isChoiceOne].prodspecSecond[this.isChoiceTwo].SpecName
      // 打开规格选择弹框，判断二级规格是否隐藏，如果隐藏，则去判断一级规格是否隐藏。
      if (this.ProdDetail.Specification[this.isChoiceOne].IsHide) {
        this.SpecificationImage = this.ProdDetail.Specification[this.isChoiceOne].Image
        this.SpecificationStock = this.ProdDetail.Specification[this.isChoiceOne].Stock
        this.SpecificationPrice = this.ProdDetail.Specification[this.isChoiceOne].SpecPrice
        if (this.ProdDetail.Specification[this.isChoiceOne].MyHide) {
          this.SpecificationImage = this.ProdDetail.Image[0]
          this.SpecificationStock = this.ProdDetail.Stock
          this.SpecificationPrice = this.ProdDetail.Pirce
        }
      }
    },
    choiceOne (index) {
      this.isChoiceOne = index
      this.isChoiceTwo = null
      this.SpecificationString = this.ProdDetail.Specification[this.isChoiceOne].SpecName
      this.SpecificationImage = this.ProdDetail.Specification[this.isChoiceOne].Image
      this.SpecificationStock = this.ProdDetail.Specification[this.isChoiceOne].prodspecSecond[0].Stock
      // 打开规格选择弹框，判断二级规格是否隐藏，如果隐藏，则点击一级规格时默认选中二级规格的id
      if (this.ProdDetail.Specification[this.isChoiceOne].IsHide) {
        this.SpecificationID = this.ProdDetail.Specification[this.isChoiceOne].prodspecSecond[0].ID
        this.SpecificationPrice = this.ProdDetail.Specification[this.isChoiceOne].SpecPrice
        this.SpecificationStock = this.ProdDetail.Specification[this.isChoiceOne].Stock
      } else {
        this.SpecificationID = ''
        this.SpecificationPrice = ''
        this.SpecificationStock = ''
      }
    },
    choiceTwo (index, id, price, stock) {
      this.isChoiceTwo = index
      this.SpecificationID = id
      this.SpecificationPrice = price
      this.SpecificationStock = stock
      this.SpecificationString = this.ProdDetail.Specification[this.isChoiceOne].SpecName + ' ' + this.ProdDetail.Specification[this.isChoiceOne].prodspecSecond[this.isChoiceTwo].SpecName
      this.SpecificationImage = this.ProdDetail.Specification[this.isChoiceOne].prodspecSecond[this.isChoiceTwo].Image
    },
    // 购物数量添加
    add () {
      this.num++
    },
    reduction () {
      if (this.num > 1) {
        this.num--
      }
    },
    // 开团购买
    openBuy () {
      // 购买时判断是否选中规格，如果选中，进行下单，如果没有，则弹框默认选中第一个
      if (this.SpecificationID) {
        // 判断是否存在openid，用于微信支付
        if (this.getCookie('openid')) {
          this.ProductBuyNow()
        } else {
          MessageBox.confirm('请先进行微信授权?').then(action => {
            localStorage.setItem('firstURL', this.$route.fullPath)
            this.$router.push('/author')
          })
        }
      } else {
        this.popupVisible = true
        this.SpecificationID = this.ProdDetail.Specification[this.isChoiceOne].prodspecSecond[this.isChoiceTwo].ID
        this.SpecificationPrice = this.ProdDetail.Specification[this.isChoiceOne].prodspecSecond[this.isChoiceTwo].Price
        this.SpecificationStock = this.ProdDetail.Specification[this.isChoiceOne].prodspecSecond[this.isChoiceTwo].Stock
        this.SpecificationString = this.ProdDetail.Specification[this.isChoiceOne].SpecName + ' ' + this.ProdDetail.Specification[this.isChoiceOne].prodspecSecond[this.isChoiceTwo].SpecName
        // 打开规格选择弹框，判断二级规格是否隐藏，如果隐藏，则去判断一级规格是否隐藏。
        if (this.ProdDetail.Specification[this.isChoiceOne].IsHide) {
          this.SpecificationImage = this.ProdDetail.Specification[this.isChoiceOne].Image
          if (this.ProdDetail.Specification[this.isChoiceOne].MyHide) {
            this.SpecificationImage = this.ProdDetail.Image[0]
          } else {
            this.SpecificationImage = this.ProdDetail.Specification[this.isChoiceOne].Image
          }
        } else {
          this.SpecificationImage = this.ProdDetail.Specification[this.isChoiceOne].prodspecSecond[this.isChoiceTwo].Image
        }
      }
    },
    // 立即购买 下单
    ProductBuyNow () {
      localStorage.setItem('openFreeWeekLink', this.$route.fullPath)
      this.$http.post('/api/APP_Product/ProductBuyNow', {
        'Token': this.$store.state.token || localStorage.getItem('token'),
        'prodList': [{
          'prodspecSecondIDList': this.SpecificationID,
          'Count': this.num,
          'ProdCommentID': this.urlCommonID
        }],
        'SignInHeadID': this.headID
      }).then(res => {
        var _this = this
        localStorage.removeItem('choiceAddress')
        localStorage.removeItem('choiceCoupon')
        localStorage.removeItem('choiceRed')
        setTimeout(() => {
          if (Number(this.$route.params.type) === 2) {
            _this.$router.push('/goods/suborder/0/' + res.Result + '?headid=' + this.headID)
          } else {
            _this.$router.push('/goods/suborder/' + this.$route.params.type + '/' + res.Result)
          }
        }, 500)
      })
    },
    openShare () {
      if (this.isShare) {
        this.popupShare = true
        this.isHideTitle = false
      } else {
        MessageBox.confirm('请先登录再分享').then(action => {
          localStorage.setItem('firstURL', this.$route.fullPath)
          this.$router.push('/author')
        })
      }
    },
    // 接受子组件传来的指令开关
    clickOnShare (e) {
      // this.isHideTitle = e
      this.$refs.shareQrcodeImg.$el.style.width = '60%'
      this.$refs.shareQrcodeImg.$el.style.bottom = '6%'
      // console.log(this.$refs.shareQrcodeImg.$el.style)
      // console.log(this.$refs.shareQrcodeImg)
    },
    // 获取商品信息
    GetProdDetail () {
      this.$http.get('/api/APP_Product/GetProdDetail', {
        Token: this.$store.state.token || localStorage.getItem('token'),
        prodID: this.urlID
      })
        .then(response => {
          this.ProdDetail = response.Result
          // this.$refs.ProdDetail.innerHTML = decodeURIComponent(response.Result.Detail ? response.Result.Detail : '暂无数据')
          this.ExchangeImage(response.Result.Image[0])
          this.goodsTitle = response.Result.Title
          this.goodsPlusCommission = response.Result.Commission
          this.goodsPrice = response.Result.Pirce
          // 是否收藏
          this.isCollect = response.Result.IsCollect
          this.SpecificationPrice = response.Result.Pirce
          this.SpecificationStock = response.Result.Stock
        })
    },
    // 获取商品信息
    GetProdDetailNot () {
      this.$http.get('/api/APP_Product/GetProdDetail', {
        prodID: this.urlID
      })
        .then(response => {
          // 商品的所有信息
          this.ProdDetail = response.Result
          // this.$refs.ProdDetailInfo.innerHTML = decodeURIComponent(response.Result.Detail ? response.Result.Detail : '暂无数据')
          this.ExchangeImage(response.Result.Image[0])
          this.goodsTitle = response.Result.Title
          this.goodsPlusCommission = response.Result.Commission
          this.goodsPrice = response.Result.Pirce
          // 是否收藏
          this.isCollect = response.Result.IsCollect
          this.SpecificationPrice = response.Result.Pirce
          this.SpecificationStock = response.Result.Stock
        })
    },
    // 上滑加载更多
    loadMore () {
      this.loading = true
      this.page++
      this.GetProdutCommontList(this.page)
    },
    // 获取评价
    GetProdutCommontList (p) {
      this.$http.get('/api/APP_Product/GetProdutCommontList', {
        prodID: this.urlID,
        pageIndex: p,
        pageSize: 5
      })
        .then(function (response) {
          // 如果是第一页直接赋值。若不是第一页则合并数据
          if (p === 1) {
            this.AllList = response.Result.commentList
            // this.$refs.loadmore.onTopLoaded()
          } else {
            this.AllList = this.AllList.concat(response.Result.commentList)
          }
          // 同时判断当前页是否是数据获取的最后一页。如果不是，则不禁止继续加载
          if (this.page < response.Result.page) {
            this.loading = false
          } else {
            this.loading = true
          }
        }.bind(this))
    },
    collectClick () {
      if (this.$store.state.token || localStorage.getItem('token')) {
        this.$http.get('/api/APP_Product/SetProdToCollect', {
          prodID: this.urlID,
          coll: this.isCollect ? 1 : 0
        })
          .then(res => {
            this.isCollect = !this.isCollect
            if (this.isCollect) {
              Toast('收藏成功')
            } else {
              Toast('取消收藏')
            }
          })
      } else {
        MessageBox.confirm('是否登录', '警告').then(action => {
          this.$router.push('/author')
        })
      }
    },
    // 将图片转base64  后台接口
    ExchangeImage (url) {
      this.$http.get('/api/APP_Home/ExchangeImage', {image: url})
        .then(res => {
          this.goodsImg = res.Result
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
          'showAllNonBaseMenuItem',
          'previewImage'
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
          title: tt.ProdDetail.Title, // 分享标题
          link: window.location.href + '?token=0', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: 'http://jmjwx.kimijia.com/static/images/logo.png', // 分享图标
          success: function () {
          },
          cancel: function () {
          }
        })
        wx.onMenuShareAppMessage({
          title: tt.ProdDetail.Title, // 分享标题
          desc: '售价：' + tt.ProdDetail.Pirce + '，' + '佣金：' + tt.ProdDetail.Commission + '，介绍：' + tt.ProdDetail.Introduce, // 分享
          link: window.location.href + '?token=0', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: 'http://jmjwx.kimijia.com/static/images/logo.png', // 分享图标
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
    this.GetProdDetailNot()
    if (this.$store.state.token || localStorage.getItem('token')) {
      this.$http.get('/api/User/JudgeExpired', {
        wxtoken: this.$store.state.token || localStorage.getItem('token')
      })
        .then(res => {
          this.isShare = res.Result
          if (this.isShare) {
            this.$http.get('/api/User/Info', {})
              .then(res => {
                localStorage.setItem('InviteCode', res.Result.InviteCode)
              })
          }
        })
    } else {
      this.isShare = false
      setTimeout(() => {
        if (this.$route.query.code) {
          localStorage.setItem('firstURL', this.$route.fullPath)
          this.$router.replace('/author/' + this.$route.query.code)
        }
      }, 1000)
    }
  },
  mounted () {
    window.scrollY = 0
    this.headID = this.$route.query.headid ? this.$route.query.headid : null
    if (!this.isActicve) {
      this.GetProdutCommontList(1)
    }
    if (this.$route.query.code || this.$route.query.token) {
      this.showLogo = true
    } else {
      this.showLogo = false
    }
    this.createCode()
    this.$http.get('/api/APP_Home/GetBankTicketAndToken')
      .then(res => {
        this.setCookie('api_ticket', res.Result.api_ticket)
        this.bkl(res.Result.api_ticket)
      })
  }
}

</script>
<style scoped lang='scss'>
@import "../../../common/base.scss";

// 轮播
.mint-swipe {
  height: 10rem;
  // padding: 0.265rem;
  box-sizing: border-box;
  overflow: visible !important;

  .mint-swipe-items-wrap {
    background-color: #efefef !important;
  }
}
.swipe-box {
  position: relative;
  .num-index {
    position: absolute;
    color: #808080;
    font-size: 0.36rem;
    right: 0.8rem;
    bottom: 0.5rem;
  }
}
.goods {
  background-color: #faf9f7;

  // 金额
  .goods-price {
    // height: 1.067rem;
    padding: 0.133rem 0.265rem;
    background-color: #fff;
    .info {
      line-height: 1.067rem;
    }

    div {
      height: 100%;
      overflow: hidden;
      color: $base_nomal;
      font-size: 0.3733rem;

      .price {
        color: #ff4e5a;
        font-size: 0.64rem;
        margin-right: 0.2rem;
        line-height: 1.067rem;
      }

      .weekBuy {
        line-height: 1.067rem;
      }

      p {
        display: inline-block;

        .dayBuy {
          font-size: 0.26rem;
          line-height: 0.2rem;
        }

        .through {
          text-decoration: line-through;
        }
      }

      // 倒计时
      .down-time {
        font-size: 0.32rem;

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
  }

  // 具体信息
  .goods-info {
    background-color: #fff;
    padding: 0.133rem 0.265rem;
    font-size: 0.3733rem;
    color: $base_nomal;

    .title {
      font-size: 0.5067rem;
      color: #262626;
      margin-bottom: 0.13rem;
      font-weight: bold;
    }

    .des {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 0.1rem;
    }

    .num {
      display: flex;
      justify-content: space-between;
    }
  }

  // 规格选择
  .choice-size {
    margin: 0.265rem 0;
    height: 1.173rem;
    line-height: 1.173rem;
    color: #333333;
    font-size: 0.4rem;
    background-color: #fff;
    padding: 0 0.265rem;

    .left {
      span {
        font-size: 0.373rem;
        color: $base_nomal;
      }
    }

    .right {
      font-weight: 600;
    }
  }

  // 商品信息和评价列表
  .detail-comment {
    margin-bottom: 1.333rem;

    .tabbar {
      height: 1.173rem;
      line-height: 0.533rem;
      font-size: 0.4rem;
      padding: 0.32rem 0;
      display: flex;
      justify-content: space-around;
      background-color: #fff;
      margin-bottom: 0.265rem;

      div {
        width: 100%;
        text-align: center;
        position: relative;
      }

      .active {
        color: #f7b500;
      }
    }

    .tabbar:nth-child(1):before {
      position: absolute;
      right: 50%;
      content: "";
      height: 0.533rem;
      width: 1px;
      background-color: #ccc;
    }

    // 图文详情
    .detail-box {
      width: 100%;
      padding: 0.265rem;
      background-color: #fff;
      p {
        width: 100%;
        img {
          width: 100%;
        }
      }
    }

    // 评论
    .comment {
      width: 100%;
      padding: 0.265rem;
      background-color: #fff;

      .for-list {
        border-bottom: 1px solid #efefef;
        padding-top: 0.133rem;
        .top {
          height: 0.8rem;
          overflow: hidden;
          line-height: 0.8rem;
          .left {
            img {
              height: 0.8rem;
              width: 0.8rem;
              border-radius: 50%;
              float: left;
              margin-right: 0.2rem;
            }
          }
        }

        .text {
          color: #262626;
          text-indent: 2em;
          font-size: 0.346rem;
          padding: 0.133rem 0;
        }

        .img {
          img {
            width: 1.6rem;
            height: 1.6rem;
            border: 1px solid #efefef;
            margin-right: 0.3rem;
          }
        }
      }
    }
  }

  // 底部收藏
  .nav-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1.33rem;
    text-align: center;
    border-top: 1px solid #efefef;
    background-color: #fff;

    .collect {
      height: 100%;
      width: 18.6%;
      background-color: #fff;

      img {
        width: 0.8067rem;
      }

      span {
        position: relative;
        top: -0.25rem;
      }
    }

    .btn {
      height: 100%;
      width: 81.4%;
      line-height: 1.33rem;
      font-size: 0.4rem;
      color: #fff;
      background-color: #f7b500;
    }
  }

  // 规格 popup
  .popup-box {
    width: 100%;
    // min-height: 8.6rem;
    padding-bottom: 1.333rem;
    .goods {
      padding: 0.265rem;
      overflow: hidden;
      background-color: #fff;

      div {
        height: 1.6rem;
        line-height: 0.53rem;
        float: left;

        img {
          height: 100%;
          width: 1.6rem;
          margin-right: 0.2rem;
          border: 1px solid #efefef;
        }

        .price {
          color: #ff4e5a;
          font-size: 0.48rem;
          margin-bottom: 0.1rem;
        }

        .stock,
        .size {
          color: $base_nomal;
          font-size: 0.32rem;
        }
      }
    }

    .size-num {
      h3 {
        color: #262626;
        font-size: 0.4rem;
        font-weight: 400;
      }

      .size-one,
      .size-two {
        padding: 0 0.265rem 0.265rem;

        .list {
          margin-top: 0.13rem;
          // height: 0.8rem;
          display: -webkit-box;
          overflow-x: auto;
          /*适应苹果*/
          -webkit-overflow-scrolling: touch;

          div {
            min-width: 2.133rem;
            height: 0.8rem;
            line-height: 0.8rem;
            border-radius: 0.1rem;
            text-align: center;
            color: #808080;
            margin-right: 0.2rem;
            padding: 0 0.265rem;
            border: 1px solid #808080;
          }

          .active {
            color: #ed2e38;
            border: 1px solid #ed2e38;
          }
        }
      }

      // 购物数量
      .add-num {
        padding: 0.133rem 0.265rem;
        height: 1.46rem;
        line-height: 1.2rem;

        div {
          width: 3.36rem;
          position: relative;

          span {
            display: inline-block;
            position: absolute;
            top: 0;
            left: 0.8rem;
            width: 1.76rem;
            height: 0.8rem;
            line-height: 0.8rem;
            font-size: 0.3467rem;
            text-align: center;
            margin-top: 0.165rem;
            border-top: 1px solid #efefef;
            border-bottom: 1px solid #efefef;
          }

          img {
            width: 0.8rem;
            height: 0.8rem;
            border: 1px solid #efefef;
            margin-top: 0.165rem;
          }
        }
      }
    }

    .btn {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 1.33rem;
      line-height: 1.33rem;
      text-align: center;
      color: #fff;
      font-size: 0.4rem;
      background: $base_active;
    }
  }
}

.popup-share {
  width: 100%;
  // height: 14rem;
  padding: 0.265rem 0.265rem;

  .share {
    height: 100%;
    width: 100%;
    text-align: center;
    position: relative;

    .over {
      position: absolute;
      top: -0.165rem;
      right: 0;
      width: 0.5rem;
    }

    h2 {
      font-size: 0.43rem;
      color: #262626;
      line-height: 1rem;
    }

    p {
      color: #808080;
      font-size: 0.346rem;
      line-height: 0.6rem;
    }
  }
}
// 星星
.star-box {
  position: relative;
  height: 20px;
  width: 100px;
  /* text-align: right; */
}
.star-back {
  position: absolute;
}
.star-front {
  position: absolute;
  white-space: nowrap;
  overflow: hidden;
}
.star-img {
  width: 20px;
  height: 20px;
  /* -moz-user-select: none; */
  cursor: pointer;
}
</style>
