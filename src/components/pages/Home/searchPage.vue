<template>
    <div class="root" :style="'height:'+htmlH +'px'">
      <!-- 搜索栏 -->
      <search-nav :isbtn='true' @searchVal='searchInputVal'></search-nav>
      <!-- title -->
      <div class="title">
        <div class="left">历史搜索</div>
        <div class="right" @click="clearSearchHis()">清空记录</div>
      </div>
      <!-- 搜索历史 -->
      <div class="for-list" v-for="(l,i) in searchHistory" :key="i" @click='searchListClick(l)'>{{l}}</div>
    </div>
</template>
<script>
import searchNav from '../../common/search'

export default {
  data () {
    return {
      htmlH: 0,
      searchHistory: [],
      inputSearchVal: ''
    }
  },
  components: {searchNav},
  methods: {
    searchInputVal (val) {
      var hasItem = this.searchHistory.some(item => {
        return val === item
      })
      hasItem || this.searchHistory.unshift(val)
      localStorage.setItem('searchKeywords', val)
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory))
      var _this = this
      setTimeout(() => {
        _this.$router.push('/home/searchpage/searchgoods/' + val)
      }, 500)
    },
    searchListClick (val) {
      var _this = this
      localStorage.setItem('searchKeywords', val)
      setTimeout(() => {
        _this.$router.push('/home/searchpage/searchgoods/' + val)
      }, 500)
    },
    // 清除历史记录
    clearSearchHis () {
      localStorage.removeItem('searchHistory')
      this.searchHistory = []
    }
  },
  beforeMount () {
    this.searchHistory = JSON.parse(localStorage.getItem('searchHistory')) ? JSON.parse(localStorage.getItem('searchHistory')) : []
    // this.inputSearchVal = localStorage.getItem('searchKeywords') ? localStorage.getItem('searchKeywords') : ''
  },
  mounted () {
    this.htmlH = document.documentElement.clientHeight
  }
}
</script>
<style scoped lang='scss'>
.root {
  background-color: #faf9f7;
  position: fixed;
  width: 100%;
  top: 0;
  overflow-y: scroll;
  // title
  .title {
    width: 100%;
    padding: 0 0.265rem;
    height: 1.16rem;
    font-size: 0.375rem;
    line-height: 1.16rem;
    color: #808080;
    background-color: #faf9f7;
  }
  .for-list {
    width: 100%;
    padding: 0 0.265rem;
    height: 1.333rem;
    font-size: 0.375rem;
    line-height: 1.333rem;
    color: #4d4d4d;
    border-bottom: 1px solid #e6e6e6;
    background-color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
