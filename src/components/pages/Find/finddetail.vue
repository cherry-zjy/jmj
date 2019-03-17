<template>
  <div class="root" :style="'min-height:'+allHeight +'px'">
    <!-- 商品轮播 -->
    <div class="swipe-box">
      <mt-swipe>
        <mt-swipe-item v-for="(l,i) in findDetail.ImageList" :key="i">
          <img :src="l" :alt="'banner图'+i" style="width:100%;height:100%">
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <div class="info">
      <div class="user">
        <img :src="findDetail.Comment.Image" alt>
        <span>{{findDetail.Comment.NickName}}</span>
      </div>
      <div class="goods-detail">{{findDetail.Comment.Comment}}</div>
    </div>
    <!-- footer -->
    <div>
      <div class="footer">
        <div
          class="footer-info"
          @click="goToGoodsDetail(findDetail.ProdID,findDetail.Type,findDetail.Comment.Commentid)"
        >
          <img :src="findDetail.ImageList[0]" alt>
          <div ref="detailText"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      allHeight: 0,
      // 判断url携带的ID
      goodsId: this.$route.params.id,
      findDetail: {
        Comment: {
          Image: ''
        },
        ImageList: []
      },
      page: 1 // 第一页
    }
  },
  components: {},
  methods: {
    getDetail (p) {
      this.$http
        .get('/api/APP_Discover/DiscoverDetail', {
          prodID: this.goodsId,
          pageIndex: p,
          pageSize: 99
        })
        .then(res => {
          this.findDetail = res.Result
          this.$refs.detailText.innerHTML = decodeURIComponent(
            res.Result.Introduct
          )
        })
    },
    goToGoodsDetail (id, type, comId) {
      switch (type) {
        case 0:
          // 售罄
          this.$router.push('/goods/goodsdetail/0/' + id + '/' + comId)
          break
        case 1:
          // 普通
          this.$router.push('/goods/goodsdetail/1/' + id + '/' + comId)
          break
        case 2:
          // 海外
          this.$router.push('/nomalgoods/goodsdetail/2/' + id + '/' + comId)
          break
        case 3:
          // 每日团购
          this.$router.push('/goods/goodsdetail/1/' + id + '/' + comId)
          break
        case 4:
          // 每周免单
          this.$router.push('/goods/goodsdetail/0/' + id + '/' + comId)
          break
        case 5:
          // 2件99
          this.$router.push('/two99/goodsinfo/' + id + '/' + comId)
          break
        default:
          alert('无法识别商品类型')
          break
      }
    }
  },
  mounted () {
    this.allHeight = document.documentElement.clientHeight
    this.getDetail(this.page)
  }
}
</script>
<style scoped lang='scss'>
// @import "../../../common/base.scss";
// 轮播
.mint-swipe {
  height: 8.05rem;
  // padding: 0.265rem;
  box-sizing: border-box;
  overflow: visible !important;
  .mint-swipe-items-wrap {
    background-color: #efefef !important;
  }
}
.info {
  padding-bottom: 2.4rem;
  .user {
    height: 1.2rem;
    line-height: 1.2rem;
    border-bottom: 1px solid #e6e6e6;
    padding-left: 0.265rem;
    img {
      float: left;
      height: 0.9rem;
      margin-top: 0.15rem;
      margin-right: 0.265rem;
    }
  }
  .goods-detail {
    text-indent: 2em;
    font-size: 0.4rem;
    color: #666666;
    line-height: 1rem;
    padding: 0.265rem;
    word-wrap: break-word;
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0.265rem;
  background-color: #fff;

  .footer-info {
    width: 100%;
    height: 1.8666rem;
    background: #efefef;
    padding: 0.265rem;
    img {
      height: 100%;
      // width: 1.3365rem;
      float: left;
      margin-right: 0.265rem;
    }
    div {
      color: #333333;
      font-size: 0.373rem;
      line-height: 0.7rem;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
}
</style>
