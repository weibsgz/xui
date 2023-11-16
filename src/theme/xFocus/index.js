import '@/assets/css/common.scss'
import './index.scss'
import '@/assets/js/init.js'

import sliderImg from './sliderImgTpl.art'

const xFocus = module.exports = function(opts) {
  if (!opts.dom) {
    console.log('dom选择器选择错误!')
  }
  opts.TextChangHeight = opts.TextChangHeight ? parseInt(opts.TextChangHeight) : 40
  let imgHtml = sliderImg(opts)
  $(opts.dom).html(imgHtml)
  this.Menu = $(opts.dom + ' .slider li') //圆点菜单
  this.Con = $(opts.dom + ' .view li') //大图
  this.Text = $(opts.dom + ' .text li') //图注文字
  this.TextBox = $(opts.dom + ' .text') //图注文字盒子
  this.Prev = $(opts.dom + ' .prev') //上一页
  this.Next = $(opts.dom + ' .next') //下一页
  this.Counts = $(this.Con).size() //获取li总数
  this.nowIndex = 0
  this.timer = null
  this.defaults = {}
  this.options = $.extend(true, {}, this.defaults, opts)
  this.init()
}
xFocus.prototype.init = function () {
  let opts = this.options
  opts.TextChang.TextBoxPos == 'bottom' ? $(opts.dom).find('.view').css({ height: $(opts.dom).height() - 40 + 'px' }) : $(opts.Box).find('.view').css({ height: $(opts.Box).height() + 'px' })
  if (this.Counts == 1) {
    return false
  }
  $(this.Prev).add(this.Next).find('em').html(1).end().find('i').html(this.Counts)
  this.setAuto()
  this.checkClick()
}
xFocus.prototype.setAuto = function () {
  let _this = this
  let opts = this.options
  console.log(opts.hasOwnProperty('speed'))
  if (this.Counts > 1) {
    this.timer = setInterval(function () {
      _this.gotoR(_this)
    }, opts.hasOwnProperty('speed') ? opts.speed : 3000)
  }

}
xFocus.prototype.gotoR = function (_this) {
  _this.nowIndex++
  if (_this.nowIndex > _this.Counts - 1) {
    _this.nowIndex = 0
  }
  _this.gotoPage(_this.nowIndex)
}
/* 打开相应的标签 */
xFocus.prototype.gotoPage = function (i) {
  $(this.Con).eq(i).fadeIn(200).siblings().fadeOut(200)
  $(this.Text).eq(i).fadeIn(200).siblings().hide()
  $(this.Menu).eq(i).addClass('current').siblings().removeClass('current')
  this.nowIndex = i
  $(this.Prev).add(this.Next).find('em').html(i + 1).end().find('i').html(this.Counts)
}
xFocus.prototype.checkClick = function () {
  let Thit = this
  let opts = this.options
  /* 点击切换 */
  $(Thit.Menu).click(function () {
    let i = $(Thit.Menu).index(this)
    Thit.gotoPage(i)
  })
  /* 鼠标经过暂停，离开继续轮播 */
  $(opts.dom).hover(function () {
    $(Thit.Prev).add(Thit.Next).show()
    if (!1) {
      $(Thit.TextBox).show()
    }
    if (Thit.timer) {
      clearInterval(Thit.timer)
    }
  }, function () {
    $(Thit.Prev).add(Thit.Next).hide()
    if (!1) {
      $(Thit.TextBox).hide()
    }
    Thit.setAuto()
  }),
  /* 下一页 */
  $(Thit.Next).click(function () {
    Thit.gotoR(Thit)
  }),

  /* 上一页 */
  $(Thit.Prev).click(function () {
    Thit.nowIndex--
    if (Thit.nowIndex < 0) {
      Thit.nowIndex = Thit.Counts - 1
    }
    Thit.gotoPage(Thit.nowIndex)
  }),
  /* 鼠标经过按钮展开 */
  $(Thit.Prev).add(Thit.Next).hover(function () {
    $(this).stop().animate({
      width: '80px'
    }, 200)
  }, function () {
    $(this).stop().animate({
      width: '40px'
    }, 200)
  })
}