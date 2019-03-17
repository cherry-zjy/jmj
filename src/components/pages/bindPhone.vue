<template>
    <div class="root editPsw"  :style="'min-height:'+allHeight +'px'">
      <div class="form">
          <mt-field  class="underLine" label="手机号" placeholder="请输入手机号码" type="tel" v-model="phone"></mt-field>
          <mt-field label="验证码" v-model="code" placeholder="请输入验证码" >
              <button class="send-code" @click="sendCode()" ref="codeBtn">{{CH_text}}</button>
          </mt-field>
          <mt-field class="underLine" label="密码" placeholder="请设置登录密码" type="password" v-model="newPassword"></mt-field>
          <mt-field class="underLine" label="密码" placeholder="请重新输入密码" type="password" v-model="oldPassword" @change="checkPsw()"></mt-field>
      </div>
      <div class="btn">
        <p class="subEdit" @click="Register()">绑定</p>
      </div>
    </div>
</template>
<script>
import md5 from 'js-md5'
import { MessageBox, Toast } from 'mint-ui'

export default {
  data () {
    return {
      allHeight: 0,
      phone: '',
      oldPassword: '',
      newPassword: '',
      code: '',
      openID: '',
      CH_text: '发送验证码',
      numDown: 60,
      InviteCode: null
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
    // 发送验证码
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
    checkPsw () {
      if (this.oldPassword !== this.newPassword) {
        Toast('密码输入不一致')
        this.oldPassword = ''
      }
    },
    Register () {
      if (this.openID) {
        if (this.phone && this.newPassword && this.oldPassword && this.code) {
          this.$http.get('/api/User/WxBindingAccount',
            { 'phone': this.phone,
              'pwd': md5(this.newPassword),
              'repwd': md5(this.oldPassword),
              'code': this.code,
              'type': 1,
              'openID': this.openID,
              'unionID': this.getCookie('unionid'),
              'inviteCode': this.InviteCode
            }
          )
            .then(res => {
              Toast('绑定成功')
              localStorage.setItem('token', res.Result.WxToken)
              this.setCookie('token', res.Result.WxToken)
              this.$store.state.token = res.Result.WxToken
              var _this = this
              setTimeout(() => {
              // _this.$router.push('/')
                // 判断当前url中是否存在isFollow=1 如果等于1 则说明用户为关注公众号，返回授权页面提示关注
                if (Number(this.$route.query.isFollow) === 1) {
                  _this.$router.go(-1)
                } else {
                  _this.goFirstURL()
                }
              }, 2000)
            })
        } else {
          Toast('请完善信息')
        }
      } else {
        MessageBox.confirm('请先进行微信授权?').then(action => {
          localStorage.setItem('firstURL', this.$route.fullPath)
          this.$router.push('/author')
        })
      }
    }
  },
  beforeMount () {
    if (this.$route.params.code) {
      this.InviteCode = this.$route.params.code ? this.$route.params.code === 'null' ? null : this.$route.params.code : null
    }
  },
  mounted () {
    this.allHeight = document.documentElement.clientHeight
    this.openID = this.getCookie('openid')
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
