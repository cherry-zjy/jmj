<template>
    <div class="root">
      <!-- 点击签到 -->
      <div class="top" :class="!InfoDetail.isSignin?'is-sign':'no-sign'">
        <div class="circle1">
          <div class="circle2">
            <div class="circle3" v-if="!InfoDetail.isSignin" @click="signCLick()">签到</div>
            <div class="circle3" v-else>签到完成</div>
          </div>
        </div>
      </div>
      <div class="title">
        签到记录
      </div>
      <div class="list">
        <div v-for="(l,i) in InfoDetail.signInList" :key="i">
          <span>{{l.CreateTime}}</span>
          <span>{{l.Integral}}</span>
          <span>{{l.SignTimes}}</span>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      // 是否可以签到
      isSign: false,
      urlID: this.$route.params.id,
      page: 1,
      InfoDetail: {
        isSignin: false,
        signInList: []
      }
    }
  },
  components: {},
  methods: {
    getSignDetail (p) {
      this.$http.get('/api/User/SignInDetail', {
        orderprodID: this.urlID,
        pageIndex: p,
        pageSize: 10
      })
        .then(res => {
          this.InfoDetail = res.Result
        })
    },
    signCLick () {
      this.$http.get('/api/User/SignIn', {
        OrderProdID: this.urlID
      })
        .then(res => {
          this.getSignDetail(1)
        })
    }
  },
  mounted () {
    this.getSignDetail(this.page)
  }
}
</script>
<style scoped lang='scss'>
.root {
  // 点击签到
  .top {
    width: 100%;
    height: 4.8rem;
    background-image: url("../../../../../static/images/clock_in_bg@2x.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    text-align: center;
    div {
      display: inline-block;
    }
  }
  .is-sign {
    .circle1 {
      height: 2.666rem;
      width: 2.666rem;
      background-color: #f7b500;
      margin-top: 1.066rem;
      border-radius: 50%;
      position: relative;
      .circle2 {
        height: 2.466rem;
        width: 2.466rem;
        background-color: #fff;
        border-radius: 50%;
        margin-top: 0.1rem;
      }
      .circle3 {
        height: 2.366rem;
        width: 2.366rem;
        background-color: #f7b500;
        border-radius: 50%;
        margin-top: 0.05rem;
        line-height: 2.366rem;
        text-align: center;
        font-size: 0.64rem;
        color: #fff;
      }
    }
  }
  .no-sign {
    .circle1 {
      height: 2.666rem;
      width: 2.666rem;
      background-color: #e0e0e0;
      margin-top: 1.066rem;
      border-radius: 50%;
      position: relative;
      .circle2 {
        height: 2.466rem;
        width: 2.466rem;
        background-color: #fff;
        border-radius: 50%;
        margin-top: 0.1rem;
      }
      .circle3 {
        height: 2.366rem;
        width: 2.366rem;
        background-color: #e0e0e0;
        border-radius: 50%;
        margin-top: 0.05rem;
        line-height: 2.366rem;
        text-align: center;
        font-size: 0.48rem;
        color: #fff;
      }
    }
  }
  // 签到记录
  .title {
    height: 1.0133rem;
    line-height: 1.0133rem;
    padding: 0 0.265rem;
    font-size: 0.346rem;
    color: #808080;
    background: #faf9f7;
  }
  .list {
    div {
      padding: 0 0.265rem;
      height: 1.333rem;
      line-height: 1.333rem;
      display: flex;
      justify-content: space-between;
      font-size: 0.4rem;
      border-bottom: 1px solid #e6e6e6;
      span:nth-child(1) {
        color: #333333;
      }
      span:nth-child(2) {
        color: #ff4e5a;
      }
      span:nth-child(3) {
        color: #808080;
      }
    }
  }
}
</style>
