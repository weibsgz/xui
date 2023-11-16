/* eslint-disable */

import '@/assets/css/common.scss'
import './index.scss'
import $ from "./touch-zepto";//触屏查找DOM插件
import Pikaday from './pikaday';//时间插件




$(function () {
    class stateGrid {
        constructor(){
           this.DOM = $(document);
           this.bindEvent();
        }
        //点击事件
        bindEvent(){
            var _this = this;
            var cardpicker = new Pikaday({bound: 1});
            _this.DOM.find('.bindEvnet').on('click',function(){
                cardpicker.gotoToday()
                cardpicker.config({
                    maxDate: new Date(),
                    minDate: new Date('2011' + '/1/1'),
                    onSelect: function (date) {
                        var param = {
                            card_time: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
                        }
                        alert(param.card_time)
                    }
                })
                cardpicker.show();  
            });
        }
    }
    new stateGrid();//初始化
});
