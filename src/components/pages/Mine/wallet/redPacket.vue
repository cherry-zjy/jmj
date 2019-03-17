<template>
  <div class="root"  :style="'min-height:'+clientHeight +'px'">
    <!-- 签到 -->
    <!-- 顶部tabbar -->
    <div class="tab-bar" v-if="!isChoice">
      <div :class="isActicve?'active':''" @click="tabbarClick(0)">未使用</div>
      <div :class="!isActicve?'active':''" @click="tabbarClick(1)">已过期</div>
    </div>
    <!-- 团购商品 签到 -->
    <div class="goods" v-if="infoList.length>0">
      <div class="for-list isUse" v-if="isActicve" v-for="(l,i) in infoList" :key="i" @click="choiceWallet(l,i)"  ref='couponRed'>
        <div class="left">
          <p class="price">￥{{l.Price}}</p>
          <p class="remart">满￥{{l.Full}}使用</p>
        </div>
        <div class="right">
          <p>{{l.Compliant}}</p>
          <p>截止时间：{{l.ExpiryTime}}</p>
        </div>
      </div>
      <div class="for-list isUse" v-if="isChoice" @click="choiceWalletKong()" ref='couponRedKong'>
        <div class="left" style="line-height:2.66rem;">
          暂不使用
        </div>
        <div class="right" style="line-height:2.66rem;">
          暂不使用
        </div>
      </div>
      <div class="for-list noUse" v-if="!isActicve" v-for="(l,i) in infoList" :key="i">
        <div class="left">
          <p class="price">￥{{l.Price}}</p>
          <p class="remart">满￥{{l.Full}}使用</p>
        </div>
        <div class="right">
          <p>{{l.Compliant}}</p>
          <p>截止时间：{{l.ExpiryTime}}</p>
        </div>
      </div>
    </div>
    <div class="goods" v-if="infoList.length<1"  style="text-align:center;color:#808080">
      暂无可用红包
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isChoice: this.$route.params.choice,
      isActicve: true,
      clientHeight: 0,
      popupVisible: false,
      infoList: [],
      page: 1
    }
  },
  components: {},
  methods: {
    tabbarClick (num) {
      this.page = 1
      if (num === 1) {
        this.isActicve = false
        this.getInfoList(this.page, 2)
      } else {
        this.isActicve = true
        this.getInfoList(this.page, 1)
      }
    },
    getInfoList (p, t) {
      this.$http.get('/api/User/GetUserRedPacket',
        {
          state: t,
          pageIndex: p,
          pageSize: 10
        })
        .then(res => {
          this.infoList = res.Result.userredpacklist
          localStorage.removeItem('choiceRed')
        })
    },
    getInfoListChoice (t) {
      this.$http.get('/api/User/GetUserRedPacket',
        {
          orderID: this.isChoice,
          state: t,
          pageIndex: 1,
          pageSize: 999
        })
        .then(res => {
          this.infoList = res.Result.userredpacklist
          localStorage.removeItem('choiceRed')
        })
    },
    choiceWallet (info, refAdd) {
      if (this.isChoice) {
        // 订单选择地址 如果是订单进来的选择地址存起来
        localStorage.setItem('choiceRed', JSON.stringify(info))
        this.$refs.couponRed.forEach(item => {
          item.id = ''
        })
        this.$refs.couponRed[refAdd].id = 'isChoiveRed'
        setTimeout(() => {
          this.$router.go(-1)
        }, 0)
      }
    },
    choiceWalletKong () {
      localStorage.setItem('choiceRed', JSON.stringify({ID: '-1'}))
      this.$refs.couponRed.forEach(item => {
        item.id = ''
      })
      this.$refs.couponRedKong.id = 'isChoiveCoupon'
      setTimeout(() => {
        this.$router.go(-1)
      }, 0)
    }
  },
  mounted () {
    this.clientHeight = document.documentElement.clientHeight
    if (this.isChoice) {
      this.getInfoListChoice(this.isActicve ? 1 : 2)
    } else {
      this.getInfoList(this.page, this.isActicve ? 1 : 2)
    }
  }
}

</script>
<style scoped lang='scss'>
.root {
  background-color: #faf9f7;
  // 顶部tabbar
  .tab-bar {
    width: 100%;
    height: 1.333rem;
    display: flex;
    justify-content: space-around;
    line-height: 1.333rem;
    background-color: #fff;
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
  .goods {
    padding: 0.265rem;
    #isChoiveRed {
      border: 1px solid #f7b500;
    }
    .for-list {
      height: 2.666rem;
      width: 100%;

      margin-bottom: 0.265rem;
      .left {
        width: 44.5%;
        color: #333333;
        text-align: center;
        .price {
          font-size: 0.8266rem;
          margin-top: 0.5rem;
          line-height: 1rem;
        }
        .remart {
          font-size: 0.3466rem;
        }
      }
      .right {
        width: 55.5%;
        text-align: left;
        padding-left: 0.6rem;
        p {
          color: #333333;
          font-size: 0.3733rem;
        }
        p:nth-child(1) {
          margin-top: 0.826rem;
        }
      }
    }
    .isUse {
      background-image: url("../../../../../static/images/coupons@2x.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    .noUse {
      background-image: url("../../../../../static/images/coupons_overdue@2x.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
}
</style>
