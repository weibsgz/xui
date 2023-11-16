/* eslint-disable */

import '@/assets/css/common.scss'
import './index.scss'
import $ from "./touch-zepto";//触屏查找DOM插件
import OpenApp from "./openapp";//唤起app

$(function () {
    class stateGrid {
        constructor(){
           this.DOM = $(document);
           this.bindEvent();
        }
        //点击事件
        bindEvent(){
            var _this = this;
            _this.DOM.find('.bindEvnet').on('click',function(){
                var _Scheme = 'appxcar://m.xcar.com.cn/startup?action=articledetail&id=2055110';
                alert('唤起app成功')
                new OpenApp({
                    name: "appxcar",
                    scheme_Ios: _Scheme,
                    scheme_Adr: _Scheme,
                    download_url: `https://a.xcar.com.cn/appdown/attachment.php?app=xcar`,
                    download_url_YYB_ios: `https://a.app.qq.com/o/simple.jsp?pkgname=com.xcar.activity&g_f=991653&pkgname=com.xcar.activity&android_scheme=${encodeURIComponent(_Scheme)}&ios_scheme=${encodeURIComponent(_Scheme)}`,
                    download_url_YYB_andorid: `https://a.app.qq.com/o/simple.jsp?pkgname=com.xcar.activity&android_scheme=${encodeURIComponent(_Scheme)}&ios_scheme=${encodeURIComponent(_Scheme)}`,
                    universal_links_Ios: `https://a.xcar.com.cn/universal_links/xcar/index.html`
                });
            });
        }

    }
    new stateGrid();//初始化
});
