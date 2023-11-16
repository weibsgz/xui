/* eslint-disable */
import $ from './touch-zepto';
import cookie from 'cookie'

window.zhuGeIoObj = {};
function getParam(pageType, id) {
    let url = baseurl + 'nxcar/index.php/interface/tongJi/zgList';
    const promise = new Promise((reslove, reject) => {
        let params = {
            type: pageType,
            id: id
        }
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            data: params
        }).done(function (res) {
            if (res && res.data) {
                let _attrName = res.data
                zhuGeIoObj = _attrName
                reslove(_attrName)
            } else {
                console.log(res.msg)
            }


        }).fail(function (err) {
            reject(err)
        })
    })
    return promise


}

function zhuGeIoDelObj(params = []) {
    for (let i = 0; i < params.length; i++) {
        for (let j in zhuGeIoObj) {
            if (params[i] == j) {
                delete zhuGeIoObj[j]
            }
        }
    }
    return zhuGeIoObj
}

function copyObj(params={}) {
    return JSON.parse(JSON.stringify(params))
}

export {
    getParam,
    zhuGeIoDelObj,
    copyObj
};