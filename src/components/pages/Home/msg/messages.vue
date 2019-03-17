<template>
    <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore">
  <div class="root" :style="'min-height:'+htmlH +'px'">

      <router-link to="/home/messages/1/0">
        <div class="for-list">
          <div class="left">
            <img src="../../../../../static/images/payment_information@2x.png" alt="">
          </div>
          <div class="leftInfo">
            <div>
              <span class="left">支付信息</span>
              <!-- <span class="right">20:20</span> -->
              <span class="clear"></span>
            </div>
            <div><span v-if="msgObj.PayMsg">【您收到一条新消息】 </span><span v-else>【暂无新消息】</span></div>
          </div>
          <div class="clear"></div>
        </div>
      </router-link>
      <router-link to="/home/messages/2/1">
        <div class="for-list">
          <div class="left">
            <img src="../../../../../static/images/money_remind@2x.png" alt="">
          </div>
          <div class="leftInfo">
            <div>
              <span class="left">佣金提醒</span>
              <!-- <span class="right">20:20</span> -->
              <span class="clear"></span>
            </div>
            <div><span v-if="msgObj.CommMsg">【您收到一条新消息】 </span><span v-else>【暂无新消息】</span></div>
          </div>
          <div class="clear"></div>
        </div>
      </router-link>
      <router-link to="/home/messages/3/0">
        <div class="for-list">
          <div class="left">
            <img src="../../../../../static/images/goods_remind@2x.png" alt="">
          </div>
          <div class="leftInfo">
            <div>
              <span class="left">收货提醒</span>
              <!-- <span class="right">20:20</span> -->
              <span class="clear"></span>
            </div>
            <div><span v-if="msgObj.CollectMsg">【您收到一条新消息】 </span><span v-else>【暂无新消息】</span></div>
          </div>
          <div class="clear"></div>
        </div>
      </router-link>
      <router-link to="/home/messages/5/2">
        <div class="for-list">
          <div class="left">
            <img src="../../../../../static/images/information_platform@2x.png" alt="">
          </div>
          <div class="leftInfo">
            <div>
              <span class="left">平台信息</span>
              <!-- <span class="right">20:20</span> -->
              <span class="clear"></span>
            </div>
            <div><span v-if="msgObj.PlatformMsg">【您收到一条新消息】 </span><span v-else>【暂无新消息】</span></div>
          </div>
          <div class="clear"></div>
        </div>
      </router-link>
      <router-link to="/home/messages/4/1">
        <div class="for-list">
          <div class="left">
            <img src="../../../../../static/images/preferential_information@2x.png" alt="">
          </div>
          <div class="leftInfo">
            <div>
              <span class="left">优惠信息</span>
              <!-- <span class="right">20:20</span> -->
              <span class="clear"></span>
            </div>
            <div><span v-if="msgObj.DiscountMsg">【您收到一条新消息】 </span><span v-else>【暂无新消息】</span></div>
          </div>
          <div class="clear"></div>
        </div>
      </router-link>
      <router-link to="/home/messages/6/1">
        <div class="for-list">
          <div class="left">
            <img src="../../../../../static/images/personal_information@2x.png" alt="">
          </div>
          <div class="leftInfo">
            <div>
              <span class="left">个人信息</span>
              <!-- <span class="right">20:20</span> -->
              <span class="clear"></span>
            </div>
            <div><span v-if="msgObj.PersonalReminding">【您收到一条新消息】 </span><span v-else>【暂无新消息】</span></div>
          </div>
          <div class="clear"></div>
        </div>
      </router-link>
  </div>

    </mt-loadmore>
</template>
<script>
export default {
  data () {
    return {
      htmlH: 0,
      msgObj: {},
      topStatus: ''

    }
  },
  components: {},
  methods: {
    // 下拉刷新
    loadTop () {
      // 下拉刷新的同时 将当前页面置为1
      this.GetMyMsgRemind()
    },
    handleTopChange (status) {
      this.topStatus = status
    },
    // 获取消息
    GetMyMsgRemind () {
      this.$http.get('/api/APP_Message/GetMyMsgRemind', {})
        .then(response => {
          this.msgObj = response.Result
          setTimeout(() => {
            this.$refs.loadmore.onTopLoaded()
          }, 1000)
        })
    }
  },
  mounted () {
    this.htmlH = document.documentElement.clientHeight
    this.GetMyMsgRemind()
  }
}

</script>
<style scoped lang='scss'>
  .root {
    background-color: #faf9f7;

    .for-list {
      width: 100%;
      height: 1.865rem;
      padding: 0.265rem;
      background-color: #fff;
      border-top: 1px solid #e6e6e6;

      .left {
        height: 100%;

        img {
          height: 100%;
          margin-right: 0.26rem;
        }
      }

      .leftInfo {
        height: 100%;
        display: flex;
        justify-content: space-between;
        flex-direction: column;

        div {
          overflow: hidden;
          color: #808080;
          font-size: 0.373rem;

          .left {
            color: #262626;
            font-size: 0.4rem;
          }
        }
      }
    }
  }

</style>
