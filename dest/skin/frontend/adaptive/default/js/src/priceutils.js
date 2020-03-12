'use strict';

function sendAddToCartRequest(service, url, data) {
    var onSuccess = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};
    var onFailure = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : function () {};

    console.log('add to cart clicked');
    console.log('action url: ', url);

    if (!service.hasSelectedItems()) {
        onFailure();
        return;
    }

    $.ajax({
        url: url,
        dataType: 'json',
        type: 'post',
        data: $.param(data)
    }).done(function (result) {
        console.log(result);
        var alert = $('#alert-top');
        var isOpen = alert.hasClass('open');
        alert.find('.alert-content').html(result.message);

        if (result.status === 'SUCCESS') {
            service.addSelectedToCart();
            alert.addClass('alert-success').removeClass('alert-danger');
            updateCart(result.actual_cart_qty, result.actual_cart_total);
            onSuccess();
        } else if (result.status === 'ERROR') {
            alert.addClass('alert-danger').removeClass('alert-success');
        }

        if (!isOpen) {
            var right = $('.container').offset().left;
            alert.addClass('open').css('right', right).fadeIn(500).delay(5000).fadeOut(500).queue(function () {
                $(this).removeClass('open').dequeue();
            });
        }

        onSuccess();
    }).fail(function () {
        console.log("error");
        showAlert('danger', 'Не удалось добавить товар в корзину, попробуйте позже.');
        onSuccess();
    });
}

function showAlert(status, msg) {
    var alert = $('#alert-top');
    var isOpen = alert.hasClass('open');
    alert.addClass('alert-' + status).find('.alert-content').html(msg);
    if (!isOpen) {
        var right = $('.container').offset().left;
        alert.addClass('open').css('right', right).fadeIn(500).delay(5000).fadeOut(500).queue(function () {
            $(this).removeClass('open').dequeue();
        });
    }
}

function createGiftRow(template, promoInfo, qty) {
    console.log(promoInfo);
    template.find('.product-table__col--img img').attr({ 'src': promoInfo['gift']['image'], 'alt': promoInfo['gift']['name'] });
    template.find('.product-table__col--img a').attr({ 'href': promoInfo['gift']['url'], 'title': promoInfo['gift']['name'] });
    template.find('.product-table__col--name a').attr('href', promoInfo['gift']['url']).text(promoInfo['gift']['name']);
    template.find('.product-table__col--qty .change-qty__value').val(qty).attr('data-sku', promoInfo['gift']['sku']);
    return template;
}

function getCartUrl(baseUrl, id) {
    // const url = baseUrl.replace('checkout/cart', 'addToCart/index'); // TODO: fix this on backend
    // return url.replace(/[0-9]+\/$/, id + '/');
    return '/addToCart/index/add/product/' + id + '/';
}

function updateCart(qty, total) {
    $('#bagPrice .price').text(total);
    $('#bagPrice').removeClass('hidden');
    $('#isoluxbag .product_num,  #mobile_cart_qty .product_num').text(qty).removeClass('hidden');
    $('#bagTitle').addClass('hidden');
}

// todo empty cart callback MAXIM
function addToCartCallback(itemsInCart) {
    if (!$('#bagPrice .price')) {
        return;
    }

    $('#bagPrice .price').text(itemsInCart.total);
    $('#bagPrice').removeClass('hidden');
    $('#isoluxbag .product_num,  #mobile_cart_qty .product_num').text(itemsInCart.count).removeClass('hidden');
    $('#bagTitle').addClass('hidden');
    console.log('cart content now is ', itemsInCart);
}

function incrementQuantityCallback(sku, qtyElement, service) {
    if (service.incrementQuantity(sku)) {
        qtyElement.css('color', 'black');
    } else {
        qtyElement.css('color', 'red');
    }

    qtyElement.val(service.getQuantity(sku));
    console.log('increment for [' + sku + '] level [' + service.getLevel() + '] count [' + service.getQuantity(sku) + ']');
}

function decrementQuantityCallback(sku, qtyElement, service) {
    if (service.decrementQuantity(sku)) {
        qtyElement.css('color', 'black');
    } else {
        qtyElement.css('color', 'red');
    }

    qtyElement.val(service.getQuantity(sku));
    console.log('decrement for [' + sku + '] level [' + service.getLevel() + '] count [' + service.getQuantity(sku) + ']');
}

function setQuantityCallback(sku, qtyElement, service) {
    if (service.setQuantity(sku, qtyElement.val())) {
        qtyElement.css('color', 'black');
    } else {
        qtyElement.css('color', 'red');
    }
    // todo handle checkbox here
    qtyElement.val(service.getQuantity(sku));
    console.log('change for [' + sku + '] level [' + service.getLevel() + '] count [' + service.getQuantity(sku) + ']');
}

function cleanUpModalValues(service, sku, input) {
    input.val('0');
    service.setQuantity(sku, '0');
}