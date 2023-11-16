/* eslint-disable */
import $ from './touch-zepto';
import './lazyload';
import IScroll from './touch-iscroll';
import tip from './touch-tip';

var ios7fix = 'scroll' + ($.os.ios && $.os.version.indexOf('7.0') > -1 && $.browser.safari ? ' touchmove touchend' : '');
var $wrapper = $('.wrapper');
var $dwrapper = $('.drawer-wrapper');
var $dpop = $('.drawer-pop');
var $pop = $('.pop')
var draid = 0;
var cache = {};
var $dom = $('body');
var scrolltop = 0;
var supporthas3d = "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix;
var flag = true;
var touchTimeout = '';

// require('assign');

if (!$pop[0]) {
    // $pop = $('<div class="pop"></div>').appendTo($dom);
    $pop = $('<div class="pop"></div>').appendTo($('.effectDisplay_body'));
    //var $pop=$('<div class="pop"></div>').appendTo($wrapper);
}

/*
 * item模版
 * */
var _tpl_img = '<span class="img-wrap lazy" data-original="{{img}}" style="">' +
    '<img src="data:image\/svg+xml;utf8,&lt;svg xmlns=\'http:\/\/www.w3.org\/2000\/svg\' width=\'4\' height=\'3\' \/&gt;" />' +
    '</span>';
var _tpl_price = '<em class="red">{{price}}</em>万'
var _tpl_item_ = '<div data-gob="{{gob}}" data-gobp="{{gobp}}" data-seat="{{seat}}" data-vstatus="{{vstatus}}" data-num="{{num}}" data-made="{{made}}" data-cc="{{cc}}" data-carprice="{{carprice}}"' +
    ' data-id="{{id}}"' +
    ' data-text="{{text}}"' +
    ' data-parentid="{{parentid}}"' +
    ' data-parentname="{{parentname}}"' +
    ' data-ischild="{{ischild}}"' +
    ' data-haschild="{{hasChild}}"' +
    ' href="javascript:;"' +
    ' class="province-info' +
    ' {{current}}' +
    ' {{cardept-info}}' +
    ' {{classify_h}}">{{cardept-classify}}{{img}}<span class="info">{{cur-ico}}<span>{{text}}</span>{{price}}</span>{{newcarEnter}}{{classifyBtn}}{{cardept-classify-e}}{{classifyHtml}}</div>';

/*
 * object 直接渲染出页面
 * function 返回ajax事例
 * */

function createEle(title, isback) {
    var domid = '__drawer_id_' + draid + '_';
    var btn_back = isback ? '<a href="javascript:" class="icon-lt js-back">@</a>' : ''
    draid++;
    var _tpl = '<div class="drawer-wrapper" id="' + domid + '"><div class="title"><a href="javascript:" class="icon-cls js-close">d</a><span>{{title}}</span>' + btn_back + '</div>' +
        '<div class="container">' +
        //'<div class="scroller">' +
        '<div class="scroll-zone"><div class="drawer-scroller">' +
        '<div class="loading-wrap"><div class="loading"></div></div>' +
        '</div>' +
        //'</div>' +
        '</div></div></div>';
    _tpl = _tpl.replace(/\{\{title\}\}/gi, title)
    // $(_tpl).appendTo($dom);
    $(_tpl).appendTo($('.effectDisplay_body'));
    //$(_tpl).appendTo($wrapper);
    return $('#' + domid);
}

