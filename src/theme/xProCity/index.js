import '@/assets/css/common.scss'
import './index.scss'

import { fetchData } from '@/assets/js/utils.js'

/**
 * @method ProCity 省市下拉
 * @param {Object} opts 参数
 */
function ProCity(opts) {
  this.opts = $.extend(true, {
    proDom: '',
    proUrl: '//www.xcar.com.cn/home_api/?service=dealer.provinces',
    cityDom: '',
    cityUrl: '//www.xcar.com.cn/home_api/?service=dealer.citys',
    layout: 1,
    provinceClickCB: null,
    cityClickCB: null,
    isClear: true
  }, opts)
  this.data = { pid: '', cid: '', pname: '', cname: '' } // 选中数据
  // 配置数据默认配置项
  if (!this.opts.hasOwnProperty('config')) {
    this.opts.config = JSON.parse(JSON.stringify(ProCity.config))
  } else {
    this.opts.config.placeholder = this.opts.config.hasOwnProperty('placeholder')
      ? Object.assign({}, { ...ProCity.config.placeholder }, { ...this.opts.config.placeholder })
      : Object.assign({}, { ...ProCity.config.placeholder })
    this.opts.config.props = this.opts.config.hasOwnProperty('props')
      ? Object.assign({}, { ...ProCity.config.props }, { ...this.opts.config.props })
      : Object.assign({}, { ...ProCity.config.props })
  }
  this.$proDom = null // 省份dom对象
  this.$cityDom = null // 城市dom对象,如果并列显示则为省份dom
  this.provinceList = []
  this.cityList = []
  if (this.opts.layout == 2) {
    if (!this.opts.proDom || !this.opts.cityDom || !this.opts.proUrl || !this.opts.cityUrl) {
      throw new Error('proDom,proUrl,cityDom,cityUrl为必传参数...')
    }
    this.opts.onlyProvince = false
  } else if (this.opts.layout == 1) {
    if (this.opts.cityDom && this.opts.cityUrl) {
      this.opts.onlyProvince = false
    } else if (this.opts.proDom && this.opts.proUrl) {
      this.opts.onlyProvince = true
    } else {
      throw new Error('只渲染省份缺少参数...')
    }
  } else {
    throw new Error('layout参数错误...')
  }

  // this.init()
}
/**
 * @method init 初始化方法
 */
