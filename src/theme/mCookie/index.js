/* eslint-disable */

import '@/assets/css/common.scss'
import './index.scss'
import $ from "./touch-zepto";//触屏查找DOM插件
import './cookie';//懒加载



$(function () {
    class stateGrid {
        constructor(){
            $(".effectDisplay_box").append(`<div class="bindEvnet" id="setCookie">点击添加一个cookie</div>
            <div  class="bindEvnet" id="getCookie">获取刚存入的cookie</div>`)
           this.bindEvent();
        }
        //点击事件
        bindEvent(){
            var _this = this;
            
            var setCookie = document.getElementById('setCookie');
            var getCookie = document.getElementById('getCookie');
            var cookieHistroy = $.cookie('cityid','',{'expires':-1});//删除cookie
           
            setCookie.onclick=function(){
                $.cookie("cityid", '475',{'expires':86400});//设置cookie
                alert('添加cookie成功，可在Application里面查看哦！')
            };
            getCookie.onclick=function(){
                var cookieLength= document.cookie.length;
                if(cookieLength>0){
                    var ckie = $.cookie('cityid');//获取cookie
                    alert('这个'+ckie+'是你刚刚存入的cookie')
                }else{
                    alert('先存一个cookie吧')
                }
            };
        }
    }
    new stateGrid();//初始化
});
