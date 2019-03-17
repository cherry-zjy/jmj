<template>
    <div class="root" :style="'min-height:'+allHeight +'px'">
      <!--list  -->
      <div class='goods-info'>
        <div class="list" v-for="(l,i) in orderDetail.OrderProduct" :key="i" v-if="l.IsReturned === 0">
          <!-- 订单商品 -->
          <div class='order-good'>
            <img class='goods-img' :src='l.Image'/>
            <div class="goods-title">
              <p>{{l.Name}}</p>
            </div>
             <star class="star" :total="5" :value="l.starNum" @StarClick='StarClick($event,i)'></star>

          </div>
          <div class="area">
            <div class="text-area">
              <textarea cols="30" rows="8" v-model="l.comment" placeholder="分享一下使用心得吧~"></textarea>
            </div>
            <div class="photo">
              <Upload @imglist='imglist($event,i)'></Upload>
            </div>
          </div>
        </div>
      </div>
      <!-- <router-link to='/mine/order/evaluate/success'> -->
        <div class="footer-btn" @click="save()">发布</div>
      <!-- </router-link> -->
    </div>
</template>
<script>
// 星级评分
import star from '../../../common/star.vue'
// 上传多张图
import Upload from '../../../common/uploadImg.vue'
import { Toast } from 'mint-ui'

export default {
  data () {
    return {
      allHeight: 0,
      // starNum: 5,
      orderDetail: {
        OrderProduct: [
          {
            starNum: 0,
            comment: '',
            imageList: '',
            Image: '',
            Name: ''
          }
        ]
      }
    }
  },
  components: {star, Upload, Toast},
  methods: {
    // 接受子组件传来的图片列表
    imglist (e, n) {
      this.imgList = e
      this.orderDetail.OrderProduct[n].imageList = e.join(',')
    },
    StarClick (e, n) {
      console.log(e)
      this.orderDetail.OrderProduct[n].starNum = e
    },
    save () {
      this.$http.post('/api/User/OrderComment', {
        'Token': this.$store.state.token || localStorage.getItem('token'),
        'prod': this.orderDetail.OrderProduct
      })
        .then(res => {
          // Toast('评价成功')
          // setTimeout(() => {
          //   this.$router.go(-1)
          // }, 2000)
          this.$router.push('/mine/order/evaluate/success')
        })
    }
  },
  mounted () {
    this.allHeight = document.documentElement.clientHeight
    this.orderDetail = JSON.parse(localStorage.getItem('evaluate'))
    for (let i = 0; i < this.orderDetail.OrderProduct.length; i++) {
      const element = this.orderDetail.OrderProduct[i]
      element.starNum = 5
      element.comment = ''
      element.imageList = ''
    }
  }
}
</script>
<style scoped lang='scss'>
.root {
  background-color: #faf9f7;
  margin-bottom: 1.333rem;

  /*list  */
  .goods-info {
    padding: 0;
    .list {
      background-color: #fff;
      margin-bottom: 0.265rem;
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
        background: #fff;
        opacity: 0.95;
        padding: 0.265rem;
        overflow: hidden;
        .goods-img {
          height: 100%;
          float: left;
          margin-right: 0.265rem;
          border: 1px solid #e5e5e5;
        }
        .goods-title {
          color: #262626;
          font-size: 0.4rem;
          font-weight: 400;
          p{
            width: 40%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        position: relative;
        .star {
          position: absolute;
          right: 0.26rem;
          top: 0.26rem;
        }
      }
      .area {
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
}
</style>
