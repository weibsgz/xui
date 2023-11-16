/* eslint-disable */

import '@/assets/css/common.scss'
import './index.scss'
import $ from "./touch-zepto";//触屏查找DOM插件
import checkMobile from './checkMobile';
import tip from './tip';


$(function () {
    class stateGrid {
        constructor(){
            $(".effectDisplay_box").append(`<input type="text" value="" placeholder="请输入电话号码" class="num" /><div class="bindEvnet" id="checkMobile">校验一下</div>`)
           this.bindEvent();
        }
        //点击事件
        bindEvent(){
            var _this = this;
            $('#checkMobile').on('click',function(){
                let _num = $('.num').val();
                if(checkMobile(_num)){
                    tip.show('此号码符合规则','info',1000);
                }else{
                    tip.show('请填写正确的电话号码','info',1000);
                }  
            })

        }
    }
    new stateGrid();//初始化
});
