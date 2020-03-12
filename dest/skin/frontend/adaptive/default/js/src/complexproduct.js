'use strict';

$(document).ready(function () {
    var changeLevelCallback = function changeLevelCallback(level) {
        if (level === 1) {
            $('.product-table__col--less-10').addClass('active');
            $('.product-table__col--10').removeClass('active');
            $('.product-table__col--40').removeClass('active');
        }

        if (level === 2) {
            $('.product-table__col--less-10').removeClass('active');
            $('.product-table__col--10').addClass('active');
            $('.product-table__col--40').removeClass('active');
        }

        if (level === 3) {
            $('.product-table__col--less-10').removeClass('active');
            $('.product-table__col--10').removeClass('active');
            $('.product-table__col--40').addClass('active');
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
        $('div.price-cur span.num').text(newTotal);
        $('span.product-table-buy-num').text(newTotal);
    };

    var service = new PriceLevelService(new ItemsContainer());
    service.registerChangeLevelCallback(changeLevelCallback);
    service.registerChangePresentCallback(changePresentCallback);
    service.registerChangeTotalCallback(changeTotalCallback);
    service.registerAddToCartCallback(addToCartCallback);

    $('div.complex_item_anchor').each(function (idx, divElement) {
        var div = $(divElement);
        var input = div.find('input[name=qty]');
        var sku = input.data('content')['sku'];

        service.addProduct(new Product(input.data('content')));
        service.deselect(sku);

        div.find('span.btn-minus').click(function (e) {
            service.decrementQuantity(sku);
            service.select(sku);
            if (service.getQuantity(sku) > 0) {
                div.find('input[type=checkbox]').prop('checked', true);
            } else {
                div.find('input[type=checkbox]').prop('checked', false);
                service.deselect(sku);
            }

            input.val(service.getQuantity(sku));
            console.log('decrement for [' + sku + '] level [' + service.getLevel() + '] count [' + service.getQuantity(sku) + ']');
        });

        div.find('span.btn-plus').click(function (e) {
            service.incrementQuantity(sku);
            service.select(sku);
            div.find('input[type=checkbox]').prop('checked', true);
            input.val(service.getQuantity(sku));
            console.log('increment for [' + sku + '] level [' + service.getLevel() + '] count [' + service.getQuantity(sku) + ']');
        });

        input.change(function (e) {
            service.setQuantity(sku, $(e.target).val());
            service.select(sku);
            div.find('input[type=checkbox]').prop('checked', true);
            input.val(service.getQuantity(sku));
            console.log('change for [' + sku + '] level [' + service.getLevel() + '] count [' + service.getQuantity(sku) + ']');
        });

        div.find('input[type=checkbox]').change(function (e) {
            if ($(e.currentTarget).prop('checked')) {
                service.select(sku);
                if (service.getQuantity(sku) == 0) {
                    service.incrementQuantity(sku);
                    input.val(service.getQuantity(sku));
                }
            } else {
                service.deselect(sku);
            }
            console.log('checkbox for [' + sku + '] is [' + $(e.currentTarget).prop('checked') + '] level [' + service.getLevel() + '] count [' + service.getQuantity(sku) + ']');
        });
    });

    $('#isoluxbag').data('content').forEach(function (i) {
        return service.addCartProduct(i);
    });
    service.addPromotions($('#all-discounts').data('content'));

    $('.product-table-buy .btn-add-to-cart, #productBuyInner .btn-add-to-cart').click(function (e) {
        var form = $('#addToCartForm');
        var data = { 'isAjax': 1, 'product': form.data('id') };
        $.each(service.getFormData(), function (id, qty) {
            return data['super_group[' + id + ']'] = qty;
        });

        $('.btn-add-to-cart').attr('disabled', true).addClass('iso-bar');
        sendAddToCartRequest(service, getCartUrl(form.attr('action'), form.data('id')), data, function () {
            $('.btn-add-to-cart').attr('disabled', false).removeClass('iso-bar');
        }, function () {
            showAlert('danger', 'Выберите необходимые товары');
            $('.btn-add-to-cart').attr('disabled', false).removeClass('iso-bar');
        });
    });
});