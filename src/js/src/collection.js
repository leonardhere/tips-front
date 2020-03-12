$(function() {
    $('#product-collection input[type=checkbox]').change(e => {
        const id = $(e.currentTarget).val();
        const checked = $(e.currentTarget).prop('checked');
        const cards = $('div[data-composition-id=' + id + ']');
        checked ? cards.removeClass('hidden') : cards.addClass('hidden');
    })
});
