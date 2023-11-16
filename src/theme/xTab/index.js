import '@/assets/css/common.scss'
import './index.scss'

// import { fetchData } from '@/assets/js/utils.js'

module.exports = class xTab {
  /**
   * @method constructor 构造方法
   * @param {Object} opts 实例化参数
   */
  constructor(opts) {
    opts = $.extend(true, { /* tabFixedTop: false, */ tpl: null, tabBox: '', listBox: '', listUrl: '', renderType: 1 }, opts)
    if (!opts.listUrl || !opts.tabBox || !opts.listBox) {
      throw new TypeError('缺少参数listUrl, tabBox, listBox...')
    }
    this.$tabBox = $(opts.tabBox) // 标签容器
    this.$listBox = $(opts.listBox) // feed流列表
    this.listUrl = opts.listUrl // 接口地址
    this.tpl = opts.tpl // 模板
    this.config = {
      /* tabFixedTop: opts.tabFixedTop, */
      isLoadNew: opts.renderType === 0 ? true : false,  // 列表渲染方式: 0 -> 切换标签加载第一页最新数据，1 -> 切换标签当前列表后追加内容
      emptyMsg: opts.emptyMsg || '<div class="no_data"></div><p>暂无内容</p>', // 暂无内容提示信息
      stop: false, // 滚动加载节流标识
      isScroll: true // 记录当前行为是否为滚动行为
    }

    if (this.$tabBox.children().length !== 0) {
      let $active = this.$tabBox.find('.active')
      if ($active.length === 0) {
        this.$tabBox.children().eq(0).addClass('active').siblings().removeClass('active')
        $active = this.$tabBox.children().eq(0)
      }
      this.config.params = this.getAttr($active)
      this.bindEvent($active[0].nodeName) // 初始化事件绑定
    }
  }
  /**
   * @method addTab 添加标签
   * @param {String} html html标签字符串
   */
  addTab(html) {
    if (html == '') {
      throw new TypeError('参数类型必须可渲染为dom的类型...')
    }
    if (this.$tabBox.children().length !== 0) {
      this.$tabBox.append(html)
    } else {
      this.$listBox.html('') // 重置列表容器
      this.$tabBox.append(html)
      let $active = this.$tabBox.find('.active')
      if ($active.length === 0) {
        this.$tabBox.children().eq(0).addClass('active').siblings().removeClass('active')
        $active = this.$tabBox.children().eq(0)
      }
      this.config.params = this.getAttr($active)
      this.bindEvent($active[0].nodeName) // 初始化事件绑定
    }
    let tabLen = this.$tabBox.children().length
    let listLen = this.$listBox.children().length
    let listStr = ''
    while (listLen < tabLen) {
      listLen += 1
      listStr += '<ul></ul>'
    }
    this.$listBox.append(listStr)
    if (this.$listBox.find('.active').length === 0) {
      this.$listBox.children().eq(0).addClass('active').siblings().removeClass('active')
    }
  }
  /**
   * @method bindEvent 绑定事件
   * @param {String} tagName 标签名
   */
  bindEvent(tagName) {
    let _this = this
    tagName = tagName.toLowerCase()
    // 标签切换事件
    _this.$tabBox.off().on('click', tagName, function (evt) {
      // evt.stopPropagation()
      let $target = $(evt.target)
      if ($target[0].nodeName.toLowerCase() !== tagName) {
        $target = $target.parents(tagName)
      }
      _this.config.params = _this.getAttr($target) // 获取当前标签的所有自定义属性
      if (_this.config.isLoadNew) {
        _this.config.params.page = 1
      }
      _this.config.stop = false // 重置滚动加载节流标识
      let $list = _this.$listBox.children().eq($target.index())
      $target.addClass('active').siblings(tagName).removeClass('active')
      $list.addClass('active').siblings().removeClass('active')
      if ($list.children().length === 0 || $list.find('.load_more .no_data').length !== 0 || _this.config.isLoadNew) {
        // 当前列表如果为空则自动请求接口
        // 列表如果不为空并且有暂无内容占位图时请求接口(可做第一次接口出错刷新接口用)
        // 列表渲染方式切换标签加载第一页最新数据
        _this.config.isScroll = false // 记录当前行为是否为滚动行为
        _this.beforeAjax() // 加载数据
      }
    })
    // 屏幕滚动事件
    $(window).on('scroll', _this.debounce(function () {
      if (_this.config.stop) return  //如果加载中禁止滑动
      let scrollTop = $(window).scrollTop()
      let scrollHeight = $(document).height()
      let clientHeight = $(window).height()

      if (scrollTop + clientHeight + 150 >= scrollHeight) {
        _this.config.isScroll = true // 记录当前行为是否为滚动行为
        _this.config.stop = true // 启用滚动加载节流标识
        _this.beforeAjax() // 加载数据
      }
    }))
    // 是否菜单吸顶
    // if(_this.config.tabFixedTop){
    //   let offset = _this.$tabBox.offset()
    //   let width = _this.$tabBox.width()
    //   let height = _this.$tabBox.height()
    //   $(window).on('scroll', _this.debounce(function () {
    //     let scrollTop = $(window).scrollTop()
    //     if(scrollTop >= (offset.top + height)){
    //       _this.$tabBox.css({
    //         position: 'fixed',
    //         top: 0
    //       })
    //       _this.$tabBox.slideDown(200)
    //       if($('body').find('[data-fixed-top=true]').length === 0){
    //         _this.$tabBox.after('<div data-fixed-top="true" style="width: '+width+'px;height: '+height+'px"></div>')
    //       }
    //     } else {
    //       _this.$tabBox.css({
    //         position: 'initial',
    //         top: 'auto'
    //       })
    //       $('body').find('[data-fixed-top=true]').remove()
    //     }
    //   }))
    // }
  }
  /**
   *
   * @method debounce 节流方法
   * @param {Function} fn 执行方法
   * @returns {Function} 
   */
  debounce(fn) {
    let timer = null
    return function () {
      timer && clearTimeout(timer)
      timer = setTimeout(function () {
        fn.apply(this, arguments)
      }, 0)
    }
  }
  /**
   * @method refresh 按照指定参数重置所有列表
   * @param {Object} params 需要设置为自定义属性的参数
   */
  refresh(params) {
    if (Object.prototype.toString.call(params) !== '[object Object]') {
      throw new TypeError('参数类型错误...')
    }
    params.page = 1
    let $tabList = this.$tabBox.children()
    for (let i = 0; i < $tabList.length; i++) {
      this.setAttr($tabList[i], params)
    }
    this.$listBox.children().html('')
    this.config.params = this.getAttr(this.$tabBox.find('.active'))
    this.config.isScroll = false // 记录当前行为是否为滚动行为
    this.beforeAjax()
  }
  /**
   * @method beforeAjax ajax请求之前处理逻辑
   */
  beforeAjax() {
    if (!this.config.params.hasOwnProperty('page')) {
      throw new TypeError('page参数为必传项...')
    }
    if (!this.config.params.hasOwnProperty('limit')) {
      this.config.params.limit = 20
    }
    if (this.config.isLoadNew && !this.config.isScroll) {
      // 如果列表渲染方式为切换标签加载第一页最新数据，并且当前行为不是滚动行为时
      this.$listBox.find('.active').html('')
    }
    this.config.params.uid = this.getCookie('_discuz_uid') || 0 // 获取cookie--uid
    this.$listBox.find('.active .load_more').remove()
    this.$listBox.find('.active').append('<li class="load_more">数据加载中，请稍后...</li>')
    this.ajax('GET')
  }
  /**
   * @method ajax 获取数据
   * @param {String} type 请求类型
   */
  ajax(type) {
    let _this = this
    $.ajax({
      type: type || 'GET',
      url: _this.listUrl,
      data: _this.config.params,
      cache: false,
      dataType: 'json'
    }).done(function (res) {
      _this.ajaxSuccess(res)
    }).fail(function (err) {
      _this.config.stop = true // 启用滚动加载节流标识
      throw new Error(err)
    })
  }
  /**
   * @method ajaxSuccess 请求成功之后的回调
   * @param {Object} res 接口返回的结果
   */
  ajaxSuccess(res) {
    let $list = this.$listBox.find('.active')
    $list.find('.load_more').remove()
    let list = []
    let type = Object.prototype.toString.call(res.list)
    if (type === '[object Object]') {
      for (let key in res.list) {
        list.push(res.list[key])
      }
    } else if (type === '[object Array]') {
      list = res.list
    }

    if (res.status != 1 || list.length === 0) {
      if (this.config.params.page == 1) {
        $list.append('<li class="load_more empty">' + this.config.emptyMsg + '</li>')
      } else {
        $list.append('<li class="load_more empty">当前已没有更多内容了</li>')
      }
      this.config.stop = true // 启用滚动加载节流标识
      return false
    }
    this.config.stop = false // 重置滚动加载节流标志
    this.config.params.page = Number(this.config.params.page) + 1 // 累加页码
    this.setAttr(this.$tabBox.find('.active'), { page: this.config.params.page }) // 更新自定义属性
    // 渲染dom
    if (this.config.params.tpl) {
      let html = this.renderDom(this.config.params.tpl, list)
      if (this.config.isLoadNew && !this.config.isScroll) {
        // 如果列表渲染方式为切换标签加载第一页最新数据，并且当前行为不是滚动行为时
        $list.html(html)
      } else {
        $list.append(html)
      }
    } else if (this.tpl) {
      let html = this.renderDom(this.tpl, list)
      if (this.config.isLoadNew && !this.config.isScroll) {
        // 如果列表渲染方式为切换标签加载第一页最新数据，并且当前行为不是滚动行为时
        $list.html(html)
      } else {
        $list.append(html)
      }
    }
  }
  /**
   * @method renderDom 渲染模板
   * @param {String|Function} tpl 数据模板
   * @param {Array} list 列表数据
   * @returns {String}
   */
  renderDom(tpl, list) {
    if (typeof tpl === 'string') {
      return template(tpl, list)
    }
    if (typeof tpl === 'function') {
      return tpl.call(this, list)
    }
    throw new TypeError('tpl参数类型错误...')
  }
  /**
   * @method getAttr 获取所有自定义属性
   * @param {HTMLElement} $dom 操作目标 Dom 对象
   * @returns {Object} obj
   */
  getAttr($dom) {
    let attributes = $($dom)[0].attributes
    let attribute = {}
    for (let i = 0; i < attributes.length; i++) {
      let item = attributes[i]
      if (item.name.indexOf('data-') !== -1) {
        attribute[item.name.split('-')[1]] = item.value
      }
    }
    return attribute
  }
  /**
   * @method setAttr 设置自定义属性
   * @param {HTMLElement} $dom 操作目标 Dom 对象
   * @param {Object} attrs 自定义属性，key 不需要加 data- 前缀
   */
  setAttr($dom, attrs) {
    if (Object.prototype.toString.call(attrs) !== '[object Object]') {
      throw new TypeError('参数类型错误...')
    }
    let _$dom = $($dom)
    for (let key in attrs) {
      _$dom.attr('data-' + key, attrs[key])
    }
    return this
  }
  /**
   * @method getCookie 获取cookie
   * @param {String} name 获取指定cookie的键
   * @returns String
   */
  getCookie(name) {
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
}
