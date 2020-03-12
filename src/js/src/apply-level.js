$(document).ready(() => {

    const changeLevelCallback = (level) => {
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

    const changeTotalCallback = (newTotal) => console.log('change total callback: ' + newTotal);

    const input = $('#addToCartForm input[name=qty]');

    if(!input.length) {
        return;
    }

    const service = new PriceLevelService(new ItemsContainer());
    service.addProduct(new Product(input.data('content')));
    service.registerChangePresentCallback(changePresentCallback);
    service.registerChangeLevelCallback(changeLevelCallback);
    service.registerChangeTotalCallback(changeTotalCallback);
    service.registerAddToCartCallback(addToCartCallback);


    $('#isoluxbag').data('content').forEach(i => service.addCartProduct(i));
    service.addPromotions($('#all-discounts').data('content'));

    $('span.btn-plus').click(e => incrementQuantityCallback(input.data('content')['sku'], input, service));
    $('span.btn-minus').click(e => decrementQuantityCallback(input.data('content')['sku'], input, service));
    input.change(e => setQuantityCallback(input.data('content')['sku'], $(e.target), service));

    service.select(input.data('content')['sku']);

    $('button.btn-add-to-cart').click(e => {
        const form = $('#addToCartForm');
        $(e.currentTarget).attr('disabled', true).addClass('iso-bar');
        console.log(service);
        sendAddToCartRequest(
            service,
            getCartUrl(form.attr('action'), form.data('id')),
            {'qty': Object.values(service.getFormData())[0], 'isAjax': 1, 'product': form.data('id')},
            () => {$(e.currentTarget).attr('disabled', false).removeClass('iso-bar');},
            () => {
                showAlert('danger', 'Не удалось добавить товар в корзину, попробуйте позже.');
                $(e.currentTarget).attr('disabled', false).removeClass('iso-bar');
            }
        );
    });
    $('.btn-one-click').click(e => {
        e.stopPropagation();
        const form = $('#addToCartForm');
        $(e.currentTarget).attr('disabled', true).addClass('iso-bar');
        console.log(service);
        sendAddToCartRequest(
            service,
            getCartUrl(form.attr('action'), form.data('id')),
            {'qty': Object.values(service.getFormData())[0], 'isAjax': 1, 'product': form.data('id')},
            () => {
                $(e.currentTarget).attr('disabled', false).removeClass('iso-bar');
                $('#buyProductOneClickModal').modal('show');
            },
            () => {
                showAlert('danger', 'Не удалось добавить товар в корзину, попробуйте позже.');
                $(e.currentTarget).attr('disabled', false).removeClass('iso-bar');
            }
        );
    });

    $('#buyProductOneClickModal').on('show.bs.modal', function() {
        $('.product-table-buy-num').text($('#bagPrice .price').text());
    });

    function priceSwap(lvl) {
        const priceLess10 = $('#price-less-10').clone();
        const priceMore10 = $('#price-more-10').clone();
        const priceMore40 = $('#price-more-40').clone();
        const prices = [[priceLess10, priceMore10, priceMore40],
                        [priceMore10, priceLess10, priceMore40],
                        [priceMore40, priceLess10, priceMore10]];
        const pricePositions = [$('#price-active .price-unit__inner'),
                                $('.more-than-10 .price-unit__inner'),
                                $('.more-than-40 .price-unit__inner')];
        $.each(pricePositions, (index, el) => el.replaceWith(prices[lvl][index]));
        $('#price-active .price-unit__inner').fadeOut(300).fadeIn(300);
    }
});
