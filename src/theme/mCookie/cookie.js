/**
 * Created by tonwe on 2017/11/8.
 */
import $ from './touch-zepto'

const cookie = function MOD(name, value, options) {
  if (typeof value != 'undefined') { // name and value given, set cookie
    options = options || {
      'domain': document.domain
    }
    if (value === null) {
      value = ''
      options.expires = -1
    }
    let expires = ''
    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
      if (typeof options.expires == 'number') {
        let date = new Date()
        date.setTime(date.getTime() + (options.expires * 1000))
        expires = '; expires=' + date.toUTCString() // use expires attribute, max-age is not supported by IE
      } else {
        let date = options.expires
        expires = '; expires=' + date.toUTCString() // use expires attribute, max-age is not supported by IE
      }
    }
    // CAUTION: Needed to parenthesiQZe options.path and options.domain
    // in the following expressions, otherwise they evaluate to undefined
    // in the packed version for some reason...
    let path = options.path ? '; path=' + (options.path) : ''
    let domain = options.domain ? '; domain=' + (options.domain) : ''
    let secure = options.secure ? '; secure' : ''
    document.cookie = [name, '=', escape(value), expires, path, domain, secure].join('')
  } else { // only name given, get cookie
    let cookieValue = null
    if (document.cookie && document.cookie != '') {
      let cookies = document.cookie.split(';')
      for (let i = 0; i < cookies.length; i++) {
        let cookie = $.trim(cookies[i])
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = unescape(cookie.substring(name.length + 1))
          break
        }
      }
    }
    return cookieValue
  }
}
$.cookie = cookie
export default cookie