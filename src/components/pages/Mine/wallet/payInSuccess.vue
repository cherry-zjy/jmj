<template>
    <div class="root" :style="'min-height:'+htmlH +'px'">
      <!-- top -->
      <div class="top">
        <img src="../../../../../static/images/top_up_success@2x.png" alt="">
        <p>充值成功</p>
      </div>
      <div class="footer">
          <button @click="goBack()">完成</button>
      </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      htmlH: 0

    }
  },
  components: {},
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  },
  mounted () {
    this.htmlH = document.documentElement.clientHeight
  }
}
</script>
<style scoped lang='scss'>
.root {
  background-color: #fff;
  padding: 0.265rem;
  .top {
    padding: 1.33rem 0;
    text-align: center;
    font-size: 0.4rem;
    color: #333333;
    img {
      width: 4.533rem;
    }
  }
  .footer {
    width: 100%;
    text-align: center;
    button {
      display: block;
      width: 80%;
      margin-left: 10%;
      color: #f7b500;
      font-size: 0.4rem;
      line-height: 1.1733rem;
      outline: none;
      background-color: #fff;
      border-radius: 3px;
      border: 1px solid #f7b500;
    }
  }
}
</style>