ProCity.prototype.init = function () {
  let _this = this
  if(_this.$proDom || _this.$cityDom){ // 如果初始化过则返回本身
    return _this
  }
  let id = Math.random().toString(16).substr(2).toLocaleUpperCase() // 创建下拉框id
  // 省市下拉分开渲染
  if (_this.opts.layout == 2) {
    _this.$proDom = $(_this.opts.proDom).append(_this.titleTpl({ id, placeholder: _this.opts.config.placeholder.pro }))
    _this.$cityDom = $(_this.opts.cityDom).append(_this.titleTpl({ id, placeholder: _this.opts.config.placeholder.city }))
    // 省份标题点击事件
    _this.$proDom.off('click', '.title_box .title')
    _this.$proDom.on('click', '.title_box .title', function (evt) {
      evt.stopPropagation()
      let $listDom = _this.$proDom.find('.list_box .list[data-name=province]')
      if ($listDom.attr('data-expand') === 'false') {
        _this.open($listDom) // 展开列表
      } else {
        _this.close($listDom) // 收起列表
      }
      calcCloseSelect(evt) // 计算是否展开收起下拉框
    })
    // 城市标题点击事件
    _this.$cityDom.off('click', '.title_box .title')
    _this.$cityDom.on('click', '.title_box .title', function (evt) {
      evt.stopPropagation()
      let $listDom = _this.$cityDom.find('.list_box .list[data-name=city]')
      if ($listDom.attr('data-expand') === 'false') {
        _this.open($listDom) // 展开列表
      } else {
        _this.close($listDom) // 收起列表
      }
      calcCloseSelect(evt) // 计算是否展开收起下拉框
    })
  } else {
    if (_this.opts.onlyProvince) {
      // 只渲染省份
      _this.$proDom = $(_this.opts.proDom).append(_this.titleTpl({ id, placeholder: _this.opts.config.placeholder.pro }))
    } else {
      // 合并占位
      _this.$cityDom = _this.$proDom = $(_this.opts.proDom || _this.opts.citDom).append(_this.titleTpl({ id, placeholder: _this.opts.config.placeholder.combine }))
    }
    // 省份城市点击事件
    _this.$proDom.off('click', '.title_box .title')
    _this.$proDom.on('click', '.title_box .title', function (evt) {
      evt.stopPropagation()
      let $listDom = _this.$proDom.find('.list_box .list[data-name]')
      if ($listDom.attr('data-expand') === 'false') {
        _this.open($listDom) // 展开列表
      } else {
        _this.close($listDom) // 收起列表
      }
      calcCloseSelect(evt) // 计算是否展开收起下拉框
    })
  }
  // 清除选中状态
  if (_this.opts.isClear) {
    if (_this.opts.layout == 1) {
      _this.clearSelect(_this.$proDom)
    } else {
      _this.clearSelect(_this.$proDom)
      _this.clearSelect(_this.$cityDom)
    }
  }
  // 点击其他区域隐藏省市下拉
  $('body').on('click', function (evt) {
    // evt.stopPropagation()
    if (_this.opts.layout == 1) {
      _this.$proDom && _this.close(_this.$proDom.find('.list_box .list[data-name]')) // 收起列表
    } else {
      _this.$proDom && _this.close(_this.$proDom.find('.list_box .list[data-name=province]')) // 收起列表
      _this.$cityDom && _this.close(_this.$cityDom.find('.list_box .list[data-name=city]')) // 收起列表
    }
  })

  // 计算是否展开收起下拉框
  function calcCloseSelect(evt) {
    // 收起所有展开的下拉框
    let $selectList = $('body').find('.list[data-name]')
    let evtId = $(evt.target).parents('.title_box').attr('data-entity_id')
    for (let i = 0, len = $selectList.length; i < len; i++) {
      let id = $($selectList[i]).parents('.list_box').siblings('.title_box').attr('data-entity_id')
      if (id !== evtId && $($selectList[i]).attr('data-expand') === 'true') {
        _this.close($($selectList[i]))
      }
    }
  }

  // 计算下拉框的位置
  $(window).on('scroll', (function(){ 
    let timer = null
    return function(){
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        let winHeight = $(window).height() // 获取窗口高度
        let scrollTop = $(window).scrollTop() // 获取页面滚动高度
        let $listBox = $('body').find('.list_box')
        for(let i = 0, len = $listBox.length;i < len;i++){
          let $item = $($listBox[i])
          if($item.find('.list').attr('data-expand') === 'true'){
            let top = $item.parents('.select_box').offset() ? $item.parents('.select_box').offset().top : 0
            let height = $item.parents('.select_box').height() // 获取下拉框的高度
            let cssTop = parseFloat($item.css('top')) // 获取下拉列表定位的top值
            let listHeight = $item.height() // 获取下拉列表的高度
            if(cssTop >= 0){
              if(winHeight - (top - scrollTop) - height < listHeight && top - scrollTop >= listHeight){
                $($item).css({top: '-'+ listHeight +'px'})
              }
            } else {
              if(top - scrollTop < listHeight && winHeight - (top - scrollTop) - height >= listHeight ){
                $($item).css({top: height+'px'})
              }
            }
          }
        }
      }, 300)
    }
  })())

  _this.initProvince()
  
  return _this
}
/**
 * @method initProvince 初始化省份下拉
 */
