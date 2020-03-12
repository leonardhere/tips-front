$(function () {
    $.fn.isInViewport = function() {
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();

        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();

        return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    $(window).on('resize scroll', function() {
        $('.to-anim').each(function() {
            if ($(this).isInViewport()) {
                $(this).addClass('in-view');
            }
        });
    });
    $(window).scroll();

    $('.lp-goods-slider').slick({
        mobileFirst: true,
        infinite: false,
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        centerMode: false,
        speed: 150,
        accessibility: false,
        responsive: [
            {
                breakpoint: 460,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    arrows: true,
                    dots: true,
                    arrows: false
                }
            }, {
                breakpoint: 787,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    arrows: true,
                    dots: true,
                    arrows: false,
                    centerMode: false
                }
            }, {
                breakpoint: 1023,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    dots: true,
                    arrows: false,
                    centerMode: false
                }
            }
        ]
    });

    $('.lp-slider-dots__item').on('click', function () {
        var $this = $(this);
        $this.siblings().removeClass('active');
        $this.addClass('active');
        $('.lp-slider__price-old').fadeOut(500, function() {$('#lp-price-old').text($this.data('priceold'))}).fadeIn(500);
        $('.lp-slider__price').fadeOut(500, function() {$('#lp-price').text($this.data('price'))}).fadeIn(500);
    });

    //Build mini maps
    $('.contact-card').each(function() {
        var $this = $(this);
        //Office name
        var officeName = $this.find('.contact-card__header').html();
        //address
        var address = $this.find('.contact-card__address').html();
        //map
        var myMap,
            mapCenter = $this.find('.contact-card__detailed').attr('data-coords').split(','),
            mapContainerID = $this.find('.contact-card__map-mini').attr('id').replace('#', '');
        ymaps.ready(function() {
            myMap = new ymaps.Map(mapContainerID, {
                    center: mapCenter,
                    zoom: 16,
                    controls: []
                }),
                myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
                    hintContent: officeName,
                    balloonContent: address
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: 'skin/frontend/adaptive/default/images/mapicon.png',
                    iconImageSize: [57, 52],
                    iconImageOffset: [-20, -50]
                });

            myMap.geoObjects.add(myPlacemark);
        });
    });

    $('.contact-card__detailed').on('click', function(e) {
        e.preventDefault();
        var modal = $('#modal-map-detailed');
        var $this = $(this).closest('.contact-card');
        var officeName = $this.find('.contact-card__header').html();
        var address = $this.find('.contact-card__address').html();
        var myMap,
            mapCenter = $this.find('.contact-card__detailed').attr('data-coords').split(',');
        var leftColContent = $this.find('.contact-col-right').html();

        modal.find('#contact-modal-content').html(leftColContent);

        ymaps.ready(function() {
            myMap = new ymaps.Map('contact-modal-map', {
                    center: mapCenter,
                    zoom: 15,
                    controls: ['zoomControl']
                }),
                myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
                    hintContent: officeName,
                    balloonContent: address
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: 'skin/frontend/adaptive/default/images/mapicon.png',
                    iconImageSize: [57, 52],
                    iconImageOffset: [-20, -50]
                });

            myMap.geoObjects.add(myPlacemark);
        });

        modal.modal('show');
        modal.on('hidden.bs.modal', function() {
            myMap.destroy();
        });
    });
});