function _renderitem(data) {
    var _html = ''
    for (var _index in data) {
        var _img = '',
            _price = '',
            _item_html;
        var _item = data[_index];
        var _classify = _item.gnlist;
        var _classify_html = '';
        if (_item.img) {
            _img = _tpl_img.replace(/\{\{img\}\}/gi, _item.img);
        }
        if (typeof _item.price != 'undefined') {
            if (_item.noprice == undefined) {
                if (_item.price) {
                    _price = '<em class="red">' + _item.price + '</em>万';
                } else {
                    _price = '<em class="gray">暂无报价</em>'
                }
            } else {
                _price = '<em class="' + _item.noprice + '">' + _item.price + '</em>';
            }
        }
        if (_classify) {
            _classify_html = '<ul>';
            var _csaletype = ["未上市", "即将上市", "暂无价格", "停售"];
            for (var f in _classify) {
                let _ify = _classify[f];
                let _classPrice = '';

                var _cpse = _ify[0] || _ify;
                // var _cpprice = _cpprice();
                function _cpprice() {

                    var _ctext;
                    var _cprice, _cnoprice;
                    if (_cpse.pmprice && _cpse.pmprice.max_price) {
                        if (_cpse.pmprice.max_price == _cpse.pmprice.min_price) {
                            _cprice = _cpse.pmprice.max_price;
                        } else {
                            _cprice = _cpse.pmprice.min_price + '-' + _cpse.pmprice.max_price;
                        }
                    }

                    if (_cpse.xstatus == 0) {
                        _ctext = _csaletype[_cpse.xstatus];
                        _cnoprice = 'gray';
                    } else if (_cpse.xstatus == 1) {
                        if (_cprice) {
                            _ctext = '预售' + _cprice + '万';
                            _cnoprice = 'red';
                        } else {
                            _ctext = _csaletype[_cpse.xstatus];
                            _cnoprice = 'red';
                        }
                    } else if (_cpse.xstatus == 2) {
                        if (_cprice) {
                            _ctext = _cprice + '万';
                            _cnoprice = 'red';
                        } else {
                            _ctext = _csaletype[_cpse.xstatus];
                            _cnoprice = 'gray';
                        }
                    } else if (_cpse.xstatus == 3) {
                        _ctext = _csaletype[_cpse.xstatus];
                        _cnoprice = 'gray';
                    }

                    return {
                        _ctext: _ctext,
                        _cnoprice: _cnoprice
                    }

                }

                if (typeof _cpprice._ctext != 'undefined') {
                    if (_cpprice._cnoprice == undefined) {
                        if (_cpprice._ctext) {
                            _classPrice = '<em class="red">' + _cpprice._ctext + '</em>万';
                        } else {
                            _classPrice = '<em class="gray">暂无报价</em>'
                        }
                    } else {
                        _classPrice = '<em class="' + _cpprice._cnoprice + '">' + _cpprice._ctext + '</em>';
                    }
                }
                let _cimg = '//img' + Math.ceil(Math.random() * 5) + '.xcarimg.com/PicLib/s/s' + _ify.serid + '_240.jpg'
                _classify_html += ('<li data-id="' + _ify.pserid + '"  data-psname="' + _ify.psname + '"  data-price="'+ _cpprice._ctext+'" class="subChild">' +
                    '<span class="img-wrap lazy" data-original="' + _cimg + '" style="">' +
                    '<img src="data:image\/svg+xml;utf8,&lt;svg xmlns=\'http:\/\/www.w3.org\/2000\/svg\' width=\'4\' height=\'3\' \/&gt;" />' +
                    '</span>' +
                    '<span class="info"><span>' + _ify['psname'] + '</span>' + _classPrice + '</span>' +
                    '</li>');
            }
            _classify_html += '</ul>'
        }
        _item_html = _tpl_item_.replace(/\{\{cardept-info\}\}/gi, _item.price != undefined ? 'cardept-info' : '')
            .replace(/\{\{cardept-classify\}\}/gi, _item.price  &&_item.gnlistcount  ? '<div class="cardept-classify closeStatus">' : '')
            .replace(/\{\{cardept-classify-e\}\}/gi, _item.price  &&_item.gnlistcount  ? '</div>' : '')
            .replace(/\{\{classifyBtn\}\}/gi, _item.price  &&_item.gnlistcount  ? '<div class="classifyBtn"><em>共' + _item.gnlistcount + '款</em><i class="arrTip up"></i></div>' : '')
            .replace(/\{\{classifyHtml\}\}/gi, _item.price  &&_item.gnlistcount  ? _classify_html : '')
            .replace(/\{\{classify_h\}\}/gi, _item.price  &&_item.gnlistcount  ? ' classify_h' : '')
            .replace(/\{\{hasChild\}\}/gi, _item.price  &&_item.gnlistcount  ? ' 1' : '0')
            .replace(/\{\{img\}\}/gi, _img)
            .replace(/\{\{price\}\}/gi, _price)
            .replace(/\{\{text\}\}/gi, _item.text)
            .replace(/\{\{id\}\}/gi, _item.id)
            .replace(/\{\{parentid\}\}/gi, _item.parentid)
            .replace(/\{\{parentname\}\}/gi, _item.parentname)
            .replace(/\{\{current\}\}/gi, _item.current ? 'current' : '')
            .replace(/\{\{cc\}\}/gi, _item.cc)
            .replace(/\{\{made\}\}/gi, _item.made)
            .replace(/\{\{num\}\}/gi, _item.num)
            .replace(/\{\{seat\}\}/gi, _item.seat)
            .replace(/\{\{carprice\}\}/gi, _item.carprice)
            .replace(/\{\{vstatus\}\}/gi, _item.vstatus)
            .replace(/\{\{ischild\}\}/gi, _item.ischild)


            .replace(/\{\{gob\}\}/gi, _item.correlation_pid)
            .replace(/\{\{gobp\}\}/gi, _item.correlation_cityid)

            .replace(/\{\{newcarEnter\}\}/gi,_item.hasNewcarEnter? '<span class="enter" data-pid="'+ _item.amid +'" data-btntype="enter">进入</span>' : '')


            .replace(/\{\{cur-ico\}\}/gi, _item.curIco ? '<i class="icon-cur">p</i>' : '');
        _html += _item_html;

    }
    return _html;
}
/*
 * 渲染列表固定数据格式
 * */
