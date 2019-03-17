<template>
    <div class="root"  :style="'min-height:'+allHeight +'px'">
      <div class='address-list'>
        <div class='address-info' v-for="(l,i) in AddressList" :key="i" ref='addressList'>
          <div class='address-user'  @click="choiceAddress(l,i)">
              <div class='user-info'>{{l.Name}}
                <span class='user-phone right'>{{l.Phone}}</span>
              </div>
              <div class='user-address'>{{l.Province}}{{l.City}}{{l.Region}}{{l.Address}}</div>
          </div>
          <div class='operation-box'>
              <div class='operation-left left' @click='selected(l.ID)'>
                <img class='isnochoice' :src='l.IsDefault?"../../../../../static/images/selected@2x.png":"../../../../../static/images/not_selected@2x.png"'/>
                <span class='set-add'>设置为默认地址</span>
              </div>
              <div class='operation-right right'>
                <span class='edit' @click='editAddress(l)'>编辑</span>
                <span class='delete' @click='delAddress(l.ID)'>删除</span>
              </div>
          </div>
        </div>
      </div>
      <div class='footer-btn'  @click='addAddress()'>新增地址</div>
    </div>
</template>
<script>
import { Toast } from 'mint-ui'

export default {
  data () {
    return {
      allHeight: 0,
      AddressList: []
    }
  },
  components: {},
  methods: {
    editAddress (l) {
      this.$router.push('/mine/address/edit/1')
      localStorage.setItem('addressInfo', JSON.stringify(l))
    },
    addAddress () {
      this.$router.push('/mine/address/edit/0')
      localStorage.removeItem('addressInfo')
    },
    getAddressList () {
      this.$http.get('/api/Address/GetListByPage', {pageIndex: 1})
        .then(res => {
          this.AddressList = res.Result.Data
        })
    },
    selected (id) {
      this.$http.get('/api/Address/SetDefault', {id: id})
        .then(res => {
          this.getAddressList()
        })
    },
    delAddress (id) {
      this.$http.get('/api/Address/Del', {id: id})
        .then(res => {
          Toast('删除成功')
          this.getAddressList()
        })
    },
    choiceAddress (info, refAdd) {
      // 订单选择地址 如果是订单进来的选择地址存起来
      if (this.$route.params.order) {
        localStorage.setItem('choiceAddress', JSON.stringify(info))
        this.$refs.addressList.forEach(item => {
          item.id = ''
        })
        this.$refs.addressList[refAdd].id = 'isChoiveAddress'
        setTimeout(() => {
          this.$router.go(-1)
        }, 0)
      }
    }
  },
  mounted () {
    this.allHeight = document.documentElement.clientHeight
    this.getAddressList()
  }
}
</script>
<style scoped lang='scss'>
.root {
  background-color: #faf9f7;
  padding: 0.265rem 0;
  .address-list {
    margin-bottom: 1.35rem;
    #isChoiveAddress {
      border: 1px solid #f7b500;
    }
    .address-info {
      padding: 0 0.265rem;
      margin-bottom: 0.265rem;
      background-color: #fff;
      // 用户地址信息
      .address-user {
        color: #262626;
        font-size: 0.4rem;
        // height: 2rem;
        padding: 0.35rem 0;
        line-height: 0.65rem;
        border-bottom: 1px solid #faf9f7;
        .user-info {
          font-size: 0.4rem;
          margin-bottom: 0.133rem;
          font-weight: 400;
        }
        .user-address {
          font-size: 0.32rem;
        }
      }
      // 底部操作
      .operation-box {
        height: 1.1733rem;
        line-height: 1.1733rem;
        background: #fff;
        overflow: hidden;
        .set-add {
          font-size: 0.3733rem;
          color: #262626;
          font-weight: 400;
          float: right;
        }

        .isnochoice {
          height: 0.773rem;
          width: 0.773rem;
          margin-top: 0.2rem;
          margin-right: 0.2rem;
        }

        .edit,
        .delete {
          display: inline-block;
          border-radius: 5px;
          font-size: 0.346rem;
          color: #262626;
          height: 0.8rem;
          line-height: 0.8rem;
          width: 1.6rem;
          text-align: center;
          border: 1px solid #b3b3b3;
          margin-left: 0.2rem;
        }
      }
    }
  }
}

.footer-btn {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 1.333rem;
  line-height: 1.333rem;
  background: #f7b500;
  color: #fff;
  font-size: 0.4rem;
  opacity: 0.96;
  text-align: center;
}
</style>
