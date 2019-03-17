<template>
    <div class="root"  :style="'min-height:'+htmlH +'px'">
      <div class="for-list" v-for="(l,i) in msglist" :key="i">
        <div class="list-top">
          <div class="left"  v-if="msgType !== 1">
            <img :src="l.Image" alt="">
          </div>
          <div class="leftInfo">
            <div class="title">{{l.Title}}</div>
            <div class="time">{{l.CreateTime}}</div>
            <div class="desText">{{decodeURIComponent(l.Introduct)}}</div>
          </div>
        </div>
        <router-link :to='"/home/messages/msglist/"+msgType+"/"+l.ID'>
          <div class="list-bottom"  v-if="msgType === 2">
            <span>查看详情</span>
            <img src="../../../../../static/images/right.png" alt="">
          </div>
        </router-link>
      </div>
      <div v-if="msglist.length < 1" style="text-align:center;padding-top:5rem;">
          <span style="color:#808080;font-size:0.346rem">暂无消息</span>
        </div>
      <!-- <div class="for-list">
        <div class="list-top">
          <div class="left"  v-if="msgType !== 1">
            <img src="../../../../../static/images/payment_information@2x.png" alt="">
          </div>
          <div class="leftInfo">
            <div class="title">平台信息</div>
            <div class="time">平台信息</div>
            <div class="des">您收到一条新消息您收到一条新消息您收到一条新消息您收到一条新消息</div>
          </div>
        </div>
        <router-link :to='"/home/messages/msglist/"+msgType+"/msgdetail"'>
          <div class="list-bottom"  v-if="msgType === 2">
            <span>查看详情</span>
            <img src="../../../../../static/images/right.png" alt="">
          </div>
        </router-link>
      </div> -->
    </div>
</template>
<script>
export default {
  data () {
    return {
      htmlH: 0,
      // 判断消息类型 0 支付/收货    1佣金/优惠/个人    2平台
      msgType: Number(this.$route.params.type),
      msg: Number(this.$route.params.msg),
      msglist: []
    }
  },
  components: {},
  methods: {
    // 获取消息
    GetMyMsgList (t) {
      this.$http.get('/api/APP_Message/GetMyMsgList', {
        type: t,
        pageIndex: 1,
        pageSize: 999
      })
        .then(response => {
          this.msglist = response.Result.msglist
        })
    }
  },
  mounted () {
    this.htmlH = document.documentElement.clientHeight
    this.GetMyMsgList(this.msg)
  }
}
</script>
<style scoped lang='scss'>
.root {
  background-color: #faf9f7;
  padding: 0.265rem;

  .for-list {
    width: 100%;
    margin-bottom: 0.265rem;
    .list-top {
      width: 100%;
      height: 2.933rem;
      background-color: #fff;
      padding: 0.265rem;
      .left {
        height: 100%;
        img {
          height: 100%;
          width: 2.403rem;
          margin-right: 0.2rem;
        }
      }
      .leftInfo {
        height: 100%;
        padding: 0.15rem 0;
        line-height: 0.52rem;
        div {
          color: #808080;
          font-size: 0.3467rem;
        }
        .title {
          color: #333333;
          font-size: 0.4rem;
          font-weight: bold;
          margin-bottom: 0.1rem;
        }
        .desText {
          text-indent: 2em;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
    .list-bottom {
      height: 1.1733rem;
      padding: 0 0.265rem;
      color: #808080;
      font-size: 0.3467rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.05rem;
      background-color: #fff;
    }
  }
}
</style>
