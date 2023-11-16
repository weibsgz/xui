import '@/assets/css/common.scss'
import './index.scss'

/**
 * 顶部的请提示效果
 * @example
 * new xTip(options);
 * options => {
 * position: top | center
 * status: info | success | warning | danger
 * content: '修改成功'
 * }
 * 快捷方式：
 * new xTip().info(content, duration);
 * new xTip().success(content, duration);
 * new xTip().warning(content, duration);
 **/
module.exports = class xTip {
  constructor(options) {
    // 默认参数
    const defaults = {
      // info 为黑色显示
      // 还支持success和warning danger
      status: 'info',
      duration: 2000,
      position: 'top'
    }
    this.typeTips = ['info', 'success', 'warning', 'danger']
    // 清除定时器
    this.timerRemove = null
    this.tipZindex = 100
    // 合并参数
    this.element = ''
    this.params = Object.assign({}, defaults, options || {})
    this.show()
    this.generateTipsfun()
  }
  // 显示tips
  show() {
    const opt = this.params
    if (!opt.content) return
    if(typeof opt.duration !== 'number') return
    // 创建元素，追加到body 中
    this.element = document.createElement('a')
    this.element.href = 'javascript:'
    this.element.className = `x-tips x-tips--${opt.status}  x-tips--${opt.position}`
    this.element.text = opt.content
    document.body.appendChild(this.element)
    // 清除定时器
    clearTimeout(this.timerRemove)
    // 设置 zIndex
    this.setTipsZindex()
    // 显示后，自动消失
    this.timerRemove = setTimeout(function () {
      this.remove()
    }.bind(this), opt.duration)
  } 
  // 移除tips
  remove() {
    let eleContainer = this.element
    if (eleContainer && eleContainer.remove) {
      clearTimeout(this.timerRemove)
      eleContainer.remove()
    }
  }
  // 设置tips zIndex 
  setTipsZindex() {
    let eleContainer = this.element
    let eleStyle = window.getComputedStyle(eleContainer)
    // 用来对比的层级，也是最小层级
    let tipsZindex = 99
    // 获取所有便签元素的 z-idex, 以便tips 要高于这些元素的 z-index
    document.body.childNodes.forEach(function (eleChild) {
      if (eleChild.nodeType !== 1) return
      let eleChildStyle = window.getComputedStyle(eleChild)
      let eleChildzIndex = eleChildStyle.zIndex * 1
      if (eleChildzIndex && eleContainer !== eleChild) {
        tipsZindex = Math.max(eleChildzIndex + 1, tipsZindex)
      }
    })
    // 新增加每个tips 的z-index
    eleContainer.style.zIndex = tipsZindex
  }
  generateTipsfun() {
    this.typeTips.forEach((type) => {
      this[type] = function (content, duration) {
        if (typeof content !== 'string') return
        this.params.content = content
        this.params.status = type
        if (duration && typeof duration === 'number') {
          this.params.duration = duration
        }
        this.show()
      }
    })
  }
}