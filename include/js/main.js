$('.owl-carousel').owlCarousel({
  loop: true,
  margin: 10,
  nav: false,
  responsiveClass: true,
  responsive:{
    0:{
        items: 2,
    },
    600:{
        items: 6,
    },
    1000:{
        items: 9,
    }
  }
});
if (window.document.documentMode) {
  $(".item").on("mouseover",function(){
    $(".item").css("opacity","1");
  });
} else {
  $(".item").on("mouseover",function(){
    $(".item").not(this).css("opacity",".3");
  });
  $(".item").on("mouseout",function(){
    $(".item").css("opacity","1");
  });
}
