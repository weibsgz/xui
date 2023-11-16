import '@/assets/css/common.scss'
import './index.scss'
import { throttle } from '@/assets/js/utils.js'
module.exports = class xStickTop {
  constructor(options) {
    if (!options.titleEleContainer || !options.container) return
    this.titleEleContainer = options.titleEleContainer
    this.container = options.container
    this.container.append('<div id="fix-topTitle"></div>')
    this.topTitle = $('#fix-topTitle')
    this.titleAry = []
    this.init()
  }
  init() {
    for (let i = 0; i < this.titleEleContainer.length; i++) {
      const element = $(this.titleEleContainer[i])
      this.titleAry.push({
        title: element.attr('data-title'),
        top: element.offset().top,
        index: i
      })
    }
    const rollFn = throttle(this.roll.bind(this), 30)
    document.addEventListener('scroll', rollFn)
  }
  roll() {
    const scrollTop = $(document).scrollTop()
    for (let index = 0; index < this.titleAry.length; index++) {
      const current = this.titleAry[index]
      const next = this.titleAry[index + 1]
      const lastEle = this.titleAry[this.titleAry.length - 1]
      // 向上滚动为0时
      if (scrollTop <= this.titleAry[0].top || scrollTop < 100) {
        this.topTitle.hide()
      }
      // 滚动距离大于最后一个元素
      if (scrollTop >= lastEle.top) {
        this.topTitle.html(lastEle.title)
        this.titleEleContainer.eq(lastEle.index).addClass('fix--top')
      } else {
        this.titleEleContainer.eq(lastEle.index).removeClass('fix--top')
      }
      // 正常滚动
      if (next && scrollTop > current.top && scrollTop < next.top) {
        this.topTitle.show().html(current.title)
      }
    }
  }
}