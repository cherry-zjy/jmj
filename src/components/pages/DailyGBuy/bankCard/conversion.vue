<template>
    <div class="root" :style="'min-height:'+htmlH +'px'">
      <!-- bnaner -->
      <div class="banner">
        <img src="../../../../../static/images/banner_one@2x.png" alt="">
      </div>
      <!-- swiper -->
      <div class="listAll">
        <p class="title">请选择兑换机构</p>
        <mt-swipe  :auto="0">
           <!-- v-for="(l, i) in bankList" :key="i" -->
          <mt-swipe-item>
            <div class="icon">
              <div :class="choiceIndex0 == ii ? 'active icon-item' : 'icon-item' " @click="choiceChange0(ii,ll.ID)" v-for="(ll, ii) in bankList" :key="ii">
                <img :src="ll.Logo" alt="">
                <p>{{ll.BankName}}</p>
              </div>
            </div>
          </mt-swipe-item>
          <mt-swipe-item>
            <div class="icon">
             <div :class="choiceIndex1 == i ? 'active icon-item' : 'icon-item' " @click="choiceChange1(i,l.ID)" v-for="(l, i) in bankList1" :key="i">
                <img :src="l.Logo" alt="">
                <p>{{l.BankName}}</p>
              </div>
            </div>
          </mt-swipe-item>
        </mt-swipe>
      </div>

      <!-- btn -->
  <div class="footer-btn" @click="subClick()">立即兑换</div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      htmlH: 0,
      urlComing: this.$route.params.iscoming,
      // 银行列表
      bankList: [
        // [
        {
          img: '../../../../../static/images/jiaotong@2x.png',
          name: '交通银行'
        }, {
          img: '../../../../../static/images/huaxia@2x.png',
          name: '华夏银行'
        }, {
          img: '../../../../../static/images/zhaoshang@2x.png',
          name: '招商银行'
        }, {
          img: '../../../../../static/images/jianshe@2x.png',
          name: '建设银行'
        }, {
          img: '../../../../../static/images/pingan@2x.png',
          name: '平安银行'
        }, {
          img: '../../../../../static/images/guangda@2x.png',
          name: '光大银行'
        }, {
          img: '../../../../../static/images/zhongguo@2x.png',
          name: '中国银行'
        }, {
          img: '../../../../../static/images/huifeng@2x.png',
          name: '汇丰银行'
        },
        // ], [
        {
          img: '../../../../../static/images/beijing@2x.png',
          name: '北京银行'
        }, {
          img: '../../../../../static/images/zhongxin@2x.png',
          name: '中信银行'
        }
        // ]
      ],
      bankList1: [],
      // 选中的银行
      choiceIndex0: 0,
      choiceIndex1: null,
      ID: ''
    }
  },
  components: {},
  methods: {
    choiceChange0 (n, id) {
      this.choiceIndex0 = n
      this.ID = id
      this.choiceIndex1 = null
    },
    choiceChange1 (n, id) {
      this.choiceIndex0 = null
      this.ID = id
      this.choiceIndex1 = n
    },
    subClick () {
      if (this.urlComing) {
        this.$router.push('/bankcard/conver/bill/' + this.ID + '/1')
      } else {
        this.$router.push('/bankcard/conver/bill/' + this.ID)
      }
    },
    GetBankList () {
      this.$http.get('/api/APP_DailyDeail/GetBankList', {
        pageIndex: 1,
        pageSize: 8
      })
        .then(res => {
          this.bankList = res.Result.banklist
          this.ID = this.bankList[0].ID
          // this.bankList = this.fixedArray(arr)
          // console.log(this.bankList)
        })
    },
    GetBankList1 () {
      this.$http.get('/api/APP_DailyDeail/GetBankList', {
        pageIndex: 2,
        pageSize: 8
      })
        .then(res => {
          this.bankList1 = res.Result.banklist
        })
    },
    // 每8个放一个数组，然后把所有数组再放入数组
    fixedArray: function (arr) {
      var bigArray = []
      var smArray = []
      for (var i = 0; i < arr.length; i++) {
        smArray.push(arr[i])
        if ((i + 1) % 8 === 0 || i === arr.length - 1) {
          bigArray.push(smArray)
          smArray = []
        }
      }
      return bigArray
    }
  },
  mounted () {
    this.htmlH = document.documentElement.clientHeight
    this.GetBankList()
    this.GetBankList1()
  }
}
</script>
<style scoped lang='scss'>
.root {
  padding: 0.265rem;
  background: #faf9f7;
  .banner {
    height: 3.7866rem;
    width: 100%;
    margin-bottom: 0.265rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  // 轮播图 css，
  .listAll {
    height: 7.4rem; // 7.2rem
    font-weight: 400;
    background-color: #fff;
    .title {
      color: #333333;
      font-size: 0.3733rem;
      letter-spacing: 0.05rem;
      line-height: 1.106rem;
      padding: 0 0.265rem;
    }
    .mint-swipe {
      background-color: #fff;
      // box-sizing: border-box;
      // overflow: visible !important;
      .mint-swipe-items-wrap {
        .icon {
          display: flex;
          flex-wrap: wrap;
          .icon-item {
            width: 25%;
            padding-bottom: 0.3rem;
            position: relative;
            img {
              width: 100%;
            }
            p {
              // position: absolute;
              // bottom: 0;
              width: 100%;
              color: #333333;
              font-size: 0.3466rem;
              font-weight: 400;
              text-align: center;
            }
          }
          .active {
            border-radius: 0.13rem;
            border: 2px solid #f7b500;
          }
        }
      }
    }
  }
  .footer-btn {
    width: 100%;
    height: 1.1733rem;
    line-height: 1.1733rem;
    font-size: 0.4rem;
    color: #fff;
    text-align: center;
    margin-top: 2rem;
    background: #f7b500;
  }
}
</style>
