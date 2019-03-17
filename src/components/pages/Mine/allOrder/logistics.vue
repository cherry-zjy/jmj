<template>
  <div class="root">
    <div class="top">
      <div class="info">
        <div class="left">
          <img :src="CheckLogistics.Image" alt>
        </div>
        <div class="left pList">
          <p>
            物流状态：
            <span v-if="CheckLogistics.logisticsdata.Status === 0">物流单号暂无结果</span>
            <span v-else-if="CheckLogistics.logisticsdata.Status === 3">在途</span>
            <span v-else-if="CheckLogistics.logisticsdata.Status === 4">揽件</span>
            <span v-else-if="CheckLogistics.logisticsdata.Status === 5">疑难</span>
            <span v-else-if="CheckLogistics.logisticsdata.Status === 6">签收</span>
            <span v-else-if="CheckLogistics.logisticsdata.Status === 7">退签</span>
            <span v-else-if="CheckLogistics.logisticsdata.Status === 8">派件</span>
            <span v-else-if="CheckLogistics.logisticsdata.Status === 9">退回</span>
            <span v-else>异常状态</span>
          </p>
          <p>快递公司：{{CheckLogistics.logisticsdata.Company}}</p>
          <p>运单编号：{{CheckLogistics.logisticsdata.Number}}</p>
        </div>
        <div class="clear"></div>
      </div>
      <div class="line"></div>
    </div>
    <div class="list">
      <div>
        <ul class="ivu-timeline">
          <li
            class="ivu-timeline-item"
            :class="i === 0?'ivu-timeline-item-one':''"
            v-for="(l,i) in CheckLogistics.logisticsdata.DataList"
            :key="i"
          >
            <div
              class="ivu-timeline-item-tail"
              v-if="i !== CheckLogistics.logisticsdata.DataList.length-1"
            ></div>
            <div class="ivu-timeline-item-head"></div>
            <div class="ivu-timeline-item-head-box" v-if="i === 0"></div>
            <div
              class="ivu-timeline-item-content"
              :class="i === CheckLogistics.logisticsdata.DataList.length-1?'ivu-timeline-item-last-content':''"
            >
              <p class="time">{{l.context}}</p>
              <p class="content">{{l.time}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'

export default {
  data () {
    return {
      CheckLogistics: {}
    }
  },
  components: {Toast},
  methods: {
    // 查看物流
    CancellationOfOrder (id) {
      this.$http.get('/api/User/CheckLogistics', {
        Token: this.$store.state.token || localStorage.getItem('token'),
        OrderID: id
      })
        .then(res => {
          if (res.Result.logisticsdata) {
            this.CheckLogistics = res.Result
          } else {
            Toast('查询物流失败')
          }
        })
    }
  },
  mounted () {
    this.CancellationOfOrder(this.$route.params.id)
  }
}

</script>
<style scoped lang='scss'>
.top {
  .info {
    background-color: #fff;
    height: 2.4rem;

    padding: 0.265rem;
    .left {
      margin-right: 0.265rem;
      height: 100%;
      img {
        height: 100%;
      }
    }
    .pList {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      p {
        font-size: 0.373rem;
        color: #808080;
      }
      p:nth-child(1) {
        font-size: 0.4rem;
        color: #262626;
        span {
          color: #f7b500;
        }
      }
    }
  }
  .line {
    width: 100%;
    height: 0.265rem;
    background: #faf9f7;
  }
}
.list {
  padding: 0.4rem 0.265rem;
  background-color: #fff;
  font-size: 0.374rem;
  color: #999;
  .ivu-timeline {
    list-style: none;
    margin: 0;
    padding: 0;
    // 正常数据 定位
    .ivu-timeline-item {
      margin: 0 !important;
      padding: 0 0 12px 0;
      list-style: none;
      position: relative;
      .ivu-timeline-item-tail {
        height: 100%;
        border-left: 1px solid #efefef;
        position: absolute;
        left: 0.133rem;
        top: 0;
      }
      .ivu-timeline-item-head-blue {
        background-color: #cfcfcf;
      }
      .ivu-timeline-item-head {
        width: 0.266rem;
        height: 0.266rem;
        border-radius: 50%;
        background-color: #cfcfcf;
        position: absolute;
      }
      .ivu-timeline-item-content {
        padding: 1px 1px 0.266rem 0;
        margin-left: 0.64rem;
        border-bottom: 1px solid #efefef;
        font-size: 0.3733rem;
        position: relative;
        top: -3px;
        p{
          line-height: 0.65rem;
        }
      }
    }
    // 第一条数据黄点
    .ivu-timeline-item-one {
      .ivu-timeline-item-head {
        background-color: #f7b500;
      }
      .ivu-timeline-item-head-box {
        width: 0.533rem;
        height: 0.533rem;
        border-radius: 50%;
        background-color: #f7b500;
        opacity: 0.2;
        position: absolute;
        left: -0.133rem;
        top: -0.133rem;
      }
    }
    // 最后一条数据 无下划线
    .ivu-timeline-item-last-content {
      margin-left: 0 !important;
      padding: 1px 1px 0.266rem 0.64rem !important;
      border-bottom: none !important;
    }
  }
}
</style>
