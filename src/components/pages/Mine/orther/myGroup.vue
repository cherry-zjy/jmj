<template>
  <div class="root">
    <div class="title">下线信息</div>
    <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore">
      <div
        class="list"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="200"
        infinite-scroll-immediate-check="false"
      >
        <div class="for-list" v-for="(l,i) in Group" :key="i">
          <div class="left">
            <div class="left">
              <img :src="l.Image" alt>
            </div>
            <div class="left">
              <p class="name">{{l.Name}}</p>
              <p>{{l.Level}}</p>
              <p>佣金{{l.Price}}</p>
            </div>
            <div class="clear"></div>
          </div>
          <div class="right">
            <p class="status" @click="openTwo(l)">···</p>
          </div>
        </div>
      </div>
    </mt-loadmore>

    <mt-popup v-model="popupVisible" popup-transition="popup-fade" class="orderPsw-popup">
      <div>
        <h2>二级下线信息</h2>
        <div class="list-two">
          <div class="for-list" v-for="(l,i) in GroupTwo" :key="i">
            <div class="left">
              <div class="left">
                <img :src="l.SecondImage" alt>
              </div>
              <div class="left">
                <p class="name twoName">{{l.SecondName}}</p>
                <p>{{l.SecondLevel}}</p>
                <p>佣金{{l.SecondPrice}}</p>
              </div>
              <div class="clear"></div>
            </div>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<script>
export default {
  data () {
    return {
      page: 1,
      Group: [],
      GroupTwo: [],
      popupVisible: false,
      topStatus: '',
      loading: false
    }
  },
  components: {},
  methods: {
    // 下拉刷新
    loadTop () {
      // 下拉刷新的同时 将当前页面置为1
      this.page = 1
      this.getInfo(this.page)
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    // 上滑加载更多
    loadMore () {
      this.loading = true
      this.page++
      this.getInfo(this.page)
    },
    openTwo (l) {
      this.popupVisible = true
      this.GroupTwo = l.MyTeam
    },
    getInfo (p) {
      this.$http
        .get('/api/User/GetMyTeam', {
          pageIndex: p,
          pageSize: 15
        })
        .then(res => {
          if (p === 1) {
            this.Group = res.Result.userlist
            this.$refs.loadmore.onTopLoaded()
          } else {
            this.Group = this.Group.concat(res.Result.userlist)
          }
          // 同时判断当前页是否是数据获取的最后一页。如果不是，则不禁止继续加载
          if (this.page < res.Result.page) {
            this.loading = false
          } else {
            this.loading = true
          }
        })
    }
  },
  mounted () {
    this.getInfo(this.page)
  }
}
</script>
<style scoped lang='scss'>
.root {
  // 签到记录
  .title {
    height: 1.0133rem;
    line-height: 1.0133rem;
    padding: 0 0.265rem;
    font-size: 0.346rem;
    color: #808080;
    background: #faf9f7;
  }
  .list,
  .list-two {
    .for-list {
      height: 2.133rem;
      line-height: 0.633rem;
      display: flex;
      justify-content: space-between;
      font-size: 0.4rem;
      padding: 0.2rem;
      border-bottom: 1px solid #e6e6e6;
      div {
        color: #808080;
        img {
          height: 1.733rem;
          margin-right: 0.265rem;
        }
        p:nth-child(1) {
          font-size: 0.4rem;
        }
        p:nth-child(2) {
          font-size: 0.32rem;
        }
        p:nth-child(3) {
          font-size: 0.32rem;
        }
      }
      .right {
        line-height: 1.733rem;
        text-align: right;
        color: #333333;
        font-size: 0.5rem;
        font-weight: 600;
      }
      .twoName {
        width: 50%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .orderPsw-popup {
    width: 8rem;
    height: 10rem;
    border-radius: 5px;
    padding: 0 0;
    overflow-y: scroll;
    div {
      h2 {
        color: #333333;
        font-size: 0.426rem;
        text-align: center;
        margin-bottom: 0.2rem;
        line-height: 1.33rem;
        border-bottom: 1px solid #efefef;
      }
      .name {
        color: #333333;
      }
    }
  }
}
</style>
