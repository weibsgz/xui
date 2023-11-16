import '@/assets/css/common.scss'
import './index.scss'
import '@/assets/js/init.js'
import shareTemp from './template.art'
// function xShare(params) {
//   $('body').append(shareTemp)
//   $('#wx').hover(function (ev) {
//     let _url = window.location.href
//     let _href = 'http:' + _url.split(':')[1]
//     let urlEncode = encodeURIComponent(_href)
//     let $t = $(this).find('.li_box')
//     if ($t.find('img').attr('src').toLowerCase().indexOf('ps_logo.jpg') != -1) {
//       $t.find('img').attr('src',
//         'http://hezuo.xcar.com.cn/index.php?partner=qrcode&url=' + urlEncode)
//     }
//     $t.show()
//     ev.stopPropagation()
//   }, function () {
//     $(this).find('.li_box').hide()
//   })
// }
class xShare {
  constructor(opt) {
    this.opt = opt
    this.init()
  }
  init() {
    let _this = this
    let res = {
      right: _this.opt.right,
      bottom: _this.opt.bottom
    }
    let tmp = shareTemp(res)
    $('body').append(tmp)
    $('#wx').hover(function (ev) {
      let _url = window.location.href
      let _href = 'http:' + _url.split(':')[1]
      let urlEncode = encodeURIComponent(_href)
      let $t = $(this).find('.li_box_position')
      if ($t.find('img').attr('src').toLowerCase().indexOf('ps_logo.jpg') != -1) {
        $t.find('img').attr('src',
          'http://hezuo.xcar.com.cn/index.php?partner=qrcode&url=' + urlEncode)
      }
      $t.show()
      ev.stopPropagation()
    }, function () {
      $(this).find('.li_box_position').hide()
    })
  }
}
module.exports = xShare