ProCity.prototype.initProvince = function () {
  let proUrl = this.opts.proUrl
  let reg = /(^(https?))|(^:)|(^\/\/)/i
  if (reg.test(proUrl)) {
    // 如果 proUrl 为接口地址时
    this.getList(this.opts.proUrl, { _: Date.now() }, _initProvince.bind(this))
  } else if (Array.isArray(this.opts.proUrl)) {
    _initProvince.call(this, this.opts.proUrl)
  }
  function _initProvince(data) {
    let _this = this
    let $proDomListBox = _this.$proDom.find('.list_box')
    _this.provinceList = data
    $proDomListBox.html(_this.listTpl('province', data))
    /* eslint-disable */
    if (_this.opts.layout == 1) {
      if(!_this.opts.onlyProvince){
        // 合并渲染渲染并且cityDom,cityUrl参数已传
        $proDomListBox.append(_this.listTpl('city', []))
        $proDomListBox.find('.list[data-name]').css({ width: '50%' })
        !reg.test(_this.opts.cityUrl) && _this.initCity({}, false) // 如果城市列表非接口则执行初始化
      }
    } else if (_this.opts.layout == 2){
      !reg.test(_this.opts.cityUrl) && _this.initCity({}, false) // 如果城市列表非接口则执行初始化
    }
    /* eslint-disable */
    $proDomListBox.find('.list[data-name=province]').off().on('click', 'li', function (evt) {
      evt.stopPropagation()
      let $target = $(evt.target)
      if($target[0].tagName.toLowerCase() !== 'li'){
        $target = $(evt.target).parents('li')
      }
      let index = $target.index()
      let province = _this.provinceList[index]
      let pid = province[_this.opts.config.props.value]
      let pname = province[_this.opts.config.props.label]
      let $provinceList = $proDomListBox.find('.list[data-name=province]')
      $target.addClass('active').siblings('li').removeClass('active')
      _this.opts.hasOwnProperty('bak') && delete _this.opts.bak // 删除反显时存储的数据
      if (!_this.opts.onlyProvince) {
        // 如果 cityDom 和 cityUrl 参数已传则执行初始化城市方法
        if (reg.test(_this.opts.cityUrl)) { // 是否自动加载城市列表
          _this.initCity({ province_id: pid }, true)  // eslint-disable-line
        }
      } else {
        $provinceList.attr('data-expand') === 'true' && _this.close($provinceList)
      }
      
      if (_this.opts.layout == 1) {
        if (!_this.opts.onlyProvince) {
          _this.$proDom.find('.title_box').attr({ 'data-cid': '', 'data-cname': '' })
        }
      } else {
        // 城市占位
        _this.$cityDom.find('.title_box .title').html(_this.opts.config.placeholder.city).addClass('color_no_select').removeClass('color_normal')
        _this.$cityDom.find('.title_box').attr({ 'data-cid': '', 'data-cname': '' })
        _this.close($provinceList)
      }
      
      _this.$proDom.find('.title_box').attr({ 'data-pid': pid, 'data-pname': pname })
      _this.setData({ pid, pname, cid: '', cname: '' })
      _this.$proDom.find('.title_box .title').html(pname).addClass('color_normal').removeClass('color_no_select')

      _this.opts.provinceClickCB && _this.opts.provinceClickCB.call(_this, province) // 回调函数最后调用有杀招
    })
  }

  return this
}
/**
 * @method initCity 初始城市信息
 * @param {Object} params 请求接口参数
 * @param {Boolean} show_list 是否展示城市列表
 * @param {Function} cb 初始化城市列表成功之后回调
 */
