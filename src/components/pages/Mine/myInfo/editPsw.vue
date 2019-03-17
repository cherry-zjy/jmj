<template>
    <div class="root editPsw"  :style="'min-height:'+allHeight +'px'">
      <div class="form" v-if="type === 0">
          <mt-field  class="underLine" label="旧密码" placeholder="请输入当前密码" type="password" v-model="oldPassword"></mt-field>
          <mt-field label="新密码" placeholder="请输入新密码" type="password" v-model="newPassword"></mt-field>
      </div>
      <div class="form" v-else-if="type === 1">
          <mt-field class="underLine" label="手机号" placeholder="请输入手机号码" type="tel" v-model="phone"></mt-field>
          <mt-field class="underLine" label="验证码" v-model="code" placeholder="请输入验证码" >
             <button class="send-code" @click="sendCode()" ref="codeBtn">{{CH_text}}</button>
          </mt-field>
          <mt-field label="密码" placeholder="请输入支付密码" type="password" v-model="newPassword"></mt-field>
      </div>
      <div class="form form2" v-else-if="type === 2">
          <mt-field  class="underLine" label="支付密码" placeholder="请输入支付密码" type="password" v-model="oldPassword"></mt-field>
          <mt-field label="确认密码" placeholder="请再次输入支付密码" type="password" v-model="newPassword"></mt-field>
      </div>
      <div class="btn"  v-if="type === 0 || type === 2">
        <p class="subEdit" @click="editBtn()">确认设置</p>
        <p class="tip">
          <span @click="changeType(type)" v-if="type === 0">手机验证码修改</span>
          <!-- <span @click="changeType(type)" v-if="type === 1">账户密码修改</span> -->
          <!-- <span @click="changeType(type)" v-if="type === 2">修改支付密码</span> -->
        </p>
      </div>
      <div class="btn"  v-else>
        <p class="subEdit" @click="editBtn()">确定修改</p>
      </div>
      <mt-popup v-model="popupVisible" popup-transition="popup-fade" class="editPsw-popup">
        <div class="success" v-if="success">
          <img src="../../../../../static/images/successful@2x.png" alt="">
          <div>密码修改成功</div>
          <p>3秒后跳转至个人中心</p>
        </div>
        <div class="fail" v-else>
          <img src="../../../../../static/images/failure@2x.png" alt="">
          <div>密码修改失败</div>
          <p>验证码有误请重新输入</p>
        </div>
      </mt-popup>
    </div>
</template>
<script>
import { Toast } from 'mint-ui'
import md5 from 'js-md5'

export default {
  data () {
    return {
      allHeight: 0,
      // 0 密码修改  1  手机号验证修改修改支付密码   2 支付密码设置
      type: 0,
      phone: '',
      oldPassword: '',
      newPassword: '',
      code: '',
      CH_text: '发送验证码',
      numDown: 60,
      // popup 弹层
      popupVisible: false,
      success: true
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
        this.$http.get('/api/VerifyCode/Send', {phone: this.phone})
          .then(res => {
            Toast('发送成功')
            this.downTime(this.numDown)
          })
      } else {
        Toast('请输入正确的手机号')
      }
    },
    changeType (num) {
      if (num === 0) {
        this.$router.push('/mine/editpsw1/1')
      } else if (num === 1) {
        this.$router.push('/mine/editpsw/0')
      }
    },
    // 修改账户密码
    editPsw () {
      this.$http.get('/api/User/ChangePwd', {
        oldPwd: md5(this.oldPassword),
        newPwd: md5(this.newPassword)
      }).then(res => {
        Toast('修改成功,请重新登录')
        localStorage.setItem('token', res.Result)
        this.setCookie('token', res.Result)
        this.$store.state.token = res.Result
        var _this = this
        setTimeout(() => {
          _this.$router.replace('/author')
        }, 2000)
      })
    },
    // 修改支付密码
    editPayPsw () {
      this.$http.get('/api/User/EditPayPassword', {
        phone: this.phone,
        code: this.code,
        paypwd: md5(this.newPassword)
      }).then(res => {
        Toast(res.Result)
        var _this = this
        setTimeout(() => {
          _this.$router.go(-1)
        }, 2000)
      })
    },
    setPayPsw () {
      if (this.newPassword === this.oldPassword) {
        this.$http.get('/api/User/SetPayPwd', {
          paypwd: md5(this.oldPassword),
          repaypwd: md5(this.newPassword)
        }).then(res => {
          Toast(res.Result)
          var _this = this
          setTimeout(() => {
            _this.$router.go(-1)
          }, 2000)
        })
      } else {
        Toast('两次输入密码不一致')
        this.newPassword = ''
      }
    },
    editBtn () {
      // === 1修改支付密码
      if (this.type === 1) {
        this.editPayPsw()
        //  ===2 设置支付密码
      } else if (this.type === 2) {
        this.setPayPsw()
      } else if (this.type === 0) {
      // 新旧密码修改账户密码
        this.editPsw()
      }
    }
  },
  beforeMount () {
    this.type = Number(this.$route.params.type)
    if (this.type !== 0 && this.type !== 1 && this.type !== 2) {
      alert('警告：网址错误')
    }
  },
  mounted () {
    this.allHeight = document.documentElement.clientHeight
  },
  watch: {
    '$route' (to, from) {
      if (from.params.type !== to.params.type) {
        this.$router.go(0)
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
      line-height: 1.066rem;
      text-align: right;
      color: #b3b3b3;
      font-size: 0.346rem;
    }
  }
  .mint-popup {
    top: 34% !important;
  }
  .editPsw-popup {
    width: 53.33%;
    text-align: center;
    border-radius: 5px;
    padding: 0.8rem 0;
    div {
      img {
        width: 2rem;
      }
      div {
        color: #333333;
        font-size: 0.4rem;
      }
      p {
        color: #808080;
        font-size: 0.32rem;
      }
    }
  }
}
</style>
