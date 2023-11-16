import '@/assets/css/common.scss'

const msg = function(opts){
  this.msgObj = {
    required:'请填写{title}',
    phone:'请填写正确的电话号',
    provincialCard:'请填写有效证件号码',
    verifyCode:'请填写6位数字的验证码',
    passport:'请填写合法的护照证号',
    organizationCode:'请填写合法的统一社会信用代码',
    email: '请填写正确格式的电子邮件',
    url: '请填写合法的网址',
    length: '请填写长度是{length}的字符串',
    sectionLength:'请填写要最少为{sectionLength},最大为{sectionLength}的字符串',  //区间
    rangelength: '请填写一个长度介于 {rangelength} 和 {rangelength} 之间的字符串', //区间
    maxLength:'请填写最大长度为{maxLength}的字符',
    minLength:'请填写最大小度为{minLength}的字符',
    noBlankSpace:'内容不能有空格',
    specialSymbols:'内容不能有特殊符号',
    amount:'最多可填入小数点前6位、小数点后2位'
  }
    
}
msg.prototype.addMsg = function(opt){
  let nobj = {}
  nobj[opt.name] = opt.msg
  this.msgObj = $.extend(this.msgObj, nobj)
}
/**
* 核心验证逻辑
* addRules方法
* vaildata 验证方法
*/
const Rules = function(){
  this.msg = new msg()
  this.data = {}
  this.Reg = {
    name:/^([\u4e00-\u9fa5]|\w){0,7}/img,
    phone : /^1[34578]\d{9}$/,
    required:/^\s*$/,
    provincialCard:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    organizationCode:/^[^\u4e00-\u9fa5]{0,30}$/, //机构代码
    length:/^[\s\S]{length}$/,
    maxLength:/^[\s\S]{maxLength}$/,
    minLength:/^[\s\S]{minLength}/,
    rangelength:/^[\s\S]{rangelength}$/,
    verifyCode:/^\d{6}/,
    passport:/^[0-9A-Z]{9}$/,
    email:/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
    noBlankSpace:/\s+/,
    specialSymbols: /[`~!@#$%^&*()_+<>?:"{},，。.\/;'[\]]+/,
    amount:/^\d{1,6}(\.\d{0,2})?$/

  }
  /*
      此队列用于验证规则取反
  */
  this.returnRulte = {
    noBlankSpace:true,
    specialSymbols:true
  }
  this.methods = {
    replaceTitle:function(str, title, opt){
      let name = opt.key ? opt.key :'title'
      if(!opt.val || (/^\s+$/img.test(opt.val))) name = 'title'
      let reg = new RegExp('{'+name+'}', 'i')
      if(opt.msgObj){
        if(opt.msgObj[opt.key]){
          return opt.msgObj[opt.key]
        }
      }
      if(!title) return str.replace(reg, title)
      if(title.toString().indexOf(',') <= 0){
        return str.replace(reg, title)
      }else{
        let titleArr = title.split(',')
        for(let i = 0;i < titleArr.length;i++){
          str = str.replace(reg, titleArr[i])
        }
        return str
      }
    },
    setRegExp:function(reg, val, name){
      if(reg && val && name){
        let nreg = new RegExp(name, 'i')
        if(nreg.test(reg.toString())){
          let nRgestr =  reg.toString().replace(nreg, val).replace('/', '').replace('/', '')
          return new RegExp(nRgestr)
        }else{
          return reg 
        }
      }else{
        return reg 
      }
    }
  }

}

/** 添加规则 rules 
* 参数 {"rule":/(^\d{15}$)|(^\d{17}(\d|X)$)/,"name":"carId","msg":"请填写正确的省份证号"}
*/
Rules.prototype.addRules =  function (opt){
  let nobj = {}
  nobj[opt.name] = opt.rule
  this.Reg =  $.extend(this.Reg, nobj)
  //给提示语录添加规则
  this.msg.addMsg(opt)
}
//返回验证规则
////{key:"",val:"",required:"required"}
/** 核心验证逻辑 特殊情况为required验证空  */
Rules.prototype.vaildata = function (opt){
  let _this = this
  let methods = this.methods
  let keyval = opt.keyVal || ''
  let title = opt.title
  let msgTitle = false
  let reg = opt.required ? _this.Reg[opt.required]: _this.Reg[opt.key]
  let isReturnRulte = this.returnRulte

  if(typeof keyval != 'boolean'){
    reg = methods.setRegExp(reg, keyval, opt.key)
    title = keyval ? keyval : opt.title
  }
  if(!reg) return {state:false, msg:'验证规则有误'}
  if((opt.required && !opt.isvaildata ) || isReturnRulte[opt.key]){
    if(reg.test(opt.ruleVal)){
      return {state:false, msg:opt.msg ? opt.msg: methods.replaceTitle(_this.msg.msgObj[isReturnRulte[opt.key] ? opt.key : opt.required], title, opt)}
    }else{
      return $.extend(opt, {state:true})
    }
  }
  if(/^\s*$/.test(opt.ruleVal)){
    return $.extend(opt, {state:true})
  }
  if(!reg.test(opt.ruleVal)){
    return {state:false, msg:opt.msg ? opt.msg : methods.replaceTitle(_this.msg.msgObj[opt.key], title, opt)}
  }else{
    return $.extend(opt, {state:true})
  }
}

/*
*入口验方法
* 外部 addRules
*/
const Vadata =  function(opts){
  let _this = this
  _this.option = $.extend({}, _this.defaults, opts)
  _this.data = null
  _this.state = {
    rulesData:null,
    checkRuleData:{state:true},
    ruleQue:[], //备份正式数据,
    requefirstRuleObj:null // required校验未通过 的第一个文件队列
  }
  _this.meths = {
    setData:function(arr){
      let nObj = {}
      for(let i=0; i<arr.length;i++){
        nObj[arr[i].name] = arr[i].value
      }
      return nObj
    },
    setRuleData:function(arr){
      let narr = []
      for(let i=0;i<arr.length;i++){
        if(arr[i].key){
          narr.push(arr[i])
        }
          
        if(arr[i].vaildata){
          let vaildata = JSON.parse(arr[i].vaildata)
          for(let j in vaildata){
            let nObj = {
              key:j,
              keyVal:vaildata[j],
              val:arr[i].val,
              target:arr[i].target,
              title:arr[i].title,
              vaildata:arr[i].vaildata,
              msgObj:arr[i].msgObj,
              isvaildata:true,
              ruleVal:arr[i].ruleVal,
              isCharToTwolen:arr[i].isCharToTwolen 
            }
            narr.push(nObj)
          }
        }
      }
      return narr
    }
  }
  _this.Rules = new Rules()
  _this.init()

}
Vadata.prototype.init =  function(){
  let _this = this
  let meths = _this.meths
  let opts = this.option
  let state = this.state
  let key = opts.isCheckSubmit ? 'change':'keyup'

  const inputFn = function(){
    _this.getRuleData(this)
    const checkRule = _this.checkRule(state.eleRrulesData);
    //如果是提交按钮为不执行验证切输入框验证不通过返回报错信息
    (!opts.isCheckSubmit) && (state.checkRuleData = checkRule)
    opts.changeCallback($.extend(state.eleRrulesData[0], checkRule))
  }
  //表单事件
  opts.form.on(opts.changeEventStr, 'input, textarea, select', function(e){
    inputFn.call($(this))
    return
  })
  /**
  * 表单聚焦校验 ，待场景总结是否需要
  */
  /*  opts.form.on("focus","input,textarea,select",function(e){
        let val = $(this).val();
        if(!val) return ;
        inputFn.call($(this));
      return;
  }); */

  opts.form.on('click', '[type="submit"]', function(e){
    e.stopPropagation()
    e.preventDefault()
    opts.form.get(0).submit($(this))
    return
  })

  opts.form.get(0).submit = function(bt) { 
    let serializeArray =  opts.form.serializeArray()
    let serializeObj = meths.setData(serializeArray)
    let rults = {}
    rults.data = serializeObj
    _this.getRuleData()
    let checkRule = opts.isCheckSubmit ?_this.checkRule():state.checkRuleData
    state.requefirstRuleObj && state.requefirstRuleObj.target.focus()
    state.requefirstRuleObj = null
    opts.submitCallback($.extend({}, rults, checkRule), bt)
    return false
  }
}
/** sibcheckout 
*  此方法为扩展校验方法 可外部执行
*  参数 为需要校验的dom对象,callback 返回当前dom的元素元素信息以及验证状态
*/
Vadata.prototype.siblingCheck = function(ele, callback){
  let _this =  this
  let meths =  _this.meths
  let opts = this.option
  let state = this.state
  _this.getRuleData(ele)
  let checkRule = _this.checkRule(state.eleRrulesData, true)
  callback($.extend(state.eleRrulesData[0], checkRule))
}
Vadata.prototype.getRuleData = function(ele){
  let _this =  this
  let opts = this.option
  let meths =  _this.meths
  let state = this.state
  let input =  opts.form.find('input, textarea, select')
  let arr = []
  let requiredArr = []
  let eleArr = []
  let getObj = function(){
    let nObj =  {
      target:this,
      title:this.attr('title'),
      msg:this.attr('msg'),
      required:this.attr('required') ? 'required' : '',
      name:this.attr('name'),
      key:this.attr('ischeck') == 'false' ? '' :this.attr('required'),
      val:this.val(),
      ruleVal:this.val(),
      vaildata:this.attr('ischeck')=='false' ? '' :this.attr('vaildata'),
      msgObj:this.attr('msgObj') ? JSON.parse(this.attr('msgObj')): '',
      isvaildata:false,
      isCharToTwolen:this.attr('isCharToTwolen') ? true : false  
    }
    if(nObj.isCharToTwolen){
      nObj.ruleVal = nObj.ruleVal.replace(/[\u4e00-\u9fa5]/g, 'aa')
    }
    return nObj
  }
  if(ele){
    eleArr.push(getObj.call(ele))
    state.eleRrulesData = meths.setRuleData(eleArr)
    return false
  }
  for(let i=0;i<input.length;i++){
    let nObj = getObj.call(input.eq(i))
    arr.push(nObj)
  }
  state.rulesData = meths.setRuleData(arr)

}
/**执行校验规则 */
Vadata.prototype.checkRule = function(cArr, noSubmit){
  let _this =  this
  let opts = this.option
  let state = this.state
  let checkRuleArr = cArr ? cArr : state.rulesData
  state.requefirstRuleObj = null
  for(let i=0;i<checkRuleArr.length;i++){
    if(checkRuleArr[i].required){
      let vaildataObj = _this.Rules.vaildata(checkRuleArr[i])
      if(!vaildataObj.state){
        if(!state.requefirstRuleObj) {state.requefirstRuleObj = checkRuleArr[i]}
        if(!noSubmit){ opts.submitCallback( $.extend(vaildataObj, checkRuleArr[i])) } 
      }
    }
  }
  for(let i=0;i<checkRuleArr.length;i++){
    if((checkRuleArr[i].required && checkRuleArr[i].key)|| (checkRuleArr[i].vaildata && checkRuleArr[i].key)){
      let vaildataObj = _this.Rules.vaildata(checkRuleArr[i])
      if(!vaildataObj.state){
        if(!state.requefirstRuleObj) {
          state.requefirstRuleObj = checkRuleArr[i]
        }
        return $.extend(vaildataObj, checkRuleArr[i])
      }
    }
  }
  return {'state':true, 'msg':'验证通过'}
}
Vadata.prototype.addRules = function(arr){
  let _this = this
  for(let i=0;i<arr.length;i++){
    _this.Rules.addRules(arr[i])
  }
}
Vadata.prototype.defaults =  {
  form:undefined,
  changeCallback:undefined,
  submitCallback:undefined,
  isCheckSubmit:true,
  changeEventStr:'change'
}
module.exports  = Vadata
