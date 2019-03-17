<template>
    <div class="root shopping" :style="'min-height:'+htmlH +'px'">
      <!-- 空购物车 -->
      <div class="empty" v-if="isEmpty">
        <img src="../../../../static/images/empty_shopping_cart@2x.png" alt="">
        <p>购物车空空如也</p>
      </div>
      <!-- 同类商品归类到一个大模块 -->
      <div class="goods-list" >
        <div style="margin-bottom:0.265rem;" v-for="(item,index) in oneList" :key="index">
          <!-- 大分类标题 -->
          <div class="list-title"  v-if="oneList[index].twoList.length>0">
            <p class="checkbox">
              <input type="checkbox" :id="'listOne'+index"  v-model="item.one_check" @change="check_list(index)">
              <label :for="'listOne'+index"></label>
            </p>
            <span>{{item.oname}}</span>
          </div>
          <!-- 商品列表 -->
          <div class="list-goods" v-for="(goods,nindex) in item.twoList" :key="nindex">
            <mt-cell-swipe
              :right="[
                {
                  content: '删除',
                  style: { background: 'red', color: '#fff' },
                  handler: () => delGoods(goods.ID)
                }
              ]" >
              <!-- 左侧复选框 -->
              <p class="checkbox left">
              <input type="checkbox" :id="'listTwo'+index+nindex" v-model="goods.two_check" @change="click_input(index,nindex)">
              <label :for="'listTwo'+index+nindex"></label>
              </p>
              <!-- 右侧商品购物车 -->
              <div class="left shopping_cart">
              <div class="left left-img" @click="goToGoodsInfo(item.oname,goods.ProdID)">
                <img class="goodsimg" :src="goods.Image" alt="">
              </div>
              <div class="right">
                <div class="goods-name">
                  <span  @click="goToGoodsInfo(item.oname,goods.ProdID)">{{goods.Name}}</span>
                </div>
                <div class="add-num">
                  <h3 class="left" style="color:#FF4E5A;font-size:0.4rem;">￥{{goods.Price}}</h3>
                  <div class="right">
                    <img class="imgleft" @click="reduction(index,nindex)" src="../../../../static/images/icon_shopping_cart_reduction@2x.png" alt="">
                    <span>{{goods.Count}}</span>
                    <img class="imgright" @click="add(index,nindex)" src="../../../../static/images/icon_shopping_cart_increase@2x.png" alt="">
                  </div>
                  <div class="clear"></div>
                </div>
              </div>
              <div class="clear"></div>
              </div>
            </mt-cell-swipe>
          </div>
        </div>
      </div>
      <!-- 底部结算 -->
      <div class="footer" v-if="oneList.length > 0">
        <div class="left left-price">
          <p class="checkbox left">
              <input type="checkbox" id="allCheckout" @change="check_all()" v-model="checkall">
              <label for="allCheckout"></label>
          </p>
          <p class="right right-pirce">合计：<span>￥{{allprice}}</span></p>
          <p class="clear"></p>
        </div>
        <div class="right subAll"  @click="btn()">
          结算
        </div>
        <div class="clear"></div>
      </div>
    </div>
