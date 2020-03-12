'use strict';

$(function () {
    //activate/deactivate for menuAim
    function showTopMenuLevel0(row) {
        if (!window.tablet) {
            if ($(row).hasClass('submenu')) {
                $(row).addClass('open-iso');
            }

            var heightNav1 = $(row).find('.navbar-1').outerHeight();
            $(row).find('.navbar-1').attr('data-height', heightNav1);
        }
    }

    function showTopMenuLevel1(row) {
        if (!window.tablet) {
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
        if (!window.tablet) {
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
        if (!window.tablet) {
            $(row).removeClass('open-iso');
        }
    }

    function hideTopMenuLevel1(row) {
        if (!window.tablet) {
            $(row).removeClass('open-iso');
            $(row).closest('.navbar-1').css('height', $(row).closest('.navbar-1').attr('data-height'));
            $(row).closest('.navbar-1').removeClass('navbar-1--bg');
        }
    }

    function hideTopMenuLevel2(row) {
        if (!window.tablet) {
            $(row).removeClass('open-iso');
            $(row).closest('.navbar-1').outerHeight(Math.max($(row).closest('.navbar-1').attr('data-height'), $(row).closest('.navbar-2__nav').attr('data-height')));
        }
    }

    function isTabletResolution() {
        return $(window).width() < MEDIA_BREAKPOINT_TABLET;
    }

    function isMobileResolution() {
        return $(window).width() < MEDIA_BREAKPOINT_MOBILE;
    }

    $(window).resize(function () {
        window.mobile = isMobileResolution();
        window.tablet = isTabletResolution();
    });

    $.ajax({
        url: '/productInfo/index/getmenu',
        type: 'GET'
    }).done(function (data) {
        var submenuArray = $(data).find('.navbar-1');
        $('#gtm-catalog > .nav-item').each(function (index, el) {
            el.append(submenuArray[index]);
        });
        menuAimActivate();
        bindMenuListeners();
    }).fail(function () {
        console.log("ajax get product menu fails");
    });

    function fixHeader() {
        var header = $('.site-controls');
        header.removeClass('fixed-head');
        $('body').css('padding-top', '');
        var posFromTop = header.offset().top;
        $(window).on("scroll", function (e) {
            if ($(window).scrollTop() >= posFromTop && !window.tablet) {
                header.addClass("fixed-head");
                $('body').css('padding-top', posFromTop || header.outerHeight());
            } else {
                header.removeClass("fixed-head");
                $('body').css('padding-top', '');
            }
        });
        $(window).scroll();
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

    function bindMenuListeners() {
        $('.nav-item.submenu > .nav-link').on('click', function (e) {
            if (window.tablet) {
                e.preventDefault();
                $(this).next('.collapse').collapse('toggle');
                $(this).closest('.navbar-iso-nav').find('> .nav-item > .collapse').collapse('hide');
            }
        });

        $('.nav-item.submenu > .collapse').on('show.bs.collapse', function (e) {
            if ($(this).is(e.target)) {
                $(this).prev('.nav-link').addClass('open');
            }
        });

        $('.nav-item.submenu > .nav-link').hammer().bind('doubletap', function (e) {
            if (window.tablet) {
                window.location = $(this).attr('href');
            }
        });

        $('.nav-item.submenu > .collapse').on('shown.bs.collapse', function (e) {
            $(this).closest('.navbar-iso-nav').find('> .nav-item > .collapse').not(this).collapse('hide');
        });

        $('.nav-item.submenu > .collapse').on('hide.bs.collapse', function (e) {
            if ($(this).is(e.target)) {
                $(this).prev('.nav-link').removeClass('open');
            }
        });
    }

    var MEDIA_BREAKPOINT_TABLET = 1024;
    var MEDIA_BREAKPOINT_MOBILE = 768;
    var INDENT_DESKTOP = 8;
    var INDENT_MOBILE = 8;
    var INITIAL_INDENT = $(window).width() >= MEDIA_BREAKPOINT_TABLET ? INDENT_DESKTOP : INDENT_MOBILE;

    //switching triggers
    $(window).on('resize', function () {
        if (window.mobile) {
            $('.popover-iso:not(.popover-mobile)').popover('hide');
        }

        if (!window.tablet) {
            $('body').css('padding-top', ''); //if window resized
            $('.navbar-iso-nav').find('> .nav-item .collapse').collapse('hide').css('height', '');
            menuAimActivate(); //activate menu aim for desktop resolution
            fixHeader(); //fixed navbar
            $('.overlay').addClass('hidden');
            $('body').removeClass('overflow-hidden');
        } else {
            $('body').css('padding-top', '');
            if ($('#search-result-mobile').hasClass('open')) {
                setSearchStyle();
            }
        }
    });

    $(document).on('show.bs.modal', '.modal', function () {
        $('.site-controls').css('width', $('.site-controls').width());
    }).on('hidden.bs.modal', function () {
        $('.site-controls').css('width', '');
    });

    $(document).on('beforeShow.fb', function () {
        $('.site-controls').css('width', $("body").prop("clientWidth"));
    }).on('afterClose.fb', function () {
        $('.site-controls').css('width', '');
    });

    $(window).resize();

    // backToTopFade();
    $(window).on('scroll', function () {
        backToTopFade();
    });

    //toggle for mobile menu
    var sideslide = $('[data-toggle=collapse-side]');
    var collapsable = sideslide.attr('data-target');
    sideslide.click(function (e) {
        if ($(collapsable).hasClass('in')) {
            $(collapsable).removeClass('in').delay(500).queue(function () {
                $(this).removeClass('show');
                $(this).dequeue();
                $('body').removeClass('overflow-hidden');
            });
        } else {
            $(collapsable).addClass('show').delay().queue(function () {
                $(this).addClass('in').delay(500).queue(function () {
                    $(this).dequeue();
                });
                $(this).dequeue();
                $('body').addClass('overflow-hidden');
            });
        }
    });

    // collapse for main page cata
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
        template: '<div class="popover popover-iso" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    });

    $(document).on('click', '.popover .isoi-close', function () {
        $(this).parents('.popover').popover('hide');
    });

    $('.catalog-list-link').on('click', function (e) {
        if (!window.mobile && $(this).siblings('.popover-outer').length) {
            e.preventDefault();
            $('.catalog-list-link').not(this).popover('hide');
            $(this).popover('toggle');
        }
    });

    // search form controls
    $('#search').on('input', function () {
        $(this).val().length ? $('#search-reset').show() : $('#search-reset').hide();
        $('#search').addClass('focused');
        if ($(this).val().length > 2) {
            $.ajax({
                type: 'POST', datatype: 'HTML',
                //TODO url брать из формы
                url: '/catalogSearchExtendet/ajax/index/' + 'q/' + $(this).val(),
                success: function success(data) {
                    $("#search-result").html(data);
                }
            });
            $('#search-result').addClass('open');
        }
    });

    $('#search-mobile').on('input', function () {
        $(this).val().length ? $('#search-mobile-reset').show() : $('#search-mobile-reset').hide();
        $('#search-mobile').addClass('focused');
        if ($(this).val().length > 2) {
            $.ajax({
                type: 'POST', datatype: 'HTML',
                //TODO url брать из формы
                url: '/catalogSearchExtendet/ajax/index/' + 'q/' + $(this).val(),
                success: function success(data) {
                    $("#search-result-mobile").html(data);
                    setSearchStyle();
                }
            });
            $("#search-result-mobile").addClass('open');
            $('body').addClass('overflow-hidden');
        } else {
            $("#search-result-mobile").removeClass('open');
            $('body').removeClass('overflow-hidden');
        }
    });

    function setSearchStyle() {
        $('#search-result-mobile .dropdown-search').css('max-height', window.innerHeight - $('.navbar-iso').outerHeight() - $('#mobile-search-wrap').outerHeight() - 30);
    };

    $('#search').on('focus', function () {
        if ($(this).val().length) {
            $('#search-result').addClass('open');
        }
    });

    $('#search-mobile').on('focus', function () {
        if ($(this).val().length) {
            $('#search-result-mobile').addClass('open');
            $('body').addClass('overflow-hidden');
            setSearchStyle();
        } else {
            $('#search-result-mobile').removeClass('open');
            $('body').removeClass('overflow-hidden');
        }
    });

    $('.mob-item--search').on('click', function (e) {
        e.stopPropagation();
        $('#mobile-search-wrap').toggleClass('hidden');
        $('.overlay').toggleClass('hidden');
        $('#search-mobile').focus();
    });

    $(document).on('click', function (e) {
        if ($('#search').length && $(e.target).attr('id') !== 'search') {
            $('#search').removeClass('focused');
            $('#search-result').removeClass('open');
        }

        if ($('#mobile-search-wrap').length && $(e.target).attr('id') !== 'mobile-search-wrap') {
            $('#mobile-search-wrap, .overlay').addClass('hidden');
            $('body').removeClass('overflow-hidden');
        }
    });

    $(document).on('click', '.dropdown-search, #mobile-search-wrap', function (e) {
        e.stopPropagation();
    });

    $('#search-reset').on('click', function () {
        $('#search').focus().addClass('focused').val('');
        $('#search-result').removeClass('open');
        $(this).hide();
    });

    $('#search-mobile-reset').on('click', function () {
        $('#search-mobile').focus().addClass('focused').val('');
        $('#search-result-mobile').removeClass('open');
        $(this).hide();
        $('body').removeClass('overflow-hidden');
    });

    //btn scroll-up
    $('.btn-scroll-up').on('click', function (e) {
        e.preventDefault();
        $('body,html').animate({
            scrollTop: 0
        }, 300);
    });

    $('.select-collapse-group').on('change', function () {
        $('.' + $(this).data('parent') + '-collapse').hide();
        $('.' + $(this).data('parent') + '-collapse select').prop('disabled', true);
        $('#' + $(this).data('parent') + '-collapse-' + $(this).val()).show();
        $('#' + $(this).data('parent') + '-collapse-' + $(this).val() + ' select').prop('disabled', false);
    });

    $(document).on('click', function (e) {
        $('[data-toggle="popover"],[data-original-title]').each(function () {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                (($(this).popover('hide').data('bs.popover') || {}).inState || {}).click = false;
            }
        });
    });

    $('.modal-menu-drop').on('click', function (e) {
        e.stopPropagation();
    });

    $('.dropdown-menu--feedback .nav-link[data-toggle="modal"], .page-footer__list .page-footer__link[data-toggle="modal"], [href="#modal-opt"]').on('click', function () {
        switch ($(this).attr('href')) {
            case '#sendAplication':
                dataPushToGTM('gtmSendEvent', 'Формы (forms)', 'Форма - Заявка на расчет - Клик', 'Отправить заявку на расчет');
                break;

            case '#callback':
                dataPushToGTM('gtmSendEvent', 'Формы (forms)', 'Форма - Обратный звонок - Клик', 'Заказать звонок');
                break;

            case '#provider':
                dataPushToGTM('gtmSendEvent', 'Формы (forms)', 'Форма - Стать поставщиком - Клик', 'Стать поставщиком');
                break;

            case '#workReview':
                dataPushToGTM('gtmSendEvent', 'Формы (forms)', 'Форма - Оставить отзыв - Клик', 'Оставить отзыв');
                break;

            case '#modal-opt':
                dataPushToGTM('gtmSendEvent', 'Оптовикам (opt)', 'Оптовикам - Заявка - Клик', 'Оптовикам - Заявка - Клик');
                break;
        }
    });

    $('.calc-delivery input, .change-qty__value').on('keypress keydown', function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    });
});

//plugin startup
$(function () {
    var _settings, _settings2, _settings3, _settings4, _settings5, _settings6, _settings7;

    $('[data-toggle=popover-inline]').popover({ trigger: 'click', template: '<div class="popover popover-iso" role="tooltip"><div class="arrow"></div><span class="isoi isoi-close"></span><h3 class="popover-title"></h3><div class="popover-content"></div></div>' });

    $('[data-toggle=popover-block]').popover({
        trigger: 'click',
        html: 'true',
        content: function content() {
            return $(this).next('.popover-data').html();
        },
        template: '<div class="popover popover-iso" role="tooltip"><div class="arrow"></div><span class="isoi isoi-close"></span><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    });

    $('#main-slider').slick({
        lazyLoad: 'ondemand',
        adaptiveHeight: false,
        infinite: true,
        dots: true,
        accessibility: false,
        fade: true,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 10000,
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
        accessibility: false,
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

    $('#brand-promo-slider').slick({
        mobileFirst: true,
        adaptiveHeight: true,
        infinite: true,
        dots: true,
        slidesToShow: 1,
        arrows: false,
        accessibility: false,
        responsive: [{
            breakpoint: 790,
            settings: {
                arrows: true
            }
        }, {
            breakpoint: 1023,
            settings: {
                slidesToShow: 2,
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
        accessibility: false,
        // adaptiveHeight: true,
        responsive: [{
            breakpoint: 790,
            settings: (_settings = {
                slidesToShow: 2,
                slidesToScroll: 2,
                arrows: true,
                dots: false
            }, _settings['arrows'] = true, _settings)
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

    /// product card
    $(window).resize(function () {
        if ($(window).width() > 767) {
            $('.product-delivery__content.in').collapse('hide');
            $('.product-delivery__link').not('.collapsed').addClass('collapsed');
        }
    });

    $('.product-spec-add-toggler').on('click', function () {
        $('.product-spec-add, .product-spec-add-toggler > span').toggleClass('hidden');
    });

    $('.product-delivery__link').popover({
        trigger: 'manual',
        placement: 'top',
        html: 'true',
        title: function title() {
            return '<div class="popover-header">' + $(this).find('.product-delivery__link-text').html() + '<span class="isoi isoi-close"></span>';
        },
        content: function content() {
            return $(this).next('.product-delivery__content').html();
        },
        template: '<div class="popover popover-iso popover-product" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    });

    $('.product-delivery__link').on('click', function (e) {
        e.preventDefault();
        if (window.mobile) {
            $(this).parents('.product-delivery').find('.product-delivery__content.in').collapse('hide');
            $(this).parents('.product-delivery').find('.product-delivery__link').not(this).addClass('collapsed');
            $('.product-calc .dropdown-menu__collapse').collapse('hide');
            $('.product-calc__link').addClass('collapsed');
            $(this).toggleClass('collapsed');
            $(this).next('.product-delivery__content').collapse('toggle');
        } else {
            $('.product-delivery__link').not(this).popover('hide');
            $(this).popover('toggle');
        }
    });

    $('.product-popover-link').popover({
        trigger: 'click',
        placement: 'bottom',
        html: 'true',
        content: function content() {
            return $(this).next('.product-popover-inner').html();
        },
        template: '<div class="popover product-popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>'
    }).on('show.bs.popover', function () {
        $(this).addClass('open');
    }).on('hide.bs.popover', function () {
        $(this).removeClass('open');
    });

    $('.product-calc__link').on('click', function (e) {
        e.preventDefault();
        if (window.mobile) {
            $('.product-delivery').find('.product-delivery__content.in').collapse('hide');
            $('.product-delivery').find('.product-delivery__link').not(this).addClass('collapsed');
            $(this).toggleClass('collapsed');
            $(this).next('.dropdown-menu__collapse').collapse('toggle');
        } else {
            $('.product-delivery__link').popover('hide');
            $(this).parent('.product-calc').toggleClass('open');
        }
    });

    $('#product-summary-slider').slick({
        mobileFirst: true,
        infinite: true,
        dots: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        focusOnSelect: true,
        accessibility: false,
        responsive: [{
            breakpoint: 767,
            settings: (_settings2 = {
                slidesToShow: 4,
                slidesToScroll: 1,
                arrows: true,
                infinite: true,
                dots: false
            }, _settings2['arrows'] = true, _settings2.focusOnSelect = true, _settings2.vertical = true, _settings2.asNavFor = '.product-summary-slider-main', _settings2)
        }, {
            breakpoint: 1199,
            settings: (_settings3 = {
                slidesToShow: 5,
                slidesToScroll: 1,
                arrows: true,
                infinite: true,
                dots: false
            }, _settings3['arrows'] = true, _settings3.focusOnSelect = true, _settings3.vertical = true, _settings3.asNavFor = '.product-summary-slider-main', _settings3)
        }]
    });

    $('#product-summary-slider-main').slick({
        mobileFirst: true,
        infinite: true,
        dots: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        focusOnSelect: true,
        accessibility: false,
        fade: true,
        cssEase: 'linear',
        responsive: [{
            breakpoint: 767,
            settings: (_settings4 = {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                infinite: true,
                dots: false
            }, _settings4['arrows'] = false, _settings4.focusOnSelect = true, _settings4.asNavFor = '#product-summary-slider', _settings4)
        }, {
            breakpoint: 1199,
            settings: (_settings5 = {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                infinite: true,
                dots: false
            }, _settings5['arrows'] = false, _settings5.focusOnSelect = true, _settings5.asNavFor = '#product-summary-slider', _settings5)
        }]
    });

    // $('.product-summary-slider-preview .slider-item:not(.slick-cloned) .d-block').fancybox({
    $('.product-summary-slider-main .slider-item:not(.slick-cloned) a, .fancy-gallery, .fancy_gallery').fancybox({
        loop: true,
        animationEffect: 'fade',
        btnTpl: {
            slideShow: false,
            fullScreen: false,
            thumbs: false,
            close: '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"></button>',
            smallBtn: '<button data-fancybox-close class="fancybox-close-small" title="{{CLOSE}}"></button>'
        }
    });

    //product card recomended slider
    $('.product-add-slider').slick({
        mobileFirst: true,
        infinite: true,
        dots: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        centerMode: false,
        speed: 150,
        accessibility: false,
        responsive: [{
            breakpoint: 460,
            settings: (_settings6 = {
                slidesToShow: 2,
                slidesToScroll: 2,
                arrows: true,
                dots: false
            }, _settings6['arrows'] = false, _settings6)
        }, {
            breakpoint: 787,
            settings: (_settings7 = {
                slidesToShow: 3,
                slidesToScroll: 3,
                arrows: true,
                dots: false
            }, _settings7['arrows'] = true, _settings7.centerMode = false, _settings7)
        }, {
            breakpoint: 1023,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
                dots: false,
                arrows: true,
                centerMode: false
            }
        }, {
            breakpoint: 1199,
            settings: {
                slidesToShow: 5,
                slidesToScroll: 5,
                dots: false,
                arrows: true,
                centerMode: false
            }
        }]
    });

    $('#product-accordion .collapse-list-content table, .catalog-desc table').addClass('table table-bordered').wrap('<div class="table-responsive"></div>');
    $('#product-accordion .collapse-list-content iframe, .catalog-desc iframe').addClass('embed-responsive-item').wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
    // delivery modal loader
    var isLoaded = 0;
    $(document).on('click', '.popover .delivery-modal,  .delivery-modal', function (e) {
        e.preventDefault();
        var url = $(this).attr('href');
        var modal = $('#delivery-modal');
        if (!isLoaded) {
            modal.find('.modal-body').load(url, function (result) {
                modal.modal('show');
                isLoaded = 1;
            });
        } else {
            modal.modal('show');
        }
    });

    //Класс пункта меню "active"
    function isTabActive() {
        return $('#product-add-nav .nav-item.active').length ? '' : 'active';
    }

    var tabProductsViewed = '#recently-viewed';
    var activeTab = isTabActive();
    if ($(tabProductsViewed).length) {
        $('#product-add-nav').append('<li class="nav-item ' + activeTab + '" role="presentation"><a data-toggle="tab" href="' + tabProductsViewed + '" role="tab">Недавно просмотренные</a></li>');
        $(tabProductsViewed).appendTo('#product-add-content').removeClass('hidden').addClass('in ' + activeTab);
    }

    // hide for product-tabs--add if empty tabs
    // if(!$('#product-add-nav .nav-item').length) {
    //     $('.product-tabs--add').hide();
    // }

    $('#modal-cost .price-unit-modal.less-than-10 .price-cur').html($('.less-than-10 .price-cur').html());
    $('#modal-cost .price-unit-modal.more-than-10 .price-cur').html($('.more-than-10 .price-cur').html());
    $('#modal-cost .price-unit-modal.more-than-40 .price-cur').html($('.more-than-40 .price-cur').html());

    $("input[type=file]").change(function (e) {
        var fileName = [],
            fieldVal = this,
            files = fieldVal.files;

        if (files && files.length >= 1) {
            for (var i = 0; i < files.length; i++) {
                fileName.push(' ' + $(this).get(0).files[i].name);
            }
        }

        if (fileName) {
            $(this).next(".custom-file__name").attr('data-filename', fileName);
        } else {
            $(this).next(".custom-file__name").attr('data-filename', '');
        }
    });

    $('#alert-top').on('click', function () {
        $(this).removeClass('open').hide();
    });

    function declOfNum(number, titles) {
        var cases = [2, 0, 1, 1, 1, 2];
        return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
    }
    (function () {
        $('.product-popover-link').on('inserted.bs.popover', function () {
            $('.popover-content .promo-countdown').each(function () {
                var $this = $(this);
                var thisDate = $(this).text().replace(/\./g, "/");
                var date = new Date(thisDate);
                var now = new Date();
                var daysLeft = Math.ceil((date.getTime() - now.getTime()) / (1000 * 3600 * 24));

                if (daysLeft <= 0) {
                    $this.parent('.label').addClass('hidden');
                } else if (thisDate) {
                    $this.countdown(thisDate, function (event) {
                        daysLeft == 1 ? $this.html(event.strftime('%H:%M:%S')) : $this.html(event.strftime('%D ' + declOfNum(daysLeft - 1, ['день', 'дня', 'дней'])));
                    });
                }
            });
        });

        $('.promo-countdown--main').each(function () {
            var $this = $(this);
            var minDay = Infinity;
            var minDate;
            var thisDate;
            $('.product-popover-inner .promo-countdown').each(function () {
                thisDate = $(this).text().replace(/\./g, "/");
                var date = new Date(thisDate);
                var now = new Date();
                var daysLeft = Math.ceil((date.getTime() - now.getTime()) / (1000 * 3600 * 24));
                if (daysLeft < minDay) {
                    minDay = daysLeft;
                    minDate = thisDate;
                }
            });
            if (minDay <= 0) {
                $this.parent('.label').addClass('hidden');
            } else if (thisDate) {
                $this.countdown(minDate, function (event) {
                    minDay == 1 ? $this.html(event.strftime('%H:%M:%S')) : $this.html(event.strftime('%D ' + declOfNum(minDay - 1, ['день', 'дня', 'дней'])));
                });
                $this.parent('.label').removeClass('hidden');
            }
        });

        $('.mobile-phone-item-js').click(function () {
            var $this = $(this);
            $this.attr('href', getPhoneNumberWithCid($this));
        });

        function getPhoneNumberWithCid($this) {
            var phone = getMainPhone($this),
                cid = $('#cid-number').text(),
                separator = ',5';
            cid = cid.replace('-', '');
            phone = phone.replace(/,[0-9]+/, '');
            return isMobileResolution() ? phone + separator + cid : phone;
        }

        function getMainPhone($this) {
            return $this.hasClass('mobile-phone-item-contacts-js') ? $this.attr('href') : $('#comagic_phone_1').attr('href');
        }
    })();
});

//cart
$(function () {
    $("[data-toggle=add-by-sku]").popover({
        container: 'body',
        html: true,
        trigger: 'click',
        placement: 'bottom',
        content: function content() {
            return $('#add-by-sku').html();
        },
        template: '<div class="popover popover-iso popover-light popover-mobile" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>'
    });
});

$(function () {
    $('[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $('.tab-pane .slider-init').slick('setPosition');
    });

    // Select all links with hashes
    $('.smooth-scroll').not('[href="#"]').not('[href="#0"]').click(function (event) {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            var targetTopOffset = target.offset().top;
            var topOffset = $('body').outerHeight() > targetTopOffset - parseFloat($('body').css('padding-top')) ? parseFloat($('body').css('padding-top')) : 0;
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                event.preventDefault();
                if (!$('html, body').is(':animated')) {
                    $('html, body').animate({
                        scrollTop: targetTopOffset - topOffset
                    }, 1000);
                }
            }
        }
    });
});

function showAlert(status, msg) {
    var alert = $('#alert-top');
    var isOpen = alert.hasClass('open');
    var posTopMobile = 62;
    var offsetDesktop = 10;
    alert.removeClass('alert-success alert-danger');
    alert.addClass('alert-' + status).find('.alert-content').html(msg);
    if (!isOpen) {
        var right = $('.page-main .container').offset().left;
        var top = $('#isolux-top-menu').outerHeight() + ($('#notice-top').length ? $('#notice-top').outerHeight() : 0) + offsetDesktop;
        top = window.tablet ? posTopMobile : top;
        alert.addClass('open').css({ 'right': right, 'top': top }).fadeIn(500).delay(2000).fadeOut(500).queue(function () {
            $(this).removeClass('open').dequeue();
        });
    }
}

var isInitVkRetargeting = false;
$(function () {
    var product = $('.current-product-js');
    if (product.length) {
        var productId = product.data('product-id'),
            productSku = product.data('product-sku'),
            productType = product.data('product-type'),
            customerEmail = getCustomerEmail();
        if (customerEmail) {
            mindbox('async', {
                operation: 'ProductView',
                data: {
                    customer: {
                        email: customerEmail
                    },
                    product: {
                        sku: {
                            ids: {
                                website: productSku
                            }
                        },
                        ids: {
                            website: productId
                        }
                    }
                }
            });
        }

        if (productType == 'simple') {
            var productData = product.find('#productBuyInner .change-qty__value').data('content'),
                productPrice = productData.prices.WH.regular;
            var eventParams = {
                'products': [{
                    'id': productId,
                    'price': Math.ceil(productPrice)
                }]
            };
            sendEventAfterVkRetargetingInit('view_product', eventParams);
        }
    }
});