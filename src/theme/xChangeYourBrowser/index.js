import '@/assets/css/common.scss'
import './index.scss'

/* eslint-disable*/

let ChangeYourBrowser = (module.exports = function () {
  this.init()
})

ChangeYourBrowser.prototype = {
  init: function () {
    let userAgent = navigator.userAgent
    let isIE = false
    let browserVersion = ''
    let tips = ''

    if (userAgent.indexOf('Firefox') !== -1) {
      browserVersion = userAgent.match(/Firefox\/[\d.]+/gi)[0]
    } else if (userAgent.indexOf('Edge') !== -1) {
      browserVersion = userAgent.match(/Edge\/[\d.]+/gi)[0]
    } else if (userAgent.indexOf('Opera') !== -1) {
      browserVersion = userAgent.match(/Opera\/[\d.]+/gi)[0]
    } else if (userAgent.indexOf('Chrome') !== -1) {
      browserVersion = userAgent.match(/Chrome\/[\d.]+/gi)[0]
    } else if (userAgent.indexOf('Safari') !== -1) {
      browserVersion = userAgent.match(/Safari\/[\d.]+/gi)[0]
    } else if (
      userAgent.indexOf('MSIE') !== -1 ||
      userAgent.indexOf('Trident') !== -1
    ) {
      isIE = true
      browserVersion =
        'IE ' +
        (userAgent.indexOf('MSIE') !== -1
          ? userAgent.match(/MSIE\s*[\d.]+/gi)[0].match(/[\d.]+/)[0]
          : userAgent.indexOf('Trident') !== -1
          ? parseInt(userAgent.match(/Trident\/[\d.]+/gi)[0].match(/[\d.]+/)) +
            4
          : '')
    }

    console.log('browserVersion!!!!!', browserVersion)

    if (isIE && browserVersion.match(/[\d.]+/)[0] < 10) {
      var oDiv = document.createElement('div')
      oDiv.innerHTML =
        '<div class="ie-warning">' +
        '<div class="ie-warning-box">' +
        '<p class="ie-warning-title">当前浏览器版本过低，将无法正常访问</p>' +
        '<p class="ie-warning-text">推荐使用新版 <a href="https://www.google.cn/chrome/" target="_blank">Chrome</a>、<a href="https://www.firefox.com.cn/" target="_blank">FireFox</a> 、<a href="https://www.microsoft.com/zh-cn/edge" target="_blank">Edge</a> 等浏览器</p>' +
        '</div>' +
        '<div class="ie-warning-close" id="ie-warning-close"><span></span></div>'
      ;('</div>')
      document.body.appendChild(oDiv)

      document.getElementById('ie-warning-close').addEventListener(
        'click',
        function () {
          document.querySelector('.ie-warning').style.display = 'none'
        },
        false
      )
    }
  }
}

new ChangeYourBrowser()
