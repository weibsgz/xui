/* eslint-disable */

import '@/assets/css/common.scss'
import './index.scss'
import $ from "./touch-zepto";//触屏查找DOM插件
import Xplayer from './xplayer';



$(function () {
    class stateGrid {
        constructor(){
           this.bindEvent();
        }
        //点击事件
        bindEvent(){
            var _this = this;
            $('.bindEvnet').click(function(){
                new Xplayer({
                    container: $('.video')[0],
                    screenshot: true,
                    autoplay: true,
                    theme: '#FADFA3',  
                        video: {
                        url: 'https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4',
                        pic: 'https://i.loli.net/2019/06/06/5cf8c5d9c57b510947.png',
                        thumbnails: 'thumbnails.jpg',
                    }
                });
            });
        }
    }
    new stateGrid();//初始化
});
