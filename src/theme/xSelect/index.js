import '@/assets/css/common.scss'
import './index.scss'
import '@/assets/js/init.js'

function xSelect(options) {
  this.name = options.select
  return this.name
}
module.exports.select = xSelect