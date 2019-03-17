<template>
  <div class="root">
    <div class="topImg">
      <div class="img">
        <!-- <img src="../../../../../static/images/banner_two@2x.png" alt=""> -->
        <img :src="bannerList[0].Image" alt="">
      </div>
      <div class="tipTitle">以下商品{{ABitePrice}}元任选{{Piece}}件</div>
    </div>
    <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore">
      <div :style="'min-height:'+allHeight +'px'"
       v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
          infinite-scroll-distance="200" infinite-scroll-immediate-check='false'>
        <div class="for-list" v-for="(l,i) in AllList" :key="i">
          <div class="list">
            <router-link :to='"/two99/goodsinfo/"+l.ID'>
              <div class="goods-img">
                <img v-lazy="l.Image" :alt="l.Name">
              </div>
              <div class="goods-title">{{l.Name}} </div>
            </router-link>
            <div class="goods-author">
              <p class="left">
                <span>￥{{l.Price}}</span>
              </p>
              <p class="right">
                <img @click="openPopup(l.ID)" src="../../../../../static/images/add_shopping_cart@2x.png" alt="">
              </p>
              <div class="clear"></div>
            </div>
          </div>
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
              <div v-if="!l.MyHide" v-for="(l,i) in ProdDetail.Specification" :key="i" track-by="$index" :class="isChoiceOne== i?'active':''" @click="choiceOne(i)">{{l.SpecName}}</div>
            </div>
          </div>
          <div class="size-two" v-if="!ProdDetail.Specification[0].IsHide">
            <h3>{{ProdDetail.Specification[isChoiceOne].prodspecSecond[0].SpecTypeName}}</h3>
            <div class="list">
              <div v-if="!ll.IsHide" v-for="(ll,ii) in ProdDetail.Specification[isChoiceOne].prodspecSecond" :key="ii" track-by="$index" :class="isChoiceTwo== ii?'active':''" @click="choiceTwo(ii,ll.ID,ll.Price,ll.Stock)">{{ll.SpecName}}</div>
            </div>
          </div>
          </div>
            <div class="add-num">
              <h3 class="left">购买数量</h3>
              <div class="right">
                <img class="left" @click="reduction()" src="../../../../../static/images/icon_shopping_cart_reduction@2x.png"
                  alt="">
                <span>{{num}}</span>
                <img class="right" @click="add()" src="../../../../../static/images/icon_shopping_cart_increase@2x.png"
                  alt="">
              </div>
              <div class="clear"></div>
            </div>
          </div>
          <div class="btn" @click="openBuy()">加入购物车</div>
        </mt-popup>
      </div>
    </mt-loadmore>
  </div>
</template>
<script>
import {
  Toast
} from 'mint-ui'
import wx from 'weixin-js-sdk'

