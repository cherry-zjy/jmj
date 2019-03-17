<template>
  <!-- 上传图 -->
  <div class="upload-img">
      <div v-for="(l,i) in imglist" :key="i" v-if="imglist.length>0">
        <!-- <img class="img" src="../../../static/images/upload_photos@2x.png" alt=""> -->
        <img class="img" :src="l" alt="" @click="preview(l)">
        <img class="close" src="../../../static/images/over@2x.png" alt=""  @click="closeImg(i)">
      </div>
      <div class="img-list">
        <img class="upload_photos" src="../../../static/images/upload_photos@2x.png" alt="">
        <input class="SetMeImg" type="file" @change="SetMayImg($event)" />
      </div>
      <mt-popup v-model="popupVisible" popup-transition="popup-fade" class="popup">
        <img :src="previewImg" alt="" style="width:100%;">
      </mt-popup>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'
import wx from 'weixin-js-sdk'
import Exif from 'exif-js'

// import hexSha1 from '../../../static/js/sha1.js'
export default {
  data () {
    return {
      // 图片上传数量限制
      limit: 3,
      // 上传成功图片目录
      imglist: [],
      imglistSmall: [],
      // 是否展示关闭按钮
      showClose: false,
      // 预览窗口
      popupVisible: false,
      // 预览图片地址
      previewImg: '',
      // wx 参数
      nonceStr: null // 验证码
    }
  },
  components: {},
  methods: {
    createCode () {
      this.nonceStr = ''
      var codeLength = 16 // 验证码的长度
      var selectChar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'l', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Y', 'Z'] // 所有候选组成验证码的字符，当然也可以用中文的
      for (var i = 0; i < codeLength; i++) {
        var charIndex = Math.floor(Math.random() * 60)
        this.nonceStr += selectChar[charIndex]
      }
    },

    // 预览图
    preview (url) {
      this.popupVisible = true
      this.previewImg = url
      // var tt = this
      // wx.previewImage({
      //   current: url,
      //   urls: tt.imglist
      // })
    },
    // 删除图
    closeImg (i) {
      this.imglist.splice(i, 1)
    },
    // 上传
    SetMayImg (e) {
      // 上传图之前判断是否大于数量限制
      if (this.imglist.length >= this.limit) {
        Toast({
          message: '最多上传' + this.limit + '张图',
          position: 'bottom',
          duration: 1500
        })
        return false
      }
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
      this.$http.postUpload('/api/APP_Home/UpdateForImage', formdata)
        .then(response => {
          this.imglist.push(response.config.baseURL + response.data.Result[0])
          this.imglistSmall.push(response.data.Result[0])
          // 不带域名的
          this.$emit('imglist', this.imglistSmall)
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
    },
    bkl (ticket) {
      var timestamp1 = Date.parse(new Date())
      var pageurl = location.href
      var signature = 'jsapi_ticket=' + ticket + '&noncestr=' + this.nonceStr + '&timestamp=' + timestamp1 + '&url=' + pageurl
      // signature = hex_sha1(signature)
      wx.config({
        debug: false,
        appId: 'wx099542e0c850bed5',
        timestamp: timestamp1,
        nonceStr: this.nonceStr,
        signature: signature,
        jsApiList: [
          'checkJsApi',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareWeibo',
          'onMenuShareQZone',
          'hideMenuItems',
          'showMenuItems',
          'hideAllNonBaseMenuItem',
          'showAllNonBaseMenuItem',
          'translateVoice',
          'startRecord',
          'stopRecord',
          'onVoiceRecordEnd',
          'playVoice',
          'onVoicePlayEnd',
          'pauseVoice',
          'stopVoice',
          'uploadVoice',
          'downloadVoice',
          'chooseImage',
          'previewImage',
          'uploadImage',
          'downloadImage',
          'getNetworkType',
          'openLocation',
          'getLocation',
          'hideOptionMenu',
          'showOptionMenu',
          'closeWindow',
          'scanQRCode',
          'chooseWXPay',
          'openProductSpecificView',
          'addCard',
          'chooseCard',
          'openCard'
        ]
      })
      wx.error(function (res) {
        // console.log(res);
        alert('微信appid授权错误')
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，
        // 也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      })
    }
  },
  mounted () {
    this.createCode()
    // var _this = this
    // _this.$http.get('/api/User/GetBankTicketAndToken')
    //   .then(function (response) {
    //     _this.bkl(response.data.Result.api_ticket)
    //   })
  }
}

</script>
<style scoped lang='scss'>
.upload-img {
  height: 2.53rem;
  padding: 0.265rem;
  div {
    display: inline-block;
    position: relative;
    width: 2rem;
    height: 2rem;
    margin-right: 0.265rem;
    .img,
    .upload_photos {
      position: absolute;
      left: 0;
      height: 2rem;
      width: 2rem;
    }
    .close {
      position: absolute;
      right: -0.165rem;
      top: -0.165rem;
      width: 0.533rem;
      height: 0.53rem;
    }
    input {
      position: absolute;
      left: 0;
      top: 0px;
      opacity: 0;
      filter: alpha(opacity=0);
      height: 2rem;
      width: 2rem;
      z-index: 10;
    }
  }
  .popup {
    width: 80%;
    height: 80%;
    top: -200% !important;
  }
}
</style>
