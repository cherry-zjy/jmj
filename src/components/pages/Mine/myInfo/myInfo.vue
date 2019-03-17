<template>
    <div class="root" :style="'min-height:'+allHeight +'px'">
        <div class="allList">
          <div class="list img">
              <div class="left">我的头像</div>
              <div class="right">
                <img class="userTopImg" :src="userInfo.Image" alt="">
                <img src="../../../../../static/images/enter@2x.png" alt="">
                <!-- <input type="file"> -->
              </div>
              <div class="right input-box">
                <input type="file" name="" id="" @change="uploadImg($event)">
              </div>
              <div class="clear"></div>
          </div>
          <div class="list">
              <div class="left">用户名</div>
              <div class="right" @click="editName(userInfo.NickName)">
                <span class="">{{userInfo.NickName}}</span>
                <img src="../../../../../static/images/enter@2x.png" alt="">
              </div>
              <div class="clear"></div>
          </div>
          <div class="list">
              <div class="left">我的会员</div>
              <div class="right">
                <span class="">{{userInfo.Level}}</span>
                <img src="../../../../../static/images/enter@2x.png" alt="">
              </div>
              <div class="clear"></div>
          </div>
          <router-link to="/mine/info/address">
            <div class="list">
              <div class="left">收货地址</div>
              <div class="right">
                <span></span>
                <span></span>
                <img src="../../../../../static/images/enter@2x.png" alt="">
              </div>
              <div class="clear"></div>
            </div>
          </router-link>
          <router-link to="/mine/editpsw/0">
            <div class="list"  style="margin-top:0.265rem;">
                <div class="left">密码</div>
                <div class="right">
                  <span></span>
                  <span></span>
                  <img src="../../../../../static/images/enter@2x.png" alt="">
                </div>
                <div class="clear"></div>
            </div>
          </router-link>
            <div class="list" @click="gotoEditPsw()">
                <div class="left">支付密码</div>
                <div class="right">
                  <span></span>
                  <span></span>
                  <img src="../../../../../static/images/enter@2x.png" alt="">
                </div>
                <div class="clear"></div>
            </div>
          <router-link to="/mine/info/idcard">
            <div class="list">
                <div class="left">身份证信息</div>
                <div class="right">
                  <span></span>
                  <span></span>
                  <img src="../../../../../static/images/enter@2x.png" alt="">
                </div>
                <div class="clear"></div>
            </div>
          </router-link>
          <!-- <div class="list"  style="margin-top:0.265rem;padding-right:0.265rem;">
              <div class="left">消息通知</div>
              <div class="right">
                <span></span>
                <span></span>
                <mt-switch  style="margin-top:0.25rem;" v-model="value"></mt-switch>
              </div>
              <div class="clear"></div>
          </div> -->
          <div class="list"  style="margin-top:0.265rem;">
              <div class="left">关于我们</div>
              <div class="right">
                <span></span>
                <span></span>
                <img src="../../../../../static/images/enter@2x.png" alt="">
              </div>
              <div class="clear"></div>
          </div>
        </div>
        <div class="footer" @click="loginOut()">退出登录</div>
    </div>
</template>
<script>
import { MessageBox, Toast, Indicator } from 'mint-ui'
import Exif from 'exif-js'

