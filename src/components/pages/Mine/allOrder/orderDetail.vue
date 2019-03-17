<template>
  <div class="root" :style="'min-height:'+allHeight +'px'">
    <!--list  -->
    <div class="goods-info" :style="'min-height:'+allHeight +'px'">
      <div class="list">
        <!-- 标题订单号 -->
        <div class='order-num'>
          <span class="left">订单号：</span>
          <span class="right">{{OrderInfo.OrderNumber}}</span>
        </div>
        <!-- 订单商品 -->
        <div class='order-good' @click='orderDetail()' v-for="(item,index) in OrderInfo.OrderProduct" :key="index">
          <img class='goods-img' :src='item.Image' />
          <div class="goods-title">
            <p>{{item.Name}}</p>
            <span>￥{{item.Price}}</span>
          </div>
          <div class="goods-num">
            <span>X {{item.Count}}</span><br/>
            <button @click="returnGoods(item)" v-if="item.IsReturned === 0">退货</button>
            <button v-else-if="item.IsReturned === 1">退货中</button>
            <button v-else-if="item.IsReturned === 2">同意退货</button>
            <button v-else-if="item.IsReturned === 3">拒绝退货</button>
          </div>
        </div>
        <div class='order-total'>总计：￥{{OrderInfo.SumPrice}}
          <span>（共{{OrderInfo.Count}}件）</span>
        </div>
        <div class='order-footer'>
          {{OrderInfo.CreateTime}}
        </div>
      </div>
    </div>
    <div class="footer-btn" v-if="!OrderInfo.IsAllReturned">
      <p>
        <router-link :to="'/mine/order/logistics/'+OrderInfo.ID">
          <span class='footer-btn1'>查看物流</span>
        </router-link>
        <span class='footer-btn2' @click="subTake(OrderInfo.ID)">确认收货</span>
      </p>
    </div>
    <!-- 确认收货 输入密码 -->
      <mt-popup v-model="popupVisible" popup-transition="popup-fade" class="orderPsw-popup">
        <div>
          <h2>输入支付密码</h2>
          <div class="input">
            <div>
              <input type="password" v-model="payCode">
            </div>
            <router-link to='/mine/editpsw/1'>
              <p><span>忘记密码</span></p>
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
import { Toast } from 'mint-ui'
import md5 from 'js-md5'
export default {
  data () {
    return {
      allHeight: 0,
      OrderInfo: {},
      orderID: '',
      payCode: null,
      popupVisible: false
    }
  },
  components: {},
  methods: {
    // 确认收货弹出密码
    subTake (id) {
      this.popupVisible = true
      this.orderID = id
    },
    // 确认收货
    ConfirmationOfReceipt () {
      if (this.payCode) {
        this.$http.get('/api/User/ConfirmationOfReceipt', {
          Token: this.$store.state.token || localStorage.getItem('token'),
          OrderID: this.orderID,
          payCode: md5(this.payCode)
        })
          .then(res => {
            Toast('确认收货成功')
            this.popupVisible = false
            this.isChoice = 4
            this.$router.replace('/mine/orderlist?typeIndex=4')
            this.getAllOrder(this.page, this.isChoice)
          })
      }
    },
    returnGoods (l) {
      localStorage.setItem('goodsIndo', JSON.stringify(l))
      this.$router.push('/mine/order/returnorder')
    }
  },
  beforeMount () {
    this.OrderInfo = JSON.parse(localStorage.getItem('orderDetail'))
  },
  mounted () {
    this.allHeight = document.documentElement.clientHeight
  }
}

</script>
<style scoped lang='scss'>
.root {
  background-color: #faf9f7;

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
          color: #808080;
          text-align: right;
          font-size: 0.346rem;
          line-height: 0.65rem;
          button {
            background-color: #fff;
            color: #808080;
            font-size: 0.32rem;
            border: 1px solid #9f9f9f;
            border-radius: 0.1rem;
            padding: 0.1rem 0.365rem;
          }
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
        padding: 0 0.265rem;
        text-align: right;
      }
    }
  }

  .footer-btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 1.333rem;
    line-height: 1.333rem;
    text-align: right;
    padding: 0 0.265rem;
    background: #fff;

    p {
      font-size: 0.32rem;
      color: #808080;

      span {
        display: inline-block;
        width: 1.8rem;
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
