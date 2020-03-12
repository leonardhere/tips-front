'use strict';

// const service = new PriceLevelService(new ItemsContainer(true));
// const productButtonsHandler = (container, service) => {
//     const input = $(container.find('input[name=qty]'));
//
//     container.find('.change-qty .btn-plus').click(e => incrementQuantityCallback(input.data('content')['sku'], input, service));
//     container.find('.change-qty .btn-minus').click(e => decrementQuantityCallback(input.data('content')['sku'], input, service));
//     input.on('change',e => {
//         input.val(e.currentTarget.value);
//         setQuantityCallback(input.data('content')['sku'], input, service);
//     });
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
$(function () {
    var observer = lozad(); // lazy loads elements with default selector as '.lozad'
    observer.observe();
    // const addToCartUrlBase = $('#buyProductModal form').attr('action');

    var changeLevelCallback = function changeLevelCallback(level) {
        var activeRow = $('#buyProductModal .product-table__row--content').not('.hidden');
        if (activeRow.hasClass('wh')) {
            $('#buyProductModal .product-table__col--less-10').addClass('active');
            return;
        }
        if (level === 1) {
            $('#buyProductModal .product-table__col--less-10').addClass('active');
            $('#buyProductModal .product-table__col--10').removeClass('active');
            $('#buyProductModal .product-table__col--40').removeClass('active');
            return;
        }

        if (level === 2) {
            $('#buyProductModal .product-table__col--less-10').removeClass('active');
            $('#buyProductModal .product-table__col--10').addClass('active');
            $('#buyProductModal .product-table__col--40').removeClass('active');
            if (activeRow.hasClass('swh_wh')) {
                $('#buyProductModal .product-table__col--less-10').addClass('active');
            }
            return;
        }

        if (level === 3) {
            $('#buyProductModal .product-table__col--less-10').removeClass('active');
            $('#buyProductModal .product-table__col--10').removeClass('active');
            $('#buyProductModal .product-table__col--40').addClass('active');
            if (activeRow.hasClass('general_wh')) {
                $('#buyProductModal .product-table__col--10').addClass('active');
            }
        }
    };

    var changePresentCallback = function changePresentCallback(promoInfo, qty) {
        if (qty > 0) {
            $('.promo-product-' + promoInfo['gift']['id'] + ' .modal-promo-present').fadeIn(250);
            $('.promo-product-' + promoInfo['gift']['id'] + ' .product-present-qty').text(qty);
        } else {
            $('.promo-product-' + promoInfo['gift']['id'] + ' .modal-promo-present').fadeOut(250);
        }
    };

    var changeTotalCallback = function changeTotalCallback(newTotal, isOnReq) {
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

    // $('.product-card .product-card__buttons .change-qty'). // modal window should be excluded
    // // TODO repeat on reload
    // each((idx, container) => service.addProduct(new Product($($(container).find('input')).data('content'))));

    // $('.product-card .product-card__buttons').each((idx, container) => productButtonsHandler($(container), service));

    // productButtonsHandler($('#buyProductModal'), service);

    // // TODO repeat on reload
    // $('#isoluxbag').data('content').forEach(i => service.addCartProduct(i));
    //
    // // TODO repeat on reload
    // service.addPromotions($('#all-discounts').data('content'));

    $('#buyProductModal').on('show.bs.modal', function (e) {
        var button = $(e.relatedTarget);
        var root = $(button).closest('.product-card');
        var modal = $(this);
        var data = root.find('.change-qty__value').data('content');
        var input = modal.find('input[name=qty]');
        var productData = service.getProductData(data['sku']);
        var promoData = service.getPromotionsForProduct(data['sku']);
        var minSaleQty = modal.find('#min-sale-qty');
        var productUnit = root.find('.product-card__unit').text();
        var modalType = data['modalClass'];
        var modalContent = $(this).find('.product-table__row--content' + '.' + modalType);

        $('#buyProductModalPromo .alert-default .info-block:not(.promo-template)').remove();
        $('#buyProductModalPromo').addClass('hidden');
        modal.find('.product-table__row--header').addClass('hidden');
        modal.find('.product-table__row--content').addClass('hidden');
        modal.find('.product-table__row--header' + '.' + modalType).removeClass('hidden');
        modal.find('.product-table__row--content' + '.' + modalType).removeClass('hidden');

        minSaleQty.hide();
        if (promoData.length) {
            $('#buyProductModalPromo').removeClass('hidden');
            // promoData.forEach(function (item, i) {
            $.each(promoData, function (i, item) {
                var template = $('#buyProductModalPromo .promo-template').clone();
                template.removeClass('hidden promo-template').data('product', item['gift']['id']).addClass('promo-product-' + item['gift']['id']);
                template.find('.promo-link').attr('href', item['promotion']['url']);
                template.find('.promo-text').text(item['promotion']['name']);
                $('#buyProductModalPromo .alert-default').append(template);
            });
        }
        service.deselect(data['sku']);
        cleanUpModalValues(service, data['sku'], input);
        service.forceChangeLevelCallback();

        // $('#buyProductModalForm').attr('action', root.find('.change-qty__value').data('action'));
        input.data('content', data);
        modal.find('.product-header').text(root.find('.product-card__name a').text());
        modal.find('.product-table__row--content .product-table__col--sku .product-table-sku-value').text(productData['shortSku']);
        modal.find('.product-card__img').attr('src', root.find('.product-card__img').attr('src'));
        minSaleQty.find('.product-present__qty').text(productData['minSaleQty'] + ' ' + productUnit);
        modalContent.find('.product-table__col--qty .change-qty__value').val(root.find('.change-qty__value').val());
        modalContent.find('.product-table__col--less-10 .product-table-price-num').text(productData['generalCurrent']);
        modalContent.find('.product-table__col--less-10 .product-table-price--old').text(productData['generalOld']);
        modalContent.find('.product-table__col--10 .product-table-price-num').text(productData['swhCurrent']);
        modalContent.find('.product-table__col--10 .product-table-price--old').text(productData['swhOld']);
        modalContent.find('.product-table__col--40 .product-table-price-num').text(productData['whCurrent']);
        modalContent.find('.product-table__col--40 .product-table-price--old').text(productData['whOld']);

        if (productData['isShowMinQty']) {
            minSaleQty.show();
        }

        dataPushToGTM('gtmSendEvent', 'Каталог (catalog)', 'Каталог - В корзину (click)', 'Каталог - В корзину');
    });

    $('#buyProductModal').on('hide.bs.modal', function (e) {
        var input = $(this).find('input[name=qty]');
        // cleanUpModalValues(service, input.data('content')['sku'], input);
        $('#buyProductModal .product-table-buy-btn').attr('disabled', false).removeClass('iso-bar');
    });

    //initial state
    window.history.pushState('filter', document.title, location.href);

    function showSelectedFilters() {
        $('.sidebar-nav__item').each(function (index, el) {
            el = $(el);
            var selectedContainer = el.find('.catalog-filter--selected');
            var selected = el.find('.custom-control__input[type=checkbox]:checked');
            el.find('.custom-control__input[type=checkbox]:checked').each(function (index, el) {
                var delimeter = index < selected.length - 1 ? ', ' : '';
                selectedContainer.append($(this).siblings('.custom-control__description').text() + delimeter);
            });
        });
    }

    function initRangeSliders() {
        $('.js-slider').each(function () {
            var slider = $(this);
            var $this = this;
            var filterElement = slider.parents('.sidebar-nav__item');
            var minField = filterElement.find('.js-filter-min');
            var maxField = filterElement.find('.js-filter-max');
            var minValue = parseFloat(slider.find('.js-min-value').val());
            var maxValue = parseFloat(slider.find('.js-max-value').val());
            var step = slider.parents('.js-slider-price').length > 0 ? 1 : 0.1;

            var currentMinValue = minField.val() ? minField.val() : minValue;
            var currentMaxValue = maxField.val() ? maxField.val() : maxValue;
            minField.val(currentMinValue);
            maxField.val(currentMaxValue);
            noUiSlider.create(this, {
                start: [currentMinValue, currentMaxValue],
                step: step,
                connect: true,
                range: {
                    'min': [minValue],
                    'max': [maxValue]
                }
            });

            this.noUiSlider.on('update', function (values, handle) {
                var value = Number(values[handle]).toFixed(step == 1 ? 0 : 1).toLocaleString('ru-RU');
                if (handle) {
                    maxField.val(value);
                } else {
                    minField.val(value);
                }
            });

            this.noUiSlider.on('end', function () {
                if (!window.tablet) {
                    $('#catalog-filters').submit();
                }
            });

            minField.on('change blur', function () {
                // onInputChange();
                $this.noUiSlider.set([parseInt(this.value, 10), null]);
            });

            maxField.on('change blur', function () {
                // onInputChange();
                $this.noUiSlider.set([null, parseInt(this.value, 10)]);
            });
        });
    };

    function resetRangeSlider() {
        $('.js-slider').each(function () {
            var slider = $(this);
            var minValue = parseFloat(slider.find('.js-min-value').val());
            var maxValue = parseFloat(slider.find('.js-max-value').val());
            this.noUiSlider.set([minValue, maxValue]);
        });
    }

    function showSliderValue(target) {
        var $target = $(target);
        var root = $target.closest('.sidebar-nav__item');
        var selectedContainer = root.find('.catalog-filter--selected');
        var currentValues = target.noUiSlider.get();

        var minValue = Number($target.find('.js-min-value').val());
        var maxValue = Number($target.find('.js-max-value').val());

        var currentMinValue = Number(currentValues[0]);
        var currentMaxValue = Number(currentValues[1]);
        var sliderValues = $target.closest('.js-slider-form').find('.label-units').text();

        if ((currentMinValue != minValue || currentMaxValue != maxValue) && maxValue !== 0) {
            selectedContainer.text('от ' + currentMinValue + ' до ' + currentMaxValue + ' ' + sliderValues);
        }
    }

    function reinitService() {
        service.resetItems();
        $('.product-card .product-card__buttons .change-qty').each(function (idx, container) {
            return service.addProduct(new Product($($(container).find('input')).data('content')));
        });
        service.addPromotions($('#all-discounts').data('content'));
    }

    function ajaxLoadFilters(url) {
        if (!$('#category-product .ajax_catalog_loader').length) {
            $('#category-product').append("<div class='ajax_catalog_loader' style='position:absolute;top:0px;left:0px;right:-1px;bottom:0px;background:white;margin:0px;-moz-opacity:.80;filter:alpha(opacity=80);opacity:0.8;z-index:4'></div>");
        }

        if (!$('#catalog-filters .ajax_catalog_loader').length) {
            $('#catalog-filters').append("<div class='ajax_catalog_loader' style='position:absolute;top:0px;left:0px;right:0;bottom:0px;background:white;margin:0px;-moz-opacity:.80;filter:alpha(opacity=80);opacity:0.8;z-index:4'></div>");
        }

        $.ajax({
            url: url,
            type: 'POST'
        }).done(function (data) {
            // var data = $(data);
            // var filterResult = data.find('#category-product').html();
            // var catalogFilters = data.find('#catalog-filters').html();
            // var title = data.find('title').text();
            $("#catalog-filters").replaceWith(data.ajaxlistfilters);
            $("#category-product").replaceWith(data.ajaxlistproduct);
            // $('#category-product').html(filterResult);
            // $('#catalog-filters').html(catalogFilters);
            $('.ajax_catalog_loader').remove();
            initRangeSliders();
            appendListeners();
            showSelectedFilters();
            reinitService();
            ajaxtoolbar.onReady(); //append listeners for pagination and sort
            $('.product-card .product-card__buttons').each(function (idx, container) {
                return productButtonsHandler($(container), service);
            });
        }).fail(function () {
            $(".ajax_catalog_loader").remove();
        }).always(function () {
            $(".ajax_catalog_loader").remove();
        });
    }

    function rangeUrl(min, max, multiplier) {
        var intPart = max - min;
        intPart = intPart === 0 ? multiplier : intPart;
        var factor = max / intPart;
        return factor + ',' + intPart;
    }

    function appendListeners() {

        if ($('.sidebar-nav__item.selected').length) {
            $('.catalog-reset').removeClass('disabled');
            $('[data-target="#catalog-filters"]').removeClass('btn-default').addClass('btn-primary');
        }

        $('.catalog-reset').on('click', function () {
            var form = $('#catalog-filters');
            form[0].reset();
            $('#catalog-filters .custom-control__input').prop('checked', false);
            resetRangeSlider();
            form.submit();
            form.removeClass('show');
            $('[data-target="#catalog-filters"]').removeClass('btn-primary').addClass('btn-default');
        });

        $('.sidebar-menu--filters .custom-control__input').on('change', function (e) {
            if (!window.tablet) {
                e.preventDefault();
                $('#catalog-filters').submit();
            }
        });

        $('#catalog-filters .js-slider').each(function () {
            showSliderValue(this);
        });

        $('.sidebar-menu-close').on('click', function () {
            $(this).closest('.sidebar-menu').removeClass('show');
            $('html, body, .page-main').removeClass('overflow-hidden');
            $('body').removeClass('fixed-toggler');
        });

        $('.sidebar-menu .submenu > .sidebar-nav__link, .sidebar-menu .submenu > .sidebar-menu__header-link').on('click', function (e) {
            if (window.tablet) {
                e.preventDefault();
                $(this).siblings('.sidebar-menu__collapse').removeClass('is-hidden');
                $('#catalog-apply--mobile').text('ГОТОВО');
            }
        });

        $('.sidebar-menu--filters .sidebar-menu__header-link').on('click', function (e) {
            if (!window.tablet) {
                e.preventDefault();
                $(this).toggleClass('collapsed');
                $(this).siblings('.sidebar-menu__collapse').collapse('toggle');
            }
        });

        $('.sidebar-menu .submenu > .sidebar-nav__link .sidebar-nav__toggler').on('click', function (e) {
            if (!window.tablet) {
                e.preventDefault();
                $(this).parents('.sidebar-nav__link').toggleClass('collapsed');
                $(this).parents('.sidebar-nav__link').siblings('.sidebar-menu__collapse').collapse('toggle');
            }
        });

        $('#catalog-filters .js-filter-min, #catalog-filters .js-filter-max').on('change', function () {
            $(this).closest('.js-slider-form').find('.js-slider').trigger('slidestop');
        });

        $('#catalog-nav .sidebar-menu-back, #catalog-seek .sidebar-menu-back').on('click', function (e) {
            if (window.tablet) {
                e.preventDefault();
                $(this).parents('.sidebar-menu__collapse').addClass('is-hidden');
            }
        });

        $('#catalog-apply--mobile, .sidebar-menu--filters .sidebar-menu-back').on('click', function (e) {
            e.preventDefault();

            if ($('.catalog-filter__collapse').not('.is-hidden').length) {
                var root = $('.catalog-filter__collapse').not('.is-hidden').closest('.sidebar-nav__item');
                var selectedContainer = root.find('.catalog-filter--selected');
                var selectedList = [];
                var selected = root.find('.custom-control__input[type=checkbox]:checked');
                $.each(selected, function (index, el) {
                    selectedList.push($(el).siblings('.custom-control__description').text());
                });

                selectedContainer.html(selectedList.join(', '));
                if ($('.catalog-filter__collapse:not(.is-hidden) .js-slider').length) {
                    showSliderValue(document.querySelector('.catalog-filter__collapse:not(.is-hidden) .js-slider'));
                }
                var target = $('.sidebar-menu .catalog-filter__collapse:not(.is-hidden) .sidebar-menu-back');
                if (window.tablet) {
                    target.closest('.catalog-filter__collapse').addClass('is-hidden');
                    $('#catalog-apply--mobile').text('ПРИМЕНИТЬ');
                }
            } else {
                $('#catalog-filters').submit();
                $('#catalog-filters').removeClass('show');
                $('html, body, .page-main').removeClass('overflow-hidden');
                $('body').removeClass('fixed-toggler');
            }
        });
    }

    initRangeSliders();
    appendListeners();
    showSelectedFilters();

    $(document).on('submit', '#catalog-filters', function (e) {
        e.preventDefault();

        var currentUrl = document.getElementById('clear-url'); // required native for work with location
        var url = '';
        var ajaxtoolbar = '';
        var obj = {};

        if (location.href.indexOf('catalogsearch') > 0) {
            var searchQueryStart = currentUrl.href.indexOf('?q=');
            var searchQueryEnd = currentUrl.href.indexOf('&');
            currentUrl = location.protocol + '//' + location.host + currentUrl.pathname + currentUrl.href.substring(searchQueryStart, searchQueryEnd > 0 ? searchQueryEnd : Infinity);
        } else {
            currentUrl = currentUrl.href.replace('?ajaxtoolbar=1', '');
        }

        $('.js-slider').each(function () {
            var $this = $(this);
            var currentValues = this.noUiSlider.get();

            var minValue = Number($this.find('.js-min-value').val());
            var maxValue = Number($this.find('.js-max-value').val());

            var currentMinValue = Number(currentValues[0]);
            var currentMaxValue = Number(currentValues[1]);
            var sliderParam = $this.data('slider-param');

            if ((currentMinValue !== minValue || currentMaxValue !== maxValue) && maxValue !== 0) {
                url += '&' + sliderParam + '=' + rangeUrl(currentMinValue, currentMaxValue, sliderParam === 'price' ? 1 : 0.1);
            }
        });

        $('#catalog-filters .custom-control__input[type=checkbox]:checked').each(function () {
            if (!obj.hasOwnProperty(this.name)) {
                obj[this.name] = [this.value];
            } else {
                obj[this.name].push(this.value);
            }
        });

        $.each(obj, function (index, el) {
            //costyl for SEO
            var element = el.length === 1 ? el.join('&').replace('[]', '') : el.join('&');
            url += '&' + element;
        });
        console.log('currentUrl', currentUrl);
        if (currentUrl.indexOf('catalogsearch') <= 0 && currentUrl.indexOf('cat_type=grouped') < 0 && currentUrl.indexOf('cat_type=bundle') < 0) {
            url = url.indexOf('&') === 0 ? '?' + url.slice(1) : '?' + url;
            url = url.length === 1 ? '' : url;
            ajaxtoolbar = url.length ? '&ajaxtoolbar=1' : '?ajaxtoolbar=1';
        } else {
            url = url.length === 1 ? '' : url;
            ajaxtoolbar = '&ajaxtoolbar=1';
        }
        location = currentUrl + url;
        console.log(currentUrl + url + ajaxtoolbar);
        ajaxLoadFilters(currentUrl + url + ajaxtoolbar);
        window.history.pushState('filter', document.title, currentUrl + url);
    });

    window.addEventListener("popstate", function (e) {
        if (e.state == 'filter') {
            // check for 'filter' object
            var url = location.href;
            if (url.indexOf('ajaxtoolbar') <= 0) {
                url = url.indexOf('&') <= 0 && url.indexOf('?') <= 0 ? url + '?ajaxtoolbar=1' : url + '&ajaxtoolbar=1';
            }
            console.log(url);
            ajaxLoadFilters(url);
        }
    }, false);

    $('.catalog-filter__close').on('click', function (e) {
        e.preventDefault();
        var root = $(this).closest('.catalog-filter__item');
        root.find('.custom-control__input').prop('checked', false);

        var minValue = root.find('.js-min-value').val();
        var maxValue = root.find('.js-max-value').val();
        var slider = root.find('.js-slider');

        if (root.find('.js-slider').length > 0) {
            root.find('.js-filter-min').val(minValue);
            root.find('.js-filter-max').val(maxValue);
            slider[0].noUiSlider.set([minValue, maxValue]);
        }
        $('#catalog-filters').submit();
    });

    //catalog visual logic
    $('.catalog-modal-trigger').on('click', function () {
        $('.sidebar-menu').not(this).removeClass('show');
        $($(this).data('target')).toggleClass('show');
        $('html, body, .page-main').addClass('overflow-hidden');
        $('body').addClass('fixed-toggler');
    });

    $('.catalog-modal-trigger').each(function () {
        if ($($(this).data('target')).length) {
            $(this).removeClass('hidden');
        }
    });

    $('.sidebar-menu').on('click', function (e) {
        if (window.tablet) {
            e.stopPropagation();
        }
    });

    // "Показать всё" modal window for show all
    $('.sidebar-menu__show-all').on('click', function (e) {
        e.stopPropagation();
        $($(this).data('toggle-target')).fadeIn(200);
    });

    $('.sidebar-menu__hide-all').on('click', function (e) {
        e.stopPropagation();
        $($(this).data('toggle-target')).fadeOut(200);
    });

    $(document).on('click', '.sidebar-menu__filters-more', function () {
        $(this).toggleClass('collapsed');
        $(this).siblings('.sidebar-menu__filters').toggleClass('show-all-items');
    });

    $('.modal-menu__hide-all').on('click', function (e) {
        e.stopPropagation();
        $($(this).data('toggle-target')).fadeOut(200);
    });

    $(document).on('click', '#show-all-requests', function (e) {
        e.stopPropagation();
    });

    $(document).on('click', function (e) {
        var container = $("#show-all-requests");
        if (container.has(e.target).length === 0 && container.is(':visible') && !window.tablet) {
            container.fadeOut(200);
        }
    });

    $('.custom-control__preview').popover({
        html: 'true',
        trigger: 'hover',
        container: 'body',
        content: function content() {
            var imgSrc = $(this).data('background-image');
            return '<img class="img-responsive" src="' + imgSrc + '">';
        },
        template: '<div class="popover popover-preview" role="tooltip"><div class="popover-content"></div></div>'
    });

    $('.custom-control__preview').on('click touch', function (e) {
        e.preventDefault();
    });

    // const observer = lozad(); // lazy loads elements with default selector as '.lozad'
    // observer.observe();
    //catalog visual logic END

    $('#catalog-req-sl').slick({
        mobileFirst: true,
        adaptiveHeight: true,
        infinite: true,
        dots: false,
        slidesToShow: 1,
        arrows: true,
        accessibility: false,
        responsive: [{
            breakpoint: 790,
            settings: {
                slidesToShow: 2,
                arrows: true
            }
        }, {
            breakpoint: 1220,
            settings: {
                slidesToShow: 3,
                arrows: true
            }
        }]
    });
});

$(function () {
    var category = $('.current-category-js');
    if (category.length) {
        var categoryId = category.data('category-id'),
            customerEmail = getCustomerEmail();
        if (categoryId) {
            if (customerEmail) {
                mindbox('async', {
                    operation: 'CategoryView',
                    data: {
                        customer: {
                            email: customerEmail
                        },
                        productCategory: {
                            ids: {
                                website: categoryId
                            }
                        }
                    }
                });
            }
        }
    }
});
