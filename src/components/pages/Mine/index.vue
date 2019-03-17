<template>
    <div class="root">
      <!-- 用户头像 -->
      <div class="user-info">
        <router-link to="/mine/info">
          <div class="info">
            <div class="left">
              <img :src="userInfo.Image" alt="">
            </div>
            <div class="left">
              <p class="name">{{userInfo.NickName}}</p>
              <p>{{userInfo.Level==='官方合伙人'?"KOL":userInfo.Level}}</p>
              <p>积分：{{userInfo.Integration}}</p>
            </div>
            <div class="clear"></div>
          </div>
        </router-link>
      </div>
      <!-- 我的订单 -->
      <div class="my-order">
        <div class="title">
          <div class="left">我的订单</div>
          <router-link to="/mine/orderlist?typeIndex=0">
            <div class="right">
              <span class="">查看全部订单</span>
              <img src="../../../../static/images/enter@2x.png" alt="">
            </div>
          </router-link>
          <div class="clear"></div>
        </div>
        <div class="order-list">
          <router-link to="/mine/orderlist?typeIndex=1">
            <div>
              <p>
                <img src="../../../../static/images/waiting_payment@2x.png" alt="">
                <span v-if="userInfo.PendingPayment!==0">{{userInfo.PendingPayment}}</span>
              </p>
              <p>待付款</p>
            </div>
          </router-link>
          <router-link to="/mine/orderlist?typeIndex=2">
            <div>
              <p>
              <img src="../../../../static/images/waiting_delivery@2x.png" alt="">
              <span v-if="userInfo.PendingDelivery!==0">{{userInfo.PendingDelivery}}</span>
              </p>
              <p>待发货</p>
            </div>
            </router-link>
          <router-link to="/mine/orderlist?typeIndex=3">
            <div>
              <p>
              <img src="../../../../static/images/waiting_goods@2x.png" alt="">
              <span v-if="userInfo.PendingReceived!==0">{{userInfo.PendingReceived}}</span>
              </p>
              <p>待收货</p>
            </div>
          </router-link>
          <router-link to="/mine/orderlist?typeIndex=4">
            <div>
              <p>
              <img src="../../../../static/images/waiting_evaluation@2x.png" alt="">
              <span v-if="userInfo.PendingComment!==0">{{userInfo.PendingComment}}</span>
              </p>
              <p>待评价</p>
            </div>
          </router-link>
        </div>

      </div>
      <!-- list -->
        <div class="list-all">
          <router-link to='/mine/wallet'>
            <div class="list"  style="margin-top:0.265rem;">
              <div class="left">我的钱包</div>
              <div class="right">
                <img src="../../../../static/images/enter@2x.png" alt="">
              </div>
              <div class="clear"></div>
            </div>
          </router-link>
          <router-link to='/mine/income'>
          <div class="list">
            <div class="left">我的收益</div>
            <div class="right">
              <img src="../../../../static/images/enter@2x.png" alt="">
            </div>
            <div class="clear"></div>
          </div>
          </router-link>
          <router-link to='/mine/exchange'>
          <div class="list" style="margin-bottom:0.265rem;">
            <div class="left">信用卡积分兑换</div>
            <div class="right">
              <img src="../../../../static/images/enter@2x.png" alt="">
            </div>
            <div class="clear"></div>
          </div>
          </router-link>
          <router-link to='/mine/signin'>
            <div class="list">
              <div class="left">签到</div>
              <div class="right">
                <img src="../../../../static/images/enter@2x.png" alt="">
              </div>
              <div class="clear"></div>
            </div>
          </router-link>
          <router-link to='/mine/collect'>
            <div class="list"  style="margin-bottom:0.265rem;">
              <div class="left">我的收藏</div>
              <div class="right">
                <img src="../../../../static/images/enter@2x.png" alt="">
              </div>
              <div class="clear"></div>
            </div>
          </router-link>
          <router-link to='/mine/mygroup'>
            <div class="list">
              <div class="left">我的团队</div>
              <div class="right">
                <img src="../../../../static/images/enter@2x.png" alt="">
              </div>
              <div class="clear"></div>
            </div>
          </router-link>
          <router-link to='/mine/generalize'>
            <div class="list">
              <div class="left">我的推广码</div>
              <div class="right">
                <img src="../../../../static/images/enter@2x.png" alt="">
              </div>
              <div class="clear"></div>
            </div>
          </router-link>
          <a href="tel:400-009-0678">
            <div class="list">
              <div class="left">联系客服</div>
              <div class="right">
                <img src="../../../../static/images/enter@2x.png" alt="">
              </div>
              <div class="clear"></div>
            </div>
          </a>
        </div>
    </div>
</template>
<script>
import {MessageBox} from 'mint-ui'
export default {
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.$store.state.showNav = true
  },
  components: {},
  methods: {
    getUserInfo () {
      this.$http.get('/api/User/Info', {})
        .then(res => {
          this.userInfo = res.Result
          localStorage.setItem('userInfo', JSON.stringify(res.Result))
        })
    }
  },
  mounted () {
    window.scrollY = 0
    if (this.$store.state.token || localStorage.getItem('token')) {
      this.getUserInfo()
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
  background-color: #faf9f7;
  .user-info {
    width: 100%;
    height: 4.533rem;
    background-image: url("/static/images/my_bg@2x.png");
    background-size: contain;
    .info {
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 0.7066rem;
      .left {
        img {
          margin-right: 0.4933rem;
          width: 2.133rem;
          height: 2.133rem;
          border-radius: 50%;
        }
        p {
          color: #333333;
          font-size: 0.346rem;
        }
        .name {
          color: #262626;
          font-size: 0.4533rem;
        }
      }
    }
  }
  .my-order {
    margin-top: 0.265rem;
    background-color: #fff;
    .title {
      line-height: 1.1733rem;
      padding-left: 0.265rem;
      border-bottom: 1px solid #e6e6e6;
      font-size: 0.4rem;
      color: #808080;
      .right {
        display: flex;
        align-items: center;
        font-size: 0.33rem;
        span {
          display: inline-block;
          width: 2.2rem;
          white-space: nowrap;
          color: #808080;
        }
        img {
          height: 0.7rem;
          position: relative;
          top: -0.05rem;
        }
      }
    }
    // 订单图标列表
    .order-list {
      overflow: hidden;
      height: 2.533rem;
      background-color: #fff;
      div {
        width: 25%;
        height: 100%;
        text-align: center;
        float: left;
        img {
          width: 0.9rem;
          margin-top: 0.466rem;
        }
        p {
          width: 100%;
          color: #666;
          font-size: 0.32rem;
          position: relative;
          span {
            position: absolute;
            top: 0.46rem;
            left: 54%;
            display: inline-block;
            min-width: 0.38rem;
            height: 0.38rem;
            line-height: 0.4rem;
            border-radius: 0.19rem;
            color: #f7b500;
            font-size: 0.22rem;
            border: 1px solid #f7b500;
            background-color: #fff;
          }
        }
      }
    }
  }
  .list-all {
    margin-bottom: 1.333rem;
    .list {
      height: 1.333rem;
      line-height: 1.333rem;
      background-color: #fff;
      margin-bottom: 2px;
      .left {
        padding-left: 0.265rem;
        font-size: 0.4rem;
        color: #333333;
      }
      .right {
        display: flex;
        align-items: center;
        img {
          height: 0.7rem;
          margin-top: 0.3166rem;
        }
      }
    }
  }
}
</style>
