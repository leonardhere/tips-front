'use strict';

$(function() {
    //activate/deactivate for menuAim
    function showTopMenu(row) {
        $('#goods-dropdown').addClass('open');
        $('#page-overlay').removeClass('hidden');
        $('#search-result, #auth-dropdown').removeClass('open');
    }

    function showTopMenuLevel0(row) {
        if (!window.tablet) {
            if ($(row).hasClass('submenu')) {
                $(row).addClass('open-iso');
            }
            var Nav1 = $(row).find('.navbar-1');
            Nav1.attr('data-height', Nav1.outerHeight());
        }
    }

    function showTopMenuLevel1(row) {
        if (!window.tablet) {
            if ($(row).hasClass('submenu')) {
                $(row).addClass('open-iso');
            }

            var Nav1 = $(row).closest('.navbar-1');
            var Nav2 = $(row).find('.navbar-2__nav');
            var heightNav1 = Nav1.outerHeight();
            var heightNav2 = Nav2.outerHeight();
            var maxHeight = Math.max(heightNav1 - heightNav2, heightNav2);

            Nav2.attr('data-height', heightNav2);
            Nav1.css('height', maxHeight);

            if (heightNav2 === null) {
                Nav1.css('height', 'auto');
            }
        }
    }

    function showTopMenuLevel2(row) {
        if (!window.tablet) {
            if ($(row).hasClass('submenu')) {
                $(row).addClass('open-iso');
            }

            var Nav1 = $(row).closest('.navbar-1');
            var heightNav1 = Nav1.outerHeight();
            var heightNav2 = $(row).closest('.navbar-2 .navbar-2__nav').outerHeight();
            var heightNav3 = $(row).find('.navbar-3 .navbar-3__nav').outerHeight();
            var maxHeight = Math.max(heightNav1 - heightNav2, heightNav2 - heightNav3, heightNav3);

            Nav1.css('height', maxHeight);
        }
    }

    function hideTopMenu(row) {
        $('#goods-dropdown').removeClass('open');
        $('#page-overlay').addClass('hidden');
    }

    function hideTopMenuLevel0(row) {
        if (!window.tablet) {
            $(row).removeClass('open-iso');
        }
    }

    function hideTopMenuLevel1(row) {
        if (!window.tablet) {
            var Nav1 = $(row).closest('.navbar-1');
            $(row).removeClass('open-iso');
            Nav1.css('height', Nav1.attr('data-height'));
        }
    }

    function hideTopMenuLevel2(row) {
        if (!window.tablet) {
            var Nav1 = $(row).closest('.navbar-1');
            $(row).removeClass('open-iso');
            Nav1.outerHeight(Math.max(Nav1.attr('data-height'), $(row).closest('.navbar-2__nav').attr('data-height')));
        }
    }

    function isTabletResolution() {
        return window.innerWidth < MEDIA_BREAKPOINT_TABLET;
    }

    function isMobileResolution() {
        return window.innerWidth < MEDIA_BREAKPOINT_MOBILE;
    }

    $(window).resize(function() {
        window.mobile = isMobileResolution();
        window.tablet = isTabletResolution();
    });

    // $.ajax({
    //     url: '/productInfo/index/getmenu',
    //     type: 'GET'
    // }).done(function (data) {
    //     var submenuArray = $(data).find('.navbar-1');
    //     $('#gtm-catalog > .nav-item').each(function (index) {
    //         $(this).append(submenuArray[index]);
    //     });
    menuAimActivate();
    bindMenuListeners();
    // }).fail(function () {
    //     console.error("product menu load error");
    // });

    function fixHeader() {
        if (window.tablet) {
            return;
        }
        var header = $('.navbar-main');
        var navHeight = header.outerHeight();
        header.removeClass('fixed-head');
        $('.navbar-controls').css('margin-bottom', '');
        var posFromTop = header.offset().top;
        $(window).on("scroll", function(e) {
            if ($(window).scrollTop() >= posFromTop && !window.tablet) {
                header.addClass("fixed-head");
                $('.navbar-controls').css('margin-bottom', navHeight);
                $('.nav-item--sign.dropdown').removeClass('open');
            } else {
                header.removeClass("fixed-head");
                $('.navbar-controls').css('margin-bottom', '');
            }
            if ($(window).scrollTop() > posFromTop + 10 && !window.tablet) {
                header.addClass('shadow-bottom');
            } else {
                header.removeClass('shadow-bottom');
            }
        });
        $(window).scroll();
    }

    function fixHeaderMobile() {
        var header = $('.navbar-iso');
        header.removeClass('shadow-bottom');
        $(window).on("scroll", function(e) {
            if ($(window).scrollTop() > 10) {
                header.addClass('shadow-bottom');
            } else {
                header.removeClass('shadow-bottom');
            }
        });
        $(window).scroll();
    }

    function backToTopFade() {
        if ($('.product-bottom').length) {
            $('.btn-scroll-up').css('bottom', 80);
        }
        if ($(window).scrollTop() > 200) {
            $('.btn-scroll-up').fadeIn();
        } else {
            $('.btn-scroll-up').fadeOut();
        }
    }

    //menuAim activate
    function menuAimActivate() {
        $('#goods-dropdown').menuAim({
            triggerEvent: 'hover',
            rowSelector: '.btn-products',
            submenuDirection: 'below',
            openClassName: 'open',
            activateCallback: showTopMenu,
            deactivateCallback: hideTopMenu,
            activationDelay: 200
        });
        $('.navbar-0').menuAim({
            triggerEvent: 'hover',
            submenuSelector: '.submenu',
            submenuDirection: 'right',
            openClassName: 'open-iso',
            activateCallback: showTopMenuLevel0,
            deactivateCallback: hideTopMenuLevel0,
            activationDelay: 0
        });
        $('.navbar-1__nav').menuAim({
            triggerEvent: 'hover',
            submenuSelector: '.submenu',
            submenuDirection: 'right',
            openClassName: 'open-iso',
            activateCallback: showTopMenuLevel1,
            deactivateCallback: hideTopMenuLevel1,
            activationDelay: 0
        });
        $('.navbar-2__nav').menuAim({
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
        $('.navbar-iso.side-collapse').on('click', function(e) {
            e.stopPropagation();
        });

        console.log(navigator.userAgent);
        $('.nav-item.submenu > .nav-link').on('click', function(e) {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                e.preventDefault();
            }

            if (window.tablet) {
                e.preventDefault();
                $(this).next('.collapse').collapse('toggle');
                $(this).closest('.navbar-iso-nav').find('> .nav-item > .collapse').collapse('hide');
            }
        });

        $('.nav-item.submenu > .collapse').on('show.bs.collapse', function(e) {
            if ($(this).is(e.target)) {
                $(this).prev('.nav-link').addClass('open');
            }
        });

        $('.nav-item.submenu > .nav-link').hammer().bind('doubletap', function(e) {
            if (window.tablet || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                window.location = $(this).attr('href');
            }
        });

        $('.nav-item.submenu > .collapse').on('shown.bs.collapse', function(e) {
            $(this).closest('.navbar-iso-nav').find('> .nav-item > .collapse').not(this).collapse('hide');
        });

        $('.nav-item.submenu > .collapse').on('hide.bs.collapse', function(e) {
            if ($(this).is(e.target)) {
                $(this).prev('.nav-link').removeClass('open');
            }
        });
    }

    var MEDIA_BREAKPOINT_TABLET = 1024;
    var MEDIA_BREAKPOINT_MOBILE = 768;

    //switching triggers
    $(window).on('resize', function() {
        if (window.mobile) {
            $('.popover-iso:not(.popover-mobile)').popover('hide');
        }

        if (!window.tablet) {
            $('body').css('padding-top', ''); //if window resized
            $('.navbar-iso-nav').find('> .nav-item .collapse').collapse('hide').css('height', '');
            menuAimActivate(); //activate menu aim for desktop resolution
            fixHeader(); //fixed navbar
            $('body').removeClass('overflow-hidden');
        } else {
            $('body').css('padding-top', '');
            if ($('#search-result-mobile').hasClass('open')) {
                setSearchStyle();
            }
            fixHeaderMobile();
        }
    });

    $(document).on('show.bs.modal', '.modal', function() {
        $('.navbar-main').css('width', $('.navbar-main').width());
    }).on('hidden.bs.modal', function() {
        $('.navbar-main').css('width', '');
    });

    $(document).on('beforeShow.fb', function() {
        $('.navbar-main').css('width', $("body").prop("clientWidth"));
    }).on('afterClose.fb', function() {
        $('.navbar-main').css('width', '');
    });

    $('#goods-dropdown, #auth-dropdown').on('show.bs.dropdown', function() {
        $('#page-overlay').removeClass('hidden');
        $('#search-result').removeClass('open');
    });

    $('#goods-dropdown, #auth-dropdown').on('hide.bs.dropdown', function() {
        $('#page-overlay').addClass('hidden');
    });

    // $('#goods-dropdown .btn').on('mouseenter', function () {
    //     $('#page-overlay').removeClass('hidden');
    //     $('#search-result').removeClass('open');
    //     $('#goods-dropdown').addClass('open');
    // });

    $(window).resize();

    // backToTopFade();
    $(window).on('scroll', function() {
        backToTopFade();
    });

    //toggle for mobile menu
    var sideslide = $('[data-toggle=collapse-side]');
    var collapsable = sideslide.attr('data-target');
    sideslide.click(function(e) {
        if ($(collapsable).hasClass('in')) {
            $(collapsable).removeClass('in').delay(500).queue(function() {
                $(this).removeClass('show');
                $(this).dequeue();
                $('body').removeClass('overflow-hidden');
            });
        } else {
            $(collapsable).addClass('show').delay().queue(function() {
                $(this).addClass('in').delay(500).queue(function() {
                    $(this).dequeue();
                });
                $(this).dequeue();
                $('body').addClass('overflow-hidden');
            });
        }
    });

    // collapse for main page cata
    $('.collapse-list').on('show.bs.collapse', function() {
        $($(this).attr('data-parent') + ' .collapse-list').not($(this)).collapse('hide');
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

    $(document).on('click', '.popover .isoi-close', function() {
        $(this).parents('.popover').popover('hide');
    });

    $('.catalog-list-link').on('click', function(e) {
        if (!window.mobile && $(this).siblings('.popover-outer').length) {
            e.preventDefault();
            $('.catalog-list-link').not(this).popover('hide');
            $(this).popover('toggle');
        }
    });

    // search form controls
    var inputTimeout = null;
    $('#search').on('input', function() {
        var value = $(this).val();
        value.length ? $('#search-reset').show() : $('#search-reset').hide();
        $('#search').addClass('focused');
        clearTimeout(inputTimeout);
        inputTimeout = setTimeout(function() {
            if (value.length > 2) {
                $.ajax({
                    type: 'POST', datatype: 'HTML',
                    //TODO url брать из формы
                    url: '/catalogSearchExtendet/ajax/index/' + 'q/' + value,
                    success: function success(data) {
                        $("#search-result").html(data);
                    }
                });
                $('#search-result').addClass('open');
            }
        }, 300);
    });

    $('#search-mobile').on('input', function() {
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

    $('#search').on('focus', function() {
        if ($(this).val().length) {
            $('#search-result').addClass('open');
        }
    });

    $('#search-mobile').on('focus', function() {
        if ($(this).val().length) {
            $('#search-result-mobile').addClass('open');
            $('body').addClass('overflow-hidden');
            setSearchStyle();
        } else {
            $('#search-result-mobile').removeClass('open');
            $('body').removeClass('overflow-hidden');
        }
    });

    $('.mob-item--search').on('click', function(e) {
        e.stopPropagation();
        $('#mobile-search-wrap').toggleClass('hidden');
        $('#page-overlay').toggleClass('hidden');
        $('#search-mobile').focus();
    });

    $(document).on('click', function(e) {
        if ($('#search').length && $(e.target).attr('id') !== 'search') {
            $('#search').removeClass('focused');
            $('#search-result').removeClass('open');
        }

        if ($('#mobile-search-wrap').length && $(e.target).attr('id') !== 'mobile-search-wrap') {
            $('#mobile-search-wrap, #page-overlay').addClass('hidden');
            $('body').removeClass('overflow-hidden');
        }

        // if ($('.product-calc .dropdown-menu').length && $(e.target).attr('id') !== 'dropdown-calc') {
        //     $('.product-calc').removeClass('open');
        // }
    });

    $(document).on('click', '.dropdown-search, #mobile-search-wrap, .product-calc .dropdown-menu', function(e) {
        e.stopPropagation();
    });

    $('#search-reset').on('click', function() {
        $('#search').focus().addClass('focused').val('');
        $('#search-result').removeClass('open');
        $(this).hide();
    });

    $('#search-mobile-reset').on('click', function() {
        $('#search-mobile').focus().addClass('focused').val('');
        $('#search-result-mobile').removeClass('open');
        $(this).hide();
        $('body').removeClass('overflow-hidden');
    });

    //btn scroll-up
    $('.btn-scroll-up').on('click', function(e) {
        e.preventDefault();
        $('body,html').animate({
            scrollTop: 0
        }, 300);
    });

    $('.select-collapse-group').on('change', function() {
        $('.' + $(this).data('parent') + '-collapse').hide();
        $('.' + $(this).data('parent') + '-collapse select').prop('disabled', true);
        $('#' + $(this).data('parent') + '-collapse-' + $(this).val()).show();
        $('#' + $(this).data('parent') + '-collapse-' + $(this).val() + ' select').prop('disabled', false);
    });

    $(document).on('click', function(e) {
        $('[data-toggle="popover"],[data-original-title]').each(function() {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                (($(this).popover('hide').data('bs.popover') || {}).inState || {}).click = false;
            }
        });
    });

    $('.modal-menu-drop').on('click', function(e) {
        e.stopPropagation();
    });

    // $('.navbar-controls__item, .page-footer__list .page-footer__link[data-toggle="modal"], [href="#modal-opt"]').on('click', function () {
    //     switch ($(this).attr('href')) {
    //         case '#sendAplication':
    //             dataPushToGTM('gtmSendEvent', 'Формы (forms)', 'Форма - Заявка на расчет - Клик', 'Отправить заявку на расчет');
    //             break;
    //
    //         case '#callback':
    //             dataPushToGTM('gtmSendEvent', 'Формы (forms)', 'Форма - Обратный звонок - Клик', 'Заказать звонок');
    //             break;
    //
    //         case '#provider':
    //             dataPushToGTM('gtmSendEvent', 'Формы (forms)', 'Форма - Стать поставщиком - Клик', 'Стать поставщиком');
    //             break;
    //
    //         case '#workReview':
    //             dataPushToGTM('gtmSendEvent', 'Формы (forms)', 'Форма - Оставить отзыв - Клик', 'Оставить отзыв');
    //             break;
    //
    //         case '#modal-opt':
    //             dataPushToGTM('gtmSendEvent', 'Оптовикам (opt)', 'Оптовикам - Заявка - Клик', 'Оптовикам - Заявка - Клик');
    //             break;
    //     }
    // });

    $('.calc-delivery input, .change-qty__value').on('keypress keydown', function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    });

    $('#mobile-phone-item').click(function(event) {
        var $this = $(this);
        if ($this.data('telephony-problem')) {
            event.preventDefault();
            showAlert('danger', 'Проблемы с телефонией! <br> <a class="alert-link underline" href="/telephony-problem">Ответы на вопросы</a>');
        } else {
            $this.attr('href', $('#comagic_phone_1').attr('href'));
        }
    });

    /**
     * Get telephone number with CID on mobile
     */
    function getPhoneNumberWithCid($this) {
        var phone = getMainPhone($this),
            cid = $('#cid-number').text(),
            separator = ',5';
        cid = cid.replace('-', '');
        phone = phone.replace(/,[0-9]+/, '');
        return window.mobile ? phone + separator + cid : phone;
    }

    function getMainPhone($this) {
        return $this.hasClass('comagic-phone') ? $('#comagic_phone_1').attr('href') : $this.attr('href');
    }

    $('label.rating-star').on('click', function() {
        $(this).addClass('active');
        $(this).siblings('.rating-star').removeClass('active');
        $(this).closest('.dropdown').dropdown('toggle');
    });
});

//plugin startup
$(function() {
    var _settings, _settings2, _settings3, _settings4, _settings5, _settings6, _settings7, _tabs;

    $('[data-toggle=popover-inline]').popover({ trigger: 'click', template: '<div class="popover popover-iso" role="tooltip"><div class="arrow"></div><span class="isoi isoi-close"></span><h3 class="popover-title"></h3><div class="popover-content"></div></div>' });

    $('[data-toggle=popover-block]').popover({
        trigger: 'click',
        html: 'true',
        content: function content() {
            return $(this).next('.popover-data').html();
        },
        template: '<div class="popover popover-iso" role="tooltip"><div class="arrow"></div><span class="isoi isoi-close"></span><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    });

    function getBannerTitle($currentSlide) {
        return $($currentSlide).find('.img-responsive').attr('alt');
    }

    $('#main-slider').on('init', function(event, slick) {
        var imageTitle = getBannerTitle(slick['$slides'][0]);
        // dataPushToGTM('gtmSendEventNonInt', 'Баннер на главной', 'Показ', imageTitle);
    }).slick({
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
            breakpoint: 810,
            settings: {
                arrows: false
            }
        }]
    }).on('afterChange', function(event, slick, currentSlide) {
        var imageTitle = getBannerTitle(slick['$slides'][currentSlide]);
        // dataPushToGTM('gtmSendEventNonInt', 'Баннер на главной', 'Показ', imageTitle);
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
            breakpoint: 810,
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
            breakpoint: 810,
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
            breakpoint: 810,
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
                // adaptiveHeight: true
            }
        }, {
            breakpoint: 1199,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
                dots: false,
                arrows: true
                // adaptiveHeight: true
            }
        }]
    });

    /// product card
    $(window).resize(function() {
        if ($(window).width() > 767) {
            $('.product-delivery__content.in').collapse('hide');
            $('.product-delivery__link').not('.collapsed').addClass('collapsed');
        }
    });

    $(document).on('click', '.product-spec-add-toggler', function() {
        var parent = $(this).parents('.product-spec-wrap');
        parent.find('.product-spec-add').toggleClass('hidden');
        parent.find('.product-spec-add-toggler > span').toggleClass('hidden');
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

    $('.product-delivery__link').on('click', function(e) {
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
    }).on('show.bs.popover', function() {
        $(this).addClass('open');
    }).on('hide.bs.popover', function() {
        $(this).removeClass('open');
    });

    $('.product-calc__link').on('click', function(e) {
        e.preventDefault();
        if (window.mobile) {
            $('.product-delivery').find('.product-delivery__content.in').collapse('hide');
            $('.product-delivery').find('.product-delivery__link').not(this).addClass('collapsed');
            $(this).toggleClass('collapsed');
            $(this).next('.dropdown-menu__collapse').collapse('toggle');
        } else {
            $('.product-delivery__link').popover('hide');
            $(this).dropdown();
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
    $(document).on('click', '.popover .delivery-modal,  .delivery-modal', function(e) {
        e.preventDefault();
        var url = $(this).attr('href');
        var modal = $('#delivery-modal');
        if (!isLoaded) {
            modal.find('.modal-body').load(url, function(result) {
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

    $(".custom-file__input").on('change', function(e) {
        var fileName = [],
            fieldVal = this,
            files = fieldVal.files;
        var nameField = $(this).next(".custom-file__name");
        var defaultFilename = nameField.attr('data-deffilename');
        if (files && files.length >= 1) {
            for (var i = 0; i < files.length; i++) {
                fileName.push(' ' + $(this).get(0).files[i].name);
            }
        }

        if (fileName.length) {
            nameField.attr('data-filename', fileName).removeClass('custom-file__name--empty');
        } else {
            console.log('empty');
            nameField.attr('data-filename', 'Файл').addClass('custom-file__name--empty');
        }
    });

    $('#alert-top').on('click', function() {
        $(this).removeClass('open').hide();
    });

    function declOfNum(number, titles) {
        var cases = [2, 0, 1, 1, 1, 2];
        return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
    }
    (function() {
        $('.product-popover-link').on('inserted.bs.popover', function() {
            $('.popover-content .promo-countdown').each(function() {
                var $this = $(this);
                var thisDate = $(this).text().replace(/\./g, "/");
                var date = new Date(thisDate);
                var now = new Date();
                var daysLeft = Math.ceil((date.getTime() - now.getTime()) / (1000 * 3600 * 24));

                if (daysLeft <= 0) {
                    $this.parent('.label').addClass('hidden');
                } else if (thisDate) {
                    $this.countdown(thisDate, function(event) {
                        daysLeft == 1 ? $this.html(event.strftime('%H:%M:%S')) : $this.html(event.strftime('%D ' + declOfNum(daysLeft - 1, ['день', 'дня', 'дней'])));
                    });
                }
            });
        });

        $('.promo-countdown--main').each(function() {
            var $this = $(this);
            var minDay = Infinity;
            var minDate;
            var thisDate;
            $('.product-popover-inner .promo-countdown').each(function() {
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
                $this.countdown(minDate, function(event) {
                    minDay == 1 ? $this.html(event.strftime('%H:%M:%S')) : $this.html(event.strftime('%D ' + declOfNum(minDay - 1, ['день', 'дня', 'дней'])));
                });
                $this.parent('.label').removeClass('hidden');
            }
        });
    })();

    $('.youtube-preview').each(function() {
        var videoId = this.id;
        var $this = $(this);

        $.getJSON('https://www.googleapis.com/youtube/v3/videos?id=' + videoId + '&key=AIzaSyBLZoOjGKYxb7tGMpCH2QusB6LSYcEcugI&part=snippet&callback=?', function(data) {
            if (typeof data.items[0] != "undefined") {
                $this.attr('title', data.items[0].snippet.title);
                $this.append('<div class="youtube-preview__title">' + data.items[0].snippet.title + '</div>');
            }
        });
    });

    $(document).on('click', '.youtube-preview', function() {
        var iframe_url = "https://www.youtube.com/embed/" + this.id + "?rel=0&autoplay=1";
        if ($(this).data('params')) iframe_url += '&' + $(this).data('params');

        var iframe = $('<iframe/>', {
            'frameborder': '0',
            'src': iframe_url,
            'class': 'embed-responsive-item',
            'allowfullscreen': 'true'
        });

        $(this).replaceWith(iframe);
    });

    var defaultAlias = $('.product-tabs--spec .nav-item.active a').data('alias'),
        defaultUrlParam = $('.product-tabs--spec .nav-item.active:not(:first-child) a').data('alias');

    defaultUrlParam = !!defaultUrlParam ? '?' + defaultUrlParam : '';
    var tabs = (_tabs = {}, _tabs[defaultAlias] = {
        'canonical': $('link[rel="canonical"]').attr('href'),
        'meta_description': $('meta[name="description"]').attr('content'),
        'meta_title': $('title').text(),
        'title': $('.product-header').text(),
        'url_param': defaultUrlParam
    }, _tabs);

    if (!!defaultAlias) {
        scrollPageToTab(defaultAlias);
    }

    if (window.tablet) {
        $('#product-' + defaultAlias + '-inner').collapse('show');
    }

    $('#tab-content-container li').on('click', function() {
        var $this = $(this);
        if ($this.data('is-custom-tab') && !$this.hasClass('active')) {
            var label = 'таб ' + $this.find('a').text().trim() + ' товара';
            // dataPushToGTM('gtmSendEventNonInt', 'Табы', 'Переход', label);
        }
    });

    $('.product-tabs--spec .nav-item a, .product-tabs--spec .collapse-list').on('show.bs.tab show.bs.collapse', function(e) {
        var alias = $(this).data('alias'),
            currentTabContentId = '#product-' + alias + '-inner',
            currentTabContent = $(currentTabContentId).find('> .collapse-list-content');
        var loader = '<div class="loader-spin-wrap">' + '<img src="/skin/frontend/adaptive/default/images/bg/loader-spin.svg">' + '</div>';
        if (!tabs.hasOwnProperty(alias)) {
            var _data;

            var setYoutubeTitle = function setYoutubeTitle() {
                $('.youtube-preview').each(function() {
                    var videoId = this.id;
                    var $this = $(this);

                    $.getJSON('https://www.googleapis.com/youtube/v3/videos?id=' + videoId + '&key=AIzaSyBLZoOjGKYxb7tGMpCH2QusB6LSYcEcugI&part=snippet&callback=?', function(data) {
                        if (typeof data.items[0] != "undefined") {
                            $this.attr('title', data.items[0].snippet.title);
                            $this.append('<div class="youtube-preview__title">' + data.items[0].snippet.title + '</div>');
                        }
                    });
                });
            };

            var initPopovers = function initPopovers() {
                $('[data-toggle=popover-block]').popover({
                    trigger: 'click',
                    html: 'true',
                    content: function content() {
                        return $(this).next('.popover-data').html();
                    },
                    template: '<div class="popover popover-iso" role="tooltip"><div class="arrow"></div><span class="isoi isoi-close"></span><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
                });
            };

            currentTabContent.html(loader);
            $.ajax({
                url: '/catalog/product/tabsContent',
                type: 'POST',
                data: (_data = {
                    'id': $('.product-summary').data('product-id')
                }, _data[alias] = null, _data),
                dataType: 'json'
            }).done(function(result) {
                tabs[alias] = result['seo'];
                currentTabContent.html(result.html);
                switch (alias) {
                    case 'simple':
                        initPopovers();
                        showMoreInit();
                        break;
                    case 'description':
                        setYoutubeTitle();
                        break;
                    case 'specification':
                    case 'about':
                        initPopovers();
                        break;
                    case 'grouped':
                        initServiceComplex();
                        preventComplexCollapse();
                        break;
                    case 'bundle':
                        initServiceBundle();
                        break;
                    case 'documentation':
                        googleDocViewInit();
                        break;
                }
                setPageSeo();
            }).fail(function() {
                console.error("product tab load error");
            });
        } else {
            setPageSeo();
        }

        scrollPageToTab(alias);

        function setPageSeo() {
            var currentTabData = tabs[alias];
            //h1
            $('.product-header').text(currentTabData['title']);
            //url
            window.history.pushState(null, document.title, location.origin + location.pathname + currentTabData['url_param']);
            //canonical
            $('link[rel="canonical"]').attr('href', currentTabData['canonical']);
            //title
            $('title').text(currentTabData['meta_title']);
            //description
            $('meta[name="description"]').attr('content', currentTabData['meta_description']);
        }
    });

    function scrollPageToTab(defaultAlias) {
        var elementId,
            defaults = ['simple', 'grouped', 'bundle'];
        if (defaults.indexOf(defaultAlias) != -1) {
            if (!window.tablet) {
                $('html, body').animate({
                    scrollTop: 0
                }, 500);
            }
        } else {
            // elementId = 'tab-content-container';
            // var targetTopOffset = $('#' + elementId).offset().top,
            //     topOffset = $('body').outerHeight() > targetTopOffset - parseFloat($('body').css('padding-top')) ? parseFloat($('body').css('padding-top')) : 0;
            // $('html, body').animate({
            //     scrollTop: targetTopOffset - topOffset
            // }, 500);
        }
    };

    function showMoreInit() {
        $('.link-more--tab').on('click', function(e) {
            e.stopPropagation();
            var target = $(this).data('href');
            window.tablet ? $(target + '-inner').collapse('show') : $('[data-target="' + target + '"]').tab('show');
        });
    }

    function preventComplexCollapse() {
        $('.product-table--complex .collapse').on('show.bs.collapse', function(e) {
            e.stopPropagation();
        });
    }

    function initServiceBundle() {
        service.resetItems();
        $('.product-card .product-card__buttons .change-qty').each(function(idx, container) {
            return service.addProduct(new Product($($(container).find('input')).data('content')));
        });
        service.addPromotions($('#all-discounts').data('content'));

        $('.product-card .product-card__buttons').each(function(idx, container) {
            return productButtonsHandler($(container), service);
        });
    }

    var iframeDocTimers = [];
    /**
     * Required for proper loading of doc iframe
     *
     */
    function googleDocViewInit() {
        var interval = window.tablet ? 5000 : 2000;
        $('#product-documentation .embed-responsive-16by9 iframe').on('load', function() {
            $(this).addClass('doc-loaded');
            clearInterval(iframeDocTimers[$(this).data('id')]);
        });

        $('#product-documentation .embed-responsive-16by9 iframe').each(function(key, item) {
            iframeDocTimers[key] = setInterval(function() {
                if (!$(item).hasClass('doc-loaded') && $('html').hasClass('onload')) {
                    $(item).attr('src', $(item).attr('src'));
                }
            }, interval);
            $(item).data('id', key);
        });
    }

    googleDocViewInit();
    preventComplexCollapse();
    showMoreInit();
});

//cart
$(function() {
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

$(function() {
    $('[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        $('.tab-pane .slider-init').slick('setPosition');
    });

    // Select all links with hashes
    $('.smooth-scroll').not('[href="#"]').not('[href="#0"]').click(function(event) {
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
    if (isOpen) return;
    var right = $('.page-main .container').offset().left;
    var top;
    if (window.tablet) {
        top = posTopMobile;
    } else {
        top = $('#isolux-top-menu').outerHeight() + ($('#notice-top').length ? $('#notice-top').outerHeight() : 0) + offsetDesktop;
    }
    alert.addClass('open').css({ 'right': right, 'top': top }).fadeIn(500).delay(2000).fadeOut(500).queue(function() {
        $(this).removeClass('open').dequeue();
    });
}

var isInitVkRetargeting = false;
$(function() {
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

        if (productType == 'simple' && $('#productBuyInner .change-qty__value[data-content]').length) {
            var productData = product.find('#productBuyInner .change-qty__value[data-content]').data('content'),
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

$(function() {
    $('.navbar-main__search').on('submit', function() {
        var input = $(this).find('[name="q"]');

        if (typeof DY != 'undefined') {
            DY.API('event', {
                name: 'Keyword Search',
                properties: {
                    dyType: 'keyword-search-v1',
                    keywords: input.val()
                }
            });
        }
    });
});

$(window).on('load', function() {
    $('html').addClass('onload');
});
