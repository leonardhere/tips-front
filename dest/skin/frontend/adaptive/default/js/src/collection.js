'use strict';

$(function () {
    $('#product-collection input[type=checkbox]').change(function (e) {
        var id = $(e.currentTarget).val();
        var checked = $(e.currentTarget).prop('checked');
        var cards = $('div[data-composition-id=' + id + ']');
        checked ? cards.removeClass('hidden') : cards.addClass('hidden');
    });
});