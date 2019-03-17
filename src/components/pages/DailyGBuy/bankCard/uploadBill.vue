<template>
  <div class="root" :style="'min-height:'+htmlH +'px'">
    <!-- product type -->
    <div class="product-type">
      <h2>产品类别</h2>
      <div class="radio-is" @click="popupVisible = true">
        <span v-if="!isExCoin">兑换至余额</span>
        <span v-if="isExCoin">兑换至金币</span>
        <img src="../../../../../static/images/enter@2x.png" alt="">
      </div>
      <div class="goods-is">
        <table>
          <tbody>
            <tr v-for="(l,i) in billItemList" :key="i">
              <td class="price" v-if="!isExCoin">{{l.ExBalance}}<span>元</span></td>
              <td class="price" v-if="isExCoin">{{l.ExCoin}}<span>元</span></td>
              <td class="name">{{l.ProductName}}</td>
              <td class="radio">
                <div>
                  <input type="radio" name="ischoice" :id="'item'+i" @change="choiceGoods(l.ID, l.IsSpecial)">
                  <label :for="'item'+i"></label></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 兑换码 -->
    <div class="number-code" v-if="IsSpecial">
      <h2>兑换码</h2>
      <input type="text" placeholder="输入兑换码" v-model="code">
    </div>
    <!-- 二维码 -->
    <div class="qr-code" v-else>
      <h2>上传二维码截图</h2>
      <div class="upload-img">
        <input type="file"  @change="uploadImg($event)">
        <img :src="codeImg?codeImg:'../../../../../static/images/upload_photos@2x.png'" alt="">
      </div>
    </div>

    <!-- 提交 -->
    <!-- <router-link to='/bill/fillin/success'> -->
      <div class="sub-btn" @click="subBtn()">提交</div>
    <!-- </router-link> -->
    <!-- 确认收货 输入密码 -->
    <mt-popup v-model="popupVisible" popup-transition="popup-fade" class="orderPsw-popup">
      <div>
        <h2>兑换至</h2>
        <table>
          <tbody>
            <tr>
              <td class="name">余额</td>
              <td class="radio">
                <div>
                  <input type="radio" name="isTo" id="ToOne" :checked='!isExCoin' @change="changeradio(false)">
                  <label for="ToOne"></label></div>
              </td>
            </tr>
            <tr>
              <td class="name">金币</td>
              <td class="radio">
                <div>
                  <input type="radio" name="isTo" id="ToTwo" :checked='isExCoin' @change="changeradio(true)">
                  <label for="ToTwo"></label></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'
import Exif from 'exif-js'

