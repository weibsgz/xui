/* eslint-disable */

import '@/assets/css/common.scss'
import './index.scss'

import $ from "./touch-zepto";//触屏查找DOM插件
import Drawer from "./drawer";//侧拉抽屉



$(function () {
    class stateGrid {
        constructor(){
            this.branddrawer = new Drawer("https://zt.xcar.com.cn/api/carsel/pbrand", "选品牌", !1, !0, {
                format: function (rs) {
                    if (rs && rs.status == 1) {
                        var data = rs.data;
                        var arr = [];
                        for (var idx in data) {
                            var _item = data[idx];
                            var _blist = [];
                            for (var jdx in _item) {
                                var id = _item[jdx].pbid;
                                _blist.push({
                                    id: id,
                                    text: _item[jdx].pbname,
                                    img:
                                        "//img" +
                                        Math.ceil(Math.random() * 5) +
                                        ".xcarimg.com/PicLib/logo/pl" +
                                        id +
                                        "_160s.png",
                                });
                            }
                            arr.push({
                                text: idx,
                                children: _blist,
                            });
                        }
                        return arr;
                    }
                },
            });//初始化品牌抽屉
            this.serisedrawer = new Drawer("https://zt.xcar.com.cn/api/carsel/pserise", "选车系", !0, !1, {
                format: function (rs) {
                    if (rs && rs.status == 1) {
                        var data = rs.data;
                        var arr = [];
                        for (var i in data) {
                            //console.log(data[i])
                            var _item = data[i];
                            var _it = {
                                text: _item.bname,
                                children: [],
                            };
                            for (var j in _item.pslist) {
                                var _pse = _item.pslist[j][0] || _item.pslist[j];
                                // var _pprice=_pse.pmprice&&_pse.pmprice.max_price?(_pse.pmprice.min_price+'-'+_pse.pmprice.max_price):0;
                                var _pprice = pprice();
                                function pprice() {
                                    if (
                                        _pse.pmprice &&
                                        _pse.pmprice.max_price == _pse.pmprice.min_price &&
                                        _pse.pmprice.max_price != 0
                                    ) {
                                        return _pse.pmprice.max_price;
                                    } else if (
                                        _pse.pmprice &&
                                        _pse.pmprice.max_price != _pse.pmprice.min_price &&
                                        _pse.pmprice.max_price != 0
                                    ) {
                                        return (
                                            _pse.pmprice.min_price +
                                            "-" +
                                            _pse.pmprice.max_price
                                        );
                                    } else {
                                        return 0;
                                    }
                                }
                                _it.children.push({
                                    id: _pse.pserid,
                                    text: _pse.gname ? _pse.gname : _pse.psname,
                                    price: _pprice || 0,
                                    serid: _pse.serid,
                                    img:
                                        "//img" +
                                        Math.ceil(Math.random() * 5) +
                                        ".xcarimg.com/PicLib/s/s" +
                                        _pse.serid +
                                        "_240.jpg",
                                    gnlist: _pse.gn_list ? _pse.gn_list : [],
                                    gnlistcount: _pse.gn_list_count
                                        ? _pse.gn_list_count
                                        : "",
                                });
                            }
                            if (_it.children[0]) arr.push(_it);
                        }
                        return arr;
                    }
                },
            });//初始化车系抽屉
            this.DOM = $(document);
        }
        //关闭抽屉方法
        drawerHide(drs){   
            for (var i in drs) {
                drs[i].hide();
            }
        }
        //点击事件
        bindEvent(){
            let _this = this;
            _this.DOM.find('.bindEvnet').on('click',function(){
                _this.branddrawer.request(function (rs) {
                    if (rs.code == 1) {
                        return false;
                    }
                    _this.serisedrawer.formdata = {
                        pbid: rs.id,
                        xst: "2",
                    };
                    _this.serisedrawer.request(function (rs) {
                        if (rs.code == 1) {
                            _this.drawerHide([_this.branddrawer]);
                            return false;
                        }
                        _this.drawerHide([_this.branddrawer, _this.serisedrawer]);
                        let _pname = rs.text,
                            _pid = rs.id;
                        //当前数据
                        alert('车系名称：'  + _pname)
                        alert('车系ID：'  + _pid)
                        console.log(_pname)//车系名称
                        console.log(_pid)//车系id
                    });
                });
            });
        }

    }
    new stateGrid().bindEvent();//初始化
});
