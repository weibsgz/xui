import '@/assets/css/common.scss'
import './index.scss'
import '@/assets/js/init.js'

import initTemp from './template.art'
import chexiTemp from './chexiTemplate.art'
import { fetchData } from '@/assets/js/utils.js'
//车型车系级联组件
let Cascade = module.exports = function (options) {
  this.defaults = {
    placeholder: '请选择品牌',
    placeholderChexi: '请选择车系',
    width: $(options.dom).width(),
    showImg: true,
    expand: false
  }

  if (!options.dom) {
    console.error('Cascade组件dom没传')
    return false
  }

  this.state = {
    keyCodeObj: [
      { code: 65, val: 'A' },
      { code: 66, val: 'B' },
      { code: 67, val: 'C' },
      { code: 68, val: 'D' },
      { code: 69, val: 'E' },
      { code: 70, val: 'F' },
      { code: 71, val: 'G' },
      { code: 72, val: 'H' },
      { code: 73, val: 'I' },
      { code: 74, val: 'J' },
      { code: 75, val: 'K' },
      { code: 76, val: 'L' },
      { code: 77, val: 'M' },
      { code: 78, val: 'N' },
      { code: 79, val: 'O' },
      { code: 80, val: 'P' },
      { code: 81, val: 'Q' },
      { code: 82, val: 'R' },
      { code: 83, val: 'S' },
      { code: 84, val: 'T' },
      { code: 85, val: 'U' },
      { code: 86, val: 'V' },
      { code: 87, val: 'W' },
      { code: 88, val: 'X' },
      { code: 89, val: 'Y' },
      { code: 90, val: 'Z' }
    ],
    server: {
      getVehicleType: 'http://localhost:3031/getVehicleType', //获取车型
      getPicserverUrl: 'http://localhost:3031/getPicserverUrl' + '?num=1',
      getcx: 'http://localhost:3031/getcx', //获取车系
      getlt: 'http://localhost:3031/getlt',
      getht: 'http://localhost:3031/getht'
    }
  }

  this.saveData = {}
  // options.placeholder = options.echo.pbname ? options.echo.pbname : options.placeholder
  this.options = $.extend(true, {}, this.defaults, options)

  this.init()
}

