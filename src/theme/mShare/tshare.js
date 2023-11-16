/* eslint-disable */
import jxcar from './jxcar';

var global = window;

var ts = global.tshare = {
    version: "1.0.0"
};
var ua = navigator.userAgent;
var toparam = function(obj) {
    var params = []

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) params.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
    }
    return params.join('&')
}
var isuc = ua.match(/\s?UC|JUC|UCWEB/), //uc浏览器
    isqq = ua.match(/MQQBrowser\/([\d\.]+)/)

if (isqq) {
    var qApiSrc = {
        lower: "http://3gimg.qq.com/html5/js/qb.js",
        higher: "http://jsapi.qq.com/get?api=app.share"
    };
    var version = getVersion(ua.split("MQQBrowser/")[1]);
    var b = (version < 5.4) ? qApiSrc.lower : qApiSrc.higher;
    var d = document.createElement("script");
    var a = document.getElementsByTagName("body")[0];
    d.setAttribute("src", b);
    a.appendChild(d)
}

function getVersion(c) {
    var a = c.split("."),
        b = parseFloat(a[0] + "." + a[1]);
    return b
};
ts.tonative = function(param, cb) {
    var sharetypes = {
        'tsina': 1,
        'weixin': 2,
        'timeline': 3,
        'friend': 4,
        'qzone': 5
    };
    jxcar.share({
        "shareType": sharetypes[param.to],
        "data": {
            "title": param.title,
            "message": param.desc,
            "targetUrl": param.url,
            "imageUrl": param.pic
        }
    }, function(data) {
        cb && cb(data);
    });
};
ts.toweb = function(param, cb) {
    var _param = {
        to: param.to,
        title: param.title,
        desc: param.desc,
        url: param.url,
        pic: param.pic,
        comment: ' '
    };
    if (param.to == 'tsina') {
        _param.title = param.desc
    }
    //https链接无法分享，估增加1.0.3版本增加http://前缀，原来为var api = '//s.share.baidu.com/?click=1&uid=0&type=text&' + toparam(_param);
    var api = 'http://s.share.baidu.com/?click=1&uid=0&type=text&' + toparam(_param);
    cb && cb(param);
    if (param.target) { //用于note2 不能触发click
        /*var $dom=$(param.target);
         $dom.attr('target','_blank').attr('href',api);
         setTimeout(function(){
         $dom.removeAttr('target').attr('href','javascript:')
         },0)*/

        var dom = param.target;
        dom.setAttribute('target', '_blank');
        dom.setAttribute('href', api);
        setTimeout(function() {
            dom.setAttribute('target', '');
            dom.setAttribute('href', 'javascript:')
        }, 0)
    } else {
        var dom = document.createElement('a');
        dom.setAttribute('target', '_blank');
        dom.setAttribute('href', api);
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(dom);
        //dom.click();
        var fireOnThis = dom;
        if (document.createEvent) {
            var evObj = document.createEvent('MouseEvents');
            evObj.initEvent('click', true, false);
            fireOnThis.dispatchEvent(evObj);
        } else if (document.createEventObject) {
            fireOnThis.fireEvent('click');
        }

        setTimeout(function() {
            head.removeChild(dom);
        }, 0)
        //$('<a href="' + api + '" target="_blank"></a>')[0].click();
    }
    return api;
};

ts.tobrowser = function(param, cb) {
    var applist = {
        tsina: ['kSinaWeibo', 'SinaWeibo', 11, '新浪微博'],
        weixin: ['kWeixin', 'WechatFriends', 1, '微信好友'],
        timeline: ['kWeixinFriend', 'WechatTimeline', '8', '微信朋友圈'],
        friend: ['kQQ', 'QQ', '4', 'QQ好友'],
        qzone: ['kQZone', 'QZone', '3', 'QQ空间']
    };


    var _from = '爱卡汽车',
        sharetype;


    if (isuc) {
        sharetype = (ua.indexOf("iPhone") > -1 || ua.indexOf("iPod") > -1) ? applist[param.to][0] : applist[param.to][1]
        if (sharetype == 'QZone') {
            var _src = "mqqapi://share/to_qzone?src_type=web&version=1&file_type=news&req_type=1&image_url=" + param.pic + "&title=" + param.title + "&description=" + param.desc + "&url=" + param.url + "&app_name=" + _from
            var _ifr_wrap = document.createElement("div");
            _ifr_wrap.style.visibility = "hidden",
                _ifr_wrap.innerHTML = '<iframe src="' + _src + '" scrolling="no" width="1" height="1"></iframe>',
                document.body.appendChild(_ifr_wrap), setTimeout(function() {
                _ifr_wrap && _ifr_wrap.parentNode && _ifr_wrap.parentNode.removeChild(_ifr_wrap)
            }, 5000);
        }
        if (window.ucweb) {
            ucweb.startRequest("shell.page_share", [param.title, param.desc, param.url, sharetype, "bbb", "cccc", "aaaaa"])
        } else {
            ucbrowser.web_share(param.title, param.desc, param.url, sharetype, "bbbb", "cccc", "aaaaa")
        }
    } else if (isqq) {
        sharetype = applist[param.to][2]
        var ah = {
            url: param.url,
            title: param.title,
            description: param.desc,
            img_url: param.pic,
            img_title: param.title,
            to_app: sharetype, //微信好友1,腾讯微博2,QQ空间3,QQ好友4,生成二维码7,微信朋友圈8,啾啾分享9,复制网址10,分享到微博11,创意分享13
            cus_txt: param.desc
        };
        if (window.browser) {
            browser.app.share(ah)
        } else {
            window.qb.share(ah)
        }
    }
    cb && cb(param);
};


var share = ts.share = function(param, cb) {

    if (jxcar.isSupport()) {
        if (jxcar.status = 1) {
            if (jxcar.share) {
                return ts.tonative(param, cb);
            } else {
                return ts.toweb(param, cb);
            }
        } else {
            jxcar.read(function() {
                jxcar.status = 1;
                share(param, cb);
            })
        }

    }
    /*else if(isuc||isqq){
     return ts.tobrowser(param, cb)
     }*/
    else {
        return ts.toweb(param, cb)
    }
}
export default ts;
