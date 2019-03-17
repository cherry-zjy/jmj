<template>
  <div class="root" :style="'min-height:'+allHeight +'px'">
    <div class="tabbar-box">
      <div class="tabbar-title" :class="isChoice === 0?'is-choice':''" @click="choiceBtn(0)">全部</div>
      <div class="tabbar-title" :class="isChoice === 1?'is-choice':''" @click="choiceBtn(1)">待付款</div>
      <div class="tabbar-title" :class="isChoice === 2?'is-choice':''" @click="choiceBtn(2)">待发货</div>
      <div class="tabbar-title" :class="isChoice === 3?'is-choice':''" @click="choiceBtn(3)">待收货</div>
      <div class="tabbar-title" :class="isChoice === 4?'is-choice':''" @click="choiceBtn(4)">评价</div>
    </div>
    <!--list  -->
    <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore">
      <div
        class="goods-info"
        :style="'min-height:'+allHeight +'px'"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="200"
        infinite-scroll-immediate-check="false"
      >
        <div style="height:1.333rem;"></div>
        <div class="list" v-for="(l,i) in OrderList" :key="i">
          <!-- 标题订单号 -->
          <div class="order-num">
            <span class="left">订单号：</span>
            <span class="right">{{l.OrderNumber}}</span>
          </div>
          <!-- 订单商品 -->
          <div
            class="order-good"
            @click="orderDetail(l)"
            v-for="(item,index) in l.OrderProduct"
            :key="index"
          >
            <img class="goods-img" :src="item.Image">
            <div class="goods-title">
              <p>{{item.Name}}</p>
              <span>￥{{item.Price}}</span>
            </div>
            <div class="goods-num">
              <span>X {{item.Count}}</span>
            </div>
          </div>
          <div class="order-total">
            总计：￥{{l.SumPrice}}
            <span>（共{{l.Count}}件）</span>
          </div>
          <div class="order-footer">
            <div class="left">{{l.CreateTime}}</div>
            <div class="right">
              <p v-if="l.Type === 0">
                <!-- <router-link to="/mine/order/cancelorder"> -->
                <span class="footer-btn1" @click="CancellationOfOrder(l)">取消订单</span>
                <!-- </router-link> -->
                <span class="footer-btn2" @click="toPayMoney(l)">立即付款</span>
              </p>
              <p v-else-if="l.Type === 1">
                <!-- <router-link to="/mine/order/cancelorder"> -->
                <span class="footer-btn1" @click="CancellationOfOrder(l)">取消订单</span>
                <!-- </router-link> -->
              </p>
              <div v-else-if="l.Type === 2">
                <p v-if="!l.IsAllReturned">
                  <router-link :to="'/mine/order/logistics/'+l.ID">
                    <span class="footer-btn1">查看物流</span>
                  </router-link>
                  <span class="footer-btn2" @click="subTake(l.ID)">确认收货</span>
                </p>
                <p v-else>已退货</p>
              </div>
              <div v-else-if="l.Type === 3">
                <p v-if="!l.IsAllReturned">
                  <span class="footer-btn1" @click="evaluate(l)">去评价</span>
                </p>
                <p v-else>已退货</p>
              </div>
              <p v-else>已完成</p>
            </div>
            <div class="clear"></div>
          </div>
        </div>
        <!-- 空 -->
        <div class="empty" v-if="OrderList.length <= 0">
          <img src="../../../../../static/images/empty_order@2x.png" alt>
          <p>暂无订单</p>
        </div>
      </div>
    </mt-loadmore>
    <!-- 回到顶部 -->
    <div class="backTop" v-if="isscroll">
      <img class="backTopImg" src="../../../../../static/images/top.png" @click="scrollBackTop">
    </div>
    <!-- 确认收货 输入密码 -->
    <mt-popup v-model="popupVisible" popup-transition="popup-fade" class="orderPsw-popup">
      <div>
        <h2>输入支付密码</h2>
        <div class="input">
          <div>
            <input type="password" v-model="payCode">
          </div>
          <router-link to="/mine/editpsw/1">
            <p>
              <span>忘记密码</span>
            </p>
          </router-link>
        </div>
        <div class="footer">
          <p @click="popupVisible = false">取消</p>
          <p @click="ConfirmationOfReceipt()">确定</p>
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import { MessageBox, Toast } from 'mint-ui'
import md5 from 'js-md5'
export default {
  data () {
    return {
      allHeight: 0,
      // isChoice: Number(this.$route.params.type),
      isChoice: Number(this.$route.query.typeIndex)
        ? Number(this.$route.query.typeIndex)
        : 0,
      // 订单状态
      status: 4,
      OrderList: [],
      orderID: '',
      page: 1, // 第一页
      isscroll: false,
      topStatus: '',
      loading: false,
      payCode: null,
      popupVisible: false
    }
  },
  components: {},
  methods: {
    // 下拉刷新
    loadTop () {
      // 下拉刷新的同时 将当前页面置为1
      this.page = 1
      this.getAllOrder(this.page, this.isChoice)
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    // 上滑加载更多
    loadMore () {
      this.loading = true
      this.page++
      this.getAllOrder(this.page, this.isChoice)
    },
    // 选择头部tabbar
    choiceBtn (num) {
      this.isChoice = num
      this.page = 1
      this.OrderList = []
      this.$router.replace('/mine/orderlist?typeIndex=' + num)
      this.getAllOrder(this.page, num)
    },
    // 确认收货弹出密码
    subTake (id) {
      this.popupVisible = true
      this.orderID = id
    },
    // 又快到慢的回到顶部
    scrollBackTop () {
      var scrollToptimer = setInterval(function () {
        var top = document.body.scrollTop || document.documentElement.scrollTop
        var speed = top / 4
        if (document.body.scrollTop !== 0) {
          document.body.scrollTop -= speed
        } else {
          document.documentElement.scrollTop -= speed
        }
        if (top === 0) {
          clearInterval(scrollToptimer)
        }
      }, 30)
    },
    getAllOrder (p, t) {
      this.$http
        .get('/api/User/GetMyOrder', {
          type: t,
          pageIndex: p,
          pageSize: 10
        })
        .then(res => {
          // 如果是第一页直接赋值。若不是第一页则合并数据
          if (p === 1) {
            this.OrderList = res.Result.orderlist
            this.$refs.loadmore.onTopLoaded()
          } else {
            this.OrderList = this.OrderList.concat(res.Result.orderlist)
          }
          // 同时判断当前页是否是数据获取的最后一页。如果不是，则不禁止继续加载
          if (this.page < res.Result.page) {
            this.loading = false
          } else {
            this.loading = true
          }
        })
    },
    // 取消订单
    CancellationOfOrder (l) {
      localStorage.setItem('myOrderInfo', JSON.stringify(l))
      this.$router.push('/mine/order/cancelorder')
      // this.$http.get('/api/User/CancellationOfOrder', {
      //   Token: this.$store.state.token || localStorage.getItem('token'),
      //   OrderID: id
      // })
      //   .then(res => {
      //     this.popupVisible = false
      //     Toast('取消订单成功')
      //     this.page = 1
      //     this.getAllOrder(this.page, this.isChoice)
      //   })
    },
    // 立即付款
    toPayMoney (l) {
      this.$router.push('/mine/order/topay/' + l.ID)
    },
    // 确认收货
    ConfirmationOfReceipt () {
      if (this.payCode) {
        this.$http
          .get('/api/User/ConfirmationOfReceipt', {
            Token: this.$store.state.token || localStorage.getItem('token'),
            OrderID: this.orderID,
            payCode: md5(this.payCode)
          })
          .then(res => {
            Toast('确认收货成功')
            this.popupVisible = false
            this.page = 1
            this.isChoice = 4
            this.$router.replace('/mine/orderlist?typeIndex=4')
            this.getAllOrder(this.page, this.isChoice)
          })
      }
    },
    // 去评价
    evaluate (l) {
      localStorage.setItem('evaluate', JSON.stringify(l))
      this.$router.push('/mine/order/evaluate')
    },
    toPay (id) {
      if (this.getCookie('openid')) {
        this.$http
          .get('/api/APP_Home/UnifiedOrder', {
            orderID: id,
            openID: this.getCookie('openid'),
            ThirdPayType: this.payTypeNum === 1 ? -1 : 1,
            Token: this.$store.state.token || localStorage.getItem('token'),
            paypwd: md5(this.pswNum)
          })
          .then(res => {
            callpay(res.Result.res)
          })
      } else {
        MessageBox.confirm('请先进行微信授权?').then(action => {
          this.$router.push('/author')
        })
      }
    },
    orderDetail (l) {
      localStorage.setItem('orderDetail', JSON.stringify(l))
      if (l.Type === 2) {
        this.$router.push('/mine/order/type/orderdetail')
      }
    }
  },
  mounted () {
    this.allHeight = document.documentElement.clientHeight
    this.getAllOrder(this.page, this.isChoice)
    var tt = this
    window.onscroll = function () {
      // 变量t是滚动条滚动时，距离顶部的距离
      var t = document.documentElement.scrollTop || document.body.scrollTop
      if (t > 400) {
        tt.isscroll = true
      } else {
        tt.isscroll = false
      }
    }
  },
  watch: {
    $route (to, from) {
      if (from.params.type !== to.params.type) {
        // this.$router.go(0)
      }
    }
  }
}
</script>
<style scoped lang='scss'>
.root {
  background-color: #faf9f7;
  .tabbar-box {
    height: 1.333rem;
    background: rgba(255, 255, 255, 1);
    opacity: 0.95;
    line-height: 1.333rem;
    display: flex;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    .tabbar-title {
      width: 20%;
      text-align: center;
      font-size: 0.3733rem;
      color: #808080;
    }
    .is-choice {
      color: #b88e42;
    }
  }
  /*list  */

  .goods-info {
    // margin-top: 1.333rem;
    padding: 0.265rem 0;
    .list {
      background-color: #fff;
      // 标题订单号
      .order-num {
        height: 1.333rem;
        font-size: 0.3733rem;
        color: #333333;
        line-height: 1.333rem;
        background: #fff;
        opacity: 0.95;
        padding: 0 0.265rem;

        border: 1px solid #efefef;
      }
      // 订单商品
      .order-good {
        height: 2.4rem;
        width: 100%;
        background: #f9f9f9;
        opacity: 0.95;
        padding: 0.265rem;
        overflow: hidden;
        .goods-img {
          height: 100%;
          width: 1.869rem;
          float: left;
          margin-right: 0.265rem;
          border: 1px solid #e5e5e5;
        }
        .goods-title {
          color: #262626;
          font-size: 0.4rem;
          font-weight: 400;
          height: 0.65rem;
          width: 100%;
          p {
            float: left;
            width: 60%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          span {
            float: right;
            color: #ff4e5a;
            font-size: 0.4rem;
          }
        }
        .goods-num {
          float: right;
          color: #808080;
          font-size: 0.346rem;
          line-height: 1rem;
        }
      }
      // z总价
      .order-total {
        height: 1.333rem;
        line-height: 1.333rem;
        text-align: right;
        font-size: 0.4rem;
        color: #333333;
        padding: 0 0.265rem;
        border-top: 1px solid #efefef;
        border-bottom: 1px solid #efefef;
        span {
          font-size: 0.32rem;
          color: #808080;
        }
      }
      .order-footer {
        height: 1.333rem;
        line-height: 1.333rem;
        background: #fff;
        overflow: hidden;
        opacity: 0.95;
        padding: 0 0.13rem;

        p {
          font-size: 0.32rem;
          color: #808080;
          span {
            display: inline-block;
            width: 2.133rem;
            height: 0.8rem;
            text-align: center;
            border-radius: 5px;
            color: #262626;
            line-height: 0.8rem;
            margin-left: 0.1rem;
            border: 1px solid #b3b3b3;
          }
          .footer-btn2 {
            border: 1px solid #edb54d;
            color: #edb54d;
          }
        }
      }
    }
    // 空购物车
    .empty {
      padding-top: 1rem;
      text-align: center;
      img {
        width: 6rem;
      }
      p {
        color: #b3b3b3;
        font-size: 0.4rem;
      }
    }
  }
  .backTop {
    position: fixed;
    bottom: 1.6rem;
    right: 0.6rem;
    width: 1.2rem;
    height: 1.2rem;
    padding: 0.2rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  /*加载gif  */
  .refresh-block {
    text-align: center;
    img {
      width: 0.5rem;
      height: 0.5rem;
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
          }
        }
        p {
          text-align: right;
          color: #808080;
          font-size: 0.346rem;
          line-height: 1rem;
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
          color: #f7b500;
        }
      }
    }
  }
}
</style>
