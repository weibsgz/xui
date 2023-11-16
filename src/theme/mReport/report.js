/* eslint-disable */
import $ from './touch-zepto';
import cookie from './cookie'
import {
    getParam,
    zhuGeIoDelObj,
    copyObj
} from './getParam'

/**
 * @desc 自定义统计依赖于xcar统计
 * @method  clickP
 * @param {String} str1
 * @param {String} str2
 * @param {String} str3
 * */
exports.clickP = function (str1, str2, str3) {
    if (typeof clickP == 'function') {
        try {
            clickP(str1, str2, str3);
        } catch (e) {}
    } else {

    }
};
/**
 * @desc 自定义统计依赖于xcar统计
 * @method  clicklog
 * @param {String} str1
 * @param {String} str2
 * @param {String} str3
 * */
exports.clicklog = function (str1, str2, str3) {
    if (typeof clicklog == 'function') {
        try {
            clicklog(str1, str2, str3);
        } catch (e) {
           
        }
    } else {

    }
};
exports.clickinterface = function (phone400, did, pbid, bid, pserid, mid, start_time) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = baseurl + "nxcar/index.php/dealerApi/index?phone400=" + phone400 + "&did=" + did + "&pbid=" + pbid + "&bid=" + bid + "&pserid=" + pserid + "&mid=" + mid + "&start_time=" + start_time;
    document.getElementsByTagName('body')[0].appendChild(script);
};

/**
 * @desc 诸葛初始化统计
 * @method zhuGeIoInit
 * @param {Int} 1 开启全局通用统计参数 0 关闭 默认开启
 * @param {Int} 1 开启Identify统计参数 0 关闭 默认开启
 * @param {String} comEventName 通用统计事件名称
 * @param {String} comAttrName 通用统计事件属性名称
 * @param {String} eventName 浏览统计事件名称
 * @param {Int} pageType 页面类型
 * @param {Int} id 页面id属性
 * 
 * 
 * */

/**
 * @desc 诸葛统计 页面接口请求
 * @method getParam
 * @param {Int} pageType 页面类型   1、车系
 * @param {Int} id 页面id属性
 * 
 * */

exports.zhuGeIoInit = function (isSetSuperProperty = 1, isIdentify = 1, comEventName = '', comAttrName = {}, eventName = '', pageType = 0, id = 0, extraAttr = {}) {

    let uid = $.cookie('_discuz_uid');
    let username = $.cookie('_xcar_name');
    if (isSetSuperProperty) {
        zhuge.setSuperProperty({
            platform_type: 'M',
            login_id: uid,
            project_name: 'XCAR',
            login_status: uid ? 1 : 0,
        });
    }
    if (uid && isIdentify && !$.cookie('isIdentify')) {
        zhuge.identify(uid, {
            user_id: uid,
            user_name: username,
        });
        $.cookie('isIdentify', 1, {
            'expires': 86400
        })
    }
    if (comEventName) {
        zhuge.track(comEventName, comAttrName);
    } else {

        getParam(pageType, id).then(res => {
            let _res = Object.assign(copyObj(res), copyObj(extraAttr))
            zhuge.track(eventName, _res);
        }).catch(function (err) {
            console.log(err);
        });
    }


}
exports.zhuGeIoCustom = function (eventName = '', attrName = {}, delAttrArr = []) {
    let delResult = {}
    if (delAttrArr.length) {
        delResult = zhuGeIoDelObj(delAttrArr)
    } else {
        delResult = {}
    }
    let _newObj = Object.assign(copyObj(attrName), copyObj(delResult))
    zhuge.track(eventName, _newObj);
}