export default {
  data () {
    return {
      htmlH: 0,
      isExCoin: false,
      popupVisible: false,
      billItemList: [],
      codeImg: '',
      goodsID: '',
      code: null,
      image: null,
      IsSpecial: false
    }
  },
  components: {},
  methods: {
    changeradio (b) {
      this.isExCoin = b
      this.popupVisible = false
    },
    choiceGoods (id, b) {
      this.IsSpecial = b
      this.goodsID = id
    },
    subBtn () {
      if (this.goodsID) {
        if (this.IsSpecial) {
          if (this.code) {
            this.axios()
          } else {
            Toast('请输入兑换码')
          }
        } else {
          if (this.image) {
            this.axios()
          } else {
            Toast('请先上传截图')
          }
        }
      } else {
        Toast('请选择兑换商品')
      }
    },
    axios () {
      this.$http.get('/api/APP_DailyDeail/UserUploadProof',
        {
          Token: this.$store.state.token || localStorage.getItem('token'),
          exchangeID: this.goodsID,
          theway: this.isExCoin ? 2 : 1,
          code: this.code,
          image: this.image
        })
        .then(res => {
          this.$router.push('/bill/fillin/success')
        })
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
      this.$http.postUpload('/api/APP_Home/UpdateForImage', formdata)
        .then(response => {
          this.codeImg = response.config.baseURL + response.data.Result[0]
          this.image = response.data.Result[0]
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
    this.htmlH = document.documentElement.clientHeight
    this.billItemList = JSON.parse(localStorage.getItem('billItemList'))
    // this.goodsID = this.billItemList[0].ID
  }
}

</script>
<style scoped lang='scss'>
.root {
  background-color: #faf9f7;
  padding: 0.265rem;

  // 产品类型
  .product-type {
    width: 100%;
    background-color: #fff;
    padding: 0 0.265rem 0.265rem;

    h2 {
      line-height: 1rem;
      font-size: 0.4rem;
      color: #333333;
      font-weight: 400;
    }

    // 兑换至哪里
    .radio-is {
      height: 1.1733rem;
      line-height: 1.1733rem;
      border: 1px solid #d0cbbd;
      font-size: 0.373rem;
      color: #333333;
      padding-left: 0.265rem;
      display: flex;
      justify-content: space-between;

      img {
        height: 0.6733rem;
        margin-top: 0.25rem;
      }
    }

    // 商品选择
    .goods-is {
      width: 100%;
      border: 1px solid #d0cbbd;
      border-bottom: none;
      padding: 0.265rem 0;
      margin-top: 0.2rem;
      position: relative;
      background-image: url("../../../../../static/images/credentials_goods_bg.png");
      background-repeat: no-repeat;
      background-position: 0 100%;
      background-size: contain;

      table {
        padding: 0 0.265rem;
        width: 100%;

        .price {
          font-size: 0.64rem;
          color: #f7b500;
          font-weight: 600;

          span {
            font-size: 0.373rem;
          }
        }

        .name {
          width: 100%;
          font-size: 0.373rem;
          color: #333333;
          font-weight: 400;
          text-align: center;
        }
      }
    }
  }

  // 兑换码
  .number-code {
    background-color: #fff;
    margin-top: 0.265rem;
    padding: 0 0.265rem 0.265rem;

    h2 {
      font-size: 0.4rem;
      color: #333333;
      font-weight: 400;
      line-height: 1.066rem;
    }

    input {
      outline: none;
      border: 1px solid #d0cbbd;
      font-size: 0.3733rem;
      color: #b3b3b3;
      line-height: 1.1733rem;
      width: 100%;
      padding-left: 0.265rem;
      -webkit-appearance: none;
    }

    input::-webkit-input-placeholder {
      color: #b3b3b3;
    }
  }

  // 上传二维码截图
  .qr-code {
    background-color: #fff;
    margin-top: 0.265rem;
    padding: 0 0.265rem 0.265rem;

    h2 {
      font-size: 0.4rem;
      font-weight: 400;
      color: #333333;
      line-height: 1.066rem;
    }

    .upload-img {
      position: relative;
      width: 2.133rem;
      height: 2.133rem;

      input {
        position: absolute;
        top: 0;
        left: 0;
        width: 2.133rem;
        height: 2.133rem;
        opacity: 0;
        z-index: 999;
      }

      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 2.133rem;
        height: 2.133rem;
      }
    }
  }

  .sub-btn {
    width: 100%;
    height: 1.33rem;
    color: #fff;
    font-size: 0.4rem;
    text-align: center;
    line-height: 1.33rem;
    margin-top: 1.2633rem;
    background-color: #f7b500;
  }

  .orderPsw-popup {
    top: 35%;
    width: 8rem;
    text-align: center;
    border-radius: 5px;
    div {
      h2 {
        color: #333333;
        font-size: 0.426rem;
        line-height: 1.173rem;
      }
      table {
        padding: 0 0.265rem;
        width: 100%;
        border-collapse: collapse;
        font-size: 0.4rem;
        color: #333333;
        tr {
          line-height: 1.6rem;
          border-top: 1px solid #e6e6e6;
          td {
            text-align: left;
            padding: 0 0.265rem;
          }
        }
        .name {
          width: 100%;
          font-size: 0.373rem;
          color: #333333;
          font-weight: 400;
        }
        .radio {
          margin-top: 0.3rem;
        }
      }
    }
  }
}
</style>