ProCity.prototype.initCity = function (params, show_list, cb) { // eslint-disable-line
  let cityUrl = this.opts.cityUrl
  let reg = /(^(https?))|(^:)|(^\/\/)/i
  if (reg.test(cityUrl)) {
    this.getList(this.opts.cityUrl, { ...params, _: Date.now() }, _initCity.bind(this))
  } else if (Array.isArray(this.opts.cityUrl)) {
    _initCity.call(this, this.opts.cityUrl)
  }
  function _initCity(data) {
    let _this = this
    let $dom = null
    _this.cityList = data
    if (_this.opts.layout == 1) {
      // 合并渲染
      if (!_this.opts.onlyProvince) {
        // 合并渲染包含城市列表
        $dom = _this.$proDom.find('.list_box')
        $dom.find('.list[data-name=city]').remove()
        $dom.append(_this.listTpl('city', data))
        $dom.find('.list[data-name]').css({ width: '50%', height: '100%' })
        if (show_list || $dom.find('.list[data-name="province"]').attr('data-expand') === "true") { // eslint-disable-line
          // $dom.find('.list[data-name=city]').attr('data-expand', true).show()
          _this.open($dom.find('.list[data-name=city]'))
        }
        if (_this.opts.hasOwnProperty('bak')) {
          // 如果存在反显字段
          _this.loadedReShowCity(_this.calcIndex(_this.opts.bak)) // 计算反显下标并执行城市加载后方法
        }
      }
    } else {
      $dom = _this.$cityDom.find('.list_box')
      if ($dom.find('.list[data-name=city]').attr('data-expand') === 'true') {
        // 如果当前城市列表为展开状态，则直接渲染列表
        let $list = $(_this.listTpl('city', data))
        $dom.find('.list[data-name=city]').html($list.children())
      } else {
        $dom.find('.list[data-name=city]').remove()
        $dom.append(_this.listTpl('city', data))
      }
      if (_this.opts.hasOwnProperty('bak')) {
        // 如果存在反显字段
        _this.loadedReShowCity(_this.calcIndex(_this.opts.bak)) // 计算反显下标并执行城市加载后方法
      }
    }
    cb && cb()
    $dom.find('.list[data-name=city]').off().on('click', 'li', function (evt) {
      evt.stopPropagation()
      let $target = $(evt.target)
      if($target[0].tagName.toLowerCase() !== 'li'){
        $target = $(evt.target).parents('li')
      }
      let index = $target.index()
      let city = _this.cityList[index]
      let $provinceList = _this.$proDom.find('.list_box .list[data-name=province]')
      let $cityList = _this.$cityDom.find('.list_box .list[data-name=city]')
      let pname = _this.data.pname
      let cid = city[_this.opts.config.props.value]
      let cname = city[_this.opts.config.props.label]
      let $titleDom = null
      $target.addClass('active').siblings('li').removeClass('active')
      
      if (_this.opts.layout == 1) {
        $titleDom = _this.$proDom.find('.title_box')
        $titleDom.find('.title').html(pname + _this.opts.config.placeholder.delimiter + cname)
      } else {
        $titleDom = _this.$cityDom.find('.title_box')
        $titleDom.find('.title').html(cname).addClass('color_normal').removeClass('color_no_select')
      }
      $titleDom.attr({ 'data-cid': cid, 'data-cname': cname })
      _this.opts.cityClickCB && _this.opts.cityClickCB.call(_this, city) // 回调函数最后调用有杀招
      _this.setData({ cid, cname })
      _this.close($provinceList)
      _this.close($cityList)
    })
  }

  return this
}
/**
 * @method clearSelect 清除选中结果
 * @param {HTMLElement} $dom Dom对象
 */
ProCity.prototype.clearSelect = function ($dom) {
  let _this = this
  $dom.off('click', '.title_box .clear')
  $dom.on('click', '.title_box .clear', function (evt) {
    evt.stopPropagation()
    if (_this.opts.layout == 1) {
      _this.clear(_this.$proDom)
    } else {
      let dataName = $(evt.target).parents('.title_box').siblings('.list_box').find('.list[data-name]').attr('data-name')
      dataName === 'province' ? _this.clear(_this.$proDom) : _this.clear(_this.$cityDom) 
    }
  })

  return _this
}
/**
 * @method clear 清除选中数据
 * @param {Object} $dom 需要清除的下拉框dom对象
 */