function render(data) {
    var _html = '<ul class="letter-index">';
    var letters = this.letters = [];
    for (var idx in data) {
        var _list = data[idx];
        letters.push(_list['text'])
        var _group_html = '<li data-letter="' + _list['text'] + '">';
        if (_list['text']) {
            _group_html += '<span class="txt">' + _list['text'] + '</span>'
        }
        _group_html += (_renderitem(_list['children']) + '</li>');
        _html += _group_html;
    }
    return _html + '</ul>';
}

function getdate(url, data) {
    var deferred = $.Deferred()
    var $root = this.$root;

    var cachekey = encodeURIComponent(url + JSON.stringify(data));
    if (cache[cachekey]) {
        deferred.resolve(cache[cachekey]);
        return deferred.promise();
    }
    $.ajax({
        url: url,
        data: data,
        dataType: 'json'
    }).done(function(rs) {
        if (rs) {
            cache[cachekey] = rs;
            deferred.resolve(rs);
        }
    }).fail(function(rs) {
        deferred.reject(rs);
    })

    return deferred.promise();
}

function _generateTransform(b, d, c) {
    return "translate" + (supporthas3d ? "3d" : "") + "(" + b + "px, " + d + "px" + (supporthas3d ? (", " + c + "px)") : ")")
}

function translate(element, dist, speed) {

    var slide = element;
    var style = slide && slide.style;

    if (!style) return;

    /*style.webkitTransitionDuration =
        style.MozTransitionDuration =
            style.msTransitionDuration =
                style.OTransitionDuration =
                    style.transitionDuration = speed + 'ms'; */
    //style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
    style.webkitTransform = _generateTransform(dist.x, dist.y, 0);
    style.msTransform =
        style.MozTransform =
        style.OTransform = 'translateX(' + dist.x + 'px,' + dist.y + 'px)';

}

