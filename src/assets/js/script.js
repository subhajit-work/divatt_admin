"use strict";
$(document).ready(function() {

  /*=====================
   01.Pre loader
   ==========================*/
  $('.loader-wrapper').fadeOut('slow', function() {
    $(this).remove();
  });


  /*=====================
   02.Tap on Top
   ==========================*/
  $(window).on('scroll', function() {
    if ($(this).scrollTop() > 600) {
      $('.tap-top').fadeIn();
    } else {
      $('.tap-top').fadeOut();
    }
  });
  $('.tap-top').on('click', function() {
    $("html, body").animate({
      scrollTop: 0
    }, 600);
    return false;
  });


  /*=====================
   03. toggle nav
   ==========================*/
  $('.toggle-nav').on('click', function() {
    $('.sm-horizontal').css("right", "0px");
  });
  $(".mobile-back").on('click', function() {
    $('.sm-horizontal').css("right", "-410px");
  });



  /*=====================
   04. footer according
   ==========================*/
  var contentwidth = jQuery(window).width();
  if ((contentwidth) < '750') {
    jQuery('.footer-title h4').append('<span class="according-menu"></span>');
    jQuery('.footer-title').on('click', function() {
      jQuery('.footer-title').removeClass('active');
      jQuery('.footer-contant').slideUp('normal');
      if (jQuery(this).next().is(':hidden') == true) {
        jQuery(this).addClass('active');
        jQuery(this).next().slideDown('normal');
      }
    });
    jQuery('.footer-contant').hide();
  } else {
    jQuery('.footer-contant').show();
  }

  if ($(window).width() < '1183') {
    jQuery('.menu-title h5').append('<span class="according-menu"></span>');
    jQuery('.menu-title').on('click', function() {
      jQuery('.menu-title').removeClass('active');
      jQuery('.menu-content').slideUp('normal');
      if (jQuery(this).next().is(':hidden') == true) {
        jQuery(this).addClass('active');
        jQuery(this).next().slideDown('normal');
      }
    });
    jQuery('.menu-content').hide();
  } else {
    jQuery('.menu-content').show();
  }

  /*=====================
   05.RTL js
   ==========================*/
  // $(".rtl-btn").click(function() {
  //   $(this).toggleClass("active");
  //   if ($(this).hasClass('active')) {
  //     $("html").attr("dir", "rtl");
  //     $("body").addClass('rtl');
  //   } else {
  //     $("html").attr("dir", "ltr");
  //     $("body").removeClass('rtl');
  //   }
  // });


  /*=====================
   06.Color js
   ==========================*/

  // (function() {
  //   $('<div class="color-picker" id="color-picker">' +
  //     '<a href="#" class="handle">' +
  //     '<i class="fa fa-cog"></i>' +
  //     '</a><div class="sec-position"><div class="settings-header">' +
  //     '<h3>Select Color:</h3>' +
  //     '</div>' +
  //     '<div class="section">' +
  //     '<div class="colors o-auto">' +
  //     '<a href="#" class="color1" ></a>' +
  //     '<a href="#" class="color2" ></a>' +
  //     '<a href="#" class="color3" ></a>' +
  //     '<a href="#" class="color4" ></a>' +
  //     '<a href="#" class="color5" ></a>' +
  //     '<a href="#" class="color6" ></a>' +
  //     '<a href="#" class="color7" ></a>' +
  //     '<a href="#" class="color8" ></a>' +
  //     '<a href="#" class="color9" ></a>' +
  //     '<a href="#" class="color10" ></a>' +
  //     '<a href="#" class="color11" ></a>' +
  //     '<a href="#" class="color12" ></a>' +
  //     '</div>' +
  //     '</div>' +
  //     '</div>' +
  //     '</div>').appendTo($('body'));
  // })();
  // var body_event = $("body");
  // body_event.on("click", ".color1", function() {
  //   var link = $("<link />", {
  //     rel: "stylesheet",
  //     type: "text/css",
  //     href: "assets/css/color1.css"
  //   });

  //   $('#color').html(link);
  //   $('#color-admin').html(link);
  //   return false;
  // });
  // body_event.on("click", ".color2", function() {
  //   var link = $("<link />", {
  //     rel: "stylesheet",
  //     type: "text/css",
  //     href: "assets/css/color2.css"
  //   });
  //   $('#color').html(link);
  //   $('#color-admin').html(link);
  //   return false;
  // });
  // body_event.on("click", ".color3", function() {
  //   var link = $("<link />", {
  //     rel: "stylesheet",
  //     type: "text/css",
  //     href: "assets/css/color3.css"
  //   });
  //   $('#color').html(link);
  //   $('#color-admin').html(link);
  //   return false;
  // });
  // body_event.on("click", ".color4", function() {
  //   var link = $("<link />", {
  //     rel: "stylesheet",
  //     type: "text/css",
  //     href: "assets/css/color4.css"
  //   });
  //   $('#color').html(link);
  //   $('#color-admin').html(link);
  //   return false;
  // });
  // body_event.on("click", ".color5", function() {
  //   var link = $("<link />", {
  //     rel: "stylesheet",
  //     type: "text/css",
  //     href: "assets/css/color5.css"
  //   });
  //   $('#color').html(link);
  //   $('#color-admin').html(link);
  //   return false;
  // });
  // body_event.on("click", ".color6", function() {
  //   var link = $("<link />", {
  //     rel: "stylesheet",
  //     type: "text/css",
  //     href: "assets/css/color6.css"
  //   });
  //   $('#color').html(link);
  //   $('#color-admin').html(link);
  //   return false;
  // });
  // body_event.on("click", ".color7", function() {
  //   var link = $("<link />", {
  //     rel: "stylesheet",
  //     type: "text/css",
  //     href: "assets/css/color7.css"
  //   });
  //   $('#color').html(link);
  //   $('#color-admin').html(link);
  //   return false;
  // });
  // body_event.on("click", ".color8", function() {
  //   var link = $("<link />", {
  //     rel: "stylesheet",
  //     type: "text/css",
  //     href: "assets/css/color8.css"
  //   });
  //   $('#color').html(link);
  //   $('#color-admin').html(link);
  //   return false;
  // });
  // body_event.on("click", ".color9", function() {
  //   var link = $("<link />", {
  //     rel: "stylesheet",
  //     type: "text/css",
  //     href: "assets/css/color9.css"
  //   });
  //   $('#color').html(link);
  //   $('#color-admin').html(link);
  //   return false;
  // });
  // body_event.on("click", ".color10", function() {
  //   var link = $("<link />", {
  //     rel: "stylesheet",
  //     type: "text/css",
  //     href: "assets/css/color10.css"
  //   });
  //   $('#color').html(link);
  //   $('#color-admin').html(link);
  //   return false;
  // });
  // body_event.on("click", ".color11", function() {
  //   var link = $("<link />", {
  //     rel: "stylesheet",
  //     type: "text/css",
  //     href: "assets/css/color11.css"
  //   });
  //   $('#color').html(link);
  //   $('#color-admin').html(link);
  //   return false;
  // });
  // body_event.on("click", ".color12", function() {
  //   var link = $("<link />", {
  //     rel: "stylesheet",
  //     type: "text/css",
  //     href: "assets/css/color12.css"
  //   });
  //   $('#color').html(link);
  //   $('#color-admin').html(link);
  //   return false;
  // });
  // $('.color-picker').animate({ right: '-190px' });
  // body_event.on("click", ".color-picker a.handle", function(e) {
  //   e.preventDefault();
  //   var div = $('.color-picker');
  //   if (div.css('right') === '-190px') {
  //     $('.color-picker').animate({ right: '0px' });
  //   } else {
  //     $('.color-picker').animate({ right: '-190px' });
  //   }
  // });

});

/*=====================
   06.Sticky js
   ==========================*/

$(document).ready(function () {
  if ($(window).width() > 991) {
      $(".product_img_scroll, .pro_sticky_info").stick_in_parent();
  }
});
