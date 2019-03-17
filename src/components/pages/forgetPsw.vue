<template>
    <div class="root editPsw"  :style="'min-height:'+allHeight +'px'">
      <div class="form">
          <mt-field class="underLine" label="手机号" placeholder="请输入手机号码" type="tel" v-model="phone"></mt-field>
          <mt-field class="underLine" label="验证码" v-model="code" placeholder="请输入验证码" >
             <button class="send-code" @click="sendCode()" ref="codeBtn">{{CH_text}}</button>
          </mt-field>
          <mt-field label="新密码" placeholder="请输入新密码" type="password" v-model="newPassword"></mt-field>
      </div>
      <div class="btn">
        <p class="subEdit" @click="editPayPsw()">忘记密码修改</p>
      </div>
    </div>
</template>
<script>
import { Toast } from 'mint-ui'
import md5 from 'js-md5'
export default {
  data () {
    return {
      allHeight: 0,
      phone: '',
      newPassword: '',
      code: '',
      CH_text: '发送验证码',
      numDown: 60
    }
  },
  components: {},
  methods: {
    downTime (num) {
      console.dir(num)
      if (num === 0) {
        this.$refs.codeBtn.disabled = false
        this.CH_text = '发送验证码'
        num = 60
        this.numDown = num
        return
      } else {
        this.$refs.codeBtn.disabled = true
        num--
        this.CH_text = num + 's后发送'
        this.numDown = num
      }
      var _this = this
      setTimeout(function () {
        _this.downTime(num)
      }, 1000)
    },
    sendCode () {
      let ph = /^[1][0-9]{10}$/
      if (ph.test(this.phone)) {
        this.$http.get('/api/VerifyCode/Send', {phone: this.phone})
          .then(res => {
            Toast('发送成功')
            this.downTime(this.numDown)
          })
      } else {
        Toast('请输入正确的手机号')
      }
    },
    editPayPsw () {
      this.$http.get('/api/User/Forgot', {
        phone: this.phone,
        code: this.code,
        pwd: md5(this.newPassword)
      }).then(res => {
        Toast('重置密码登录')
        localStorage.setItem('token', res.Result)
        this.setCookie('token', res.Result)
        this.$store.state.token = res.Result
        var _this = this
        setTimeout(() => {
          _this.$router.push('/')
        }, 2000)
      })
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
      background-color: #fff;
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
