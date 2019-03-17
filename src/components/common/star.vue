<template>
  <div class="star-box">
    <div class="star-back">
      <img class="star-img" v-for="(n ,i) in total" :key="i" src="../../../static/images/star@2x.png" @click="starClick(n)" />
    </div>
    <div class="star-front" :style="widthStar">
      <img class="star-img"  v-for="(n ,i) in total" :key="i" src="../../../static/images/star_selected@2x.png" @click="starClick(n)" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 总共几个星星
    total: {
      default: 5,
      type: Number
    },
    // 选中了几个
    value: {
      type: Number
    }
  },
  data () {
    return {
      widthStar: ''
    }
  },
  computed: {

  },
  components: {},
  methods: {
    frontStyle: function (num) {
      var w = 25 * num
      this.widthStar = 'width:' + w + 'px'
    },
    starClick: function (n) {
      this.$emit('StarClick', n)
      this.frontStyle(n)
    }
  },
  mounted () {}
}

</script>
<style scoped lang=''>
.star-box {
  position: relative;
  height: 25px;
  width: 125px;
  /* text-align: right; */
}
.star-back {
  position: absolute;
}
.star-front {
  position: absolute;
  white-space: nowrap;
  overflow: hidden;
}
.star-img {
  width: 25px;
  height: 25px;
  /* -moz-user-select: none; */
  cursor: pointer;
}
</style>
