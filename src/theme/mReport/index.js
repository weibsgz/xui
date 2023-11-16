/* eslint-disable */

import '@/assets/css/common.scss'
import './index.scss'
import $ from "./touch-zepto";//触屏查找DOM插件
import report from "./report";//侧拉抽屉


$(function () {
    class stateGrid {
        constructor(){
           this.DOM = $(document);
           this.bindEvent();
        }
        //点击事件
        bindEvent(){
            var _this = this;
            //诸葛初始化统计
            _this.DOM.find('.bindEvnet1').on('click',function(){
                report.zhuGeIoInit(1,1,'detail_page_view',{
                });
                alert('诸葛初始化统计成功')
            });
            //诸葛点击事件统计
            _this.DOM.find('.bindEvnet2').on('click',function(){
                report.zhuGeIoCustom('content_consume',{});
                alert('诸葛点击事件统计成功')
            });
            //爱卡自有统计
            _this.DOM.find('.bindEvnet3').on('click',function(){
                report.clicklog(125710)
                alert('爱卡自有点击事件统计成功')
            });
        }

    }
    new stateGrid();//初始化
});
