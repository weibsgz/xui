/* eslint-disable */

import '@/assets/css/common.scss'
import './index.scss'
import $ from "./touch-zepto";//触屏查找DOM插件
import './lazyload';//懒加载



$(function () {
    class stateGrid {
        constructor(){
           this.DOM = $(document);
           for(var i=0;i<1000;i++){
            $(".effectDisplay_box").append(`<li class="lazy" data-original="https://image.xcar.com.cn/attachments/a/day_210105/2021010522_b9563a5fbaa6f38d46f1SOHDFJRoV2UK.jpg">
                <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='4' height='3' />" style="opacity: 0;">
            </li>`)
           }
           this.bindEvent();
        }
        //点击事件
        bindEvent(){
            var _this = this;
            _this.toload($('.lazy'));
        }
        /*懒加载*/
        toload($dom) {
            var ios7fix = 'scroll' + ($.os.ios && $.os.version.indexOf('7.0') > -1 && $.browser.safari ? ' touchmove touchend' : '');
            $dom.lazyload({
                event: ios7fix,
                load: function (self, elements_left, settings) { //effect : "fadeIn"会导致图片二次闪烁所以去掉
                    $(this).addClass('loaded').find('img').css('opacity', 0);
                }
            })
        }
    }
    new stateGrid();//初始化
});
