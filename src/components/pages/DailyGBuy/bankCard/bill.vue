<template>
    <div class="root" :style="'min-height:'+htmlH +'px'">
      <!-- top -->
      <div class="top">
        <table>
          <thead>
            <th>积分数</th>
            <th>兑换商品</th>
            <th>审核周期<br>（工作日）</th>
            <th>兑换余额</th>
            <th>兑换金币</th>
          </thead>
          <tbody>
            <tr v-for="(l,i) in itemList" :key="i">
              <td class="integral">{{l.Integral}}</td>
              <td>{{l.ProductName}}</td>
              <td>{{l.Days}}</td>
              <td>{{l.ExBalance}}</td>
              <td>{{l.ExCoin}}</td>
            </tr>
          </tbody>
        </table>

        <div v-if="itemList.length<1" style="text-align:center;padding:0.265rem 0;color:#808080">暂无数据</div>
      </div>
      <!-- goods -->
      <div class="bill-step">
        <h2>兑换步骤详情</h2>
        <!-- <h3>兑换步骤详情</h3> -->
        <div class="step" ref="step"></div>
      </div>
      <div class="footer" v-if="!urlComing">
        <router-link :to="'/bankcard/conversion/bill/fillin/'+this.$route.params.id" v-if="itemList.length>0">
          <p>报单</p>
        </router-link>
      </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      htmlH: 0,
      urlComing: this.$route.params.iscoming,
      itemList: []
    }
  },
  components: {},
  methods: {
    getInfo () {
      this.$http.get('/api/APP_DailyDeail/GetBankDetail',
        {
          bankID: this.$route.params.id
        })
        .then(res => {
          this.itemList = res.Result.itemList
          // console.log(this.$refs.step)
          this.$refs.step.innerHTML = decodeURIComponent(res.Result.Detail ? res.Result.Detail : '暂无数据')
          localStorage.setItem('billItemList', JSON.stringify(res.Result.itemList))
        })
    }
  },
  mounted () {
    this.htmlH = document.documentElement.clientHeight
    this.getInfo()
  }
}
</script>
<style scoped lang='scss'>
.root {
  background-color: #faf9f7;
  padding: 0.265rem;
  .top {
    width: 100%;
    background-color: #fff;
    table {
      width: 100%;
      font-size: 0.32rem;
      text-align: center;
      thead {
        color: #333333;
      }
      tbody {
        color: #808080;
        .integral {
          color: #f7b500;
        }
      }
    }
  }
  .bill-step {
    padding: 0.265rem;
    background-color: #fff;
    margin-top: 0.3rem;
    h2 {
      display: inline-block;
      color: #333333;
      font-size: 0.4rem;
      position: relative;
      font-weight: 400;
      line-height: 0.7rem;
    }
    h2::before {
      position: absolute;
      bottom: 0;
      content: "";
      width: 50%;
      left: 25%;
      height: 0.0533rem;
      background-color: #f7b500;
    }
    h3 {
      color: #8c8c8c;
      font-size: 0.3733rem;
      line-height: 1rem;
    }
    .step {
      width: 100%;
      padding: 0.265rem 0;
      p {
        width: 100%;
        img {
          width: 100%;
        }
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0 0.265rem;
    height: 1.863rem;
    line-height: 1.333rem;
    font-size: 0.4rem;
    color: #fff;
    text-align: center;
    p {
      color: #fff;
      background-color: #f7b500;
    }
  }
}
</style>
