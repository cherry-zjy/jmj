exports.install = function (Vue, options) {
  Vue.prototype.changeData = function (val) {
    var time = parseInt(val)
    var sN = '' // 秒
    var mN = '' // 分
    var hN = '' // 时
    sN = time < 10 ? '0' + String(time) : time
    if (parseInt(val) > 60) {
      var second = parseInt(val) % 60
      sN = second < 10 ? '0' + String(second) : second
      var min = parseInt(val / 60)
      mN = min < 10 ? '0' + String(min) : min
      if (min > 60) {
        min = parseInt(val / 60) % 60
        var hour = parseInt(parseInt(val / 60) / 60)
        mN = min < 10 ? '0' + String(min) : min
        hN = hour < 10 ? '0' + String(hour) : hour
        return hN + '-' + mN + '-' + sN
      } else {
        return '00-' + mN + '-' + sN
      }
    } else {
      return '00-00-' + sN
    }
  }

  // 将时间戳转化为时间
  Vue.prototype.formatDateTime = function (timeStamp) {
    var date = new Date()
    date.setTime(timeStamp)
    var y = date.getFullYear()
    var m = date.getMonth() + 1
    m = m < 10 ? '0' + m : m
    var d = date.getDate()
    d = d < 10 ? '0' + d : d
    var h = date.getHours()
    h = h < 10 ? '0' + h : h
    var minute = date.getMinutes()
    var second = date.getSeconds()
    minute = minute < 10 ? '0' + minute : minute
    second = second < 10 ? '0' + second : second
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
  }
  // 获取当前日期 格式为 2018-09-19 00:00:00
  Vue.prototype.getNowDate = function (num) {
    var now = new Date()
    var year = now.getFullYear() // 年
    var month = now.getMonth() + 1 // 月
    var day = now.getDate() // 日
    var hh = now.getHours() // 时
    var mm = now.getMinutes() // 分
    var ss = now.getSeconds() // 秒

    // 判断是否为当前日，如果不是则为明天零点
    if (num === 0) {
      var clock0 = year + '-'
      if (month < 10) clock0 += '0'
      clock0 += month + '-'
      if (day < 10) clock0 += '0'
      clock0 += day + ' '
      if (hh < 10) clock0 += '0'
      clock0 += hh + ':'
      if (mm < 10) clock0 += '0'
      clock0 += mm + ':'
      if (ss < 10) clock0 += '0'
      clock0 += ss
      return clock0
    } else {
      var clock = year + '-'
      if (month < 10) clock += '0'
      clock += month + '-'
      if (day < 10) clock += '0'
      clock += day + num + ' '
      if (hh < 10) clock += '00:'
      clock += '00:'
      if (mm < 10) clock += '00:'
      clock += '00:'
      if (ss < 10) clock += '00'
      clock += '00'
      return clock
    }
  }
}
