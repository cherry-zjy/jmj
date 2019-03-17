<template>
    <div class="root" :style="'min-height:'+htmlH +'px'">
      <div class="list">
        <div class="for-list" v-for="(l,i) in MyCollectList" :key="i" @click="clickPro(l.ProdID, l.Type, l.IsOutSourcing,l.IsSellOut)">
          <div class="left">
            <div class="left">
              <img :src="l.Image" alt="">
            </div>
            <div class="left">
              <p class="name">{{l.Name}} </p>
              <p class="price">￥{{l.Price}} </p>
            </div>
            <div class="clear"></div>
          </div>
          <!-- <div class="right">
            <p class="status" @click="popupVisible = true">···</p>
          </div> -->
        </div>
      </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      htmlH: 0,
      page: 1,
      MyCollectList: []
    }
  },
  components: {},
  methods: {
    getMyCollect (p) {
      this.$http.get('api/User/GetMyCollectionList', {
        pageIndex: p,
        pageSize: 10
      })
        .then(res => {
          this.MyCollectList = res.Result.usercollect
        })
    },
    clickPro (id, type, isout, iskong) {
      switch (type) {
        case 1:
        // 普通商品 跳转
        // 是否海外
          if (isout) {
            this.$router.push('/nomalgoods/goodsdetail/2/' + id)
          } else {
          // 不是海外商品就是普通商品 判断是否售罄
            if (iskong) {
              this.$router.push('/nomalgoods/goodsdetail/0/' + id)
            } else {
              this.$router.push('/nomalgoods/goodsdetail/1/' + id)
            }
          }
          break
        case 2:
        // 每日团购
          this.$router.push('/goods/goodsdetail/1/' + id)
          break
        case 3:
        // 每周免单
          this.$router.push('/goods/goodsdetail/0/' + id)
          break
        case 4:
        // 2件99
          this.$router.push('/two99/goodsinfo/' + id)
          break
        default:
          alert('无法识别商品类型')
          break
      }
    }
  },
  mounted () {
    this.htmlH = document.documentElement.clientHeight
    this.getMyCollect(this.page)
  }
}
</script>
<style scoped lang='scss'>
.root {
  padding: 0.265rem;
  background-color: #faf9f7;
  .list {
    .for-list {
      height: 2.933rem;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      font-size: 0.4rem;
      padding: 0.2rem;
      margin-bottom: 0.265rem;
      div {
        color: #808080;
        img {
          height: 2.533rem;
          width: 2.533rem;
          margin-right: 0.265rem;
          border: 1px solid #efefef;
        }
        p:nth-child(1) {
          width: 6rem;
          font-size: 0.4rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        p:nth-child(2) {
          font-size: 0.32rem;
          color: #ff4e5a;
        }
        // p:nth-child(3) {
        //   font-size: 0.32rem;
        // }
      }
      .right {
        line-height: 1.733rem;
        text-align: right;
        color: #333333;
        font-size: 0.5rem;
        font-weight: 600;
      }
    }
  }
}
</style>
