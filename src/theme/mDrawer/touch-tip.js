/* eslint-disable */
import $ from './touch-zepto'

const Tip={

    /**
     * 显示tips提示
     * @param {String} str 内容
     * @param {String} type 类型 [info|right|wrong|loading]
     * @param {Number} delay 展示时长,单位ms -1表示不消失
     */
    show: function (str, type, delay) {
        var types = {
            "info": "",
            "right": "icon-pop-hook",
            "wrong": "icon-pop-info",
            "loading": "icon-loading loading-animate"
        };
        var cls = types[type] || types["info"];
        dom = $('#' + tipId);

        if (dom.size() === 0) {
            $(document.body).append(tipTmpl({id: tipId}));
            dom = $('#' + tipId);
        }

        dom.find('span').html(str);
        dom.find('.pop-layer i').attr('class', cls);
        if (cls == types["info"]) {
            dom.find('.pop-layer').addClass('no-icon');
        }
        else {
            dom.find('.pop-layer').removeClass('no-icon');
        }
        dom.css({
            'opacity': 100
        }).show();
        currentId += 1;
        dom.data('cid', currentId);
        clearTimeout(clearTimer);
        clearTimeout(tmr);
        if (delay != -1) {
            tmr = setTimeout(Tip.hide, delay || 2400);
        }
        return currentId;
    },

    /**
     * 隐藏tips
     */
    hide: function (id) {
        if (id && dom && +dom.data('cid') != id) {
            return;
        }
        clearTimeout(clearTimer);
        clearTimer = setTimeout(function(){
            if (dom) {
                dom.animate({
                    opacity: 0
                }, 200, 'ease-out', function () {
                    dom.hide();
                });
            }
        },50);
    }
};

var tmpl = {
    'tips': function(data){

        var __p=[],_p=function(s){__p.push(s)};
        __p.push('<div class="pop-layer-wp" id="');
        _p(data.id);
        __p.push('" style="display:none; z-index:999;"><div class="pop-layer"><i class="icon-pop-info"></i><span></span></div></div>');
        return __p.join("");
    }
};

var tipTmpl = tmpl.tips;
var tipId = 'J_tip_' + Math.random().toString().substr(8);
var currentId = 0;
//container
var dom, tmr;
var clearTimer = null;


export default Tip;