
const fetchData = {
  get: function (url, data, baseUrl) {
    return this.send('get', url, data, baseUrl)
  },
  post: function (url, data, baseUrl) {
    return this.send('post', url, data, baseUrl)
  },
  send: function (type, url, data, baseUrl) {
    if (!data) data = {} //兼容IE8
    let dtd = $.Deferred()
    baseUrl = baseUrl ? baseUrl : ''
    $.ajax({
      url: baseUrl + url,
      type: type,
      data: data,
      cache: false,
      timeout: 30000

    }).then(function (data) {
      data = JSON.parse(data)
      // if (data.code == 0) {
      //     dtd.resolve(data);
      // } else {
      //     dtd.reject(data);
      // }
      dtd.resolve(data)
    }, function (error) {
      console.log('请求接口失败')
      dtd.reject(error)
    })
    return dtd.promise()
  }
}

const getUrlParams = function (url, str) {
  if (
    !url || !str ||
    typeof url !== 'string' || typeof str !== 'string'
  ) {
    console.error('getUrlParams传参错误')
    return
  }

  url = url.split('?')[1]
  if (url) {
    let reg = new RegExp('(^|&)' + str + '=([^&]*)(&|$)', 'i')
    let r = url.match(reg)
    if (r != null) return unescape(r[2])
  }
}

const setCookie = function (name, value, expires, path, domain, secure) {

  let cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value)
  if (expires instanceof Date) {
    cookieText += ';expires=' + expires.toGMTString()
  }
  if (typeof expires == 'number') {
    let cookieTime = new Date()
    cookieTime.setTime(cookieTime.getTime() + expires * 1000)
    cookieText += ';expires=' + cookieTime
  }
  if (path) {
    cookieText += ';path=' + path
  }
  if (domain) {
    cookieText += ';domain=' + domain
  }
  if (secure) {
    cookieText += ';secure'
  }
  document.cookie = cookieText
}

const getCookie = function (name) {
  let cookieName = encodeURIComponent(name) + '=',
    cookieStart = document.cookie.indexOf(cookieName),
    cookieValue = null
  if (cookieStart > -1) {
    let cookieEnd = document.cookie.indexOf(';', cookieStart)
    if (cookieEnd == -1) {
      cookieEnd = document.cookie.length
    }
    cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd))
  }
  return cookieValue
}

// 防抖, 将高频操作只处理执行最后一次
const debounce = function (fn, delay = 10) {
  let timer = null
  return function (...args) {
    const context = this
    if (timer) clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}
// 节流 降低高频操作，每隔一段时间触发
const throttle = function (fn, wait = 10) {
  let last = 0
  return function (...args) {
    let now = +new Date()
    const context = this
    if (now - last > wait) {
      fn.apply(context, args)
      last = now
    }
  }
}
// 深克隆
const deepClone = function(source) {
  let target = Array.isArray(source) ? [] : {}
  for(const key in source) {
    if(Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = typeof source[key] ? deepClone(source[key]) : source[key]
    }
  }
  return target
}
module.exports = {
  fetchData, getUrlParams, getCookie, setCookie, debounce, throttle, deepClone
}