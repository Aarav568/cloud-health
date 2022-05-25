
/*----------Page Preloader--------------*/

$(window).load(function () {
  $('.preloader').fadeOut(1000); // set duration in brackets    
  });
  
  $(document).ready(function () {
  
  
  /*----------------------------Menu Collapse----------------*/
  
  $('.navbar-collapse a').click(function () {
    $(".navbar-collapse").collapse('hide');
  });
  
  
  
  /*---------------Smoothscroll------------------------------------*/
  $(function () {
    $('.navbar-default a').bind('click', function (event) {
      var $anchor = $(this);
      $('html, body').stop().animate({
        scrollTop: $($anchor.attr('href')).offset().top - 49
      }, 1000);
      event.preventDefault();
    });
  });
  
  /*------------------------Back to top button-------------------------*/
  
  $(window).scroll(function () {
    if ($(this).scrollTop() > 200) {
      $('.go-top').fadeIn(200);
    } else {
      $('.go-top').fadeOut(200);
    }
  });
  // Animate the scroll to top
  $('.go-top').click(function (event) {
    event.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 300);
  });
  
  
  
  /*-------------------Animation css set up------------------------------*/
  
  new WOW({ mobile: false }).init();
  
  });