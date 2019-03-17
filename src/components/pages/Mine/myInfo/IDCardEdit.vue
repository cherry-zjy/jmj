<template>
    <div class="root editPsw"  :style="'min-height:'+allHeight +'px'">
      <div class="form">
          <mt-field  class="underLine" placeholder="姓名" v-model="AuthListInfo.Name"></mt-field>
          <mt-field placeholder="身份证号码" v-model="AuthListInfo.IDNO"></mt-field>
      </div>
      <div class="btn">
        <p class="subEdit" v-if="type === 0" @click="addSave()">保存</p>
        <p class="subEdit" v-else  @click="editSave()">确认修改</p>
      </div>
      <mt-popup v-model="popupVisible" popup-transition="popup-fade" class="editPsw-popup">
        <div class="success" v-if="success">
          <img src="../../../../../static/images/successful@2x.png" alt="">
          <div>身份认证成功</div>
        </div>
        <div class="fail" v-else>
          <img src="../../../../../static/images/failure@2x.png" alt="">
          <div>姓名与身份证号码不匹配</div>
          <p>请重新输入</p>
        </div>
      </mt-popup>
    </div>
</template>
<script>
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      type: this.$route.params.type,
      allHeight: 0,
      AuthListInfo: {
        Name: '',
        IDNO: ''
      },
      // popup 弹层
      popupVisible: false,
      success: false
    }
  },
  components: {},
  methods: {
    addSave () {
      if (this.AuthListInfo.IDNO && this.AuthListInfo.Name) {
        this.$http.get('/api/User/AddUserAuth',
          {
            'name': this.AuthListInfo.Name,
            'IDCard': this.AuthListInfo.IDNO
          }
        )
          .then(res => {
            if (res) {
              Toast('添加成功')
              setTimeout(() => {
                this.$router.go(-1)
              }, 2000)
            }
          })
      } else {
        Toast('请完善信息')
      }
    },
    editSave () {
      if (this.AuthListInfo.IDNO && this.AuthListInfo.Name) {
        this.$http.get('/api/User/EditUserAuth',
          {
            'authID': this.AuthListInfo.ID,
            'name': this.AuthListInfo.Name,
            'IDCard': this.AuthListInfo.IDNO
          }
        )
          .then(res => {
            if (res) {
              Toast('修改成功')
              setTimeout(() => {
                this.$router.go(-1)
              }, 2000)
            }
          })
      } else {
        Toast('请完善信息')
      }
    }
  },
  beforeMount () {
    this.type = Number(this.$route.params.type)
    if (this.type !== 0 && this.type !== 1 && this.type !== 2) {
      alert('警告：网址错误')
    }
    if (this.type === 1) {
      this.AuthListInfo = JSON.parse(localStorage.getItem('AuthListInfo'))
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
