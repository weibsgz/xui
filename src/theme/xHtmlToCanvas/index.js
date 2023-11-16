import '@/assets/css/common.scss'
import './index.scss'

let HtmlToCanvas = (module.exports = function (options, callback) {
  this.defaults = {
    tpl: '', //传入的模板 可以是 字符串形式  DOM对象
    params: {
      // htmltoCanvas的参数 见API
      allowTaint: true,
      backgroundColor: 'null',
      useCORS: true
    },
    //转换的图片属性
    imgConf: {
      type: 'png',
      quality: 0.92
    }
  }

  if (!options.tpl) {
    console.error('renderDom2Canvas组件html模板没传')
    return false
  }

  this.options = Object.assign({}, this.defaults, options)

  if (this.options.imgConf.type === 'jpg') {
    this.options.imgConf.type = 'jpeg'
  }

  this.init(callback)
})

HtmlToCanvas.prototype = {
  init: function (callback) {
    let _this = this
    if (typeof html2canvas !== 'function') {
      this.loadScript(
        'http://asserts.xcarimg.com/resource/other/haibao/js/html2canvas.min.js',
        function () {
          _this.run(callback)
        }
      )
    }

    // typeof callback === 'function' &&
    //   callback({ base64: base64, file: file }, this.download(base64, filename))
  },
  run: function (callback) {
    //传入的TPL分为3种形式  1. 字符串拼接的  2. JQUERY DOM  3. 原生的DOM   （document.querySelector）
    //如果是字符串形式的 需要生成个空DIV 插入这些字符串插入到网页中 才能生成canvas
    let $selector = null
    let _this = this

    let isDOM = this.isDom(this.options.tpl)
    if (!isDOM) {
      this.parseDom(this.options.tpl)
      $selector = document.querySelector('.captureImg')
    } else {
      //html2canvas 的第一个参数只能是原生DOM 所以如果是JQ DOM 需要取[0]
      $selector = this.isJQueryDom(this.options.tpl)
        ? this.options.tpl[0]
        : this.options.tpl
    }

    // console.log('isDom', isDOM, '$selector', $selector)

    //插件提供的核心方法html2canvas
    html2canvas($selector, _this.options.params).then(function (canvas) {
      let ext = '',
        base64 = '',
        filename = '',
        file = '',
        quality = 0.92
      console.log(_this.options.params)
      if (
        _this.options.imgConf.type === 'jpeg' ||
        _this.options.imgConf.type === 'jpg' ||
        _this.options.imgConf.type === 'webp'
      ) {
        ext = _this.options.imgConf.type === 'webp' ? '.webp' : '.jpg'
        if (
          _this.options.imgConf.quality >= 0 &&
          _this.options.imgConf.quality <= 1
        ) {
          quality = _this.options.imgConf.quality
        }
        base64 = canvas.toDataURL(
          'image/' + _this.options.imgConf.type,
          quality
        )
      } else {
        base64 = canvas.toDataURL('image/png')
        ext = '.png'
      }
      filename = Date.now() + ext // 文件名
      file = _this.dataURLtoFile(base64, filename) // base64 转为 File 对象
      typeof callback === 'function' &&
        callback(
          { base64: base64, file: file },
          _this.download.bind(null, base64, filename)
        )

      !isDOM && document.querySelector('.captureImg').remove() // 是字符串插入的 需要移除模板
    })
  },
  loadScript: function (url, callBack) {
    if (!/^((https?)?:)?\/\/.*/gim.test(url)) {
      console.log('url 不正确...')
      return false
    }
    const headDOM = document.getElementsByTagName('head')[0]
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onload = script.onreadystatechange = function () {
      if (
        !this.readyState ||
        this.readyState === 'loaded' ||
        this.readyState === 'complete'
      ) {
        callBack && callBack()
        script.onload = script.onreadystatechange = null // Handle memory leak in IE
      }
    }
    script.src = url
    headDOM.appendChild(script)
  },
  //下载图片
  download: function (base64, filename) {
    let saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
    let event = document.createEvent('MouseEvents')
    saveLink.href = base64
    saveLink.download = filename
    event.initMouseEvent(
      'click',
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    )
    saveLink.dispatchEvent(event)
  },
  //转为formData形式
  dataURLtoFile: function (dataUrl, filename) {
    let arr = dataUrl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  },
  //判断是否是JQUEY DOM 对象或者 是原生的DOM的对象
  isDom(obj) {
    if (!obj) return false
    return obj instanceof Element || obj[0] instanceof Element
  },
  //判断是JQUERY 对象还是DOM原生对象
  isJQueryDom(obj) {
    if (!obj) return false
    return !(obj instanceof Element)
  },

  //字符串转DOM对象 将字符串放入一个DOM对象插入页面中，好生成图片用，要不没有样式
  parseDom(nodelist) {
    console.log('模板是字符串')
    let objE = document.createElement('div')
    objE.style.cssText = 'position:absolute;top:-99999px;'
    objE.className = 'captureImg'
    objE.innerHTML = nodelist
    document.body.appendChild(objE)
  }
}
