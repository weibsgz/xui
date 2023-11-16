import '@/assets/css/common.scss'
import './index.scss'
import '@/assets/js/init.js'
import feedBackTemp from './template.art'
module.exports =  function xBackToTop(params) {
  $('body').append(feedBackTemp)

  $('.feedBackWraphd').on('click', function(event) {
    $('html,body').animate(
      {
        scrollTop: 0
      },
      500
    )
    event.preventDefault()
  })
  $(window).scroll(function() {
    if ($(document).scrollTop() < 100) {
      $('.feedBackWraphd').hide()
    } else {
      $('.feedBackWraphd').show()
    }
  })
}
