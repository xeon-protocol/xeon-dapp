$(document).ready(function () {
    // --- VARIABLES ---
  
    var loopedslides = 5;
    var mainThumbs = new Swiper(".product-photo-main .main-thumbs", {
        spaceBetween: 0,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        spaceBetween: 0,
        slidesPerView: 2,
        centeredSlides: true,
        centeredSlidesBounds: true,
        loop: 1,
        loopedSlides: loopedslides,
        slideToClickedSlide: 1,
        breakpoints: {
          640: {
            slidesPerView: 3
          },
          1024: {
            slidesPerView: loopedslides
          }
        }
      }),
      mainTop = new Swiper(".product-photo-main .main-top", {
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        thumbs: {
          swiper: mainThumbs
        },
        effect: "fade",
        fadeEffect: {
          crossFade: true
        },
        autoplay: {
          delay: 5000
        },
        speed: 1000,
        preloadImages: 0,
        spaceBetween: 0,
        loop: 1,
        slidesPerView: 1,
        loopedSlides: loopedslides,
        centeredSlides: true,
        centeredSlidesBounds: true
      });
    var galleryThumbs = new Swiper(
        ".product-gallery-full-screen .gallery-thumbs",
        {
          spaceBetween: 0,
          watchSlidesVisibility: true,
          watchSlidesProgress: true,
          spaceBetween: 0,
          slidesPerView: 2,
          centeredSlides: true,
          centeredSlidesBounds: true,
          loop: 1,
          loopedSlides: loopedslides,
          slideToClickedSlide: 1,
          breakpoints: {
            640: {
              slidesPerView: 3
            },
            1024: {
              slidesPerView: loopedslides
            }
          }
        }
      ),
      galleryTop = new Swiper(".product-gallery-full-screen .gallery-top", {
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        thumbs: {
          swiper: galleryThumbs
        },
        spaceBetween: 0,
        loop: 1,
        slidesPerView: 1,
        loopedSlides: loopedslides,
        centeredSlides: true,
        centeredSlidesBounds: true
      });
  
    mainTop.controller.control = mainThumbs || galleryTop || galleryThumbs;
    galleryTop.controller.control = mainTop || mainThumbs;
  
    var galleryOpen = false,
      fullscreen = false,
      fsTrigger = $(".gallery-nav .fullscreen")[0],
      fsGallery = $(".product-gallery-full-screen")[0],
      fsFunction = fsGallery.requestFullscreen;
    // browser support check
    if (!fsFunction) {
      [
        "webkitRequestFullScreen",
        "mozRequestFullscreen",
        "msRequestFullScreen"
      ].forEach(function (req) {
        fsFunction = fsFunction || fsGallery[req];
      });
    }
  
    // --- FUNCTIONS ---
    function openImageGallery(slide) {
      galleryOpen = true;
      var galleryX = $(".product-photo-main").offset().left,
        galleryY = $(".product-photo-main").offset().top,
        galleryHeight = $(".product-photo-main").height(),
        galleryWidth = $(".product-photo-main").width(),
        activeIndex = slide.index(),
        indexes = $(".product-photo-main").find(".swiper-slide").length;
      $("body").css("overflow", "hidden");
      $(".main, .product-gallery-full-screen").css("overflow-y", "scroll");
      $(".product-gallery-full-screen").addClass("opened");
      galleryTop.slideTo(activeIndex, 0);
      galleryThumbs.slideTo(activeIndex, 0);
    }
  
    function goFs() {
      fullscreen = true;
      $(".product-gallery-full-screen").css("overflow-y", "auto");
      $(".fullscreen").addClass("leavefs");
      fsFunction.call(fsGallery);
    }
  
    function leaveFs() {
      fullscreen = false;
      $(".product-gallery-full-screen").css("overflow-y", "scroll");
      $(".fullscreen").removeClass("leavefs");
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch((err) => Promise.resolve(err));
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    }
  
    function closeImageGallery() {
      $("body").css("overflow", "auto");
      $(".main, .product-gallery-full-screen").css("overflow-y", "auto");
      galleryOpen = false;
      leaveFs();
      $(".product-gallery-full-screen").removeClass("opened");
    }
  
    // --- EVENTS ---
    // open the large image gallery
    $(".product-photo-main .main-top .swiper-slide").on(
      "click touch",
      function () {
        var slide = $(this);
        openImageGallery(slide);
      }
    );
    // close the large image gallery
    $(".gallery-nav .close").on("click touch", function () {
      closeImageGallery();
    });
    // zoom in / out
    $(".zoom").on("click touch", function () {
      // breaks active index...
    });
    $(".product-gallery-background").on("click touch", function () {
      closeImageGallery();
    });
    // fullscreen toggle
    $(fsTrigger).on("click touch", function () {
      if (fullscreen) {
        leaveFs();
      } else {
        goFs();
      }
    });
  
    // keyboard controls
    $(document).on("keydown", function (e) {
      e.preventDefault();
      var code = e.keyCode || e.which;
      // open the large image gallery
      if (code == 13 && !galleryOpen) {
        var slide = $(".product-photo-main .swiper-slide.swiper-slide-active");
        openImageGallery(slide);
      }
      // close the large image gallery
      if (code == 27 && galleryOpen) {
        closeImageGallery();
      }
      if (code == 122) {
        if (galleryOpen) {
          if (fullscreen) {
            leaveFs();
          } else {
            goFs();
          }
        }
      }
    });
  });
  