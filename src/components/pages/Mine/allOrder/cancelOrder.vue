<template>
    <div class="root" :style="'min-height:'+allHeight +'px'">
      <!--list  -->
      <div class='goods-info'>
        <div class="list">
          <!-- 标题订单号 -->
          <div class='order-num'>
            <span class="left">{{orderInfo.OrderNumber}}</span>
            <span class="right">{{orderInfo.CreateTime}}</span>
          </div>
          <!-- 订单商品 -->
          <div class='order-good' v-for="(l,i) in orderInfo.OrderProduct" :key="i">
            <img class='goods-img' :src='l.Image'/>
            <div class="goods-title">{{l.Name}}
              <span>￥{{l.Price}}</span>
            </div>
            <div class="goods-num">
              <span>X {{l.Count}}</span>
            </div>
          </div>
          <div class="pay">
            <div class="left">支付方式</div>
            <div class="right">
              <img class="img1" v-if="orderInfo.PayType == 2" src="../../../../../static/images/alipay_big@2x.png" alt="">
              <img class="img1" v-else-if="orderInfo.PayType == 1" src="../../../../../static/images/wechat_big@2x.png" alt="">
              <img class="img1" v-else src="../../../../../static/images/money_big@2x.png" alt="">
              <span v-if="orderInfo.PayType == 2">支付宝支付</span>
              <span v-if="orderInfo.PayType == 1">微信支付</span>
              <span v-if="orderInfo.PayType == 3">账户余额支付</span>
              <span v-if="orderInfo.PayType == 4">APP支付</span>
            </div>
            <div class="clear"></div>
          </div>
        </div>
      </div>
      <div class="area">
        <!-- <p>1231</p> -->
          <div class="text-area">
            <textarea cols="30" rows="8" v-model="content" placeholder="取消理由：为什么呢？"></textarea>
          </div>
      </div>
      <div class="footer-btn"  @click="cancel()">取消订单</div>
      <!-- 确认 -->
      <mt-popup v-model="popupVisible" popup-transition="popup-fade" class="orderPsw-popup">
        <div>
          <h2>订单取消后将无法恢复</h2>
          <div class="footer">
            <p @click="popupVisible = false">暂不取消</p>
            <p @click="CancellationOfOrder()">确认取消</p>
          </div>
        </div>
      </mt-popup>
    </div>
</template>
<script>
import { Toast } from 'mint-ui'

export default {
  data () {
    return {
      allHeight: 0,
      orderInfo: {},
      content: null,
      popupVisible: false
    }
  },
  components: {},
  methods: {
    // 取消订单
    cancel () {
      this.popupVisible = true
    },
    CancellationOfOrder () {
      this.$http.get('/api/User/CancellationOfOrder', {
        Token: this.$store.state.token || localStorage.getItem('token'),
        OrderID: this.orderInfo.ID,
        reason: this.content
      })
        .then(res => {
          this.popupVisible = false
          Toast('取消订单成功')
          setTimeout(() => {
            this.$router.go(-1)
          }, 2000)
        })
    }
  },
  mounted () {
    this.allHeight = document.documentElement.clientHeight
    this.orderInfo = JSON.parse(localStorage.getItem('myOrderInfo'))
  }
}
</script>
<style scoped lang='scss'>
.root {
  background-color: #faf9f7;
  /*list  */
  .goods-info {
    padding: 0;
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
          width: 1.869rem;
          height: 100%;
          float: left;
          margin-right: 0.265rem;
          border: 1px solid #e5e5e5;
        }
        .goods-title {
          color: #262626;
          font-size: 0.4rem;
          font-weight: 400;
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
      .pay {
        height: 1.333rem;
        line-height: 1.333rem;
        padding: 0 0.265rem;
        background-color: #fff;
        margin-top: 1.5px;
        border-bottom: 1px solid #efefef;
        border-top: 1px solid #efefef;
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
    }
  }
  .area {
    width: 100%;
    p {
      color: #333333;
      font-size: 0.4rem;
      line-height: 1.333rem;
      padding: 0 0.265rem;
    }
    .text-area {
      width: 100%;
      padding: 0.265rem;
      background-color: #fff;
      textarea {
        width: 100%;
        height: 100%;
        border: none;
        color: #808080;
        font-size: 0.4rem;
      }
    }
  }
  .footer-btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 1.333rem;
    line-height: 1.333rem;
    color: #fff;
    font-size: 0.4rem;
    text-align: center;
    background-color: #f7b500;
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
