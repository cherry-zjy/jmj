<template>
  <div>
    <div class="root" id="codeImg" :style="'width:'+ htmlW +'px;height:'+htmlW*1.777 +'px;'">
      <!-- background-image: url('+BackgroundMap+'); -->
      <img class="backMap" :src="BackgroundMap" alt>
      <!-- 推广码 -->
      <div class="user-info">
        <img :src="userImg" alt>
        <!-- <img src="../../../../../static/images/logo.png" alt=""> -->
        <p>
          <span>{{userInfo.NickName}}</span>
          <br>
          <span>我为极美家代言</span>
        </p>
      </div>
      <div class="qrcode">
        <div id="qrcode" style="text-align:center"></div>
        <div>长按此二维码
          <br>注册成为极美家会员
        </div>
      </div>
      <div id="canvas"></div>
      <canvas id="aaa"></canvas>
      <mt-popup v-model="popupShare" class="popup-share share-code">
        <div class="share">
          <div class="share-img"></div>
          <!-- <div class="footer" @click="downImg()">长按进行分享操作 </div> -->
        </div>
      </mt-popup>
    </div>
    <!-- 分享 -->
    <div class="share-icon" @click="openShare()">
      <img src="../../../../../static/images/share.png" alt>
    </div>
  </div>
</template>
<script>
import QRCode from 'qrcodejs2'
import html2canvas from 'html2canvas'