ProCity.prototype.clear = function($dom = undefined){
  let _this = this
  if($dom && Object.prototype.toString.call($dom) != '[object Object]'){
    throw new TypeError('参数必须为一个dom对象...')
  }
  let $titleBox = $dom ? $($dom).find('.title_box') : _this.$proDom.find('.title_box')
  if(_this.opts.layout == 1){
    if(_this.opts.onlyProvince){
      $titleBox.find('.title').html(_this.opts.config.placeholder.pro) // 省份占位
      $titleBox.attr({ 'data-pid': '', 'data-pname': ''})
      _this.setData({ pid: '', pname: '' })
    } else {
      $titleBox.find('.title').html(_this.opts.config.placeholder.combine) // 合并占位
      $titleBox.siblings('.list_box').find('.list[data-name=city]').html('') // 同时清除城市列表
      $titleBox.attr({ 'data-pid': '', 'data-pname': '', 'data-cid': '', 'data-cname': '' })
      _this.setData({ pid: '', pname: '', cid: '', cname: '' })
    }
    $titleBox.siblings('.list_box').find('.list[data-name]').find('li').removeClass('active')
    $titleBox.find('.title').removeClass('color_normal').addClass('color_no_select')
    return _this
  }
  if($dom){ // 如果 $dom 已传，则清除指定下拉框
    let $siblings = $titleBox.siblings('.list_box').find('.list[data-name]')
    if($siblings.attr('data-name') === 'province'){ // 如果是省份下拉
      $titleBox.find('.title').html(_this.opts.config.placeholder.pro) // 省份占位
      $titleBox.attr({ 'data-pid': '', 'data-pname': '' })
      let $cityTitleBox = _this.$cityDom.find('.title_box')
      $cityTitleBox.attr({ 'data-cid': '', 'data-cname': '' })
      _this.setData({ pid: '', pname: '', cid: '', cname: '' })
      // 城市占位
      $cityTitleBox.find('.title').html(_this.opts.config.placeholder.city).removeClass('color_normal').addClass('color_no_select')
      $cityTitleBox.siblings('.list_box').find('.list[data-name=city]').html('')
    } else {
      $titleBox.find('.title').html(_this.opts.config.placeholder.city) // 城市占位
      $titleBox.attr({ 'data-cid': '', 'data-cname': '' })
      _this.setData({ cid: '', cname: '' })
    }
    $titleBox.siblings('.list_box').find('.list[data-name]').find('li').removeClass('active')
    $titleBox.find('.title').removeClass('color_normal').addClass('color_no_select')
  } else {
    let $proTitleBox = _this.$proDom.find('.title_box')
    let $cityTitleBox = _this.$cityDom.find('.title_box')
    // 省份占位
    $proTitleBox.find('.title').html(_this.opts.config.placeholder.pro).removeClass('color_normal').addClass('color_no_select')
    $proTitleBox.attr({ 'data-pid': '', 'data-pname': '' })
    $proTitleBox.siblings('.list_box').find('.list[data-name]').find('li').removeClass('active')
    $cityTitleBox.attr({ 'data-cid': '', 'data-cname': '' })
    $cityTitleBox.find('.title').html(_this.opts.config.placeholder.city).removeClass('color_normal').addClass('color_no_select')
    $cityTitleBox.siblings('.list_box').find('.list[data-name=city]').html('')
    _this.setData({ pid: '', pname: '', cid: '', cname: '' })
  }

  return _this
}
/**
 * @method getList 获取列表接口
 * @param {String} url 接口地址
 * @param {Object} data 请求参数
 * @param {Function} cb 请求成功回调函数
 * @returns {Object}
 */
ProCity.prototype.getList = function (url, data, cb) {
  fetchData.get(url, data).done(function (res) {
    if (res.code != 0) {
      return false
    }
    cb(res.data)
  }).fail(function (err) {
    throw new Error('接口错误...')
  })

  return this
}
/**
 * @method open 展开dom
 * @param {HTMLElement} $dom
 */