Cascade.prototype = {
  init: function () {
    this.InitDom()
    this.initPinpai()
  },

  InitDom: function () {
    let opts = this.options
    //品牌插入内容
    let ele1 = $('<div class="x-main_select_warp"><div class="selectItem cx cxSelectItem_top disabled"><div class="select"><span>' + opts.placeholder + '</span><i></i></div></div></div>')
    $(opts.dom).append(ele1)

    //为车型DOM插入内容  
    if (opts.chexidom) {
      let ele2 = $('<div class="x-main_select_warp"><span class="x-chexidomspan"><span>' + (opts.pserText || opts.placeholderChexi) + '</span><i></i></span></div>')
      $(opts.chexidom).append(ele2)
    }
  },

  initPinpai: function () {
    let opts = this.options
    let state = this.state
    let _this = this
    //品牌接口
    fetchData.get(opts.pinpaiInterface).done(function (res) {
      res.config = {
        showImg: opts.showImg,
        width: opts.width,
        placeholder: opts.placeholder,
        expand: opts.expand
      }

      let html = initTemp(res)
      $(_this.options.dom).find('.cxSelectItem_top').append(html)
      $(opts.dom).find('.cxSelectItem_top').removeClass('disabled')
      //如果传入默认的品牌车系信息  打开品牌菜单选中默认品牌
      //目前只支持合并菜单且是默认展开的情况，非合并菜单chexidom的placeholder在异步getXhrcx中没修改
      //且单独展开车系菜单会有问题 未处理
      let _pbid = opts.pbid || ''
      let _pbname = opts.pbname || ''
      let _pserid = opts.pserid || ''
      let _pserText = opts.pserText || ''
      let spanText = $(opts.dom).find('.select > span')

      if (!opts.chexidom) {
        $(opts.dom).attr('saveData', [_pbid, _pserid])
        if (!_pbname) {
          spanText.html(opts.placeholder)
        } else {
          spanText.html(_pbname + '-' + _pserText)
        }
      } else {
        $(opts.dom).attr('saveData', _pbid)
        $(opts.chexidom).attr('saveData', _pserid)
        spanText.html(_pbname)
        if (!_pbname) {
          spanText.html(opts.placeholder)
        } else {
          spanText.html(_pbname)
        }
      }
      _this.saveData.pid = _pbid
      _this.saveData.pserid = _pserid
      _this.saveData.pserText = _pserText
      _this.saveData.pbText = state.pbText = _pbname

      //品牌下拉选中默认位置
      _this.rollPinpaiMenu(opts, _pbid)
      //打开车系菜单
      opts.expand && _this.expandChexiMenu(opts, _pbid, _pserid)
      opts.initPinpaiCb && opts.initPinpaiCb()
    }).fail(function (err) {
      throw new Error('品牌接口错误')
    })
    this.domClick(opts)

  },
  getXhrcx: function (nObj, cb) {
    let opts = this.options
    let _this = this

    fetchData.get(opts.chexiInterface, nObj).done(function (res) {
      res.config = {
        width: opts.width,
        placeholder: opts.placeholder,
        chexidom: opts.chexidom ? true : false,
        placeholderChexi: _this.saveData.pserText || opts.placeholderChexi
      }
      let html = chexiTemp(res)
      //处理插入车系菜单的位置，如果有chexidom则在chexidom处插入
      //否则在品牌菜单右侧插入 

      $(opts.dom).find('.cxxSelectItem_top').remove()
      if (!opts.chexidom) {
        $(opts.dom).find('.cxSelectItem_top').after(html)
      } else {
        //$(opts.chexidom).find('.x-main_select_warp').remove()
        $(opts.chexidom).find('.cxxSelectItem_top').remove()
        //let ele = $('<div class="x-main_select_warp"></div>')
        // $(opts.chexidom).append(ele)
        $(opts.chexidom).find('.x-main_select_warp').append(html)
        //如果有车系的单独容器，需要添加SHOW
        $(opts.chexidom).find('.cxx').addClass('show')
      }

      $(opts.dom).find('.cxxSelectItem_top').removeClass('disabled')
      cb && cb()
    }).then(() => {

    }).fail(function (err) {
      throw new Error('jiekou error')
    })

  },
  rollPinpaiMenu(opts, pbid) {
    if (!pbid) return
    let _this = this
    $(opts.dom).find('.cxSelectItem_top .cxOpt .options li').each(function (i, v) {
      let __this = this
      if (!_this.state.clickedPinpai && $(v).attr('pid') == pbid) {
        $(v).addClass('action')
        console.log('品牌滚动')
        setTimeout(function () {
          $(__this).parent('.options').animate({ scrollTop: $(v).index() * 40 }, 300)
        }, 300)
      }
    })
  },
  //车型模板
  domClick(opts) {
    let _this = this
    let state = this.state
    //点击显示下拉框，点击其他位置隐藏
    $(opts.dom + ',' + opts.chexidom).on('click', '.selectItem .select', function (e) {
      if ($(this).parent().hasClass('disabled')) {
        console.log('return')
        return
      }
      //1.先判断是否是合并菜单
      //2.判断是否已经选完品牌车系了 如果选完了再次点击品牌就合并菜单品牌车系都展示出来上次选择的
      let attrSaveData = $(opts.dom).attr('saveData')
      if (!opts.chexidom) {
        let pbid = ''
        let pserid = ''
        if (attrSaveData) {
          pbid = attrSaveData.split(',')[0]
          pserid = attrSaveData.split(',')[1]
        }
        if (pbid && pserid) {
          _this.expandChexiMenu(opts, pbid, pserid)
        }
      }

      //如果传入了品牌默认ID 则自动滚动到此位置

      _this.rollPinpaiMenu(opts, opts.pbid)

      if (!$(this).parents('.selectItem').hasClass('show')) {
        $(this).find('.options').hide()
        $(this).find('.cxOpt').hide()
        $(this).find('.selectItem').removeClass('show')
        $(this).parents('.selectItem').addClass('show')
        $(this).parent().find('.options').show()
        $(this).parent().children('.cxOpt').show()
        return
      } else {
        $(this).parents('.selectItem').removeClass('show')
        $(this).parent().find('.options').hide()
        $(this).parent().children('.cxOpt').hide()
        if (attrSaveData) {
          //如果之前选中过品牌车系再点击就不让菜单收起了
          //因为上面的逻辑合并车系菜单是后插入的，隐藏不能生效
          $(this).find('.options').hide()
          $(this).find('.cxOpt').hide()
          $(this).find('.selectItem').removeClass('show')
          $(this).parents('.selectItem').addClass('show')
          $(this).parent().find('.options').show()
          $(this).parent().children('.cxOpt').show()
        }
        return
      }
    })
    //如果有回显的品牌 车系  点击车系需要单独展开车系菜单
    $(opts.chexidom).on('click', function (e) {
      let savedataDom = $(opts.dom).attr('savedata')
      let savedataChexidom = $(this).attr('savedata')
      if (savedataDom && savedataChexidom) {
        if ($(e.target).hasClass('x-chexidomspan'))
          _this.expandChexiMenu(opts, savedataDom)
      }
    })

    // //其他地方执行关闭操作
    $(document).on('click', function (e) {
      if ($(e.target).hasClass('disabled') || $(e.target).parent().hasClass('disabled')) { return }
      if (e.target.className == 'select' || e.target.className == 'input' || $(e.target).parent().hasClass('select') || $(e.target).parent().hasClass('zm') || $(e.target).parents().hasClass('inputItem')) { return }

      //如果车系列表很少 点击空白处
      if (e.target.className == 'options') {
        return
      }

      if ($(e.target).parents('.options').length == 0 || $(e.target).parents('.cxOpt').length == 0) {
        $('.selectItem').removeClass('show').children('.options').hide()
        $('.inputItem').children('.options').hide()
        $('.selectItem').removeClass('show').children('.cxOpt').hide()

        // if (!opts.chexidom && true) {
        //   $(opts.dom).remove()
        // }

        //点击外面 如果选了品牌没选车系 则置空
        if (!opts.chexidom) {
          let attrData = $(opts.dom).attr('saveData')
          if (!attrData) {
            //说明被回调改过返显内容 并且 还没点品牌
            if ($(opts.dom).find('.select span').text() !== opts.placeholder && !_this.state.clickedPinpai) {
              return
            } else {
              console.log('dddddd')
              $(opts.dom).find('.cxSelectItem_top .select span').text(opts.placeholder)
            }
          }
        }
      }

    })

    //点击字母
    $(opts.dom).off('click', '.zm li')
    $(opts.dom).on('click', '.zm li', function (e) {
      _this.numAzfn.call($(this))
    })

    //点击品牌
    $(opts.dom).off('click', '.selectItem .cxOpt .options li')
    $(opts.dom).on('click', '.selectItem .cxOpt .options li', function (e) {
      //点击过了品牌，如果是合并的 又被修改了回显内容，那么doucument只点击了品牌没有点击车系 要判断
      _this.state.clickedPinpai = true

      let pcls = $(this).attr('pcls')
      let pid = $(this).attr('pid')
      let text = $(this).find('i').text()
      let spanText = $(this).parents('.cxSelectItem_top').find('.select > span')
      _this.saveData.pbText = state.pbText = text
      _this.saveData.pid = pid
      let nObj = {
        pbid: pid
      }

      if ($(this).hasClass('disabled')) {
        return
      }
      console.log('点击品牌')

      $(this).addClass('action').siblings().removeClass('action')
      $(this).parents('.cxOpt').find('.zm .' + pcls).addClass('action').siblings().removeClass('action')
      $(this).parents('.options').show()

      opts.chexidom ? spanText.html(text) : spanText.html(text + '-')

      $(this).parents('.cxSelectItem_top').addClass('show')
      _this.getXhrcx(nObj, function () {
        if ($(opts.chexidom)) {
          //分开菜单的时候 点击品牌后清空车系选项 
          $(opts.chexidom).find('.cxxSelectItem_top .select').find('span').text(opts.placeholderChexi)
          $(opts.chexidom).attr('savedata', '')
        }
      })

      $(opts.dom).find('.cxxSelectItem_top').show()
      //每次点击品牌的时候清空data
      if (!opts.chexidom) {
        $(opts.dom).attr('saveData', '')
      } else {
        $(this).parents('.cxOpt').hide()
        $(opts.dom).attr('saveData', _this.saveData.pid)

      }

      opts.clickPinpaiCb && opts.clickPinpaiCb({
        pbid: _this.saveData.pid,
        pbname: _this.saveData.pbText
      })

    })

    //车型
    $(opts.dom + ',' + opts.chexidom).off('click', '.cxxSelectItem_top .options li')
    $(opts.dom + ',' + opts.chexidom).on('click', '.cxxSelectItem_top .options li', function (e) {
      console.log('点击车型后', _this.saveData)
      if ($(this).hasClass('disabled')) {
        return
      }
      let pserid = $(this).attr('pserid')
      let fid = $(this).attr('fid')
      let text = $(this).find('span').text()

      _this.saveData.pserid = pserid
      _this.saveData.pserText = text

      $(this).addClass('action').siblings().removeClass('action')
      $(this).parent('.options').hide()
      $(this).parents('.cxxSelectItem_top').removeClass('show')

      if (!opts.chexidom) {
        $(opts.dom).find('.cxSelectItem_top .select').find('span').text(state.pbText + ' - ' + text)
      } else {
        $(opts.chexidom).find('.cxxSelectItem_top .select').find('span').text(text)
      }

      //在传入的DOM上绑定品牌ID和车系ID
      //如果有车系单独的DOM则把车系ID绑定到车系单独的DOM上

      if (!opts.chexidom) {
        $(opts.dom).attr('saveData', [_this.saveData.pid, _this.saveData.pserid])
      } else {
        $(opts.dom).attr('saveData', _this.saveData.pid)
        $(opts.chexidom).attr('saveData', _this.saveData.pserid)
      }

      opts.clickCheXiCb && opts.clickCheXiCb({
        pbid: _this.saveData.pid,
        serid: _this.saveData.pserid,
        pbname: _this.saveData.pbText,
        pserText: _this.saveData.pserText
      })

    })
  },
  expandChexiMenu(opts, pbid, pserid) {
    let _this = this
    let nObj = {
      pbid: pbid
    }
    _this.getXhrcx(nObj, function () {
      console.log('展开车系菜单')
      let _dom = opts.chexidom ? opts.chexidom : opts.dom
      $(_dom).find('.cxxSelectItem_top').find('.options li').each(function (i, v) {
        if (pserid && $(v).attr('pserid') == pserid) {
          $(v).addClass('action')
          setTimeout(function () {
            $(v).parent('.options').animate({ scrollTop: $(v).index() * 40 - 30 }, 500)
          }, 100)
        }
      })
    })

  },
  numAzfn() {

    let text = this.text()
    let listCount = $(this).parent().next()
    let thisOPT = this.position().top
    let listContLi = listCount.find('.' + text)

    let liOffsetTop = listContLi.position().top // 菜单中字母距离顶部高度
    let scrollTop = listCount.scrollTop() // 品牌列表容器具体顶部高度
    let otherH = $(this).next().length == 0 ? 100 : 0 //由于最后一个值不能显示 出车品牌内容故给添加100个像素
    this.addClass('action').siblings().removeClass('action')
    console.log(liOffsetTop, scrollTop)

    listCount.stop().animate({
      scrollTop: liOffsetTop + scrollTop
    }, 'fast')
  }
}
