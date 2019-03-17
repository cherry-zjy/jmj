<template>
  <div class="root editPsw" :style="'min-height:'+allHeight +'px'">
    <div class="form">
      <mt-field class="underLine" label="手机号" placeholder="请输入手机号码" type="tel" v-model="phone"></mt-field>
      <mt-field class="underLine" label="验证码" v-model="code" placeholder="请输入验证码">
        <button class="send-code" @click="sendCode()" ref="codeBtn">{{CH_text}}</button>
      </mt-field>
      <mt-field
        class="underLine"
        label="密码"
        placeholder="请输入密码"
        type="password"
        v-model="newPassword"
      ></mt-field>
      <mt-field
        class="underLine"
        label="密码"
        placeholder="请重新输入密码"
        type="password"
        v-model="oldPassword"
        @change="checkPsw()"
      ></mt-field>
    </div>
    <div class="btn">
      <p class="subEdit" @click="Register()">立即注册</p>
      <p class="tip" v-if="this.InviteCode === null">
        <router-link to="/login">
          <span>已有账号，去登陆</span>
        </router-link>
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
      oldPassword: '',
      newPassword: '',
      code: '',
      InviteCode: null,
      CH_text: '发送验证码',
      numDown: 60
    }
  },
  components: {},
  methods: {
    downTime (num) {
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
        this.$http
          .get('/api/VerifyCode/Send', { phone: this.phone })
          .then(res => {
            Toast('发送成功')
            this.downTime(this.numDown)
          })
      } else {
        Toast('请输入正确的手机号')
      }
    },
    checkPsw () {
      if (this.oldPassword !== this.newPassword) {
        Toast('密码输入不一致')
        this.oldPassword = ''
      }
    },
    Register () {
      if (this.phone && this.newPassword && this.oldPassword && this.code) {
        let ph = /^[1][0-9]{10}$/
        if (ph.test(this.phone)) {
          if (this.InviteCode) {
            this.$http
              .post('/api/User/Register', {
                Phone: this.phone,
                Pwd: md5(this.newPassword),
                RePwd: md5(this.oldPassword),
                Code: this.code,
                Lng: 0,
                Lat: 0,
                ID: -1,
                InviteCode: this.InviteCode
              })
              .then(res => {
                localStorage.setItem('token', res.Result.wxToken)
                this.setCookie('token', res.Result.wxToken)
                this.$store.state.token = res.Result.wxToken
                var _this = this
                setTimeout(() => {
                  _this.$router.push('/')
                }, 2000)
              })
          } else {
            this.$http
              .post('/api/User/Register', {
                Phone: this.phone,
                Pwd: md5(this.newPassword),
                RePwd: md5(this.oldPassword),
                Code: this.code,
                Lng: 0,
                Lat: 0,
                ID: -1
              })
              .then(res => {
                localStorage.setItem('token', res.Result.wxToken)
                this.setCookie('token', res.Result.wxToken)
                this.$store.state.token = res.Result.wxToken
                var _this = this
                setTimeout(() => {
                  _this.$router.push('/')
                }, 2000)
              })
          }
        } else {
          Toast('请输入正确的手机号')
        }
      } else {
        Toast('请完善信息')
      }
    }
  },
  beforeMount () {
    if (this.$route.params.code) {
      this.InviteCode = this.$route.params.code
    }
  },
  mounted () {
    this.allHeight = document.documentElement.clientHeight
    if (this.InviteCode !== null) {
      // 判断是否已经存在token，如果不存在 则停留在当前注册页面  然后判断已经存在的token是否失效。
      if (this.$store.state.token || localStorage.getItem('token')) {
        this.$http
          .get('/api/User/JudgeExpired', {
            wxtoken: this.$store.state.token || localStorage.getItem('token')
          })
          .then(res => {
            this.isShare = res.Result
            if (res.Result) {
              // 已经登录
              this.$router.push('/')
            } else {
              // 登录失效
              Toast('登录失效,请重新登录')
              this.$router.push('/author')
            }
          })
      }
    }
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
    .tip {
      line-height: 1.33rem;
      color: #b3b3b3;
      font-size: 0.346rem;
      span {
        color: #b3b3b3;
      }
    }
  }
}
</style>
