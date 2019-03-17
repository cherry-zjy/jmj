<template>
    <div>
      <div class='nav-bar'>
      <router-link class="nav-a" to="/dailygbuy">
          <div class="span">
            <p class="daily_buy_nav">
            </p>
            <p class="bottom">
              <span class="titleName">每日团购</span>
            </p>
          </div>
        </router-link>
        <router-link class="nav-a" to="/find">
          <div class="span">
            <p class="found_nav">
            </p>
            <p class="bottom">
              <span class="titleName">发现</span>
            </p>
          </div>
        </router-link>
        <router-link class="nav-a" to="/home">
          <div class="span">
            <p class="home_nav">
            </p>
            <p class="bottom">
              <span class="titleName">首页</span>
            </p>
          </div>
        </router-link>
        <router-link class="nav-a" to="/shopping">
          <div class="span">
            <p class="shopping_nav">
              <!-- <span>2</span> -->
            </p>
            <p class="bottom">
              <span class="titleName">购物车</span>
            </p>
          </div>
        </router-link>
        <router-link class="nav-a" to="/mine">
          <div class="span">
            <p class="mine_nav">
            </p>
            <p class="bottom">
              <span class="titleName">个人</span>
            </p>
          </div>
        </router-link>

      </div>
    </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  components: {},
  methods: {},
  mounted () {}
}
</script>
<style scoped lang='scss'>
.nav-bar {
  position: fixed !important;
  bottom: 0px;
  text-align: center;
  height: 1.333rem;
  background-color: white;
  border-top: 2px solid #f1f1f1;
  z-index: 1000;
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.nav-bar .span {
  text-align: center;
  display: inline-block;
  width: 2rem;
}

.nav-a .titleName {
  color: #999;
}

.bottom {
  position: relative;
  top: -0.05rem;
}

.bottom span {
  font-size: 0.267rem;
}

.router-link-exact-active .titleName {
  color: #F7B500;
}
.navBar{
  height: 0.853rem;
  background-size: 0.853rem 0.853rem;
  background-repeat: no-repeat;
  background-position: 50%, 50%;
}
.daily_buy_nav{
  background-image: url(../../../static/images/daily_groups_buy@2x.png);
  @extend .navBar;
}
.router-link-exact-active .daily_buy_nav {
  background-image: url(../../../static/images/daily_groups_buy_selected@2x.png);
}
.found_nav{
  background-image: url(../../../static/images/found@2x.png);
  @extend .navBar;
}
.router-link-exact-active .found_nav {
  background-image: url(../../../static/images/found_selected@2x.png);
}
.home_nav {
  background-image: url(../../../static/images/home@2x.png);
  @extend .navBar;
}
.router-link-exact-active .home_nav {
  background-image: url(../../../static/images/home_selected@2x.png);
}
.shopping_nav{
  background-image: url(../../../static/images/shopping_cart@2x.png);
  @extend .navBar;
  position: relative;
  span{
    position: absolute;
    top: 0.05rem;
    display: inline-block;
    width: 0.38rem;
    height: 0.38rem;
    line-height: 0.4rem;
    border-radius: 50%;
    color: #fff;
    font-size: 0.24rem;
    background-color: #FF4E5A;
  }
}
.router-link-exact-active .shopping_nav {
  background-image: url(../../../static/images/shopping_cart_selected@2x.png);
}
.mine_nav{
  background-image: url(../../../static/images/my@2x.png);
  @extend .navBar;
}
.router-link-exact-active .mine_nav {
  background-image: url(../../../static/images/my_selected@2x.png);
}
</style>
