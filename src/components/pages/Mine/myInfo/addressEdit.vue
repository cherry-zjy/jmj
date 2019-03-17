<template>
    <div class="root editPsw"  :style="'min-height:'+allHeight +'px'">
      <div class="form">
          <mt-field class="underLine" placeholder="收货人姓名" v-model="name"></mt-field>
          <mt-field class="underLine" placeholder="手机号" type="tel" v-model="phone"></mt-field>
          <addressPicker v-if="type == '0'" class="underLine" :address="address" @choiceAddress='choiceAddress'></addressPicker>
          <addressPickerEdit v-else class="underLine" :address="address" @choiceAddress='choiceAddress'></addressPickerEdit>
          <mt-field placeholder="详细地址" type="textarea" rows="4" v-model="addressdetail"></mt-field>
      </div>
      <div class="btn">
        <p class="subEdit" v-if="type == '0'" @click="addSave()">保存</p>
        <p class="subEdit" v-else  @click="editSave()">确认修改</p>
      </div>
    </div>
</template>
<script>
import addressPicker from '../../../common/addressPicker.vue'
import addressPickerEdit from '../../../common/addressPickerEdit.vue'
import { Toast } from 'mint-ui'

export default {
  data () {
    return {
      type: this.$route.params.type,
      allHeight: 0,
      addressID: '',
      name: '',
      phone: '',
      address: '省,市,区',
      addressdetail: '',
      IsDefault: 1
    }
  },
  components: {addressPicker, addressPickerEdit},
  methods: {
    // 接受子组件的值
    choiceAddress (data) {
      this.address = data
    },
    addSave () {
      if (this.name && this.phone && this.addressdetail) {
        this.$http.post('/api/Address/Add',
          {
            'Token': this.$store.state.token || localStorage.getItem('token'),
            'name': this.name,
            'phone': this.phone,
            'provice': this.address.split(',')[0],
            'city': this.address.split(',')[1],
            'region': this.address.split(',')[2],
            'address': this.addressdetail,
            'isDefault': this.IsDefault
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
      if (this.name && this.phone && this.addressdetail) {
        this.$http.post('/api/Address/Edit',
          {
            'Token': this.$store.state.token || localStorage.getItem('token'),
            'AddressID': this.addressID,
            'name': this.name,
            'phone': this.phone,
            'provice': this.address.split(',')[0],
            'city': this.address.split(',')[1],
            'region': this.address.split(',')[2],
            'address': this.addressdetail,
            'isDefault': this.IsDefault
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
      let addressInfo = JSON.parse(localStorage.getItem('addressInfo'))
      this.name = addressInfo.Name
      this.phone = addressInfo.Phone
      this.address = addressInfo.Province + ',' + addressInfo.City + ',' + addressInfo.Region
      this.addressdetail = addressInfo.Address
      this.IsDefault = addressInfo.IsDefault ? 1 : 0
      this.addressID = addressInfo.ID
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
