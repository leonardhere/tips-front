$(function() {

    var keydown = {};
    keydown['BACKSPACE'] = 8,
    keydown['DELETE'] = 46;

    var properties = {
        month: '',
        year: '',
        caretPosition: null
    };

    var k = {

        pan: $('#iPAN_sub'),
        pan_real: $('#iPAN'),
        expiryMY: $('#expiry-month-year'),
        month: $('#month'),
        year: $('#year'),
        holder: $('#iTEXT'),
        cvc: $('#iCVC'),

        isMobile: function() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Windows Phone|Opera Mini/i.test(navigator.userAgent);
        },

        correctNumberInput: function() {
            var maxlength = parseInt(k.pan_real.attr('maxlength')) || 19;
            var number = k.pan.val().replace(/\D/g, "").substr(0, maxlength);
            var number_sub = number.replace(/(\d{4}(?!$))/g, '$1 ');

            k.pan.val(number_sub);
            k.pan_real.val(number);
        },

        restrictNumeric: function(e) {
            var $this = k.expiryMY;
            $this.val($this.val().replace(/\D/g, ""));
        },

        formatExpiry: function(e) {
            var $this = k.expiryMY,
                value = $this.val(),
                length = value.length;

            // Проверка ввода первой цифры
            if (length === 1) {
                if (value > 1) {
                    $this.val('0' + value + '/');
                    properties.month = '0' + value;
                    k.setCaretToEnd(this);
                }
            }
            // Проверка ввода второй цифры
            if (length === 2) {
                if (value > 12) {
                    $this.val('12/');
                    properties.month = '12';
                    k.setCaretToEnd(this);
                } else if (value === '00') {
                    $this.val('0');
                    properties.month = value;
                } else {
                    $this.val(value + '/');
                    properties.month = value;
                    k.setCaretToEnd(this);
                }
            }
            if (length === 3) {
                properties.year = value.slice(-1);
                $this.val(properties.month + '/' + properties.year);
                k.setCaretToEnd(this);
            }
            if (length === 4) {
                properties.year = value.slice(-2);
                $this.val(properties.month + '/' + properties.year);
            }

            k.month.val(properties.month);
            k.year.val('20' + properties.year);
            k.month.trigger('change');
            k.year.trigger('change');
        },

        setCaretToEnd: function(input) {
            var self = input;
            setTimeout(function() {
                self.selectionStart = self.selectionEnd = 10000;
            }, 0);
        },

        saveCaretPosition: function() {
            properties.caretPosition = k.getCaretPos(this);
        },

        keyboardFormatExpiry: function(e) {
            var $this = k.expiryMY,
                value = $this.val(),
                length = value.length,
                code = e.which || e.keyCode;

            // Корректное удаление даты при BACKSPACE и курсоре после символа '/'
            if (e.key === 'Backspace' || code === keydown['BACKSPACE']) {
                if (length === 3) {
                    $this.val(value.substring(0, 1));
                    return false;
                }
                if (length === 4) {
                    $this.val(value.substring(0, 3));
                    return false;
                }
                if (k.getCaretPos(this) === 4 && length > 3) {
                    $this.val(value.substring(0, length - 1));
                    return false;
                }
                if (k.getCaretPos(this) === 3 && length === 5) {
                    return false;
                }
            }
        },

        getCaretPos: function(input) {
            // Internet Explorer Caret Position (TextArea)
            if (document.selection && document.selection.createRange) {
                var range = document.selection.createRange();
                var bookmark = range.getBookmark();
                var caret_pos = bookmark.charCodeAt(2) - 2;
            } else {
                // Firefox Caret Position (TextArea)
                if (input.setSelectionRange)
                    var caret_pos = input.selectionStart;
                }
            return caret_pos;
        }
    };

    k.pan.on('keypress keyup paste input change', function(evt) {
        k.correctNumberInput();
        if (evt.type == 'keyup') {
            k.pan_real.keyup();
        }
    });

    $('#expiry-month-year').on('input blur focus', function(e) {
        k.restrictNumeric(e);
        k.formatExpiry(e);
    });

    $('#expiry-month-year').on('keydown', function(e) {
        k.saveCaretPosition(e);
        k.keyboardFormatExpiry(e);
    });

    $('.form-control').on('blur', function(e) {
        $(this).addClass('focused');
    });
});