export default {
  data () {
    return {
      htmlH: 0,
      htmlW: 0,
      userInfo: {},
      userImg: '',
      BackgroundMap: '',
      popupShare: false
    }
  },
  components: {},
  methods: {
    qrcode (qn) {
      /* eslint-disable no-new */
      new QRCode('qrcode', {
        width: 85,
        height: 85,
        text: qn
      })
    },
    openShare () {
      this.popupShare = true
      this.downImg()
    },
    downImg () {
      var _this = this
      var canvas2 = document.createElement('canvas')
      let _canvas = document.querySelector('.root')
      var w = parseInt(window.getComputedStyle(_canvas).width)
      var h = parseInt(window.getComputedStyle(_canvas).height)
      // 将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了
      canvas2.width = w * 2
      canvas2.height = h * 2
      canvas2.style.width = w + 'px'
      canvas2.style.height = h + 'px'
      // 可以按照自己的需求，对context的参数修改,translate指的是偏移量
      //  var context = canvas.getContext("2d");
      //  context.translate(0,0);
      var context = canvas2.getContext('2d')
      context.scale(2, 2)
      let opts = {
        scale: 2,
        allowTaint: true,
        canvas: canvas2,
        logging: true,
        imageTimeout: 0,
        // width: w, // dom 原始宽度
        // height: h,
        dpi: window.devicePixelRatio * 960
      }
      html2canvas(document.querySelector('.root'), opts).then(function (canvas) {
        // var context = canvas.getContext('2d')
        // 【重要】关闭抗锯齿
        // context.mozImageSmoothingEnabled = false
        // context.webkitImageSmoothingEnabled = false
        // context.msImageSmoothingEnabled = false
        // context.imageSmoothingEnabled = false
        document.querySelector('.share-img').innerHTML =
          '<div class="qrimg"><p style="font-size:0.32rem;color:#808080;line-height:1.173rem">长按上图进行分享操作</p></div>'
        // 在p标签前面插入图片insertBefore(new,item[0]) 在父元素最后插入appendChild(new)
        document
          .querySelector('.qrimg')
          .insertBefore(
            _this.convertCanvasToImage(canvas),
            document.querySelector('.share-img p')
          )
        document.querySelector('.share-img img').style.width = '100%'

        // canvas转换成url，然后利用a标签的download属性，直接下载，绕过上传服务器再下载
        // var triggerDownload = document.querySelector('.down')
        // triggerDownload.setAttribute('href', canvas.toDataURL())
        // triggerDownload.setAttribute('download', 'goods-img.png')
        // triggerDownload.click()
      })
    },
    // 从 canvas 提取图片 image
    convertCanvasToImage (canvas) {
      var image = new Image()
      image.src = canvas.toDataURL('image/png')
      return image
    },
    getUserInfo () {
      this.$http.get('/api/User/Info', {}).then(res => {
        this.userInfo = res.Result
        this.ExchangeImage(1, this.userInfo.Image)
        this.ExchangeImage(2, this.userInfo.BackgroundMap)
        // console.log(this.getBase64ByUrl(this.userInfo.Image))
        var qrNum =
          'http://jmjwx.kimijia.com/#/author/' + res.Result.InviteCode
        this.qrcode(qrNum)
        // var image = new Image()
        // // image.crossOrigin = 'Anonymous'
        // image.crossOrigin = '*'
        // // image.setAttribute('crossorigin', 'anonymous')
        // image.src = this.userInfo.Image + '?' + (+new Date())
        // var _this = this
        // image.onload = function () {
        //   var base64 = _this.getBase64Image(image)
        //   _this.userImg = base64
        // }
      })
    },
    // 将图片转base64  后台接口
    ExchangeImage (index, url) {
      this.$http
        .get('/api/APP_Home/ExchangeImage', { image: url })
        .then(res => {
          if (index === 1) {
            this.userImg = res.Result
          } else if (index === 2) {
            this.BackgroundMap = res.Result
          }
        })
    },
    // 直接读成blob文件对象
    getImageBlob (url, cb) {
      var xhr = new XMLHttpRequest()
      xhr.open('get', url, true)
      xhr.responseType = 'blob'
      xhr.onload = function () {
        if (this.status === 200) {
          console.log()
          // imgResponse = this.response
          // // 这里面可以直接通过URL的api将其转换，然后赋值给img.src
          // // 也可以使用下面的preView方法将其转换成base64之后再赋值
          // img.src = URL.createObjectURL(this.response)
        }
      }
      xhr.send()
    },
    // 这里面将blob转换成base64
    preView (url) {
      let reader = new FileReader()
      this.getImageBlob(url, function (blob) {
        reader.readAsDataURL(blob)
      })
      reader.onload = function (e) {
        console.log(e.loaded)
      }
    },

    // 将图片转base64

    getBase64Image (img) {
      var canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)
      var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
      var dataURL = canvas.toDataURL('image/' + ext)
      return dataURL
    },
    // 将图片转base64
    getBase64ByUrl (src, callback, outputFormat) {
      var xhr = new XMLHttpRequest()
      xhr.open('GET', src, true)

      xhr.responseType = 'arraybuffer'
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
      xhr.onload = function (e) {
        if (xhr.status === 200) {
          var uInt8Array = new Uint8Array(xhr.response)
          var i = uInt8Array.length
          var binaryString = new Array(i)
          while (i--) {
            binaryString[i] = String.fromCharCode(uInt8Array[i])
          }
          var data = binaryString.join('')
          var base64 = window.btoa(data)
          var dataUrl =
            'data:' + (outputFormat || 'image/png') + ';base64,' + base64
          alert(dataUrl)
          callback.call(this, dataUrl)
        }
      }

      xhr.send()
    }
  },
  mounted () {
    this.htmlH = document.documentElement.clientHeight
    this.htmlW = document.documentElement.clientWidth
    this.getUserInfo()

    // var img = "http://127.0.0.1/base64/1.jpg";
  }
}
</script>
<style scoped lang='scss'>
.root {
  width: 100%;
  // background-image: url("/static/images/code_bg.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
  .backMap {
    position: absolute;
    top: 0;
    width: 100%;
  }
  .user-info {
    padding: 0.5rem;
    position: absolute;
    top: 0;
    width: 100%;
    img {
      width: 1.333rem;
      height: 1.333rem;
      float: left;
      margin-right: 0.265rem;
    }

    p {
      color: #262626;
      font-size: 0.32rem;
      line-height: 0.6665rem;
      font-family: "楷体";
      font-weight: 600;
    }
  }

  .qrcode {
    position: absolute;
    bottom: 0.4rem;
    right: 0.265rem;
    margin-top: 0.5rem;

    div {
      text-align: center;
      color: #fff;
      font-family: "楷体";
      font-size: 0.32rem;
    }
  }

  .popup-share {
    width: 80%;
    // height: 14rem;
    padding: 0.265rem 0.265rem 0;

    .share {
      height: 100%;
      width: 100%;
      text-align: center;
      position: relative;
      img {
        width: 100%;
      }
    }
  }
}
</style>
