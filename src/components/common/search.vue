<template>
    <div>
      <div class="search">
        <div class="left">
          <router-link to="/home/searchpage" >
            <input v-if="isbtn" v-focus type="text" v-model="value" placeholder="搜索您需要的商品">
            <input v-else type="text" v-model="value" placeholder="搜索您需要的商品">
            <img src="../../../static/images/search@2x.png" alt="">
          </router-link>
        </div>
        <div class="right">
          <router-link to="/home/messages"  v-if="!isbtn">
            <img src="../../../static/images/message@2x.png" alt="">
          </router-link>
          <span v-else @click="searchBtn()">搜索</span>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  // 接收父组件的值 判断显示的按钮
  props: ['isbtn', 'inputSearchVal'],

  data () {
    return {
      value: ''
    }
  },
  components: {},
  methods: {
    searchBtn () {
      this.$emit('searchVal', this.value)
    }
  },
  mounted () {
    this.value = this.inputSearchVal ? this.inputSearchVal : ''
  }
}
</script>
<style scoped lang='scss'>
// 搜索栏
.search {
  height: 1.12rem;
  padding: 0.1733rem 0.265rem;
  left: 1rem;
  display: flex;
  border-bottom: 1px solid #e6e6e6;
  background-color: #fff;
  a{
      color: #666
  }
  .left {
    padding-left: 0.5467rem;
    border: none;
    border-radius: 0.5rem;
    background-color: #f5f5f5;
    flex: auto;
    input {
      border: none;
      width: 85%;
      height: 100%;
      border-radius: 0.5rem;
      background-color: #f5f5f5;
      font-size: 0.345rem;
    }
    input::-webkit-input-placeholder {
      color: #808080;
    }
    img {
      margin-left: 0.25rem;
      // margin-top: 0.1125rem;
      width: 0.5065rem;
      position: relative;
      top: 0.1125rem;
    }
  }
  .right {
    width: 1rem;
    height: 100%;
    padding: 0.1125rem 0;
    text-align: center;

    img {
      width: 0.5065rem;
      margin-left: 0.25rem;
    }
    span {
      font-size: 0.375rem;
      color: #333333;
      font-weight: 400;
    }
  }
}
</style>
