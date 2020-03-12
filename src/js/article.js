'use strict';

$(function() {
    var nav = $('#article-nav'),
        siteTop = $('.site-controls').outerHeight(),
        navTopDelta = 20;

    function positionStickySupport() {
        var el = document.createElement('a'),
            mStyle = el.style;
        mStyle.cssText = "position:sticky;position:-webkit-sticky;position:-ms-sticky;";
        return mStyle.position.indexOf('sticky') !== -1;
    };

    function affixScrollspy() {

        $('body').scrollspy({
            target: '#article-nav',
            offset: siteTop + navTopDelta
        });

        if (positionStickySupport()) {
            nav.css({
                'position': 'sticky',
                'top': siteTop + navTopDelta
            });
        } else {
            $(window).on('load resize', function(e) {
                var artBodyHeight = $('.article-main').outerHeight(),
                    artBodyTop = $('.article-main').offset().top,
                    topTrigger = artBodyTop - siteTop - navTopDelta,
                    bottomTrigger = $(document).height() - artBodyTop - artBodyHeight + siteTop - navTopDelta / 2;

                nav.affix({
                    offset: {
                        top: topTrigger,
                        bottom: bottomTrigger
                    }
                });

                nav.affix('checkPosition');

                if (e.type === 'resize') {
                    nav.data('bs.affix').options.offset.top = topTrigger;
                    nav.data('bs.affix').options.offset.bottom = bottomTrigger;
                }
            });

            $(window).scroll(); // for fix bs affix bug on window resize
        }
    }

    nav.on('affix.bs.affix', function(e) {
        $(this).css('top', siteTop + 20);
    });

    nav.on('affix-top.bs.affix', function(e) {
        $(this).css('top', 0);
    });

    if ($('.article-body h2').length > 0) {
        $('.article-body h2').each(function(i) {
            $(this).attr('id', i + 1);
            $('<li class="article-nav__item"><a class="article-nav__link smooth-scroll" href=\'#' + (i + 1) + '\'><span class="article-nav__num">' + (i + 1) + '</span><span class="article-nav__text">' + $(this).text() + '</span></a></li>').appendTo('.article-nav .article-nav__list');
        });
        affixScrollspy();
    } else {
        nav.hide().next('.pull-right').removeClass('pull-right');
    }

    $('.article-body img').each(function() {
        if (!$(this).parent('div').hasClass('art-life-hack')) {
            if ($(this).parent('.fancy_gallery, [data-fancybox], a[rel="group"]').length) {
                $(this).parent().wrap('<div class=\'article-img\'></div>');
                $(this).parent().after('<div class="article-img-share"><span class="ya-share2" data-lang="ru" data-size="s" data-services="vkontakte,facebook,twitter,odnoklassniki,gplus" data-direction="vertical"></span></div>');
            } else if ($(this).parent().not('a').length) {
                $(this).wrap('<div class=\'article-img\'><a data-fancybox="group" href=' + $(this).attr('src') + ' data-caption="' + $(this).attr('alt') + '"></a></div>');
                $(this).after('<div class="article-img-share"><span class="ya-share2" data-lang="ru" data-size="s" data-services="vkontakte,facebook,twitter,odnoklassniki,gplus" data-direction="vertical"></span></div>');
            } else {
                $(this).wrap('<div class=\'article-img\'></div>');
                $(this).after('<div class="article-img-share"><span class="ya-share2" data-lang="ru" data-size="s" data-services="vkontakte,facebook,twitter,odnoklassniki,gplus" data-direction="vertical"></span></div>');
            }

            if ($(this).attr('alt')) {
                $(this).after('<div class=\'article-img-caption\'>' + $(this).attr('alt') + '</div>');
            }
        }
    });

    $('.article-body table').each(function() {
        $(this).wrap('<div class=\'table-responsive\'></div>');
    });

    $('.art-video').addClass('embed-responsive, embed-responsive-16by9');

    $('.article-body .fancy_gallery:not([target="_blank"]), .article-body a[rel="group"]:not([target="_blank"])').each(function() {
        $(this).attr({'data-fancybox': $(this).attr('rel'), 'data-caption': $(this).children('img').attr('alt')});
    });

    $('[data-fancybox]:not([target="_blank"])').fancybox({
        loop: true,
        btnTpl: {
            slideShow: false,
            fullScreen: false,
            thumbs: false,
            close: '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"></button>',
            smallBtn: '<button data-fancybox-close class="fancybox-close-small" title="{{CLOSE}}"></button>'
        }
    });

    $('.article-nav__item:not(.active) .article-nav__link.smooth-scroll').not('[href="#"]').not('[href="#0"]').click(function(event) {
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

    if ($('.article-last').length) {
        $('.articles-more').css({'display': 'none'});
    }

    //обработчик нажатия кнопки "показать больше статей"
    $('.articles-more-btn').click(function() {
        var rubric = $('.articles-rubric').attr('data-rubric-id'),
            type = $('.articles-controls__item.active').attr('data-type'),
            pageSize = 12;

        $.ajax({
            type: 'POST',
            datatype: 'HTML',
            url: '/articles/index/ajax/rubric/' + rubric + '/type/' + type + '/pageNum/' + $('.articles-more-btn').attr('data-page-next') + '/pageSize/' + pageSize,

            beforeSend: function beforeSend() {
                $('.articles-more-btn').addClass('loading');
            },
            complete: function complete() {
                $('.articles-more-btn').removeClass('loading');
            },
            success: function success(data) {
                $('.articles-content').append(data);
                $('.articles-more-btn').attr('data-page-next', Number($('.articles-more-btn').attr('data-page-next')) + 1);

                if ($('.article-last').length) {
                    $('.articles-more').collapse('hide');
                }

                $('.articles-more').blur();
            },
            error: function error() {
                $('.articles-more').html('<div class="alert alert-danger" role="alert">Произошла ошибка<div>Обновите страницу</div></div>');
            }
        });
    });
});
