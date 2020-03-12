// const service = new PriceLevelService(new ItemsContainer(true));
// const productButtonsHandler = (container, service) => {
//     const input = $(container.find('input[name=qty]'));
//
//     container.find('.change-qty .btn-plus').click(e => incrementQuantityCallback(input.data('content')['sku'], input, service));
//     container.find('.change-qty .btn-minus').click(e => decrementQuantityCallback(input.data('content')['sku'], input, service));
//     input.change(e => setQuantityCallback(input.data('content')['sku'], input, service));
//
//     container.find('.product-table-buy-btn').on('click', e => {
//         e.preventDefault();
//         const $this = $(e.currentTarget);
//         if ($this.hasClass('iso-bar')) {
//             return;
//         }
//         const data = input.data('content');
//         const dataForPixel = {'sku': data['sku'], 'maxPrice': service.getProductData(data['sku'])['generalCurrentRaw']};
//         service.deselectOtherThan(data['sku']);
//         $('#buyProductModal .product-table-buy-btn').attr('disabled', true).addClass('iso-bar');
//
//         var resultStatus = sendAddToCartRequest(service, getCartUrl($('#buyProductModal form').attr('action'), data['id']), {
//             'qty': Object.values(service.getFormData())[0],
//             'isAjax': 1,
//             'product': data['id']
//         }, dataForPixel,
//             () => {
//                 $('#buyProductModal .product-table-buy-btn').attr('disabled', false).removeClass('iso-bar');
//                 $('#buyProductModal').modal('hide');
//             },
//             () => {},
//             () => {
//                 dataPushToGTM('gtmSendEvent', 'Каталог (catalog)', 'Каталог - В корзину из модалки (send)', 'Каталог - В корзину');
//             }
//     );
//
//     });
//
//     container.find('.add-to-card').on('click', e => {
//         e.preventDefault();
//         const $this = $(e.currentTarget);
//         if ($this.hasClass('iso-bar')) {
//             return;
//         }
//         const data = input.data('content');
//         const dataForPixel = {'sku': data['sku'], 'maxPrice': service.getProductData(data['sku'])['generalCurrentRaw']};
//         service.deselectOtherThan(data['sku']);
//         $this.prop('disabled', true).addClass('iso-bar');
//         var resultStatus = sendAddToCartRequest(service, getCartUrl($('#buyProductModal form').attr('action'), data['id']), {
//             'qty': Object.values(service.getFormData())[0],
//             'isAjax': 1,
//             'product': data['id']
//         }, dataForPixel,
//             () => {
//                 $this.prop('disabled', false).removeClass('iso-bar');
//         },  () => {
//                 showAlert('danger', 'Выберите необходимые товары');
//                 $('.btn-add-to-cart').attr('disabled', false).removeClass('iso-bar');
//         },  () => {
//                 dataPushToGTM('gtmSendEvent', 'Каталог (catalog)', 'Каталог - В корзину с мобилы (send)', 'Каталог - В корзину');
//             }
//         );
//     });
//
// };
$(function() {
    // const addToCartUrlBase = $('#buyProductModal form').attr('action');

    const changeLevelCallback = (level) => {
        if (level === 1) {
            $('#buyProductModal .product-table__col--less-10').addClass('active');
            $('#buyProductModal .product-table__col--10').removeClass('active');
            $('#buyProductModal .product-table__col--40').removeClass('active');
        }

        if (level === 2) {
            $('#buyProductModal .product-table__col--less-10').removeClass('active');
            $('#buyProductModal .product-table__col--10').addClass('active');
            $('#buyProductModal .product-table__col--40').removeClass('active');
        }

        if (level === 3) {
            $('#buyProductModal .product-table__col--less-10').removeClass('active');
            $('#buyProductModal .product-table__col--10').removeClass('active');
            $('#buyProductModal .product-table__col--40').addClass('active');
        }
    };

    const changePresentCallback = (promoInfo, qty) => {
        if (qty > 0) {
            $('.promo-product-' + promoInfo['gift']['id'] + ' .modal-promo-present').fadeIn(250);
            $('.promo-product-' + promoInfo['gift']['id'] + ' .product-present-qty').text(qty);
        } else {
            $('.promo-product-' + promoInfo['gift']['id'] + ' .modal-promo-present').fadeOut(250);
        }
    };

    const changeTotalCallback = (newTotal, isOnReq) => {
        if (isOnReq) {
            $('#buyProductModal .product-table-buy-num').text('Цена по запросу');
            $('#buyProductModal .product-table-buy-ico').addClass('hidden');
        } else {
            $('#buyProductModal .product-table-buy-num').text(newTotal);
            $('#buyProductModal .product-table-buy-ico').removeClass('hidden');
        }
    };


    // service.registerChangePresentCallback(changePresentCallback);
    // service.registerChangeLevelCallback(changeLevelCallback);
    // service.registerAddToCartCallback(addToCartCallback);
    // service.registerChangeTotalCallback(changeTotalCallback);
    //
    // $('.product-card .product-card__buttons .change-qty'). // modal window should be excluded
    //
    // // TODO repeat on reload
    // each((idx, container) => service.addProduct(new Product($($(container).find('input')).data('content'))));
    //
    // $('.product-card .product-card__buttons').each((idx, container) => productButtonsHandler($(container), service));
    //
    // productButtonsHandler($('#buyProductModal'), service);
    //
    // // TODO repeat on reload
    // $('#isoluxbag').data('content').forEach(i => service.addCartProduct(i));
    //
    // // TODO repeat on reload
    // service.addPromotions($('#all-discounts').data('content'));
    //
    // $('#buyProductModal').on('show.bs.modal', function(e) {
    //     const button = $(e.relatedTarget);
    //     const root = $(button).closest('.product-card');
    //     const modal = $(this);
    //     const modalContent = $(this).find('.product-table__row--content');
    //     const data = root.find('.change-qty__value').data('content');
    //     const input = modal.find('input[name=qty]');
    //     const productData = service.getProductData(data['sku']);
    //     const promoData = service.getPromotionsForProduct(data['sku']);
    //     $('#buyProductModalPromo .alert-default .info-block:not(.promo-template)').remove();
    //     $('#buyProductModalPromo').addClass('hidden');
    //     service.forceChangeLevelCallback();
    //     if (promoData.length) {
    //         $('#buyProductModalPromo').removeClass('hidden');
    //         // promoData.forEach(function (item, i) {
    //         $.each(promoData, function (i, item) {
    //             const template = $('#buyProductModalPromo .promo-template').clone();
    //             template.removeClass('hidden promo-template').data('product', item['gift']['id']).addClass('promo-product-' + item['gift']['id']);
    //             template.find('.promo-link').attr('href', item['promotion']['url']);
    //             template.find('.promo-text').text(item['promotion']['name']);
    //             $('#buyProductModalPromo .alert-default').append(template);
    //         });
    //     }
    //     service.deselect(data['sku']);
    //     cleanUpModalValues(service, data['sku'], input);
    //
    //     // $('#buyProductModalForm').attr('action', root.find('.change-qty__value').data('action'));
    //     input.data('content', data);
    //     modal.find('.product-header').text(root.find('.product-card__name a').text());
    //     modal.find('.product-table__row--content .product-table__col--sku .product-table-sku-value').text(productData['shortSku']);
    //     modal.find('.product-card__img').attr('src', root.find('.product-card__img').attr('src'));
    //     modalContent.find('.product-table__col--qty .change-qty__value').val(root.find('.change-qty__value').val());
    //     modalContent.find('.product-table__col--less-10 .product-table-price-num').text(productData['generalCurrent']);
    //     modalContent.find('.product-table__col--less-10 .product-table-price--old').text(productData['generalOld']);
    //     modalContent.find('.product-table__col--10 .product-table-price-num').text(productData['swhCurrent']);
    //     modalContent.find('.product-table__col--10 .product-table-price--old').text(productData['swhOld']);
    //     modalContent.find('.product-table__col--40 .product-table-price-num').text(productData['whCurrent']);
    //     modalContent.find('.product-table__col--40 .product-table-price--old').text(productData['whOld']);
    //
    //     dataPushToGTM('gtmSendEvent', 'Каталог (catalog)', 'Каталог - В корзину (click)', 'Каталог - В корзину');
    // });

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


    //visual logic for slides

    $('#catalog-apply--mobile, .sidebar-menu__collapse .sidebar-menu-back>a').on('click', function (e) {
        e.preventDefault();
        if ($('.sidebar-menu__collapse').not('.is-hidden').length) {
            var root = $('.sidebar-menu__collapse').not('.is-hidden').closest('.catalog-filter__item');
            var selectedContainer = root.find('.catalog-filter--selected');
            var selectedList = [];
            var selected = root.find('.custom-control__input[type=checkbox]:checked');
            $.each(selected, function (index, el) {
                selectedList.push($(el).siblings('.custom-control__description').find('.custom-control__label').text());
            });
            selectedContainer.html(selectedList.join(', '));
            if($('.sidebar-menu__collapse:not(.is-hidden) .js-slider').length) {
                showSliderValue($('.sidebar-menu__collapse:not(.is-hidden) .js-slider'));
            }
            var target = $('.sidebar-menu .submenu:not(.is-hidden) .sidebar-menu-back');
            if (window.tablet) {
                target.closest('.sidebar-menu__collapse').addClass('is-hidden');
                $('#catalog-apply--mobile').text('ПРИМЕНИТЬ');
            }
        } else {
            $('#catalog-filters').submit();
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
    // show full page filters for mobile
    $('.catalog-modal-trigger').on('click', function() {
        $('.sidebar-menu').not(this).removeClass('show');
        $($(this).data('target')).toggleClass('show');
        $('html, body, .page-main').addClass('overflow-hidden');
        $('body').addClass('fixed-toggler');
    });

    $('.catalog-modal-trigger').each(function() {
        if ($($(this).data('target')).length) {
            $(this).removeClass('hidden');
        }
    });

    $('.sidebar-menu-close').on('click', function() {
        $(this).closest('.sidebar-menu').removeClass('show');
        $('html, body, .page-main').removeClass('overflow-hidden');
        $('body').removeClass('fixed-toggler');
    });

    $('.sidebar-menu .submenu > .sidebar-nav__line > a:not(.catalog-filter__close)').on('click', function(e) {
        if (window.tablet) {
            e.preventDefault();
            $(this).parents('.sidebar-nav__line').siblings('.sidebar-menu__collapse').removeClass('is-hidden');
            $('#catalog-apply--mobile').text('ГОТОВО');
        }
    });

    $('.sidebar-menu .submenu > .sidebar-nav__line > .sidebar-nav__toggler').on('click', function(e) {
        if (!window.tablet) {
            e.preventDefault();
            $(this).toggleClass('collapsed');
            $(this).parents('.sidebar-nav__line').siblings('.sidebar-menu__collapse').collapse('toggle');
        }
    });

    $('.sidebar-menu .submenu .sidebar-menu-back').on('click', function(e) {
        if (window.tablet) {
            e.preventDefault();
            $(this).parents('.sidebar-menu__collapse').addClass('is-hidden');
            $('#catalog-apply--mobile').text('ПРИМЕНИТЬ');
        }
    });

    $('.sidebar-menu').on('click', function(e) {
        if (window.tablet) {
            e.stopPropagation();
        }
    });

    // "Показать всё" modal window for show all
    $('.sidebar-menu__show-all').on('click', function(e) {
        e.stopPropagation();
        $($(this).data('toggle-target')).fadeIn(200);
    });

    $('.sidebar-menu__hide-all').on('click', function(e) {
        e.stopPropagation();
        $($(this).data('toggle-target')).fadeOut(200);
    });

    $('.sidebar-menu__filters-more').on('click', function() {        
        $(this).toggleClass('collapsed');
        $(this).siblings('.sidebar-menu__filters').toggleClass('show-all-items');
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