export default {
  data () {
    return {
      allHeight: 0,
      popupVisible: false,
      // 商品规格1的是否选中
      isChoiceOne: 0,
      // 商品规格2的是否选中
      isChoiceTwo: 0,
      // 购物车数量
      num: 1,
      // 获取列表数据
      AllList: [],
      bannerList: [{'Image': null}],
      ABitePrice: null,
      Piece: null,
      // 商品信息
      ProdDetail: {
        Specification: [{
          SpecName: '',
          SpecTypeName: '',
          prodspecSecond: [{
            SpecName: '',
            SpecTypeName: ''
          }]
        }]
      },
      // 选中规格时商品的图片，默认最外层的Image
      SpecificationImage: '',
      // 选中规格时商品的金额。默认最外层的Price
      SpecificationPrice: 0,
      // 选中规格时商品的金额。默认最外层的Stock
      SpecificationStock: 0,
      SpecificationID: '',
      SpecificationString: '',
      page: 1,
      topStatus: '',
      loading: false

    }
  },
  components: {},
  methods: {
    openPopup (id) {
      this.popupVisible = true
      this.GetProdDetail(id)
    },
    previewImage (index, list) {
      wx.previewImage({
        current: list[index], // 当前显示图片的http链接
        urls: list // 需要预览的图片http链接列表
      })
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
      this.SpecificationImage = this.ProdDetail.Specification[this.isChoiceOne].prodspecSecond[this.isChoiceTwo].Image
      this.SpecificationString = this.ProdDetail.Specification[this.isChoiceOne].SpecName + ' ' + this.ProdDetail.Specification[this.isChoiceOne].prodspecSecond[this.isChoiceTwo].SpecName
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
    // 加入购物车
    openBuy () {
      this.popupVisible = false
      this.AddUserShopingCart()
    },
    // 下拉刷新
    loadTop () {
      // 下拉刷新的同时 将当前页面置为1
      this.page = 1
      this.GetFixedPriceList(this.page)
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    // 上滑加载更多
    loadMore () {
      this.loading = true
      this.page++
      this.GetFixedPriceList(this.page)
    },
    // 获取商品列表
    GetFixedPriceList (p) {
      this.$http.get('/api/APP_Product/GetFixedPriceList', {
        pageIndex: p,
        pageSize: 10
      })
        .then(function (response) {
          // 如果是第一页直接赋值。若不是第一页则合并数据
          this.ABitePrice = response.Result.ABitePrice
          this.Piece = response.Result.Piece
          if (p === 1) {
            this.AllList = response.Result.prodlist
            this.$refs.loadmore.onTopLoaded()
          } else {
            this.AllList = this.AllList.concat(response.Result.prodlist)
          }
          // 同时判断当前页是否是数据获取的最后一页。如果不是，则不禁止继续加载
          if (this.page < response.Result.page) {
            this.loading = false
          } else {
            this.loading = true
          }
        }.bind(this))
    },
    // 获取商品列表
    GetBanner () {
      this.$http.get('/api/APP_Home/GetBannerList', {
        type: 9,
        pageIndex: 1,
        pageSize: 10
      })
        .then(response => {
          this.bannerList = response.Result.banner
        })
    },
    // 获取商品信息
    GetProdDetail (id) {
      this.$http.get('/api/APP_Product/GetProdDetail', {
        prodID: id
      })
        .then(response => {
          this.ProdDetail = response.Result
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
        })
    },
    // 加入购物车
    AddUserShopingCart () {
      this.$http.post('/api/APP_Product/AddUserShopingCart', {
        'Token': this.$store.state.token || localStorage.getItem('token'),
        'prodspecsecondID': this.SpecificationID,
        'Count': this.num
      })
        .then(res => {
          // console.log(res)
          Toast('添加购物车成功')
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
    this.allHeight = document.documentElement.clientHeight - Number(htmlSize) * 6.2
    // 获取当前页数据
    this.GetFixedPriceList(1)
    this.GetBanner()

    this.createCode()
    this.$http.get('/api/APP_Home/GetBankTicketAndToken')
      .then(res => {
        this.setCookie('api_ticket', res.Result.api_ticket)
        this.bkl(res.Result.api_ticket)
      })
  },
  beforeRouteLeave (to, from, next) {
    let position = window.scrollY
    this.$store.state.scrollNum = position
    next()
  }
}

</script>
<style scoped lang='scss'>
@import "../../../common/base.scss";

.root {
  padding: 0.265rem 0 0.265rem 0.265rem;
  background-color: #faf9f7;
  .topImg {
    margin-bottom: 0.265rem;
    .img {
      width: 100%;
      padding: 0 0.265rem 0 0;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .tipTitle {
      height: 1.333rem;
      line-height: 1.333rem;
      text-align: center;
      font-size: 0.4rem;
      color: #f7b500;
      background-color: #fff;
    }
  }
  .for-list {
    width: 4.865rem;
    display: inline-block;
    background-color: #faf9f7;
    padding-right: 0.265rem;
    padding-bottom: 0.265rem;

    .list {
      width: 100%;
      background-color: #fff;

      .goods-img {
        width: 100%;
        height: 4rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .goods-title {
        font-size: 0.4rem;
        color: #333333;
        padding: 0.265rem 0.265rem 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .goods-author {
        font-size: 0.32rem;
        color: #808080;
        padding: 0.132rem 0.265rem 0.265rem;

        .left {
          line-height: 0.53rem;

          img {
            width: 0.53rem;
            border-radius: 50%;
            float: left;
            margin-right: 0.1rem;
          }

          span {
            line-height: 0.59rem;
          }
        }

        .right {
          line-height: 0.53rem;

          img {
            width: 0.53rem;
            border-radius: 50%;
            float: left;
            margin-right: 0.1rem;
          }

          span {
            line-height: 0.55rem;
          }
        }
      }
    }
  }

  @media screen and (min-width: 540px) {
    .for-list {
      width: 33.3%;

      .goods-img {
        width: 100%;
      }
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
</style>
