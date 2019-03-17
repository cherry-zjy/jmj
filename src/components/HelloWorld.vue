<template>
  <!-- 默认生成HelloWorld 此处用作测试页面 -->
  <div class="hello"  style="height:100px">
    <mt-swipe :auto="4000" >
      <mt-swipe-item>1</mt-swipe-item>
      <mt-swipe-item>2</mt-swipe-item>
      <mt-swipe-item>3</mt-swipe-item>
    </mt-swipe>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$base_color:red;

.hello{
  color: $base_color
}
</style>
