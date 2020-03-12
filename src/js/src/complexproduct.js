$(document).ready(() => {
    const changeLevelCallback = (level) => {
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

    const changePresentCallback = (promoInfo, qty) => {
        console.log(promoInfo);
        console.log('qty ' + qty);
        const elementId = 'present-' + promoInfo['gift']['id'];
        let present = $('#' + elementId);

        if(!present.length) {
            const presentTemplate = $('#present-template').clone();
            presentTemplate.removeClass('present-template').attr('id', elementId);
            $('#productBuyInner').append(presentTemplate);
            // reread element
            present = presentTemplate;
        }

        if(qty > 0) {
            present.find('.product-present__name').attr('href', promoInfo['gift']['url']).text(promoInfo['gift']['name']);
            present.find('.product-present__qty').text(qty);
            present.collapse('show');
        } else {
            present.collapse('hide');
        }
    };

    const changeTotalCallback = (newTotal) => {
        $('div.price-cur span.num').text(newTotal);
        $('span.product-table-buy-num').text(newTotal);
    };

    const service = new PriceLevelService(new ItemsContainer());
    service.registerChangeLevelCallback(changeLevelCallback);
    service.registerChangePresentCallback(changePresentCallback);
    service.registerChangeTotalCallback(changeTotalCallback);
    service.registerAddToCartCallback(addToCartCallback);


    $('div.complex_item_anchor').each((idx, divElement) => {
        const div = $(divElement);
        const input = div.find('input[name=qty]');
        const sku = input.data('content')['sku'];

        service.addProduct(new Product(input.data('content')));
        service.deselect(sku);

        div.find('span.btn-minus').click(e => {
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

        div.find('span.btn-plus').click(e => {
            service.incrementQuantity(sku);
            service.select(sku);
            div.find('input[type=checkbox]').prop('checked', true);
            input.val(service.getQuantity(sku));
            console.log('increment for [' + sku + '] level [' + service.getLevel() + '] count [' + service.getQuantity(sku) + ']');
        });

        input.change(e => {
            service.setQuantity(sku, $(e.target).val());
            service.select(sku);
            div.find('input[type=checkbox]').prop('checked', true);
            input.val(service.getQuantity(sku));
            console.log('change for [' + sku + '] level [' + service.getLevel() + '] count [' + service.getQuantity(sku) + ']');
        });

        div.find('input[type=checkbox]').change(e => {
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

    $('#isoluxbag').data('content').forEach(i => service.addCartProduct(i));
    service.addPromotions($('#all-discounts').data('content'));

    $('.product-table-buy .btn-add-to-cart, #productBuyInner .btn-add-to-cart').click(e =>  {
        const form = $('#addToCartForm');
        const data = {'isAjax': 1, 'product': form.data('id')};
        $.each(service.getFormData(), (id, qty) => data['super_group[' + id + ']'] = qty);

        $('.btn-add-to-cart').attr('disabled', true).addClass('iso-bar');
        sendAddToCartRequest(
            service,
            getCartUrl(form.attr('action'), form.data('id')),
            data,
            () => {$('.btn-add-to-cart').attr('disabled', false).removeClass('iso-bar');},
            () => {
                showAlert('danger', 'Выберите необходимые товары');
                $('.btn-add-to-cart').attr('disabled', false).removeClass('iso-bar');
            }
        );
    });
});