ProCity.prototype.open = function ($dom) {
  let _this = this
  $dom.attr({ 'data-expand': true })
  $($dom).parents('.list_box').siblings('.title_box').find('.arrow').addClass('arrow_up')
  let winHeight = $(window).height() // 获取窗口高度
  let scrollTop = $(window).scrollTop() // 获取页面滚动高度
  let top = $($dom).parents('.select_box').offset().top // 获取下拉框的位置
  let height = $($dom).parents('.select_box').height() // 获取下拉框的高度
  let listHeight = $($dom).parents('.list_box').height() // 获取下拉列表的高度
  $($dom).parent('.list_box').css({display: 'block'})
  if(winHeight - (top - scrollTop) - height >= listHeight){
    $($dom).parent('.list_box').css({top: height+'px'})
  } else if(top - scrollTop >= listHeight) {
    $($dom).parent('.list_box').css({top: '-'+ listHeight +'px'})
  } else {
    $($dom).parent('.list_box').css({top: height+'px'})
  }

  return _this
}
/**
 * @method close 收起dom
 * @param {HTMLElement} $dom
 */
ProCity.prototype.close = function ($dom) {
  let _this = this
  $dom.attr({ 'data-expand': false })
  $($dom).parents('.list_box').siblings('.title_box').find('.arrow').removeClass('arrow_up')
  let winHeight = $(window).height() // 获取窗口高度
  let scrollTop = $(window).scrollTop() // 获取页面滚动高度
  let top = $dom.parents('.select_box').offset() ? $dom.parents('.select_box').offset().top : 0
  let height = $($dom).parents('.select_box').height() // 获取下拉框的高度
  let listHeight = $($dom).parents('.list_box').height() // 获取下拉列表的高度
  $($dom).parent('.list_box').css({display: 'none'})
  if(winHeight - (top - scrollTop) - height >= listHeight){
    $($dom).parent('.list_box').css({top: height+'px'})
  } else if(top - scrollTop >= listHeight) {
    $($dom).parent('.list_box').css({top: '-'+ listHeight +'px'})
  } else {
    $($dom).parent('.list_box').css({top: height+'px'})
  }

  return _this
}
/**
 * @method titleTpl 下拉列表提示框
 * @param {Object} params 配置参数
 * ```javascript
 *  { id, placeholder }
 * ```
 * @returns {String}
 */
ProCity.prototype.titleTpl = function ({ id, placeholder }) {
  let _this = this
  let temp = '<div class="title_box" data-entity_id="' + id + '"><span class="title color_no_select">' + placeholder + '</span><span class="arrow"></span>'
  if (_this.opts.isClear) {
    temp += '<i class="clear"></i>';
  }
  temp += '</div><div class="list_box"></div>'

  return temp
}
/**
 * @method listTpl 渲染列表
 * @param {String} name 区分省份或城市
 * @param {Array} arr 列表数据
 * @returns {String}
 */
ProCity.prototype.listTpl = function (name, arr) {
  let _this = this
  return '<ol class="list" data-name="' + name + '" data-expand="false">' + arr.map(function (item) {
    let li = '<li '
    for(let key in item){
      if(key != _this.opts.config.props.label){
        li += 'data-'+ key + '="'+ item[key] +'" '
      }
    }
    li += '>'+item[_this.opts.config.props.label]+'</li>'
    return li
  }).join('') + '</ol>'
}
/**
 * @method set 反显省市下拉选中状态
 * @param {Object} obj 需要设置的省市id
 */