</template>
<script>
import { MessageBox, Toast } from 'mint-ui'
export default {
  data () {
    return {
      htmlH: 0,
      num: 1,
      options: [1, 2, 3],
      oneList: [],
      checkall: false,
      allprice: 0,
      cponeList: [],
      isEmpty: true,
      // 点击购买时处理数据 用于请求
      buyArr: []
    }
  },
  created () {
    this.$store.state.showNav = true
  },
  components: {},
  methods: {
    // 购物数量添加
    add (i, j) {
      this.oneList[i].twoList[j].Count++
      if (this.oneList[i].twoList[j].two_check) {
        this.money()
      }
    },
    reduction (i, j) {
      if (this.oneList[i].twoList[j].Count > 1) {
        this.oneList[i].twoList[j].Count--
        if (this.oneList[i].twoList[j].two_check) {
          this.money()
        }
      }
    },
    delGoods (id) {
      MessageBox.confirm('确定删除该商品?').then(action => {
        this.$http.get('/api/APP_Shoppingcart/DelShopCartProd',
          {
            prodsecondID: id,
            Token: localStorage.getItem('token')
          })
          .then(res => {
            Toast(res.Result)
            this.GetShopCartList()
          })
      })
    },
    // 获取金额
    money: function () {
      var that = this
      this.allprice = 0
      that.oneList.forEach(item1 => {
        item1.twoList.forEach(item2 => {
          if (item2.two_check === true) {
            // 判断是否是一口价商品
            if (item1.oname === '一口价') {
              // 如果一个元素中商品数量为偶数 则2件99 否则2件99再加一件原价
              if (item2.Count % 2 === 0) {
                that.allprice += 99 * (item2.Count / 2)
              } else {
                that.allprice += 99 * ((item2.Count - 1) / 2) + item2.Price
              }
            } else {
              that.allprice += (item2.Price) * (item2.Count)
            }
          }
        })
      })
    },
    check_all: function () {
      var that = this
      that.oneList.forEach(item1 => {
        item1.one_check = that.checkall
        item1.twoList.forEach(item2 => {
          item2.two_check = that.checkall
        })
      })
      that.money()
    },
    abc: function () {
      var that = this
      var aaa = that.oneList.filter(item2 => {
        return item2.one_check === true
      })
      aaa.length === that.oneList.length ? that.checkall = true : that.checkall = false
      that.money()
    },

    check_list: function (i) {
      var that = this
      that.oneList[i].twoList.forEach(item1 => {
        item1.two_check = that.oneList[i].one_check
      })
      that.abc()
    },

    click_input: function (i, j) {
      console.log(i, j)
      var that = this
      var checklist = that.oneList[i].twoList.filter(item1 => {
        return item1.two_check === true
      })

      checklist.length === that.oneList[i].twoList.length ? that.oneList[i].one_check = true : that.oneList[i].one_check = false
      that.abc()
    },
    btn: function () {
      var that = this

      that.cponeList = JSON.parse(JSON.stringify(that.oneList))
      that.cponeList.filter(item1 => {
        item1.twoList = item1.twoList.filter(item2 => {
          return item2.two_check === true
        })
      })
      that.cponeList = that.cponeList.filter(item3 => {
        return item3.twoList.length !== 0
      })

      if (that.cponeList.length === 0) {
        Toast('请选择商品哦！')
      } else {
        that.cponeList.forEach(item4 => {
          item4.twoList.forEach(item5 => {
            var obj = {}
            // console.log(item5)
            obj.prodspecSecondIDList = item5.ID
            obj.Count = item5.Count
            that.buyArr.push(obj)
          })
        })

        setTimeout(() => {
          that.ProductBuyNow()
        }, 500)
      }
    },
    // 立即购买 下单
    ProductBuyNow () {
      this.$http.post('/api/APP_Product/ProductBuyNow', {
        'Token': this.$store.state.token || localStorage.getItem('token'),
        'prodList': this.buyArr
      }).then(res => {
        localStorage.removeItem('choiceAddress')
        localStorage.removeItem('choiceCoupon')
        localStorage.removeItem('choiceRed')
        this.$router.push('/shopping/suborder/' + res.Result)
      })
    },
    // 获取购物车列表
    GetShopCartList () {
      this.$http.get('/api/APP_Shoppingcart/GetShopCartList',
        {
          pageIndex: 1,
          pageSize: 999,
          Token: localStorage.getItem('token')
        })
        .then(res => {
          this.isEmpty = res.Result.isEmpty
          this.oneList = res.Result.oneList
        })
    },
    goToGoodsInfo (name, id) {
      switch (name) {
        case '普通商品':
          this.$router.push('/nomalgoods/goodsdetail/1/' + id)
          break
        case '海外淘':
          this.$router.push('/nomalgoods/goodsdetail/2/' + id)
          break
        case '一口价':
          this.$router.push('/two99/goodsinfo/' + id)
          break
        case '售罄商品':
          this.$router.push('/nomalgoods/goodsdetail/0/' + id)
          break
        default:
          break
      }
    }
  },
  mounted () {
    this.htmlH = document.documentElement.clientHeight
  },
  beforeMount () {
    if (this.$store.state.token || localStorage.getItem('token')) {
      this.GetShopCartList()
    } else {
      MessageBox('温馨提示', '您还未登录')
      setTimeout(() => {
        window.location.href = '#/author'
      }, 1000)
    }
  }
}
</script>
<style scoped lang='scss'>
.root {
  width: 100%;
  // height: 100%;
  background-color: #faf9f7;
  // 空购物车
  .empty {
    padding-top: 3rem;
    text-align: center;
    img {
      width: 6rem;
    }
    p {
      color: #b3b3b3;
      font-size: 0.4rem;
      margin-top: 0.1rem;
    }
  }
  // 非空
  .goods-list {
    width: 100%;
    margin-bottom: 2.7rem;
    .list-title {
      height: 1.333rem;
      line-height: 1.333rem;
      background-color: #fff;
      padding: 0 0.265rem;
      // border: 1px solid #e6e6e6;
      p {
        float: left;
        margin-right: 0.265rem;
        margin-top: 0.38rem;
      }
      span {
        color: #333333;
        font-size: 0.346rem;
      }
    }
    .list-goods {
      height: 2.4rem;
      background-color: #fff;
      padding: 0.265rem 0 0.265rem 0.265rem;
      border-top: 1px solid #e6e6e6;
      .checkbox {
        width: 0.533rem;
        margin-top: 0.635rem;
        margin-right: 0.265rem;
      }
      .shopping_cart {
        height: 100%;
        width: 90%;
        display: flex;
        .left-img {
          height: 100%;
          margin-right: 0.265rem;
          .goodsimg {
            height: 1.85rem;
            width: 1.85rem;
          }
        }
        .right {
          height: 1.85rem;
          flex: auto;
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          .goods-name {
            color: #333333;
            font-size: 0.4rem;
            line-height: 0.8rem;
            span {
              display: inline-block;
              width: 5rem;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            // .right {
            //   height: 0.4rem;
            //   padding-top: 0.1rem;
            // }
          }
          // 购物数量
          .add-num {
            height: 0.8rem;
            line-height: 0.8rem;
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
                border-top: 1px solid #efefef;
                border-bottom: 1px solid #efefef;
              }
              img {
                padding: 0.1rem;
              }
              .imgleft {
                width: 0.8rem;
                height: 0.8rem;
                border: 1px solid #efefef;
                position: absolute;
                left: 0;
              }
              .imgright {
                width: 0.8rem;
                height: 0.8rem;
                border: 1px solid #efefef;
                position: absolute;
                right: 0;
              }
            }
          }
        }
      }
    }
  }

  .footer {
    line-height: 1.333rem;
    position: fixed;
    left: 0;
    bottom: 1.33rem;
    width: 100%;
    font-size: 0.4rem;
    .left-price {
      width: 60%;
      background-color: #fff;
      padding: 0 0.265rem;
      .checkbox {
        margin-top: 0.35rem;
      }
      .right-pirce {
        span {
          color: #ff4e5a;
        }
      }
    }
    .subAll {
      width: 40%;
      text-align: center;
      color: #fff;
      background-color: #f7b500;
    }
  }
}
</style>
