/* eslint-disable */

function govern() {
    var hilen = history.length;
    var need = /MicroMessenger\/[\d.]+/gi.test(navigator.userAgent) || /QQ\/[\d.]+/gi.test(navigator.userAgent) || /Weibo/gi.test(navigator.userAgent);
    var thishref = location.href;
    var indexhref = "//a.xcar.com.cn/";
    if (!need) return false;
    if ((hilen == 1) || (document.referrer == backend_data.arcurl && hilen == 2)) {
        document.querySelector('body').style.display = 'none';

        history.replaceState({
            title: "爱卡汽车",
            url: indexhref,
            govern: true
        }, "爱卡汽车", indexhref)
        document.querySelector('body').style.display = 'inherit';
        history.pushState({
            title: "爱卡汽车",
            url: thishref
        }, "爱卡汽车", thishref);

        window.addEventListener("popstate", function(e) {
            if (e.state && e.state.govern)
                location.reload()
        }, false);

    }
};
export default govern;


