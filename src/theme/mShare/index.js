/* eslint-disable */

import '@/assets/css/common.scss'
import './index.scss'
import $ from "./touch-zepto";//触屏查找DOM插件
import tshare from './tshare';
import nshare from './nshare';


$(function () {
    class stateGrid {
        constructor(){
           this.bindEvent();
           nshare.setdata({
            to:'qzone',
            title: '【爱卡原创】2020年中型车保值率TOP10出炉：雅阁失冠，蒙迪欧上榜',
            desc: "随着消费者购车消费升级，空间更大、档次更高一些的中型车成为了消费重心，在低迷的车市上持续火爆。可是买什么车在开几年之后能卖出一个好价格呢？",
            url:"http://newcar.xcar.com.cn/202101/news_2055745_1.html",
            pic: "http://pic2.xcarimg.com/img/07news/202101/20210120135400612740590731634.jpg"
            });
        }
        //点击事件
        bindEvent(){
            var _this = this;
            $('.bindEvnetOne').click(function(){
                var param = {
                    to:'tsina',
                    title: '【爱卡原创】2020年中型车保值率TOP10出炉：雅阁失冠，蒙迪欧上榜',
                    desc: "随着消费者购车消费升级，空间更大、档次更高一些的中型车成为了消费重心，在低迷的车市上持续火爆。可是买什么车在开几年之后能卖出一个好价格呢？",
                    url:"http://newcar.xcar.com.cn/202101/news_2055745_1.html",
                    pic: "http://pic2.xcarimg.com/img/07news/202101/20210120135400612740590731634.jpg"
                }
                tshare.share(param, function (data) {
                    console.log(444444)
                });
            });
            $('.bindEvnetTwo').click(function(){
                var param = {
                    to:'qzone',
                    title: '【爱卡原创】2020年中型车保值率TOP10出炉：雅阁失冠，蒙迪欧上榜',
                    desc: "随着消费者购车消费升级，空间更大、档次更高一些的中型车成为了消费重心，在低迷的车市上持续火爆。可是买什么车在开几年之后能卖出一个好价格呢？",
                    url:"http://newcar.xcar.com.cn/202101/news_2055745_1.html",
                    pic: "http://pic2.xcarimg.com/img/07news/202101/20210120135400612740590731634.jpg"
                }
                tshare.share(param, function (data) {
                    console.log(444444)
                });
            });
        }
    }
    new stateGrid();//初始化
});
