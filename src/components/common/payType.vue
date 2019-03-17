<template>
    <div>
      <mt-popup v-model="openPayChild" position="bottom" closeOnClickModal="false" class="popup-box">
        <div class="title">选择支付方式</div>
        <div class="payList weiXin">
          <img src="../../../static/images/wechat_big@2x.png" alt="">
          <span>微信支付</span>
        </div>
        <div class="payList yuE">
          <img src="../../../static/images/money_big@2x.png" alt="">
          <span> 账户余额支付</span>
        </div>
      </mt-popup>
    </div>
</template>
<script>
export default {
  props: ['openPay'],
  data () {
    return {
      openPayChild: true
    }
  },
  components: {},
  methods: {},
  updated () {
    // this.openPayChild = this.openPay
  },
  mounted () {
    console.log(this.openPayChild)
  }
}
</script>
<style scoped lang='scss'>

</style>
