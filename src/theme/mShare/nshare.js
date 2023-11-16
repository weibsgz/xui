/* eslint-disable */
import wxapi from './jweixin';
import jxcar from './jxcar';

var global = window;

var jsonpid = 0;


var ns = global.nshare = {
    version: "1.0.0"
};
ns.wxapi = wxapi;
ns.jxcar = jxcar;
var data = ns.data = {
    api: '//a.xcar.com.cn/jssdk/wxsdk.php'
};
var events = data.events = {};
// Bind event
var on = ns.bind = ns.on = function(name, callback) {
    var list = events[name] || (events[name] = []);
    list.push(callback);
    return ns;
};
// Remove event. If `callback` is undefined, remove all callbacks for the
// event. If `event` and `callback` are both undefined, remove all callbacks
// for all events
var off = ns.unbind = ns.off = function(name, callback) {
    // Remove *all* events
    if (!(name || callback)) {
        events = data.events = {};
        return ns;
    }

    var list = events[name];
    if (list) {
        if (callback) {
            for (var i = list.length - 1; i >= 0; i--) {
                if (list[i] === callback) {
                    list.splice(i, 1)
                }
            }
        } else {
            delete events[name]
        }
    }

    return ns;
};
var emit = ns.trigger = ns.emit = function(name, data) {
    var list = events[name],
        fn;
    if (list) {
        list = list.slice();
        while ((fn = list.shift())) {
            fn(data)
        }
    }
    return ns;
};

var appendQuery = function(url, query) {
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
}
var getconfigapi = function(options) {
    var document = global.document;
    options.url = appendQuery(options.url, 'callback=?');
    var callbackName = options.jsonpCallback || 'jsonp' + (++jsonpid),
        script = document.createElement('script'),
        cleanup = function() {
            clearTimeout(abortTimeout)

            if (script.parentNode != null)
                script.parentNode.removeChild(script)
            delete window[callbackName]
        },
        abort = function(type) {
            cleanup()
            // In case of manual abort or timeout, keep an empty function as callback
            // so that the SCRIPT tag that eventually loads won't result in an error.
            if (!type || type == 'timeout')
                window[callbackName] = function() {}
        },
        xhr = {
            abort: abort
        },
        abortTimeout;
    window[callbackName] = function(data) {
        cleanup()
        options.success && options.success(data, xhr, options)
    }

    script.onerror = function() {
        abort('abort')
        options.error && options.error();
    }

    script.src = options.url.replace(/=\?/, '=' + callbackName);
    //jsonp charset

    document.getElementsByTagName('head')[0].appendChild(script)

    if (options.timeout > 0)
        abortTimeout = setTimeout(function() {
            abort('abort')
            options.error && error();
        }, options.timeout)

    return xhr
}

ns.jxcar.on('share', function(data) {
    ns.emit('share', data);
});
ns.ready = function(sharedata) {
    wxapi.ready(function() {
        wxapi.status = 1;
        ns.setwxdata(sharedata);
    });
};
ns.setwxdata = function(sharedata) {
    var shareapis = ['Timeline', 'AppMessage', 'QQ', 'Weibo', 'QZone'];
    if (wxapi.status) {
        for (var key = 0, len = shareapis.length; key < len; key++) {
            var shareapi = shareapis[key];
            var onfn = wxapi['onMenuShare' + shareapi];
            if (onfn) onfn({
                title: sharedata['title'],
                desc: sharedata['desc'],
                link: sharedata['url'],
                imgUrl: sharedata['pic'],
                type: '',
                dataUrl: '',
                success: function(resp) {
                    ns.emit(shareapi.toLowerCase() + 'success', resp);
                },
                cancel: function(resp) {
                    ns.emit(shareapi.toLowerCase() + 'cancel', resp);
                },
                fail: function(resp) {
                    ns.emit(shareapi.toLowerCase() + 'fail', resp);
                },
                complete: function(resp) {
                    ns.emit(shareapi.toLowerCase() + 'complete', resp);
                },
                trigger: function(resp) {
                    ns.emit(shareapi.toLowerCase() + 'trigger', resp);
                }

            })
        }

    } else {
        var url = location.href;
        var configapi = data.api;
        /*$.ajax({
         type:'GET',
         url:configapi,
         data:{url:url},
         dataType:'jsonp',
         jsonp:'callback',
         timeout:20000,
         success:function(rs){
         var config=JSON.parse(rs);
         config['jsApiList']=['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQzone', 'hideOptionMenu', 'showOptionMenu'];
         wxapi.config(config);
         ns.ready(sharedata);
         }
         });*/

        getconfigapi({
            type: 'GET',
            url: configapi + '?url=' + encodeURIComponent(location.href),
            jsonp: 'callback',
            timeout: 20000,
            success: function(rs) {
                var config = JSON.parse(rs);
                config['jsApiList'] = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQzone', 'hideOptionMenu', 'showOptionMenu'];
                wxapi.config(config);
                ns.ready(sharedata);
            }
        })

    }
}
ns.setxcardata = function(sharedata) {
    if (jxcar.status) { //加载成功直接执行
        jxcar.shareInfo && jxcar.shareInfo({
            "data": {
                "title": sharedata['title'],
                "message": sharedata['desc'],
                "targetUrl": sharedata['url'],
                "imageUrl": sharedata['pic']
            }
        });
    } else {
        jxcar.ready(function() {
            jxcar.status = 1;
            jxcar.shareInfo && jxcar.shareInfo({
                "data": {
                    "title": sharedata['title'],
                    "message": sharedata['desc'],
                    "targetUrl": sharedata['url'],
                    "imageUrl": sharedata['pic']
                }
            });
        });
    }
}
/*
 * @sharedata : {title:String,desc:String,url:String,pic:String}
 * */
ns.setdata = function(sharedata) {

    /*
     * 不同的native环境加载被动分享组件
     * */
    if (jxcar.isSupport()) {
        ns.setxcardata(sharedata);
    } else if (/MicroMessenger\/([\d\.]+)/.test(navigator.userAgent)) {
        ns.setwxdata(sharedata)
    }

};

export default ns;