function drawer(data, title, isback, showletter, option) {
    var that = this;
    var $root = this.$root = createEle(title, isback);
    var showletter = this.showletter = showletter;
    if (typeof data === 'object') {
        if (!data[0]) return false;
        that.render(data);
        that.data = data;
    } else if (typeof data === 'string') {
        that.format = option.format;
        that.neednetwork = 1;
        that.url = data;
        that.formdata = option.formdata;
    }
    $root.on('touchmove', '.title', function(e) {
            e.preventDefault();
            e.stopPropagation();
        }).on('click', '.province-info', function() {
            var _this = $(this);
            if( flag ){
                setTimeout(function(){
                    touchTimeout = null;
                    data = _this.data();
                    that.cb(data);
                    that.deferred.resolve(data);
                    flag = true
                },200)
            }
            flag = false
           
        }).on('click', '.province-info', function(e) {
            e.preventDefault();
        }, false).on('click', '.js-close', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var error = {
                code: 1,
                msg: '用户关闭'
            }
            that.cb(error);
            that.deferred.resolve(error);
            that.hide();
        }).on('click', '.js-back', function(e) {
            e.preventDefault();
            e.stopPropagation();

            that.back();
        })
        .on('touchstart touchmove', '.letter-box', function(e) {
            e.preventDefault();
            $(this).css({
                'background-color': 'rgba(0,0,0,.2)',
                'border-radius': '.1rem'
            });
            if (!e.changedTouches[0]) return false;
            var pageY = e.changedTouches[0]['clientY'];
            // $root.find(".letter-box").append('<div style="position: absolute;z-index:99999;width: 2px;height: 2px;background-color: red;left: 10px;top: '+pageY+'px;"></div>')
            var cx = e.changedTouches[0]['clientX'];
            var cy = e.changedTouches[0]['clientY'];

            var cnode;
            if (document.elementFromPoint) cnode = document.elementFromPoint(cx, cy);


            var ptop = parseInt($(this).css('padding-top'))
            var _itemheight = $(this).find('li').height();

            var _y = pageY - ($(this).offset().top - window.scrollY) - ptop;
            var letterindex = +((_y / _itemheight) + '').split('.')[0];
            var $letter;
            if (cnode && $(cnode).data('letter')) {
                $letter = $root.find(".letter-index").find('li#letter-' + $(cnode).data('letter'))
            } else {
                $letter = $root.find(".letter-index").find('li').eq(letterindex);
            }


            if (!$letter.offset()) return false;


            if ($letter.hasClass('cur')) {

            } else {
                that.iscroll.scrollToElement($letter[0], 10);
                // window.scrollTo($letter[0],10);
            }
        })
        .on('touchend', '.letter-box', function() {
            $(this).css({
                'background-color': '',
                'border-radius': '.1rem'
            })
        })
        .on('tap', '.cardept-classify', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if(e.target.className=='enter') return false;
            if ($(this).hasClass('closeStatus')) {
                $(this).addClass('openStatus').removeClass('closeStatus');
                $(this).parents('.classify_h').addClass('on').find('ul').addClass('slideDN').removeClass('slideUP');
                $(this).find('.arrTip').addClass('down').removeClass('up');
                // $(this).parents('.classify_h').siblings('.cardept-info').removeClass('on').find('ul').addClass('slideUP').removeClass('slideDN');
            } else if ($(this).hasClass('openStatus')) {
                $(this).addClass('closeStatus').removeClass('openStatus');
                $(this).parents('.classify_h').removeClass('on').find('ul').addClass('slideUP').removeClass('slideDN');
                $(this).find('.arrTip').addClass('up').removeClass('down');
            }
            that.iscroll.refresh()
        })
        .on('click', '.cardept-classify', function (e) {
            e.preventDefault();
            if(e.target.className=='enter') return false;
        }, false)
        .on('tap', '.subChild', function () {
            data = $(this).data();
            that.cb(data);
            that.deferred.resolve(data);
        })
        .on('tap','.enter',function(e){
            e.preventDefault();
            e.stopPropagation();
            data = $(this).data();
            that.cb(data);
            that.deferred.resolve(data);
        })
    $pop.on('click tap touchmove touchstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if ($(this).hasClass('drawer-pop')) {
            that.hide();
        }
    })


}
Object.assign = Object.assign || function(target, source) {
    var from;
    var to = Object(target);
    var symbols;

    for (var s = 1; s < arguments.length; s++) {
        from = Object(arguments[s]);

        for (var key in from) {
            if (hasOwnProperty.call(from, key)) {
                to[key] = from[key];
            }
        }

        if (Object.getOwnPropertySymbols) {
            symbols = Object.getOwnPropertySymbols(from);
            for (var i = 0; i < symbols.length; i++) {
                if (propIsEnumerable.call(from, symbols[i])) {
                    to[symbols[i]] = from[symbols[i]];
                }
            }
        }
    }

    return to;
};
Object.assign(drawer.prototype, {
    show: function() {
        var that = this;
        var winheight = $(window).height();
        var iscorll = that.iscroll;
        var scroller = that.$root.find('.drawer-scroller');

        if (!$dom.hasClass('modal-open')) {
            scrolltop = $(window).scrollTop();
            $dom.addClass('modal-open');
            winheight = $(window).height();
            $wrapper.css({ height: (winheight + scrolltop) });
        }
        if (that.neednetwork) {
            scroller.html('<div class="loading-wrap"><div class="loading"></div></div>')
        }
        $pop.attr('class', 'pop drawer-pop');
        setTimeout(function() {

            winheight = $(window).height();
            //that.$root.css('height',winheight)
            //$dom.height(winheight)

        }, 0)
        setTimeout(function() {
            that.$root.css({
                opacity: 0,
                display: 'block'
            }).animate({
                opacity: 1,
                transform: 'translate(0, 0px) translateZ(0px) scale(0.85)',
                '-webkit-transform': 'translate(0, 0px) translateZ(0px) scale(0.85)'
            }, 200)
            that.letterresize()

            if (that.iscroll) {
                that.iscroll.refresh();
            } else {
                window.iscroll = that.iscroll = new IScroll(that.$root.find('.scroll-zone')[0], {
                    scrollBarY: true
                })
            }

        }, 200);

    },
    hide: function() {
        var that = this;
        //scrolltop=-parseInt($wrapper.css('transform').split(',')[1])||scrolltop;
        that.$root
            .animate({
                opacity: 0,
                transform: ''
            }, 200, '', function() {
                $pop.attr('class', 'pop');
                that.$root.hide();

                translate($wrapper[0], { x: 0, y: 0 }, 0)
                $wrapper.css({ height: '', transform: '', '-webkit-transform': '' });

                $dom.css({ 'height': '' }).removeClass('modal-open');
                //$(window).scrollTop(scrolltop)

            })
    },
    back: function() {
        var that = this;

        that.$root
            .animate({
                opacity: 0,
                transform: ''
            }, 200, '', function() {
                that.$root.hide();
            })
    },
    render: function(data) {
        var that = this;
        var $root = that.$root;
        var _html = '<ul class="letter-index">';
        var letters = this.letters = [];
        for (var idx in data) {
            var _list = data[idx];
            letters.push(_list['text'])
            var _group_html = '<li id="letter-' + _list['text'] + '" data-letter="' + _list['text'] + '">';
            if (_list['text']) {
                _group_html += '<span class="txt">' + _list['text'] + '</span>'
            }
            _group_html += (_renderitem(_list['children']) + '</li>');
            _html += _group_html;
        }
        _html = _html + '</ul>';
        var $sz = $root.find('.drawer-scroller');
        $sz.attr('hasdata', true).html(_html);


        var _html_letters = '';
        if (that.showletter && letters) {
            for (var i in letters) {
                var letter = letters[i];
                letter && (_html_letters += '<li><a href="javascript:" data-letter="' + letter + '">' + letter + '</a></li>')
            }
        }
        if (_html_letters) {
            $root.find('.container .letter-box').remove();
            $root.find('.container').append('<ul class="letter-box">' + _html_letters + '</ul>');
        }
        if (data[0]) {} else {
            $sz.attr('hasdata', false).html('<div class="loadlibrary"><i class="icon-cry">O</i><span class="txt">暂无数据</span></div>');
        }

        that.iscroll && that.iscroll.refresh();

        var lazys = $root.find('.lazy').lazyload({
            event: ios7fix,
            load: function(self, elements_left, settings) { //effect : "fadeIn"会导致图片二次闪烁所以去掉
                $(this).addClass('loaded').find('img').css('opacity', 0);
            }
        })
        setTimeout(function() {
            lazys.trigger("appear");
        }, 500)


    },
    letterresize: function() {
        if (!this.letters) return false;
        var $root = this.$root;
        var lcount = this.letters.length;
        var $scrollzone = $root.find('.scroll-zone');
        var _szheight = $scrollzone.height();
        var $lbox = $root.find('.letter-box');
        var _lbheight = $lbox.height();
        var _maxcont = _szheight - 50;
        // var _drawerTit=$root.find('drawer-wrapper .title');
        // console.log(_drawerTit)
        if (_lbheight > _maxcont) {
            $lbox.css({
                'line-height': _maxcont / lcount + 'px'
            })
            _lbheight = $lbox.height();
        } else {

        }
        $lbox.css({
            // top:'50%',
            // 'margin-top':-_lbheight/2
        });
    },
    scrollToElement: function($el, time, offsetX, offsetY, easing) {
        var _scroll = this.iscroll;

        var pos = $el.offset();
        pos.left = -pos.left;
        pos.top = -pos.top;

        pos.left -= _scroll.wrapperOffset.left;
        pos.top -= _scroll.wrapperOffset.top;
        // if offsetX/Y are true we center the element to the screen
        if (offsetX === true) {
            offsetX = Math.round($el[0].offsetWidth / 2 - _scroll.wrapper.offsetWidth / 2);
        }
        if (offsetY === true) {
            offsetY = Math.round($el[0].offsetHeight / 2 - _scroll.wrapper.offsetHeight / 2);
        }

        pos.left -= offsetX || 0;
        pos.top -= offsetY || 0;

        pos.left = pos.left > 0 ? 0 : pos.left < _scroll.maxScrollX ? _scroll.maxScrollX : pos.left;
        pos.top = pos.top > 0 ? 0 : pos.top < _scroll.maxScrollY ? _scroll.maxScrollY : pos.top;

        time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(_scroll.x - pos.left), Math.abs(_scroll.y - pos.top)) : time;
        pos.top && _scroll.scrollTo(pos.left, pos.top, time, easing);
    }

})

Object.assign(drawer.prototype, {
    request: function(cb) {

        var that = this;
        var $root = this.$root;
        var deferred = this.deferred = $.Deferred();
        that.show();
        if (that.neednetwork) {
            getdate.call(that, that.url, that.formdata)
                .done(function(rs) {
                    var data = that.format(rs);
                    that.data = data;
                    that.render(data);
                    that.letterresize();
                    //that.show();
                }).fail(function(rs) {
                    $root.find(".drawer-scroller").html('<div class="loadlibrary"><i class="icon-cry">O</i><span class="txt">网络加载失败，请刷新重试</span></div>');
                    that.deferred.reject(rs);
                    tip.show('网络加载失败，请刷新重试');
                })
        } else {
            that.show();
        }
        that.cb = cb || function() {};
        // console.log(that.deferred.promise())
        return that.deferred.promise()
    }
})

window.drawer = drawer;
export default drawer;