export default {
  data () {
    return {
      allHeight: 0,
      userInfo: {}
    }
  },
  components: {MessageBox, Toast, Indicator},
  methods: {
    editName (userName) {
      MessageBox.prompt(' ', '修改用户名', {inputValue: userName}).then(({ value, action }) => {
        this.$http.get('/api/User/UpdateForName', {name: encodeURIComponent(value)})
          .then(res => {
            this.getUserInfo()
          })
      })
    },
    getUserInfo () {
      this.$http.get('/api/User/Info', {})
        .then(res => {
          this.userInfo = res.Result
        })
    },
    gotoEditPsw () {
      if (this.userInfo.HasPayPwd) {
        // 为true 已设置过。跳转修改密码1
        this.$router.push('/mine/editpsw/1')
      } else {
        // 未设置跳2
        this.$router.push('/mine/editpsw/2')
      }
    },
    loginOut () {
      // 退出登录
      Indicator.open()
      setTimeout(() => {
        Indicator.close()
        this.$store.state.token = null
        localStorage.removeItem('token')
        this.delCookie('token')
      }, 1000)
      setTimeout(() => {
        Indicator.close()
        Toast('退出成功')
        this.$router.push('/')
      }, 1500)
    },
    uploadImg (e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.picValue = files[0]
      this.imgPreview(this.picValue)
    },
    imgPreview (file) {
      let self = this
      let Orientation
      // 去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file, function () {
        Orientation = Exif.getTag(this, 'Orientation')
      })
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return

      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader()
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file)
        // 读取成功后的回调
        reader.onloadend = function () {
          let result = this.result
          let img = new Image()
          img.src = result
          // 判断图片是否大于100K,是就直接上传，反之压缩图片
          if (this.result.length <= (100 * 1024)) {
            self.headerImage = this.result
            self.postImg(self.headerImage)
          } else {
            img.onload = function () {
              let data = self.compress(img, Orientation)
              self.headerImage = data
              self.postImg(self.headerImage)
            }
          }
        }
      }
    },
    postImg (img) {
      // ajax请求，通过formdata进行上传图片
      var formdata = new FormData()
      var blob = this.dataURItoBlob(img)
      formdata.append('file', blob, 'image.png')
      var token = this.$store.state.token || localStorage.getItem('token')
      this.$http.postUpload('/api/User/UpdateForImage?Token=' + token, formdata)
        .then(response => {
          // Toast('上传成功')
          this.getUserInfo()
        })
    },
    rotateImg (img, direction, canvas) {
      // 最小与最大旋转方向，图片旋转4次后回到原方向
      const minStep = 0
      const maxStep = 3
      if (img === null) return
      // img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height
      let width = img.width
      let step = 2
      if (step === null) {
        step = minStep
      }
      if (direction === 'right') {
        step++
        // 旋转到原位置，即超过最大值
        step > maxStep && (step = minStep)
      } else {
        step--
        step < minStep && (step = maxStep)
      }
      // 旋转角度以弧度值为参数
      let degree = step * 90 * Math.PI / 180
      let ctx = canvas.getContext('2d')
      switch (step) {
        case 0:
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0)
          break
        case 1:
          canvas.width = height
          canvas.height = width
          ctx.rotate(degree)
          ctx.drawImage(img, 0, -height)
          break
        case 2:
          canvas.width = width
          canvas.height = height
          ctx.rotate(degree)
          ctx.drawImage(img, -width, -height)
          break
        case 3:
          canvas.width = height
          canvas.height = width
          ctx.rotate(degree)
          ctx.drawImage(img, -width, 0)
          break
      }
    },
    compress (img, Orientation) {
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      // 瓦片canvas
      let tCanvas = document.createElement('canvas')
      let tctx = tCanvas.getContext('2d')
      let initSize = img.src.length
      let width = img.width
      let height = img.height
      // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio
      if ((ratio = width * height / 4000000) > 1) {
        console.log('大于400万像素')
        ratio = Math.sqrt(ratio)
        width /= ratio
        height /= ratio
      } else {
        ratio = 1
      }
      canvas.width = width
      canvas.height = height
      //        铺底色
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      // 如果图片像素大于100万则使用瓦片绘制
      let count
      if ((count = width * height / 1000000) > 1) {
        console.log('超过100W像素')
        count = ~~(Math.sqrt(count) + 1) // 计算要分成多少块瓦片
        //            计算每块瓦片的宽和高
        let nw = ~~(width / count)
        let nh = ~~(height / count)
        tCanvas.width = nw
        tCanvas.height = nh
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height)
      }
      // 修复ios上传图片的时候 被旋转的问题
      if (Orientation !== '' && Orientation !== 1) {
        switch (Orientation) {
          case 6:// 需要顺时针（向左）90度旋转
            this.rotateImg(img, 'left', canvas)
            break
          case 8:// 需要逆时针（向右）90度旋转
            this.rotateImg(img, 'right', canvas)
            break
          case 3:// 需要180度旋转
            this.rotateImg(img, 'right', canvas)// 转两次
            this.rotateImg(img, 'right', canvas)
            break
        }
      }
      // 进行最小压缩
      let ndata = canvas.toDataURL('image/jpeg', 0.1)
      console.log('压缩前：' + initSize)
      console.log('压缩后：' + ndata.length)
      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + '%')
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
      return ndata
    },
    // 创建一个Blob对象 用于将base64转化为formdata
    dataURItoBlob (base64Data) {
      var byteString
      if (base64Data.split(',')[0].indexOf('base64') >= 0) {
        byteString = window.atob(base64Data.split(',')[1])
      } else {
        byteString = unescape(base64Data.split(',')[1])
      }
      var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0] // type
      // 处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(byteString.length) // size
      var ia = new Uint8Array(ab)
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ab], {
        type: mimeString
      })
    }
  },
  mounted () {
    this.allHeight = document.documentElement.clientHeight
    this.getUserInfo()
  }
}
</script>
<style scoped lang='scss'>
.root {
  padding: 0.05rem 0 0;
  background-color: #faf9f7;
  // position: relative;
  .allList {
    .list {
      line-height: 1.333rem;
      padding-left: 0.265rem;
      border-bottom: 1px solid #e6e6e6;
      font-size: 0.4rem;
      font-weight: 400;
      color: #333333;
      background-color: #fff;
      .right {
        display: flex;
        align-items: center;
        font-size: 0.33rem;
        span {
          display: inline-block;
          color: #808080;
          font-size: 0.3733rem;
          white-space: nowrap;
        }
        img:nth-child(1) {
          width: 1.333rem;
          height: 1.333rem;
          border-radius: 50%;
        }
        img:nth-child(2) {
          height: 0.7rem;
          position: relative;
          top: -0.02rem;
        }
        img:nth-child(3) {
          height: 0.7rem;
          margin-top: 0.3166rem;
        }
      }
    }
    .img {
      line-height: 1.6rem;
      position: relative;
      .right {
        img {
          margin-top: 0.265rem;
        }
        .userTopImg {
          margin-top: 0.133rem;
        }
      }
      .input-box {
        height: 100%;
        line-height: 1.6rem;
        position: absolute;
        right: 0;
        width: 2rem;
        opacity: 0;
        input {
          height: 100%;
          width: 2rem;
        }
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1.33rem;
    color: #f7b500;
    font-size: 0.4rem;
    text-align: center;
    line-height: 1.33rem;
    background-color: #fff;
  }
  .popup {
    width: 100%;
    background-color: #faf9f7;
    p {
      background-color: #fff;
      line-height: 1.33rem;
      text-align: center;
      font-size: 0.4rem;
      color: #333333;
      position: relative;
      input {
        // opacity: 0;
        width: 100%;
        z-index: 100;
      }
      span {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        width: 100%;
        height: 100%;
        z-index: 80;
      }
    }
    p:nth-child(1) {
      margin-bottom: 0.265rem;
    }
  }
}
</style>
