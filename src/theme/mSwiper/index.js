/* eslint-disable */

import '@/assets/css/common.scss';
import './index.scss';
import $ from './touch-zepto'; //触屏查找DOM插件
import Swiper from './swiper'; //懒加载
console.log('123123123',Swiper);
$(function () {
	class stateGrid {
		constructor() {
            $('.effectDisplay_box').append(`
            
            <div class="tabwrap swiper-container" id="swiper-container-id" >
                <ul class="swiper-wrapper">
                        <li class="swiper-slide">
                            <a href="javascript:;" >
                                <img src="https://pic.xcar.com.cn/strategy/cos/image/2021/1/14/strategy_20210114100454605048165755523.png" >
                            </a>
                        </li>
                        <li class="swiper-slide">
                            <a href="javascript:;" >
                                <img src="https://pic.xcar.com.cn/strategy/cos/image/2021/1/11/strategy_20210111162100109115603829686.jpeg" >
                            </a>
                        </li>
                        <li class="swiper-slide">
                            <a href="javascript:;" >
                                <img src="https://pic.xcar.com.cn/strategy/cos/image/2021/1/15/strategy_20210115092755581512769603442.jpg" >
                            </a>
                        </li>
                </ul>
                <div class="tab-point swiper-pagination-bullets"></div>
            </div>
           
            
            
            
            
            
            `);
            this.mySwiper = null;
			this.bindEvent();
		}
		//点击事件
		bindEvent() {
			var _this = this;

			_this.mySwiper = new Swiper('#swiper-container-id', {
                loop: true,
                autoplay: 3000,
                autoplayDisableOnInteraction: false,
                pagination: '.swiper-pagination-bullets',
                observer: true
            });
		}
	}
	new stateGrid(); //初始化
});
