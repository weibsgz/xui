import '@/assets/css/common.scss'
import './index.scss'
const Message = (module.exports = function (option = {}) {
  this.opts = Object.assign(
    {
      content: '',
      theme: '',
      closeTime: 3000,
      wrap: $('body'),
      width: '',
      height: '',
      top: '50',
      left: '',
      theme: 'default',
      isAnimation: true
    },
    option || {}
  )
})
Message.prototype.message = function (option) {
  return new Promise((resolve, reject) => {
    const opts = Object.assign({}, this.opts, option)
    let str = `<div class="messageWrap  ${opts.theme} ${opts.type}Msg"><div> ${opts.content}</div></div>`
    const $str = $(str)
    opts.wrap.append($str)
    if (opts.isAnimation) {
      $str.stop().animate(
        {
          top: opts.top + 'px'
        },
        200,
        function () {
          setTimeout(function () {
            $str.remove()
            resolve()
          }, Number(opts.closeTime || 3000))
        }
      )
    } else {
      $str.css({
        top: opts.top + 'px'
      })
    }
  })
}
Message.prototype.success = function (msg, option) {
  const obj = $.extend(
    {
      msg: msg
    },
    this.opts,
    option || {
      type: 'success'
    }
  )
  obj.content = '<i class="successIcon"></i> <span>' + obj.msg + '</span>'
  this.message(obj)
}
Message.prototype.wain = function (msg, option) {
  const obj = $.extend(
    {
      msg: msg
    },
    this.opts,
    option || {
      type: 'wain'
    }
  )
  obj.content = '<i class="wainIcon"></i> <span>' + obj.msg + '</span>'
  this.message(obj)
}
Message.prototype.error = function (msg, option) {
  const obj = $.extend(
    {
      msg: msg
    },
    this.opts,
    option || {
      type: 'error'
    }
  )
  obj.content = '<i class="errorIcon"></i> <span>' + obj.msg + '</span>'
  this.message(obj)
}
