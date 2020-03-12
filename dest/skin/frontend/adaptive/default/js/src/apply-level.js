'use strict';

$(document).ready(function () {

    var changeLevelCallback = function changeLevelCallback(level) {
        if (level === 1) {
            priceSwap(0);
        }

        if (level === 2) {
            priceSwap(1);
        }

        if (level === 3) {
            priceSwap(2);
        }
    };

    var changePresentCallback = function changePresentCallback(promoInfo, qty) {
        console.log(promoInfo);
        console.log('qty ' + qty);
        var elementId = 'present-' + promoInfo['gift']['id'];
        var present = $('#' + elementId);

        if (!present.length) {
            var presentTemplate = $('#present-template').clone();
            presentTemplate.removeClass('present-template').attr('id', elementId);
            $('#productBuyInner').append(presentTemplate);
            // reread element
            present = presentTemplate;
        }

        if (qty > 0) {
            present.find('.product-present__name').attr('href', promoInfo['gift']['url']).text(promoInfo['gift']['name']);
            present.find('.product-present__qty').text(qty);
            present.collapse('show');
        } else {
            present.collapse('hide');
        }
    };

    var changeTotalCallback = function changeTotalCallback(newTotal) {
        return console.log('change total callback: ' + newTotal);
    };

    var input = $('#addToCartForm input[name=qty]');

    if (!input.length) {
        return;
    }

    var service = new PriceLevelService(new ItemsContainer());
    service.addProduct(new Product(input.data('content')));
    service.registerChangePresentCallback(changePresentCallback);
    service.registerChangeLevelCallback(changeLevelCallback);
    service.registerChangeTotalCallback(changeTotalCallback);
    service.registerAddToCartCallback(addToCartCallback);

    $('#isoluxbag').data('content').forEach(function (i) {
        return service.addCartProduct(i);
    });
    service.addPromotions($('#all-discounts').data('content'));

    $('span.btn-plus').click(function (e) {
        return incrementQuantityCallback(input.data('content')['sku'], input, service);
    });
    $('span.btn-minus').click(function (e) {
        return decrementQuantityCallback(input.data('content')['sku'], input, service);
    });
    input.change(function (e) {
        return setQuantityCallback(input.data('content')['sku'], $(e.target), service);
    });

    service.select(input.data('content')['sku']);

    $('button.btn-add-to-cart').click(function (e) {
        var form = $('#addToCartForm');
        $(e.currentTarget).attr('disabled', true).addClass('iso-bar');
        console.log(service);
        sendAddToCartRequest(service, getCartUrl(form.attr('action'), form.data('id')), { 'qty': Object.values(service.getFormData())[0], 'isAjax': 1, 'product': form.data('id') }, function () {
            $(e.currentTarget).attr('disabled', false).removeClass('iso-bar');
        }, function () {
            showAlert('danger', 'Не удалось добавить товар в корзину, попробуйте позже.');
            $(e.currentTarget).attr('disabled', false).removeClass('iso-bar');
        });
    });
    $('.btn-one-click').click(function (e) {
        e.stopPropagation();
        var form = $('#addToCartForm');
        $(e.currentTarget).attr('disabled', true).addClass('iso-bar');
        console.log(service);
        sendAddToCartRequest(service, getCartUrl(form.attr('action'), form.data('id')), { 'qty': Object.values(service.getFormData())[0], 'isAjax': 1, 'product': form.data('id') }, function () {
            $(e.currentTarget).attr('disabled', false).removeClass('iso-bar');
            $('#buyProductOneClickModal').modal('show');
        }, function () {
            showAlert('danger', 'Не удалось добавить товар в корзину, попробуйте позже.');
            $(e.currentTarget).attr('disabled', false).removeClass('iso-bar');
        });
    });

    $('#buyProductOneClickModal').on('show.bs.modal', function () {
        $('.product-table-buy-num').text($('#bagPrice .price').text());
    });

    function priceSwap(lvl) {
        var priceLess10 = $('#price-less-10').clone();
        var priceMore10 = $('#price-more-10').clone();
        var priceMore40 = $('#price-more-40').clone();
        var prices = [[priceLess10, priceMore10, priceMore40], [priceMore10, priceLess10, priceMore40], [priceMore40, priceLess10, priceMore10]];
        var pricePositions = [$('#price-active .price-unit__inner'), $('.more-than-10 .price-unit__inner'), $('.more-than-40 .price-unit__inner')];
        $.each(pricePositions, function (index, el) {
            return el.replaceWith(prices[lvl][index]);
        });
        $('#price-active .price-unit__inner').fadeOut(300).fadeIn(300);
    }
});