"use strict";
// $(document).ready(function() {
//   $('#main-menu').smartmenus({
//       subMenusSubOffsetX: 1,
//       subMenusSubOffsetY: -8
//   });
//   $('#sub-menu').smartmenus({
//       subMenusSubOffsetX: 1,
//       subMenusSubOffsetY: -8
//   })
// });

if ($(window).width() > '1200') {
  $('#hover-cls').hover(
    function () {
      $('.sm').addClass('hover-unset');
    }
  )

}

var sliderWheel = $(".home-slider");

//Implementing navigation of slides using mouse scroll
sliderWheel.on('wheel', (function(e) {
  e.preventDefault();
  if (e.originalEvent.deltaY < 0) {
    // $(this).slick('slickNext');
    $(this).slick('slickPrev');
  // }
  } else {
    // $(this).slick('slickPrev');
    $(this).slick('slickNext');
  }
}));

$(document).ready(function () {
  if ($(window).width() > 991) {
      $(".product_img_scroll, .pro_sticky_info").stick_in_parent();
  }
});
$(".sidebar").stick_in_parent({
  offset_top: 10
});

$ (document).ready (function () {
	$ (".modal a").not (".dropdown-toggle").on ("click", function () {
		$ (".modal").modal ("hide");
	});
});
$(function(){
  $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
  });

  $(window).resize(function(e) {
    if($(window).width()<=768){
      $("#wrapper").removeClass("toggled");
    }else{
      $("#wrapper").addClass("toggled");
    }
  });
  $(window).scroll(function() {
    var scroll = $(window).scrollTop();

    if (scroll >= 500) {
        $("#wrapper").removeClass("toggled");
        $("#sidebar-wrapper").addClass("toggled");

    } else {
        $("#wrapper").removeClass("toggled");
    }
});
});
