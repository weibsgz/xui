/* eslint-disable */
/*
 * 函数节流
 * method function，delay ms 延时(，duration ms 必执行)
 * */
export default function throttle(method,delay,duration){
    var timer=null, begin=new Date();
    return function(){
        var context=this, args=arguments, current=new Date();
        clearTimeout(timer);
        if(current-begin>=duration){
            method.apply(context,args);
            begin=current;
        }else{
            timer=setTimeout(function(){
                method.apply(context,args);
            },delay);
        }
    }
}