'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

$(function () {
  //activate/deactivate for menuAim
  function showTopMenuLevel0(row) {
    if (!isMobileResolution()) {
      if ($(row).hasClass('submenu')) {
        $(row).addClass('open-iso');
      }

      var heightNav1 = $(row).find('.navbar-1').outerHeight();
      $(row).find('.navbar-1').attr('data-height', heightNav1);
    }
  }

  function showTopMenuLevel1(row) {
    if (!isMobileResolution()) {
      if ($(row).hasClass('submenu')) {
        $(row).addClass('open-iso');
      }

      var heightNav1 = $(row).closest('.navbar-1').outerHeight();
      var heightNav2 = $(row).find('.navbar-2__nav').outerHeight();
      var maxHeight = Math.max(heightNav1 - heightNav2 + INITIAL_INDENT, heightNav2 + INITIAL_INDENT);

      $(row).find('.navbar-2__nav').attr('data-height', heightNav2 + INITIAL_INDENT);
      if ($(row).hasClass('submenu')) {
        $(row).closest('.navbar-1').addClass('navbar-1--bg');
      }
      $(row).closest('.navbar-1').css('height', maxHeight);
      if (heightNav2 === null) {
        $(row).closest('.navbar-1').css('height', 'auto');
      }
    }
  }

  function showTopMenuLevel2(row) {
    if (!isMobileResolution()) {
      if ($(row).hasClass('submenu')) {
        $(row).addClass('open-iso');
      }

      var heightNav1 = $(row).closest('.navbar-1').outerHeight();
      var heightNav2 = $(row).closest('.navbar-2 .navbar-2__nav').outerHeight();
      var heightNav3 = $(row).find('.navbar-3 .navbar-3__nav').outerHeight();
      var maxHeight = Math.max(heightNav1 - heightNav2 + INITIAL_INDENT, heightNav2 - heightNav3 + INITIAL_INDENT, heightNav3 + INITIAL_INDENT);

      $(row).closest('.navbar-1').css('height', maxHeight);
    }
  }

  function hideTopMenuLevel0(row) {
    if (!isMobileResolution()) {
      $(row).removeClass('open-iso');
    }
  }

  function hideTopMenuLevel1(row) {
    if (!isMobileResolution()) {
      $(row).removeClass('open-iso');
      $(row).closest('.navbar-1').css('height', $(row).closest('.navbar-1').attr('data-height'));
      $(row).closest('.navbar-1').removeClass('navbar-1--bg');
    }
  }

  function hideTopMenuLevel2(row) {
    if (!isMobileResolution()) {
      $(row).removeClass('open-iso');
      $(row).closest('.navbar-1').outerHeight(Math.max($(row).closest('.navbar-1').attr('data-height'), $(row).closest('.navbar-2__nav').attr('data-height')));
    }
  }

  function isMobileResolution() {
    return $(window).width() < MEDIA_BREAKPOINT;
  }

  function fixHeader() {
    var header = $('.site-controls');
    header.removeClass('fixed-head'); //if window resized
    $('body').css('padding-top', ''); //if window resized
    var posFromTop = header.offset().top;
    $(window).scroll();
    $(window).on("scroll", function (e) {
      if ($(window).scrollTop() >= posFromTop) {
        header.addClass("fixed-head");
        $('body').css('padding-top', posFromTop || header.outerHeight());
      } else {
        header.removeClass("fixed-head");
        $('body').css('padding-top', '');
      }
    });
  }

  function backToTopFade() {
    if ($(window).scrollTop() > 200) {
      $('.btn-scroll-up').fadeIn();
    } else {
      $('.btn-scroll-up').fadeOut();
    }
  }

  //menuAim activate
  function menuAimActivate() {
    var topMenuLevel0 = $('.navbar-0').menuAim({
      triggerEvent: 'hover',
      submenuSelector: '.submenu',
      submenuDirection: 'below',
      openClassName: 'open-iso',
      activateCallback: showTopMenuLevel0,
      deactivateCallback: hideTopMenuLevel0,
      activationDelay: 200
    });
    var topMenuLevel1 = $('.navbar-1__nav').menuAim({
      triggerEvent: 'hover',
      submenuSelector: '.submenu',
      submenuDirection: 'right',
      openClassName: 'open-iso',
      activateCallback: showTopMenuLevel1,
      deactivateCallback: hideTopMenuLevel1,
      activationDelay: 0
    });
    var topMenuLevel2 = $('.navbar-2__nav').menuAim({
      triggerEvent: 'hover',
      submenuSelector: '.submenu',
      submenuDirection: 'right',
      openClassName: 'open-iso',
      activateCallback: showTopMenuLevel2,
      deactivateCallback: hideTopMenuLevel2,
      activationDelay: 0
    });
  }

  var MEDIA_BREAKPOINT = 1025;
  // const MEDIA_BREAKPOINT = 1025;
  var INDENT_DESKTOP = 8;
  var INDENT_MOBILE = 18;
  var INITIAL_INDENT = $(window).width() >= MEDIA_BREAKPOINT ? INDENT_DESKTOP : INDENT_MOBILE;

  //switching triggers
  $(window).resize(function () {
    var method = isMobileResolution() ? 'switchToClick' : 'switchToHover';
    var linkWithSubmenu = $('.submenu > .nav-link');

    // [topMenuLevel0, topMenuLevel1, topMenuLevel2].map(x => x.menuAim(method));

    if (isMobileResolution()) {
      linkWithSubmenu.on('click', function (e) {
        e.preventDefault();
        $(this).toggleClass('open');
        $(this).next('.collapse').collapse('toggle');
        $(this).closest('.navbar-iso-nav').find('> .nav-item > .collapse').collapse('hide');
        $(this).closest('.navbar-iso-nav').find('> .nav-item > .nav-link').not(this).removeClass('open');
        // BUG: incorrect removing of 'open' class on click
      });
    } else {
      $('.navbar-iso-nav').find('> .nav-item .collapse').collapse('hide').css('height', '');
      $('.navbar-iso-nav').find('> .nav-item .nav-link').removeClass('open');
      menuAimActivate(); //activate menu aim for desctop resolution
      fixHeader(); //fixed navbar
    }

    if ($(window).width() < 768) {
      $('.popover-iso').popover('hide');
    }
  });

  $(window).resize();

  // backToTopFade();
  $(window).scroll(function () {
    backToTopFade();
  });

  //toggle for mobile menu
  var sideslide = $('[data-toggle=collapse-side]');
  var collapsable = sideslide.attr('data-target');
  sideslide.click(function (e) {
    if ($(collapsable).hasClass('in')) {
      $('.side-collapse__header').removeClass('fixed');
      $(collapsable).removeClass('in').delay(500).queue(function () {
        $(this).removeClass('show');
        $(this).dequeue();
        $('.touch-handler').removeClass('overflow-hidden');
      });
    } else {
      $(collapsable).addClass('show').delay().queue(function () {
        $(this).addClass('in').delay(500).queue(function () {
          $('.side-collapse__header').addClass('fixed');
          $(this).dequeue();
        });
        $(this).dequeue();
        $('.touch-handler').addClass('overflow-hidden');
      });
    }
  });

  // collapse for main page cata test
  $('.collapse-list').on('show.bs.collapse', function () {
    $($(this).attr('data-parent') + ' .collapse-list').collapse('hide');
  });

  $('.catalog-list-link').popover({
    trigger: 'manual',
    placement: 'top',
    html: 'true',
    title: function title() {
      return '<div class="popover-header"><a class="popover-title-link" href="' + $(this).attr('href') + '">' + $(this).html() + '</a></div><span class="isoi isoi-close"></span>';
    },
    content: function content() {
      return $(this).next('.popover-outer').html();
    },
    // template: '<div class="popover" role="tooltip">' + '<div class="arrow"></div>' + '<div class="caption-tooltip">' + $(this).html() + '<span class="icon popover-cancel"></span></div>' + '<div class="popover-content"></div>' + '</div>',
    template: '<div class="popover popover-iso" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  });

  $(document).on("click", ".popover .isoi-close", function () {
    $(this).parents(".popover").popover('hide');
  });

  $('.catalog-list-link').on('click', function (e) {
    console.log($(this).siblings('.popover-outer').length);
    if ($(window).width() >= 768 && $(this).siblings('.popover-outer').length) {
      e.preventDefault();
      $(this).popover('toggle');
    }
  });

  //search form controls
  $('#search').on('input', function () {
    $(this).val().length ? $('#search-reset').show() : $('#search-reset').hide();
    $('#search').addClass('focused');
    if ($(this).val().length) {
      $('#search-result').addClass('open');
    }
  });

  $('#search').on('focus', function () {
    if ($(this).val().length) {
      $('#search-result').addClass('open');
    }
  });

  $(document).on('click', function (e) {
    if ($('#search').length && $(e.target).attr('id') !== 'search') {
      $('#search').removeClass('focused');
      $('#search-result').removeClass('open');
    }
  });

  $('#search-reset').on('click', function () {
    $('#search').focus().addClass('focused').val('');
    $('#search-result').addClass('open');
    $(this).hide();
  });

  //btn scroll-up
  $('.btn-scroll-up').on('click', function (e) {
    e.preventDefault();
    $('body,html').animate({
      scrollTop: 0
    }, 300);
  });

  $('.select-collapse-group').on('change', function () {
    console.log($(this).data('parent') + '-collapse-' + $(this).val());
    $('.' + $(this).data('parent') + '-collapse').hide();
    $('#' + $(this).data('parent') + '-collapse-' + $(this).val()).show();
    // $(this).val() == 'services'
    //   ? $('#provider-collaplse').show()
    //   : $('#provider-collaplse').hide();
  });
});

//plugin startup
$(function () {

  $('#main-slider').slick({
    adaptiveHeight: false,
    infinite: true,
    dots: true,
    lazyLoad: 'ondemand',
    responsive: [{
      breakpoint: 790,
      settings: {
        arrows: false
      }
    }]
  });

  $('#best-promo-slider').slick({
    mobileFirst: true,
    adaptiveHeight: true,
    infinite: true,
    dots: true,
    slidesToShow: 1,
    arrows: false,
    responsive: [{
      breakpoint: 790,
      settings: {
        arrows: true
      }
    }, {
      breakpoint: 991,
      settings: {
        slidesToShow: 3,
        arrows: true
      }
    }]
  });

  $('#article-slider').slick({
    mobileFirst: true,
    infinite: true,
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
    // {
    //   breakpoint: 767,
    //   settings: {
    //     slidesToShow: 2,
    //     slidesToScroll: 2,
    //     dots: false,
    //     arrows: true,
    //   }
    // },
    {
      breakpoint: 790,
      settings: _defineProperty({
        slidesToShow: 2,
        slidesToScroll: 2,
        arrows: true,
        dots: false
      }, 'arrows', true)
    }, {
      breakpoint: 991,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        dots: false,
        arrows: true
      }
    }, {
      breakpoint: 1199,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
        dots: false,
        arrows: true
      }
    }]
  });
});
//# sourceMappingURL=maps/main.js.map
