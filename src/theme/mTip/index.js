/* eslint-disable */

import '@/assets/css/common.scss'
import './index.scss'
import $ from "./touch-zepto";//触屏查找DOM插件
import tip from './tip';



$(function () {
    class stateGrid {
        constructor(){
            $(".effectDisplay_box").append(`<div class="bindEvnet" id="showTip">点击显示tip框</div>`)
           this.bindEvent();
        }
        //点击事件
        bindEvent(){
            var _this = this;
            $('#showTip').on('click',function(){
                tip.show('这是要显示的内容','info',1000);
            })

        }
    }
    new stateGrid();//初始化
});
