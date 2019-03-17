<template>
    <div class="root">
      <!-- 我的收益 -->
      <div class="top">
        <div class="price">{{balance}}</div>
        <div class="tip">所得佣金</div>
      </div>
      <div class="title">
        佣金记录
      </div>
      <div class="list">
        <!-- <div class="for-list" v-for="(l,i) in allList" :key="i">
          <div class="left">
            <p class="name">{{l.Content}}</p>
            <p>{{l.CreateTime}}</p>
          </div>
          <div class="right">
            <p class="prcie">+{{l.Price}} </p>
            <p>{{l.ProductPrice}}</p>
          </div>
        </div> -->
        <echarts v-if="flag" :allList='allList'></echarts>
        <!-- <div v-if="allList.length === 0" style="text-align:center;padding-top:5rem;">
            <span style="color:#808080;font-size:0.346rem">暂无记录</span>
          </div> -->
      </div>
    </div>
</template>
<script>
import echarts from '../../../common/echarts.vue'
export default {
  data () {
    return {
      page: 1,
      balance: 888,
      allList: [],
      flag: false
    }
  },
  components: {echarts},
  methods: {
    getAllList (p) {
      // this.$http.get('/api/User/GetUserNotSettledCommission', {
      //   pageIndex: p,
      //   pageSize: 999
      // })
      this.$http.get('/api/User/FoldLineDiagram', {
      })
        .then(res => {
          this.allList = res.Result
          this.flag = true
        })
    }
  },
  created () {
    this.getAllList(this.page)
  },
  mounted () {
    this.balance = JSON.parse(localStorage.getItem('userInfo')).SettledCommission
  }
}
</script>
<style scoped lang='scss'>
.root {
  // 点击签到
  .top {
    width: 100%;
    height: 3.733rem;
    text-align: center;
    background-color: #fff;
    padding-top: 1.1rem;
    .price {
      color: #f7b500;
      font-size: 0.8rem;
    }
    .tip {
      color: #4d4d4d;
      font-size: 0.346rem;
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
    .for-list {
      height: 1.566rem;
      line-height: 0.633rem;
      display: flex;
      justify-content: space-between;
      font-size: 0.4rem;
      padding: 0.2rem;
      border-bottom: 1px solid #e6e6e6;
      div {
        color: #808080;
        p:nth-child(1) {
          font-size: 0.4rem;
        }
        p:nth-child(2) {
          font-size: 0.32rem;
        }
      }
      .right {
        text-align: right;
      }
      .name {
        color: #333333;
      }
      .prcie {
        color: #ff4e5a;
      }
    }
  }
}
</style>