ProCity.prototype.set = function (obj) {
  /* eslint-disable */
  let _this = this
  let provinceTimer = null
  if(_this.opts.layout == 2){
    if(_this.$proDom == null || _this.$cityDom == null){
      return _this
    }
  } else {
    if(_this.$proDom == null){
      return _this
    }
  }
  _this.opts.bak = obj // 每次反显缓存反显id
  if (!obj.pid) {
    throw new Error('省份id不能为空...')
  }
  if (_this.provinceList.length === 0) {
    // 如果省份列表数据空，则延迟执行设置省份方法
    provinceTimer = setInterval(function () {
      if(_this.provinceList.length !== 0) {
        clearInterval(provinceTimer)
        provinceTimer = null
        _this.setProvince(_this.calcIndex(obj))
      }
    }, 1000);
  } else {
    _this.setProvince(_this.calcIndex(obj))
  }
  // 如果有城市id并且城市列表已渲染 
  if (obj.cid && !_this.opts.onlyProvince) {
    if (provinceTimer) {
      // 如果设置省份反显数据已延迟，则设置
      setTimeout(function () {
        _this.setCity(_this.calcIndex(obj))
      }, 1000);
    } else {
      _this.setCity(_this.calcIndex(obj))
    }
  }
  /* eslint-disable */

  return _this
}
/**
 * @method calcIndex 计算省市下标
 * @param {Object} obj
 * @returns Object
 */
ProCity.prototype.calcIndex = function (obj) {
  let _this = this
  let indexObj = { province_index: -1, city_index: -1, pid: obj.pid }
  // indexObj.province_index = _this.provinceList.findIndex(item => item[_this.opts.config.props.value] == obj.pid)
  // indexObj.city_index = obj.cid ? _this.cityList.findIndex(item => item[_this.opts.config.props.value] == obj.cid) : -1
  for(let i = 0;i < _this.provinceList.length;i++){
    let item = _this.provinceList[i]
    if(item[_this.opts.config.props.value] == obj.pid){
      indexObj.province_index = i
      break
    } else {
      indexObj.province_index = -1
    }
  }
  for(let i = 0;i < _this.cityList.length;i++){
    let item = _this.cityList[i]
    if(item[_this.opts.config.props.value] == obj.cid){
      indexObj.city_index = i
      break
    } else {
      indexObj.city_index = -1
    }
  }
  if (obj.cid) {
    indexObj.cid = obj.cid
  }
  
  return indexObj
}
/**
 * @method setProvince 设置省份信息
 * @param {Object} obj 下标信息
 */
ProCity.prototype.setProvince = function (obj) {
  let _this = this
  let $proDom = _this.$proDom
  let propertyObj = {pid: obj.pid, province_index: obj.province_index}
  for(let i = 0;i < _this.provinceList.length;i++){
    let item = _this.provinceList[i]
    if(item[_this.opts.config.props.value] == obj.pid){
      propertyObj.pname = item[_this.opts.config.props.label]
      break
    }
  }
  _this.setProperty($proDom, propertyObj)
  $proDom.find('.title_box .title').html(propertyObj.pname).addClass('color_normal').removeClass('color_no_select')
  
  // _this.opts.provinceClickCB && _this.opts.provinceClickCB.call(_this, province) // 调用 set 方法后触发 provinceClickCB 回调
  return _this
}
/**
 * @method setCity 设置城市信息
 * @param {Object} obj 下标信息
 */
ProCity.prototype.setCity = function (obj) {
  let _this = this
  if (_this.cityList.length == 0) {
    if (!Array.isArray(_this.opts.cityUrl)) { // 如果城市接口是url时执行
      _this.initCity({ province_id: obj.pid }, false)
    }
  } else {
    _this.loadedReShowCity(obj)
  }

  return _this
}
/**
 * @method loadedReShowCity 城市信息加载后调用
 * @param {Object} obj 下标信息
 */
