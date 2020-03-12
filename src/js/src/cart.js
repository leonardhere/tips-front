$(function() {
    const changeLevelCallback = (level) => {
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

        $('span[isoluxtotal]').each((idx, e) => {
            const elem = $(e);
            elem.text(service.getTotalForProduct(elem.data('sku')));
        });
    };
    const changePresentCallback = (promoInfo, qty) => {
        const sku = promoInfo['gift']['sku'];
        const card = $('div[isoluxpresent] input[data-sku=' + sku + ']');
        if (card.length) {
            if (qty != 0) {
                card.val(qty);
            } else {
                card.closest('.product-table__row--gift').remove();
            }
        } else {
            const template = $('.product-table__row--gift-tmpl').first().clone();
            template.removeClass('product-table__row--gift-tmpl');
            $('.product-table.product-table--cart').append(createGiftRow(template, promoInfo, qty));
        }
    };

    const changeTotalCallback = (newTotal) => $('span[isoluxcarttotal]').text(newTotal);
    const productButtonsHandler = (container, service) => {
        const input = container.find('input');
        const totalEl = container.find('span[isoluxtotal]');
        container.find('span.btn-plus').click(e => {
            incrementQuantityCallback(input.data('content')['sku'], input, service);
            totalEl.text(service.getTotalForProduct(input.data('content')['sku']));
        });
        container.find('span.btn-minus').click(e => {
            decrementQuantityCallback(input.data('content')['sku'], input, service);
            totalEl.text(service.getTotalForProduct(input.data('content')['sku']));
        });
        input.change(e => {
            setQuantityCallback(input.data('content')['sku'], input, service);
            totalEl.text(service.getTotalForProduct(input.data('content')['sku']));
        });
    };

    const service = new PriceLevelService(new ItemsContainer());
    service.registerChangePresentCallback(changePresentCallback);
    service.registerChangeLevelCallback(changeLevelCallback);
    service.registerAddToCartCallback(addToCartCallback);
    service.registerChangeTotalCallback(changeTotalCallback);
    $('div[isoluxitem] input[data-content]').each((idx, elem) => {
        const input = $(elem);
        service.addProductWithQuantity(input.data('content'), input.val());
    });
    service.addPromotions($('#all-discounts').data('content'));
    $('div[isoluxitem]').each((idx, container) => productButtonsHandler($(container), service));

    $('.btn-cart-sumbit').on('click', function(event) {
        event.preventDefault();
        $(this).addClass('iso-bar').attr('disabled', true);

        $.ajax({
            type: "POST",
            dataType: 'json',
            url: "/checkout/cart/updateAjaxPost/",
            data: $('#form_cart').serialize(),
            success: function() {
                window.location = '/checkout/onepage/';
            }
        });
    });

});
