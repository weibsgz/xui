import '@/assets/css/common.scss'
import './index.scss'
import '@/assets/js/init.js'

function xSearch(options) {
  this.defaults = {

  }  
  this.init()
}

xSearch.prototype = {
  init: function() { 
    console.log(111)
  }
}

module.exports.xSearch = xSearch
