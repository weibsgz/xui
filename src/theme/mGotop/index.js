/* eslint-disable */
import '@/assets/css/common.scss'
import './index.scss'
import $ from "./touch-zepto";//触屏查找DOM插件
import gotop from './gotop';




$(function () {
    class stateGrid {
        constructor(){
           this.DOM = $(document);
           this.bindEvent();
        }
        //点击事件
        bindEvent(){
            var _this = this;
            for(var i=0;i<3000;i++){
                $(".effectDisplay_body_ul").append(`<li>${i}</li>`)
            }
            gotop()
        }
    }
    new stateGrid();//初始化
});
