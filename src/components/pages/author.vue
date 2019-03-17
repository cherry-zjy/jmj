<template>
  <div class="root" :style="'min-height:'+clientHeight +'px'">
    <!-- 登录选择页面 -->
    <div class="login">
      <img src="../../../static/images/login_logo@2x.png" alt>
    </div>
    <div class="footer">
      <div @click="wechat()">
        <img src="../../../static/images/login_wechat@2x.png" alt>
        <span>微信授权登录</span>
      </div>
      <!-- <div @click="phoneLogin()"><span>手机号登录</span><img src="../../../static/images/enter@2x.png" alt=""></div> -->
    </div>
    <mt-popup class="author_qr" v-model="popupVisible" popup-transition="popup-fade">
      <!-- <p>长按识别二维码关注公众号</p> -->
      <div class="mint-msgbox" style>
        <div class="mint-msgbox-content">
          <div class="mint-msgbox-message">立即前往关注完成授权
            <p style="font-size:0.3rem;">长按识别二维码</p>
            <img style="width:3rem" src="../../../static/images/attention.png">
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'

export default {
  data () {
    return {
      clientHeight: 0,
      InviteCodeL: null,
      IsBinding: false,
      popupVisible: false,
      watchJump: ''
    }
  },
  components: {},
  methods: {
    wechat () {
      // dev 开发测试阶段
      // if (this.InviteCode !== null) {
      //   window.location.href =
      //     'http://jmj.kimijia.com/OAuth/WeiXin?jmjtype=1&invite=' +
      //     this.InviteCode
      // } else {
      //   window.location.href = 'http://jmj.kimijia.com/OAuth/WeiXin?jmjtype=1'
      // }
      // prod 线上
      if (this.InviteCode !== null) {
        window.location.href = 'http://jmj.kimijia.com/OAuth/WeiXin?invite=' + this.InviteCode
      } else {
        window.location.href = 'http://jmj.kimijia.com/OAuth/WeiXin'
      }
    },
    phoneLogin () {
      this.$router.push('/login')
    },
    WxLogin () {
      var appid = window.location.href.indexOf('openid') > 0 ? window.location.href.split('openid=')[1].slice(0, 28) : this.getCookie('openid')
      this.$http
        .get('/api/User/WxAuthorizedLogin', {
          loginway: 1,
          openID: appid || this.getCookie('openid')
        })
        .then(res => {
          this.IsBinding = res.Result.IsBinding

          if (res.Result.IsBinding) {
            if (res.Result.IsFollow) {
            // 清除心跳
              clearTimeout(this.watchJump)
              localStorage.setItem('token', res.Result.WxToken)
              this.setCookie('token', res.Result.WxToken)
              this.setCookie('openid', res.Result.AppID)
              this.$store.state.token = res.Result.WxToken
              this.goFirstURL()
            } else {
              this.popupVisible = true
              // 心跳检测
              this.watchJump = setTimeout(() => {
                this.WxLogin()
              }, 2000)
            }
          } else {
            if (res.Result.IsFollow) {
              Toast('即将跳转绑定手机号')
              setTimeout(() => {
                if (this.InviteCode !== null) {
                  this.$router.push('/bindphone/' + this.InviteCode)
                } else {
                  this.$router.push('/bindphone')
                }
              }, 2000)
            } else {
              // this.popupVisible = true
              Toast('即将跳转绑定手机号')
              setTimeout(() => {
                if (this.InviteCode !== null) {
                  this.$router.push('/bindphone/' + this.InviteCode + '?isFollow=1')
                } else {
                  this.$router.push('/bindphone?isFollow=1')
                }
              }, 2000)
            }
          }
        })
    }
  },
  beforeMount () {
    if (this.$route.params.code) {
      this.InviteCode = this.$route.params.code
    }
  },
  mounted () {
    this.clientHeight = document.documentElement.clientHeight
    var wait = setInterval(() => {
      if (window.location.href.indexOf('openid') > 0) {
        if (
          window.location.href.split('openid=')[1] ||
          this.getCookie('openid')
        ) {
          this.setCookie(
            'openid',
            window.location.href.split('openid=')[1].slice(0, 28) ||
              this.getCookie('openid')
          )
          this.setCookie(
            'unionid',
            window.location.href.split('unionid=')[1].slice(0, 28) ||
              this.getCookie('unionid')
          )
          this.InviteCode = window.location.href.split('invite=')[1].slice(0, 8)
            ? window.location.href.split('invite=')[1].slice(0, 8)
            : null
          clearInterval(wait)
          this.WxLogin()
        }
      } else {
        // 自动登录操作
        // if (!this.getCookie('openid')) {
        //   this.wechat()
        // } else {
        //   clearInterval(wait)
        //   this.WxLogin()
        // }
      }
    }, 500)
  }
}
</script>
<style scoped lang='scss'>
.root {
  background-color: #fff;
  .login {
    text-align: center;
    padding-top: 1.5rem;
    img {
      width: 50%;
    }
  }
  .footer {
    position: fixed;
    bottom: 0.5rem;
    padding: 0 0.265rem;
    width: 100%;
    div {
      height: 1.173rem;
      line-height: 1.173rem;
      text-align: center;
    }
    div:nth-child(1) {
      background-color: #f7b500;
      display: flex;
      justify-content: center;
      img {
        height: 100%;
        padding: 0.1rem;
      }
      span {
        display: inline-block;
        line-height: 1.173rem;
        color: #fff;
        font-size: 0.4rem;
      }
    }
    div:nth-child(2) {
      background-color: #fff;
      display: flex;
      justify-content: center;
      img {
        height: 100%;
        padding: 0.2rem 0;
      }
      span {
        display: inline-block;
        line-height: 1.173rem;
        color: #b3b3b3;
        font-size: 0.346rem;
      }
    }
  }
}
</style>
