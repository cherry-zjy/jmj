<template>
    <div class="root editPsw"  :style="'min-height:'+allHeight +'px'">
      <div class="form">
          <mt-field  class="underLine" label="密码" placeholder="请输入6~12位密码" type="password" v-model="oldPassword"></mt-field>
          <mt-field label="密码" placeholder="请重新输入密码" type="password" v-model="newPassword"></mt-field>
      </div>
      <div class="btn">
        <p class="subEdit">完成</p>
      </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      allHeight: 0,
      phone: '',
      oldPassword: '',
      newPassword: '',
      code: ''
    }
  },
  components: {},
  methods: {
  },
  mounted () {
    this.allHeight = document.documentElement.clientHeight
  }
}
</script>
<style scoped lang='scss'>
.root {
  background-color: #faf9f7;
  padding-top: 0.265rem;
  .form {
    .underLine {
      border-bottom: 1px solid #e6e6e6;
    }
    .send-code {
      display: inline-block;
      width: 2.4rem;
      height: 0.88rem;
      font-size: 0.346rem;
      line-height: 0.88rem;
      text-align: center;
      color: #f7b500;
      border: 1px solid #f7b500;
    }
  }
  .btn {
    margin-top: 1.8rem;
    padding: 0 0.265rem;
    .subEdit {
      width: 100%;
      height: 1.333rem;
      line-height: 1.333rem;
      text-align: center;
      color: #fff;
      font-size: 0.4rem;
      background-color: #f7b500;
    }
  }
}
</style>
