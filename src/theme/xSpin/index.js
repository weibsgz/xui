import '@/assets/css/common.scss'
import './index.scss'
const Spin = module.exports =  class {
  constructor(option = {}){
    this.option = Object.assign({}, this.defaults(), option)
    this.loadEle = null
   
  }
  insetHtml(){
    console.log('spin')
    const {wrap, isMask, content, cls} = this.option
    let loadStr = `<div class="xloadwrap ${cls} ${isMask ?'xloadMask':''}">
      <div class="loadImgCont">
         ${content} 
      </div> 
    </div>`
    this.loadEle = $(loadStr)
    wrap.append(this.loadEle)
  }
  show(){
    this.insetHtml()
  }
  hide(){
    this.destruction()
  }
  destruction(){
    const {wrap} = this.option
    //wrap.find('.xloadwrap').remove()
    wrap.find( this.loadEle).remove()
  }
  defaults(){
    return {
      wrap:$('body'),
      cls:'',
      isMask:false,
      content:`<span class="spin-dot">
                  <i class="spin-dot-item"></i>
                  <i class="spin-dot-item"></i>
                  <i class="spin-dot-item"></i>
                  <i class="spin-dot-item"></i>
              </span>
              <div class="spin-text">Loading...</div>
            `,
      inx:''
    }
  }
}