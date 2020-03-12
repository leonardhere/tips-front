$(function() {

    $('#buyProductModal').on('show.bs.modal', function(e) {
        const button = $(e.relatedTarget);
        const root = $(button).closest('.product-card');
        const modal = $(this);
        const modalContent = $(this).find('.product-table__row--content');
        const data = root.find('.change-qty__value').data('content');
        const input = modal.find('input[name=qty]');
        const productData = service.getProductData(data['sku']);
        const promoData = service.getPromotionsForProduct(data['sku']);
        $('#buyProductModalPromo .alert-default .info-block:not(.promo-template)').remove();
        $('#buyProductModalPromo').addClass('hidden');
        service.forceChangeLevelCallback();
        cleanUpModalValues(service, data['sku'], input);
        if (promoData.length) {
            $('#buyProductModalPromo').removeClass('hidden');
            // promoData.forEach(function (item, i) {
            $.each(promoData, function (i, item) {
                const template = $('#buyProductModalPromo .promo-template').clone();
                template.removeClass('hidden promo-template').data('product', item['gift']['id']).addClass('promo-product-' + item['gift']['id']);
                template.find('.promo-link').attr('href', item['promotion']['url']);
                template.find('.promo-text').text(item['promotion']['name']);
                $('#buyProductModalPromo .alert-default').append(template);
            });
        }

        // $('#buyProductModalForm').attr('action', root.find('.change-qty__value').data('action'));
        input.data('content', data);
        modal.find('.product-header').text(root.find('.product-card__name a').text());
        modal.find('.product-table__row--content .product-table__col--sku .product-table-sku-value').text(productData['shortSku']);
        modal.find('.product-card__img').attr('src', root.find('.product-card__img').attr('src'));
        modalContent.find('.product-table__col--qty .change-qty__value').val(root.find('.change-qty__value').val());
        modalContent.find('.product-table__col--less-10 .product-table-price-num').text(productData['generalCurrent']);
        modalContent.find('.product-table__col--less-10 .product-table-price--old').text(productData['generalOld']);
        modalContent.find('.product-table__col--10 .product-table-price-num').text(productData['swhCurrent']);
        modalContent.find('.product-table__col--10 .product-table-price--old').text(productData['swhOld']);
        modalContent.find('.product-table__col--40 .product-table-price-num').text(productData['whCurrent']);
        modalContent.find('.product-table__col--40 .product-table-price--old').text(productData['whOld']);

        dataPushToGTM('gtmSendEvent', 'Каталог (catalog)', 'Каталог - В корзину (click)', 'Каталог - В корзину');
    });

    $('#buyProductModal').on('hide.bs.modal', function(e) {
        const input = $(this).find('input[name=qty]');
        // cleanUpModalValues(service, input.data('content')['sku'], input);
        $('#buyProductModal .product-table-buy-btn').attr('disabled', false).removeClass('iso-bar');
    });

    if($('.catalog-filter__link.catalog-filter__close').length) {
        $('.form-clean').removeClass('hidden');
        $('[data-target="#catalog-filters"]').removeClass('btn-default').addClass('btn-primary');
    }

    $('.catalog-filter__item').each(function(index, el) {
        el = $(el);
        const selectedContainer = el.find('.catalog-filter--selected');
        const selected = el.find('.custom-control__input[type=checkbox]:checked');
        el.find('.custom-control__input[type=checkbox]:checked').each(function(index, el) {
            var delimeter = index < selected.length - 1 ? ', ' : ''
            selectedContainer.append($(this).siblings('.custom-control__description').find('.custom-control__label').text() + delimeter);
        });
    });

    $('.js-slider').each(function() {
        var slider = $(this);
        var filterElement = slider.parents('.catalog-filter__item');
        var minField = filterElement.find('.js-filter-min');
        var maxField = filterElement.find('.js-filter-max');
        var minValue = parseFloat(slider.find('.js-min-value').val());
        var maxValue = parseFloat(slider.find('.js-max-value').val());
        var step = slider.parents('.js-slider-price').length > 0
            ? 1
            : 0.1;

        // узнаем текущие настройки фильтра цены
        //var currentPrice = getRangeUrl(slider.data('slider-param'), step);
        var currentMinValue = minField.val()
            ? minField.val()
            : minValue;
        var currentMaxValue = maxField.val()
            ? maxField.val()
            : maxValue;
        // записываем текущие настройки фильтра цены в input'ы
        minField.val(currentMinValue);
        maxField.val(currentMaxValue);

        slider.slider({
            range: true,
            min: minValue,
            max: maxValue,
            values: [
                currentMinValue, currentMaxValue
            ],
            step: step,
            create: function create() {
                var sliderValues = slider.slider('values');

                slider.find('> a:nth-child(2)').addClass('slider-left');
                slider.find('> a:nth-child(3)').addClass('slider-rigth');

            },
            slide: function slide(event, ui) {
                minField.val(ui.values[0]);
                maxField.val(ui.values[1]);
            },
            start: function start() {
                // dataPushToGTM('Filters', 'Фильтр - цена (price_filter)', 'Перемещение ползунка (slide)');
                // fixGAEvents('price_filter', 'slide');
            }
        });

        function onInputChange() {
            var min = parseFloat(minField.val())
                    ? parseFloat(minField.val())
                    : 0,
                max = parseFloat(maxField.val())
                    ? parseFloat(maxField.val())
                    : 0,
                val;
            if (min > max) {
                val = min;
                min = max;
                max = val;
            }
            minField.val(min);
            maxField.val(max);
            slider.slider('values', [min, max]);
        }

        minField.on('input', function() {
            onInputChange();
        });

        maxField.on('input', function() {
            onInputChange();
        });
    });

    $('#catalog-filters .js-slider').each(function() {
        showSliderValue($(this));
    });

    function showSliderValue(target) {
        const root = target.closest('.catalog-filter__item');
        const selectedContainer = root.find('.catalog-filter--selected');
        const currentValues = target.slider('values');

        const minValue = parseFloat(target.find('.js-min-value').val());
        const maxValue = parseFloat(target.find('.js-max-value').val());

        const currentMinValue = currentValues[0];
        const currentMaxValue = currentValues[1];
        const sliderValues = target.closest('.js-slider-form').find('.label-units').text();

        if ((currentMinValue !== minValue || currentMaxValue !== maxValue) && maxValue !== 0) {
            selectedContainer.text('от ' + currentMinValue + ' до ' + currentMaxValue + ' ' + sliderValues);
        }
    }

    $('#catalog-filters .js-filter-min').on('change', function() {
        $(this).closest('.js-slider-form').find('.js-slider').trigger('slidestop');
    });

    $('#catalog-filters').on('submit', function(e) {
        e.preventDefault();

        var currentUrl = document.getElementById('current-url'); // required native for work with location
        let url = '';
        const obj = {};

        if((location.href).indexOf('catalogsearch') > 0) {
            var searchQueryStart = currentUrl.href.indexOf('?q=');
            var searchQueryEnd = currentUrl.href.indexOf('&');
            currentUrl = location.protocol + '//' + location.host + currentUrl.pathname +
                        currentUrl.href.substring(searchQueryStart, searchQueryEnd > 0 ? searchQueryEnd : Infinity);
        } else {
            currentUrl = location.protocol + '//' + location.host + currentUrl.pathname;
        }

        $('.js-slider').each(function() {
            var $this = $(this);
            var currentValues = $this.slider('values');

            const minValue = parseFloat($this.find('.js-min-value').val());
            const maxValue = parseFloat($this.find('.js-max-value').val());

            const currentMinValue = currentValues[0];
            const currentMaxValue = currentValues[1];
            const sliderParam = $this.data('slider-param');

            if ((currentMinValue !== minValue || currentMaxValue !== maxValue) && maxValue !== 0) {
                url += '&' + sliderParam + '=' + rangeUrl(currentMinValue, currentMaxValue, (sliderParam === 'price'
                    ? 1
                    : 0.1));
            }
        });


        $('#catalog-filters .custom-control__input[type=checkbox]:checked').each(function() {
            if (!obj.hasOwnProperty(this.name)) {
                obj[this.name] = [this.value];
            } else {
                obj[this.name].push(this.value);
            }
        });

        $.each(obj, function(index, el) {
            //costyl for SEO
            var element = el.length === 1 ? el.join('&').replace('[]', '') : el.join('&');
            url += '&' + element;
        });

        if(currentUrl.indexOf('catalogsearch') <= 0) {
            url = url.indexOf('&') === 0 ? '?' + url.slice(1) : '?' + url;
            url = url.length === 1 ? '' : url;
        } else {
            url = url.length === 1 ? '' : url;
        }
        location = currentUrl + url;
    });

    $('#catalog-apply--mobile, .modal-menu-drop .modal-menu-back>a').on('click', function (e) {
        e.preventDefault();
        if ($('.modal-menu-drop').not('.is-hidden').length) {
            var root = $('.modal-menu-drop').not('.is-hidden').closest('.catalog-filter__item');
            var selectedContainer = root.find('.catalog-filter--selected');
            var selectedList = [];
            var selected = root.find('.custom-control__input[type=checkbox]:checked');
            $.each(selected, function (index, el) {
                selectedList.push($(el).siblings('.custom-control__description').find('.custom-control__label').text());
            });
            selectedContainer.html(selectedList.join(', '));
            if($('.modal-menu-drop:not(.is-hidden) .js-slider').length) {
                showSliderValue($('.modal-menu-drop:not(.is-hidden) .js-slider'));
            }
            var target = $('.modal-menu .submenu:not(.is-hidden) .modal-menu-back');
            if (window.tablet) {
                target.closest('.modal-menu-drop').addClass('is-hidden');
                $('#catalog-apply--mobile').text('ПРИМЕНИТЬ');
            }
        } else {
            $('#catalog-filters').submit();
        }
    });

    $('.modal-menu .submenu > a:not(.catalog-filter__close)').on('click', function(e) {
        if (window.tablet) {
            e.preventDefault();
            $(this).siblings('.modal-menu-drop').removeClass('is-hidden');
            $('#catalog-apply--mobile').text('ГОТОВО');
        }
    });

    $('.modal-menu .submenu .modal-menu-back').on('click', function(e) {
        if (window.tablet) {
            e.preventDefault();
            $(this).closest('.modal-menu-drop').addClass('is-hidden');
            $('#catalog-apply--mobile').text('ПРИМЕНИТЬ');
        }
    });

    $('.catalog-filter__close').on('click', function(e) {
        e.preventDefault();
        const root = $(this).closest('.catalog-filter__item');
        root.find('.custom-control__input').prop('checked', false);

        const minValue = root.find('.js-min-value').val();
        const maxValue = root.find('.js-max-value').val();
        const slider = root.find('.js-slider');

        if (root.find('.js-slider').length > 0) {
          root.find('.js-filter-min').val(minValue);
          root.find('.js-filter-max').val(maxValue);
          slider.slider('values', [minValue, maxValue]);
        }
        $('#catalog-filters').submit();
    });

    $('.catalog-filter__bool .custom-control__input').on('change', function(e) {
        if(!window.tablet) {
            e.preventDefault();
            $('#catalog-filters').submit();
        }
    });

    function rangeUrl(min, max, multiplier) {
        let intPart = max - min;
        intPart = intPart === 0
            ? multiplier
            : intPart;
        const factor = max / intPart;
        return factor + ',' + intPart
    }

    //catalog visual logic
    $('.catalog-modal-trigger').on('click', function() {
        $('.modal-menu').not(this).removeClass('show');
        $($(this).data('target')).toggleClass('show');
        $('html, body, .page-main').addClass('overflow-hidden');
        $('body').addClass('fixed-toggler');
    });

    $('.catalog-modal-trigger').each(function() {
        if ($($(this).data('target')).length) {
            $(this).removeClass('hidden')
        }
    });

    $('.modal-menu-close').on('click', function() {
        $(this).closest('.modal-menu').removeClass('show');
        $('html, body, .page-main').removeClass('overflow-hidden');
        $('body').removeClass('fixed-toggler');
    });

    $(window).resize(function() {
        if (window.tablet) {
            $($('.modal-menu__show-all').data('toggle-target')).removeAttr('style');
        }
    });

    $('.show-all-variants').on('click', function() {
        $(this).closest('.modal-menu-drop').removeAttr('style').addClass('modal-content').wrap('<div class="modal fade bs-example-modal-lg filter-modal" tabindex="-1" role="dialog"><div class="modal-dialog">');
        $('.filter-modal').modal('show');
    });

    $(document).on('hide.bs.modal', '.filter-modal', function() {
        $('.modal-menu-drop.modal-content').removeClass('modal-content').unwrap('.modal-dialog').unwrap('.filter-modal');
        $(this).closest('.catalog-filter__item.dropdown').removeClass('open');
    });

    $('.modal-menu-drop .close').on('click', function() {
        $(this).closest('.filter-modal').modal('hide');
        $(this).closest('.catalog-filter__item.dropdown').removeClass('open');
    });

    $('.modal-menu__list').on('click', function(e) {
        if (window.tablet) {
            e.stopPropagation();
        }
    });

    $('.modal-menu__show-all').on('click', function(e) {
        e.stopPropagation();
        $($(this).data('toggle-target')).fadeIn(200);
    });

    $('.modal-menu__hide-all').on('click', function(e) {
        e.stopPropagation();
        $($(this).data('toggle-target')).fadeOut(200);
    });

    $(document).on('click', '#show-all-requests', function(e) {
        e.stopPropagation();
    });

    $(document).on('click', function (e) {
        var container = $("#show-all-requests");
        if (container.has(e.target).length === 0 && container.is(':visible') && !window.tablet) {
            container.fadeOut(200);
        }
    });
    //catalog visual logic END
});
