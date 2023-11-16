/* eslint-disable */



var mobileReg = /^1[3456789]{1}[0-9]{1}[0-9]{8}$/;
function checkMobile(mobile) {
    if (mobileReg.test(mobile)) { 
        return true; 
    } else {
        return false
    }
}
export default checkMobile;

