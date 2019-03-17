<template>
    <div class="root"  :style="'min-height:'+allHeight +'px'">
      <div class='address-list'>
        <div class='address-info' v-for="(l,i) in UserAuthList" :key="i">
          <div class='address-user'  @click="choiceAddress(l,i)"  ref='addressList'>
              <div class='user-info'>{{l.Name}}
                <span class='user-phone right'>{{l.IDNO}}</span>
              </div>
          </div>
          <div class='operation-box'>
              <div class='operation-right right'>
                <span class='edit' @click='editAddress(l)'>编辑</span>
                <span class='delete' @click='delAddress(l.ID)'>删除</span>
              </div>
          </div>
        </div>
      </div>
        <div class='footer-btn' @click="addAddress()">新增</div>
    </div>
</template>
<script>
import { Toast, MessageBox } from 'mint-ui'

export default {
  data () {
    return {
      UserAuthList: [],
      allHeight: 0
    }
  },
  components: {},
  methods: {
    addAddress () {
      this.$router.push('/mine/idcard/edit/0')
      localStorage.removeItem('AuthListInfo')
    },
    editAddress (l) {
      this.$router.push('/mine/idcard/edit/1')
      localStorage.setItem('AuthListInfo', JSON.stringify(l))
    },
    delAddress (id) {
      MessageBox.confirm('确定删除吗?').then(action => {
        this.$http.get('/api/User/DeleteUserAuth', {authID: id})
          .then(res => {
            Toast('删除成功')
            this.getUserAuthList()
          })
      })
    },
    getUserAuthList () {
      this.$http.get('/api/User/GetUserAuthList', {pageIndex: 1, pageSize: 10})
        .then(res => {
          this.UserAuthList = res.Result.authList
        })
    },
    choiceAddress (info, refAdd) {
      // 订单选择地址 如果是订单进来的选择地址存起来
      if (this.$route.params.order) {
        localStorage.setItem('choiceAuthor', JSON.stringify(info))
        this.$refs.addressList.forEach(item => {
          item.id = ''
        })
        this.$refs.addressList[refAdd].id = 'isChoiveAddress'
        setTimeout(() => {
          this.$router.go(-1)
        }, 700)
      }
    }
  },
  mounted () {
    this.allHeight = document.documentElement.clientHeight
    this.getUserAuthList()
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
      }
      // 底部操作
      .operation-box {
        height: 1.1733rem;
        line-height: 1.1733rem;
        background: #fff;
        overflow: hidden;
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
