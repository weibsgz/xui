/* eslint-disable */
/**
 * Created by tonwe on 2017/9/13.
 */

/*
 * 基础类库
 * */

function OpenApp(opt) {
    this.isPlatform = {
        UA: navigator.userAgent,
        isAndroid: function() {
            return this.UA.indexOf('Android') > -1 || this.UA.indexOf('Adr') > -1;
        },
        isIos: function() {
            return {
                ios: !!this.UA.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                version: !!this.UA.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? parseInt((navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/)[1], 10) : 0
            };
        },
        isCanUseYYB: function() {
            return this.UA.toLowerCase().indexOf('micromessenger') > -1;
        }
    };
    this.config = {
        name: '',
        scheme_Ios: '',
        scheme_Adr: '',
        download_url: '',
        download_url_YYB_ios: '',
        download_url_YYB_andorid: '',
        universal_links_Ios: '',
        timeout: 1500
    };
    for (var key in opt) {
        this.config[key] = opt[key];
    };

    var platform_type = 0;
    if (this.isPlatform.isCanUseYYB()) {
        if (this.isPlatform.isIos().ios && this.isPlatform.isIos().version >= 9) {
            /*ios9+ 应用宝*/
            platform_type = 1;
        } else if ((this.isPlatform.isIos().ios && this.isPlatform.isIos().version < 9) || this.isPlatform.isAndroid()) {
            /*ios9-或android 应用宝*/
            platform_type = 2;
        } else {
            return;
        };
    } else {
        if (this.isPlatform.isIos().ios && this.isPlatform.isIos().version >= 9) {
            //ios9+ 浏览器
            platform_type = 1;
        } else if ((this.isPlatform.isIos().ios && this.isPlatform.isIos().version < 9) || this.isPlatform.isAndroid()) {
            //ios9-或android 浏览器
            platform_type = 3;
        } else if(!this.isPlatform.isIos().ios && !this.isPlatform.isAndroid()) {
            //非ios和安卓浏览器
            platform_type = 4;
        } else {
            return;
        }
    }
    this._init(platform_type);

}
OpenApp.prototype = {
    _init: function(type) {
        if (type == 1) {
            window.location.href = this.getIos9Scheme(this.config.name + '://');
        } else if (type == 2) {
            var _url;
            if (this.isPlatform.isIos().ios) {
                _url = this.config.download_url_YYB_ios;
            } else {
                _url = this.config.download_url_YYB_andorid;
            };
            window.location.href = _url;
        } else if(type == 4){
            _url = this.config.download_url;
            window.location.href = _url;
        } else {
            var schemeUrl, downUrl;
            if (this.isPlatform.isIos().ios) {
                schemeUrl = this.config.scheme_Ios;
            } else {
                schemeUrl = this.config.scheme_Adr;
            };
            downUrl = this.config.download_url
            this.openAppFn(schemeUrl, function(opend) {
                if (!opend) {
                    window.location.href = downUrl;
                };
            });
        }
    },
    // getIos9Scheme:function(s){
    //      return this.config.universal_links_Ios + "?ref=" +encodeURIComponent(this.config.scheme_Ios) + '&downsrc=' + encodeURIComponent(this.config.download_url);
    // },
    getIos9Scheme: function(s) {
        if (this.isPlatform.isCanUseYYB()) {
            return this.config.universal_links_Ios + "?ref=" + encodeURIComponent(this.config.scheme_Ios) + '&downsrc=' + encodeURIComponent(this.config.download_url_YYB_ios);
        } else {
            return this.config.universal_links_Ios + "?ref=" + encodeURIComponent(this.config.scheme_Ios) + '&downsrc=' + encodeURIComponent(this.config.download_url);
        };
    },
    openAppFn: function(openUrl, callback) {
        var intHandle = null,
            that = this,
            clearIntHandle = function() {
                clearInterval(intHandle);
            };

        function checkOpen(cb) {
            var timeout = that.config.timeout,
                cycleCount = 20,
                timeoutCount = 100,
                threshold = 3000;
            var _clickTime = +(new Date());

            function check(elsTime) {
                if (elsTime > threshold || document.hidden || document.webkitHidden) {
                    cb(true);
                } else {
                    cb(false);
                }
            };
            var _count = 0;
            intHandle = setInterval(function() {
                _count++;
                var elsTime = +(new Date()) - _clickTime;
                if (_count >= timeoutCount || elsTime > threshold) {
                    clearIntHandle();
                    check(elsTime);
                };
            }, cycleCount);

        };
        var aLink = null,
            body;

        if (navigator.userAgent.toLowerCase().indexOf('huawei') > -1) {
            aLink = document.createElement("iframe"),
                body = document.body;
            aLink.style.cssText = "display:none;width:0px;height:0px;";
            aLink.src = openUrl;
            body.appendChild(aLink);
        } else {
            aLink = document.createElement("a"),
                body = document.body;
            aLink.style.cssText = "display:none;width:0px;height:0px;";
            aLink.href = openUrl;
            body.appendChild(aLink);
            aLink.click();
        };
        if (callback) {
            checkOpen(function(opened) {
                callback && callback(opened);
            });
        };
        var visibilitychange = function() {
            var tag = document.hidden || document.webkitHidden;
            tag && clearIntHandle();;
        };
        document.addEventListener('visibilitychange', visibilitychange, false);
        document.addEventListener('webkitvisibilitychange', visibilitychange, false);
        window.addEventListener('pagehide', function() {
            clearIntHandle();
        }, false);
        window.addEventListener('blur', function() {
            clearIntHandle();
        }, false);
    }
}

export default OpenApp;