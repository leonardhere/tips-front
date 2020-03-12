'use strict';

$(function () {
    var changeLevelCallback = function changeLevelCallback(level) {
        if (level === 1) {
            $('.product-table--cart .product-table__col--price div[isoluxprices]:nth-child(1)').removeClass('hidden');
            $('.product-table--cart .product-table__col--price div[isoluxprices]:nth-child(2)').addClass('hidden');
            $('.product-table--cart .product-table__col--price div[isoluxprices]:nth-child(3)').addClass('hidden');
        }

        if (level === 2) {
            $('.product-table--cart .product-table__col--price div[isoluxprices]:nth-child(1)').addClass('hidden');
            $('.product-table--cart .product-table__col--price div[isoluxprices]:nth-child(2)').removeClass('hidden');
            $('.product-table--cart .product-table__col--price div[isoluxprices]:nth-child(3)').addClass('hidden');
        }

        if (level === 3) {
            $('.product-table--cart .product-table__col--price div[isoluxprices]:nth-child(1)').addClass('hidden');
            $('.product-table--cart .product-table__col--price div[isoluxprices]:nth-child(2)').addClass('hidden');
            $('.product-table--cart .product-table__col--price div[isoluxprices]:nth-child(3)').removeClass('hidden');
        }

        $('span[isoluxtotal]').each(function (idx, e) {
            var elem = $(e);
            elem.text(service.getTotalForProduct(elem.data('sku')));
        });
    };
    var changePresentCallback = function changePresentCallback(promoInfo, qty) {
        var sku = promoInfo['gift']['sku'];
        var card = $('div[isoluxpresent] input[data-sku=' + sku + ']');
        if (card.length) {
            if (qty != 0) {
                card.val(qty);
            } else {
                card.closest('.product-table__row--gift').remove();
            }
        } else {
            var template = $('.product-table__row--gift-tmpl').first().clone();
            template.removeClass('product-table__row--gift-tmpl');
            $('.product-table.product-table--cart').append(createGiftRow(template, promoInfo, qty));
        }
    };

    var changeTotalCallback = function changeTotalCallback(newTotal) {
        return $('span[isoluxcarttotal]').text(newTotal);
    };
    var productButtonsHandler = function productButtonsHandler(container, service) {
        var input = container.find('input');
        var totalEl = container.find('span[isoluxtotal]');
        container.find('span.btn-plus').click(function (e) {
            incrementQuantityCallback(input.data('content')['sku'], input, service);
            totalEl.text(service.getTotalForProduct(input.data('content')['sku']));
        });
        container.find('span.btn-minus').click(function (e) {
            decrementQuantityCallback(input.data('content')['sku'], input, service);
            totalEl.text(service.getTotalForProduct(input.data('content')['sku']));
        });
        input.change(function (e) {
            setQuantityCallback(input.data('content')['sku'], input, service);
            totalEl.text(service.getTotalForProduct(input.data('content')['sku']));
        });
    };

    var service = new PriceLevelService(new ItemsContainer());
    service.registerChangePresentCallback(changePresentCallback);
    service.registerChangeLevelCallback(changeLevelCallback);
    service.registerAddToCartCallback(addToCartCallback);
    service.registerChangeTotalCallback(changeTotalCallback);
    $('div[isoluxitem] input[data-content]').each(function (idx, elem) {
        var input = $(elem);
        service.addProductWithQuantity(input.data('content'), input.val());
    });
    service.addPromotions($('#all-discounts').data('content'));
    $('div[isoluxitem]').each(function (idx, container) {
        return productButtonsHandler($(container), service);
    });

    $('.btn-cart-sumbit').on('click', function (event) {
        event.preventDefault();
        $(this).addClass('iso-bar').attr('disabled', true);

        $.ajax({
            type: "POST",
            dataType: 'json',
            url: "/checkout/cart/updateAjaxPost/",
            data: $('#form_cart').serialize(),
            success: function success() {
                window.location = '/checkout/onepage/';
            }
        });
    });
});