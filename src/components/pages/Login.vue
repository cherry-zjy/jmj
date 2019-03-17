<template>
    <div class="root editPsw"  :style="'min-height:'+allHeight +'px'">
      <div class="form">
          <mt-field  class="underLine" label="手机号" placeholder="请输入手机号码" type="number" v-model="phone"></mt-field>
          <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password" @keyup.enter.native="loginIn"></mt-field>
      </div>
      <div class="btn">
        <p class="subEdit" @click="loginIn">登录</p>
        <p class="tip">
          <router-link to='/register'>
            <span class="left">没有账号？立即注册</span>
          </router-link>
          <router-link to='/forgetpsw'>
            <span class="right">忘记密码?</span>
          </router-link>
          <span class="clear"></span>
        </p>
      </div>
    </div>
</template>
<script>
import md5 from 'js-md5'
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      allHeight: 0,
      phone: '',
      password: '',
      code: ''
    }
  },
  components: {Toast},
  methods: {
    loginIn () {
      if (this.Phone || this.password) {
        let ph = /^[1][0-9]{10}$/
        if (ph.test(this.phone)) {
          this.$http.post('/api/User/LoginByPhoneAndPwd', {
            'LoginWay': 1,
            'Phone': this.phone,
            'Pwd': md5(this.password)
          })
            .then(res => {
              Toast('登录成功')
              localStorage.setItem('token', res.Result.WxToken)
              this.setCookie('token', res.Result.WxToken)
              this.$store.state.token = res.Result.WxToken
              // var _this = this
              setTimeout(() => {
                // _this.$router.push('/')
                this.goFirstURL()
              }, 2000)
            })
        } else {
          Toast('请输入正确的手机号')
        }
      } else {
        Toast('请输入信息')
      }
    }
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
    .tip {
      line-height: 1.33rem;
      overflow: hidden;
      font-size: 0.346rem;
      span {
        color: #b3b3b3;
      }
    }
  }
}
</style>
