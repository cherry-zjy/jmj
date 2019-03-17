import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
// import store from '../store/index'

Vue.use(Router)

export default new Router({
  scrollBehavior (to, from, savedPosition) {
    // console.log(store.state.scrollNum)
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    // 路由重定向
    {
      path: '/',
      redirect: '/dailygbuy'
    },
    {
      path: '/author/:code?',
      name: 'author',
      component: resolve =>
        require(['../components/pages/author.vue'], resolve),
      meta: {
        title: '登录启动',
        keepAlive: false
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: resolve => require(['../components/pages/Login.vue'], resolve),
      meta: {
        title: '密码登录',
        keepAlive: false
      }
    },
    {
      path: '/bindphone/:code?',
      name: 'bindPhone',
      component: resolve =>
        require(['../components/pages/bindPhone.vue'], resolve),
      meta: {
        title: '绑定手机号',
        keepAlive: false
      }
    },
    {
      path: '/register/:code?',
      name: 'register',
      component: resolve =>
        require(['../components/pages/register.vue'], resolve),
      meta: {
        title: '注册',
        keepAlive: false
      }
    },
    {
      path: '/forgetpsw',
      name: 'forgetPsw',
      component: resolve =>
        require(['../components/pages/forgetPsw.vue'], resolve),
      meta: {
        title: '忘记密码',
        keepAlive: false
      }
    },
    {
      path: '/changepsw',
      name: 'changePsw',
      component: resolve =>
        require(['../components/pages/changePsw.vue'], resolve),
      meta: {
        title: '修改密码',
        keepAlive: false
      }
    },
    // 每日团购--------------------------------------------------------------------
    {
      path: '/dailygbuy',
      name: 'DailyGBuy',
      component: resolve =>
        require(['../components/pages/DailyGBuy/index.vue'], resolve),
      meta: {
        title: '每日团购',
        keepAlive: true
      }
    },
    // 每日团购，积分兑换
    {
      path: '/bankcard/conversion/:iscoming?',
      name: 'Conversion',
      component: resolve =>
        require([
          '../components/pages/DailyGBuy/bankCard/conversion.vue'
        ], resolve),
      meta: {
        title: '银行卡积分换取余额',
        keepAlive: false
      }
    },
    // 每日团购，报单
    {
      path: '/bankcard/conver/bill/:id/:iscoming?',
      name: 'Bill',
      component: resolve =>
        require(['../components/pages/DailyGBuy/bankCard/bill.vue'], resolve),
      meta: {
        title: '报单',
        keepAlive: false
      }
    },
    // 每日团购，报单填写
    {
      path: '/bankcard/conversion/bill/fillin/:id',
      name: 'FillIn',
      component: resolve =>
        require([
          '../components/pages/DailyGBuy/bankCard/uploadBill.vue'
        ], resolve),
      meta: {
        title: '上传凭证',
        keepAlive: false
      }
    },
    // 每日团购，报单填写成功
    {
      path: '/bill/fillin/success',
      name: 'success',
      component: resolve =>
        require([
          '../components/pages/DailyGBuy/bankCard/success.vue'
        ], resolve),
      meta: {
        title: '上传成功',
        keepAlive: false
      }
    },
    // 发现--------------------------------------------------------------------
    {
      path: '/find',
      name: 'Find',
      component: resolve =>
        require(['../components/pages/Find/index.vue'], resolve),
      meta: {
        title: '发现',
        keepAlive: true
      }
    },
    // 发现
    {
      path: '/findlist/finddetail/:id',
      name: 'findDetail',
      component: resolve =>
        require(['../components/pages/Find/finddetail.vue'], resolve),
      meta: {
        title: '动态详情',
        keepAlive: false
      }
    },
    // 首页--------------------------------------------------------------------
    {
      path: '/home',
      name: '首页',
      component: resolve =>
        require(['../components/pages/Home/index.vue'], resolve),
      meta: {
        title: '首页',
        keepAlive: true
      }
    },
    // 搜索页面
    {
      path: '/home/searchpage',
      name: 'searchpage',
      meta: {
        title: '搜索页',
        keepAlive: false
      },
      component: resolve =>
        require(['../components/pages/Home/searchPage.vue'], resolve)
    },
    {
      path: '/home/searchpage/searchgoods/:keywords',
      name: 'searchgoods',
      meta: {
        title: '搜索详情',
        keepAlive: true
      },
      component: resolve =>
        require(['../components/pages/Home/searchGoods.vue'], resolve)
    },
    // 消息页面
    {
      path: '/home/messages',
      name: '消息',
      meta: {
        title: '消息',
        keepAlive: false
      },
      component: resolve =>
        require(['../components/pages/Home/msg/messages.vue'], resolve)
    },
    // 消息列表
    {
      path: '/home/messages/:msg/:type',
      name: '消息列表',
      meta: {
        title: '消息列表',
        keepAlive: false
      },
      component: resolve =>
        require(['../components/pages/Home/msg/msgList.vue'], resolve)
    },
    // 平台消息详情
    {
      path: '/home/messages/msglist/:type/:id',
      name: '平台消息',
      meta: {
        title: '平台消息',
        keepAlive: false
      },
      component: resolve =>
        require(['../components/pages/Home/msg/msgDetail.vue'], resolve)
    },
    // 普通商品  empty : 0 售空  1未
    {
      path: '/nomalgoods/goodsdetail/:empty/:id/:commonID?',
      name: '普通商品详情',
      meta: {
        title: '商品详情',
        keepAlive: false
      },
      component: resolve =>
        require([
          '../components/pages/Home/nomalGoods/goodsDetail.vue'
        ], resolve)
    },
    // 提交订单
    {
      path: '/nomalgoods/suborder/:empty/:id',
      name: '提交订单',
      meta: {
        title: '提交订单',
        keepAlive: false
      },
      component: resolve =>
        require(['../components/pages/Home/nomalGoods/subOrder.vue'], resolve)
    },
    // 每周免单商品----
    {
      path: '/home/freelist',
      name: '每周免单',
      meta: {
        title: '每周免单',
        keepAlive: false
      },
      component: resolve =>
        require(['../components/pages/Home/weekFree/freeList.vue'], resolve)
    },
    // 关于每周免单
    {
      path: '/freelist/about',
      name: '关于每周免单',
      meta: {
        title: '关于每周免单',
        keepAlive: false
      },
      component: resolve =>
        require(['../components/pages/Home/weekFree/helpAbout.vue'], resolve)
    },
    // 每周免单/每日团购商品
    {
      path: '/goods/goodsdetail/:type/:id/:commonID?/:iscoming?',
      name: '团购商品详情',
      meta: {
        title: '商品详情',
        keepAlive: false
      },
      component: resolve =>
        require([
          '../components/pages/Home/dailyGoods/goodsDetail.vue'
        ], resolve)
    },
    // 提交订单
    {
      path: '/goods/suborder/:type/:id',
      name: '每周免单提交订单',
      meta: {
        title: '提交订单',
        keepAlive: false
      },
      component: resolve =>
        require(['../components/pages/Home/dailyGoods/subOrder.vue'], resolve)
    },
    // 提交订单
    {
      path: '/goods/suborder/success',
      name: '提交订单成功',
      meta: {
        title: '提交订单成功',
        keepAlive: false
      },
      component: resolve =>
        require([
          '../components/pages/Home/dailyGoods/dailySuccess.vue'
        ], resolve)
    },
    // 商品类目 点击
    {
      path: '/goodtype/:type/:id',
      name: '商品类目',
      meta: {
        title: '商品类目',
        keepAlive: true
      },
      component: resolve =>
        require(['../components/pages/Home/goodType/goodType.vue'], resolve)
    },
    // 99选2
    {
      path: '/home/two99',
      name: '打包一口价',
      meta: {
        title: '打包一口价',
        keepAlive: true
      },
      component: resolve =>
        require(['../components/pages/Home/fixedPrice/twoNine.vue'], resolve)
    },
    {
      path: '/two99/goodsinfo/:id/:commonID?',
      name: '商品详情',
      meta: {
        title: '商品详情',
        keepAlive: false
      },
      component: resolve =>
        require(['../components/pages/Home/fixedPrice/goodsInfo.vue'], resolve)
    },
    // 购物车--------------------------------------------------------------------
    {
      path: '/shopping',
      name: 'Shopping',
      component: resolve =>
        require(['../components/pages/Shopping/index.vue'], resolve),
      meta: {
        title: '购物车',
        keepAlive: true
      }
    },
    {
      path: '/shopping/suborder/:id',
      name: 'shoppingOrder',
      component: resolve =>
        require(['../components/pages/Shopping/subOrder.vue'], resolve),
      meta: {
        title: '提交订单',
        keepAlive: false
      }
    },
    // 个人--------------------------------------------------------------------
    {
      path: '/mine',
      name: 'Mine',
      component: resolve =>
        require(['../components/pages/Mine/index.vue'], resolve),
      meta: {
        title: '个人',
        keepAlive: false
      }
    },
    // 我的订单
    {
      path: '/mine/orderlist/:type?',
      name: 'MyOrder',
      component: resolve =>
        require(['../components/pages/Mine/allOrder/index.vue'], resolve),
      meta: {
        title: '我的订单',
        keepAlive: false
      }
    },
    {
      path: '/mine/order/type/orderdetail',
      name: 'orderDetail',
      component: resolve =>
        require(['../components/pages/Mine/allOrder/orderDetail.vue'], resolve),
      meta: {
        title: '订单详情',
        keepAlive: false
      }
    },
    {
      path: '/mine/order/topay/:id',
      name: 'mySubOrder',
      component: resolve =>
        require(['../components/pages/Mine/allOrder/subOrder.vue'], resolve),
      meta: {
        title: '物流查询',
        keepAlive: false
      }
    },
    {
      path: '/mine/order/logistics/:id',
      name: 'logistics',
      component: resolve =>
        require(['../components/pages/Mine/allOrder/logistics.vue'], resolve),
      meta: {
        title: '物流查询',
        keepAlive: false
      }
    },
    {
      path: '/mine/order/cancelorder',
      name: 'cancelOrder',
      component: resolve =>
        require(['../components/pages/Mine/allOrder/cancelOrder.vue'], resolve),
      meta: {
        title: '取消订单',
        keepAlive: false
      }
    },
    {
      path: '/mine/order/returnorder',
      name: 'returnOrder',
      component: resolve =>
        require(['../components/pages/Mine/allOrder/returnOrder.vue'], resolve),
      meta: {
        title: '退货',
        keepAlive: false
      }
    },
    {
      path: '/mine/order/evaluate',
      name: 'evaluate',
      component: resolve =>
        require(['../components/pages/Mine/allOrder/evaluate.vue'], resolve),
      meta: {
        title: '订单评价',
        keepAlive: false
      }
    },
    {
      path: '/mine/order/evaluate/success',
      name: 'evaluateSuccess',
      component: resolve =>
        require([
          '../components/pages/Mine/allOrder/evaluateSuccess.vue'
        ], resolve),
      meta: {
        title: '评价成功',
        keepAlive: false
      }
    },
    // 个人信息
    {
      path: '/mine/info',
      name: 'MineInfo',
      component: resolve =>
        require(['../components/pages/Mine/myInfo/myInfo.vue'], resolve),
      meta: {
        title: '个人中心',
        keepAlive: false
      }
    },
    // 收货地址
    {
      path: '/mine/info/address/:order?',
      name: 'Address',
      component: resolve =>
        require(['../components/pages/Mine/myInfo/address.vue'], resolve),
      meta: {
        title: '收货地址',
        keepAlive: false
      }
    },
    {
      path: '/mine/address/edit/:type',
      name: 'AddressEdit',
      component: resolve =>
        require(['../components/pages/Mine/myInfo/addressEdit.vue'], resolve),
      meta: {
        title: '收货地址',
        keepAlive: false
      }
    },
    // 修改密码  0 密码修改 1 手机号验证修改
    {
      path: '/mine/editpsw/:type',
      name: 'editPsw',
      component: resolve =>
        require(['../components/pages/Mine/myInfo/editPsw.vue'], resolve),
      meta: {
        title: '密码',
        keepAlive: false
      }
    },
    {
      path: '/mine/editpsw1/:type',
      name: 'editPsw1',
      component: resolve =>
        require(['../components/pages/Mine/myInfo/editPsw.1.vue'], resolve),
      meta: {
        title: '密码',
        keepAlive: false
      }
    },
    // 身份认证  列表
    {
      path: '/mine/info/idcard/:order?',
      name: 'IDCardList',
      component: resolve =>
        require(['../components/pages/Mine/myInfo/IDCardList.vue'], resolve),
      meta: {
        title: '身份认证',
        keepAlive: false
      }
    },
    {
      path: '/mine/idcard/edit/:type',
      name: 'IDCardEdit',
      component: resolve =>
        require(['../components/pages/Mine/myInfo/IDCardEdit.vue'], resolve),
      meta: {
        title: '身份认证',
        keepAlive: false
      }
    },
    // 签到
    {
      path: '/mine/signin',
      name: 'signIn',
      component: resolve =>
        require(['../components/pages/Mine/signIn/index.vue'], resolve),
      meta: {
        title: '签到',
        keepAlive: false
      }
    },
    {
      path: '/mine/signin/:id',
      name: 'sublist',
      component: resolve =>
        require(['../components/pages/Mine/signIn/indexSub.vue'], resolve),
      meta: {
        title: '签到',
        keepAlive: false
      }
    },
    {
      path: '/mine/sign/success',
      name: 'signInSuccess',
      component: resolve =>
        require(['../components/pages/Mine/signIn/success.vue'], resolve),
      meta: {
        title: '返款成功',
        keepAlive: false
      }
    },
    {
      path: '/mine/income',
      name: 'inCome',
      component: resolve =>
        require(['../components/pages/Mine/income/index.vue'], resolve),
      meta: {
        title: '我的收益',
        keepAlive: false
      }
    },
    {
      path: '/mine/exchange',
      name: 'exchange',
      component: resolve =>
        require(['../components/pages/Mine/income/exchange.vue'], resolve),
      meta: {
        title: '信用卡积分兑换',
        keepAlive: false
      }
    },
    // 我的钱包
    {
      path: '/mine/wallet',
      name: 'wallet',
      component: resolve =>
        require(['../components/pages/Mine/wallet/index.vue'], resolve),
      meta: {
        title: '我的钱包',
        keepAlive: false
      }
    },
    {
      path: '/mine/wallet/balance',
      name: 'balance',
      component: resolve =>
        require([
          '../components/pages/Mine/wallet/priceList/balance.vue'
        ], resolve),
      meta: {
        title: '我的余额',
        keepAlive: false
      }
    },
    {
      path: '/mine/wallet/goldcoin',
      name: 'goldCoin',
      component: resolve =>
        require([
          '../components/pages/Mine/wallet/priceList/goldCoin.vue'
        ], resolve),
      meta: {
        title: '金币',
        keepAlive: false
      }
    },
    {
      path: '/mine/wallet/brokerage',
      name: 'brokerage',
      component: resolve =>
        require([
          '../components/pages/Mine/wallet/priceList/brokerage.vue'
        ], resolve),
      meta: {
        title: '待结算佣金',
        keepAlive: false
      }
    },
    {
      path: '/mine/wallet/coupon/:choice?',
      name: 'coupon',
      component: resolve =>
        require(['../components/pages/Mine/wallet/coupon.vue'], resolve),
      meta: {
        title: '我的优惠券',
        keepAlive: false
      }
    },
    {
      path: '/mine/wallet/redpacket/:choice?',
      name: 'redPacket',
      component: resolve =>
        require(['../components/pages/Mine/wallet/redPacket.vue'], resolve),
      meta: {
        title: '我的红包',
        keepAlive: false
      }
    },
    {
      path: '/mine/wallet/payin',
      name: 'payIn',
      component: resolve =>
        require(['../components/pages/Mine/wallet/payIn.vue'], resolve),
      meta: {
        title: '充值',
        keepAlive: false
      }
    },
    {
      path: '/mine/wallet/extract',
      name: 'extract',
      component: resolve =>
        require(['../components/pages/Mine/wallet/extract.vue'], resolve),
      meta: {
        title: '提现',
        keepAlive: false
      }
    },
    {
      path: '/mine/wallet/extract/success',
      name: 'extractSuccess',
      component: resolve =>
        require([
          '../components/pages/Mine/wallet/extractSuccess.vue'
        ], resolve),
      meta: {
        title: '提现成功',
        keepAlive: false
      }
    },
    {
      path: '/mine/wallet/payin/success',
      name: 'payInSuccess',
      component: resolve =>
        require(['../components/pages/Mine/wallet/payInSuccess.vue'], resolve),
      meta: {
        title: '充值成功',
        keepAlive: false
      }
    },
    {
      path: '/mine/generalize',
      name: 'generalize',
      component: resolve =>
        require(['../components/pages/Mine/orther/generalize.vue'], resolve),
      meta: {
        title: '我的推广码',
        keepAlive: false
      }
    },
    {
      path: '/mine/mygroup',
      name: 'mygroup',
      component: resolve =>
        require(['../components/pages/Mine/orther/myGroup.vue'], resolve),
      meta: {
        title: '我的团队',
        keepAlive: false
      }
    },
    {
      path: '/mine/collect',
      name: 'collect',
      component: resolve =>
        require(['../components/pages/Mine/orther/collect.vue'], resolve),
      meta: {
        title: '我的收藏',
        keepAlive: false
      }
    }
  ]
})
