
/* eslint-disable */
/**
 * Created by tonwe on 2017/11/9.
 */
import $ from './touch-zepto';
import throttle from './throttle';

export default function gotop() {
    var tmpl="<div class='gotop' id='gotop'><span class='icon-up'>置顶</span></div>";
    if(!$('#gotop')[0]){
        $('.effectDisplay_body').append(tmpl);
    }
    $('#gotop').on('click',function(){
        $('.effectDisplay_body_g').scrollTop(0); 
    });
    var scrollhandler=function(){
        var d=$('.effectDisplay_body_g').scrollTop();
        var wh=$('.effectDisplay_body').height()*1.5;
        if(d>wh){
            setTimeout(function(){$('.gotop').css({'display':'block'});},0);
        }else{
            $('.gotop').hide();
        }
    };
    // ios 7 safari 隐藏后台回来滚动失效bug增加touch事件解决
    var ios7fix='scroll'+($.os.ios&&$.os.version.indexOf('7.0')>-1&& $.browser.safari?' touchend':'');
    $('.effectDisplay_body_g').bind(ios7fix,throttle(scrollhandler,100)).trigger('scroll');
}
