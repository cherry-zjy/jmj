<template>
    <div class="root">
      <h2>{{msgDetail.Title}}</h2>
      <div class="time">{{msgDetail.CreateTime}}</div>
      <div class="img"><img :src="msgDetail.Image" alt=""></div>
      <div class="des" v-html="decodeURIComponent(msgDetail.Content)"></div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      msgDetail: {}
    }
  },
  components: {},
  methods: {
    // 获取消息xiangqing
    GetMyMsgList () {
      this.$http.get('/api/APP_Message/PlatMesDetail', {
        msgID: this.$route.params.id
      })
        .then(response => {
          this.msgDetail = response.Result
        })
    }
  },
  mounted () {
    this.GetMyMsgList()
  }
}
</script>
<style scoped lang='scss'>
.root {
  padding: 0.265rem;
  h2 {
    font-size: 0.4267rem;
    color: #333333;
    text-align: center;
    padding-top: 0.265rem;
  }
  .time {
    font-size: 0.3733rem;
    text-align: center;
    color: #808080;
    margin-bottom: 0.265rem;
  }
  .img {
    width: 100%;
    min-height: 5.333rem;
    background-color: #efefef;
    margin-bottom: 0.27rem;
    img{
      width: 100%;
    }
  }
  .des {
    width: 100%;
    color: #808080;
    font-size: 0.4rem;
    text-indent: 2em;
    letter-spacing: 0.1rem;
    line-height: 0.8rem;
    word-break: break-word;
    p {
      width: 100%;
      img {
        width: 100% !important;
      }
    }
  }
}
</style>