ProCity.prototype.loadedReShowCity = function (obj) {
  let _this = this
  let $proDom = _this.$proDom
  let $cityDom = _this.$cityDom
  let propertyObj = {cid: obj.cid, city_index: obj.city_index}
  for(let i = 0;i < _this.cityList.length;i++){
    let item = _this.cityList[i]
    if(item[_this.opts.config.props.value] == obj.cid){
      propertyObj.cname = item[_this.opts.config.props.label]
      break
    }
  }
  if (_this.opts.layout == 2) {
    obj.city_index > -1 && _this.setProperty($cityDom, propertyObj)
    obj.city_index > -1 && $cityDom.find('.title_box .title').html(propertyObj.cname).addClass('color_normal').removeClass('color_no_select')
  } else {
    obj.city_index > -1 && _this.setProperty($proDom, propertyObj)
    obj.city_index > -1 && $proDom.find('.title_box .title').html(_this.data.pname + _this.opts.config.placeholder.delimiter + propertyObj.cname).addClass('color_normal').removeClass('color_no_select')
  }
  // _this.opts.cityClickCB && _this.opts.cityClickCB.call(_this, city) // 调用 set 方法后触发 cityClickCB 回调
  return _this
}
/**
 * @method setProperty 设置属性公共方法
 * @param {HTMLElement} $dom dom对象
 * @param {Object} obj 下标信息
 */
ProCity.prototype.setProperty = function ($dom, obj) {
  let _this = this
  let attrs = null
  if(obj.pid){
    attrs = { 'data-pid': obj.pid, 'data-pname': obj.pname }
    _this.setData({ pid: obj.pid, pname: obj.pname })
  } else {
    attrs = { 'data-cid': obj.cid, 'data-cname': obj.cname }
    _this.setData({ cid: obj.cid, cname: obj.cname })
  }
  $dom.find('.title_box').attr(attrs)
  $dom.find('[data-name=' + (obj.pid ? 'province' : 'city') + '] li:eq(' + (obj.pid ? obj.province_index : obj.city_index) + ')').addClass('active').siblings('li').removeClass('active')

  return _this
}
/**
 * @method setData 设置选中数据
 * @param {Object} obj 结果
 */
ProCity.prototype.setData = function(obj){
  let _this = this
  if(Object.prototype.toString.call(obj) !== '[object Object]'){
    return _this
  }
  _this.data = $.extend(true, _this.data, obj)

  return _this
}
/**
 * @method get 获取指定省份城市信息
 * @param {Object} obj
 * @returns {Array} 省市信息
 */
ProCity.prototype.get = function (obj) {
  let _this = this
  let result = []
  if (obj.pid) {
    result = result.concat(this.provinceList.filter(function (item) {
      return item[_this.opts.config.props.value] == obj.pid
    }))
  }
  if (obj.cid) {
    result = result.concat(this.cityList.filter(function (item) {
      return item[_this.opts.config.props.value] == obj.cid
    }))
  }

  return result
}
/**
 * @method destroy 销毁当前实例
 */
ProCity.prototype.destroy = function(){
  var _this = this
  if(_this.layout == 2){
    if(_this.$proDom == null || _this.$cityDom == null){
      return _this
    }
    _this.$proDom.html('')
    _this.$cityDom.html('')
  } else {
    if(_this.$proDom == null){
      return _this
    }
    _this.$proDom.html('')
  }
  _this.$proDom = _this.$cityDom = null
  for(let key in _this.data){
    _this.data[key] = ''
  }
  return _this
}
/**
 * 数据配置项默认值
 */
ProCity.config = {
  placeholder: { // 下拉框占位提示信息配置项
    pro: '请选择省', // 省份下拉占位符
    city: '请选择市', // 城市下拉占位符
    combine: '请选择省市',  // 省市合并占位符
    delimiter: '/' // 省市合并渲染分隔符
  },
  props: {
    value: 'id', // 数据主键
    label: 'name' // 显示名称
  }
}
/****************************************************************/
/**
 * @class List 下拉列表(必须先声明后使用)
 * @param {*} arr
 * @memberof List
 */
// class List {
//   constructor(arr) {

//   }
// }
// class Province extends List {
//   constructor() {
//     super()
//     console.log('Province instance...')
//   }
//   render() { }
// }
exports = module.exports = {
  ProCity,
  // Province
}
