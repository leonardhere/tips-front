/**
 * Payment page universal handler
 */
(function($) {
  var settings = {
    language: "ru",
    orderId: "orderNumber",
    amount: "amount",
    paymentFormId: "formPayment",
    acsFormId: "acs",
    panInputId: "rbs_pan",
    subPanInputId: "iPAN_sub",
    yearSelectId: "expiry-years",
    currentYear: (new Date).getFullYear(),
    monthSelectId: "expiry-months",
    monthYearInputId: "expiry-month-year-input",
    expiryYearValueElement: "expiry-year-val",
    expiryMonthValueElement: "expiry-month-val",
    cardholderInputId: "iTEXT",
    cvcInputId: "iCVC",
    typecardIcon: "card-type",
    newCardTitle: "card-block-ttl",
    bankType: "bank-type",
    cardType: "card-type",
    card: "card-block",

    minAmount: 1, // минимальная разрешенная сумма в рублях

    defaultCurrency: 'RUB',

    submitId: "submit-link",
    email: "email",

    collectFields: [],
    optionalFields: ['description'],
    predefinedFields: [],
    customFieldsFormats: {},
    customFieldsConfig: {
      contract: {
        label: "Номер договора",
        placeholder: "гггг-мм-######",
        fieldFontAwesomeClass: 'fa-file-text-o',
        tooltipMessage: 'Номер договора указан сверху договора'
      }
    },

    paymentUrl: "../../api/pay.do",
    backUrl: "../../finish_modal.html",

    expiryIsInput: true,

    messageAjaxError: "Service Unavailable",
    messageValidationInvalid: "Bad input",
    validationHighlightTime: 1000,
    defaultInputTemplate: '<div class="row" id="{fieldName}_block">' +
                      '<div class="form-group">' +
                      '<div class="input-group">' +
                      '<input id="{name}" type="text" class="form-control large validate" placeholder="{placeholder}" tabindex="6"/>' +
                      '<span class="input-group-addon"><span class="fa {fieldFontAwesomeClass}"></span></span>' +
                      '</div>' +
                      '</div>' +
                      '</div>',

    onReady: function() {
      $('#formPayment').trigger('reset');
      methods.prepareForMobile();
      methods.sendHeightToParent();
      methods.hideProgress();
    }
  };

  var properties = {
    month: '',
    year: ''
  };
  var validation = {
    validPan: false,
    validExpiry: false,
    validCvc: false,
    validAmount: false,
    validEmail: false,
    showErrors: false,
    showValid: true,
    customFields: []
  };

  var methods = {
    init: function(options) {
      if (options) {
        $.extend(settings, options);
      }
      settings.token = validateToken(getUrlParameter('token'));
      settings.order = setupOrder(settings.order ? settings.order : getUrlParameter('order'), settings);

      setupCustomFields(settings);
      settings.language = localStorage.getItem("locale");
      if (!settings.token || !settings.order) {
        return;
      }

      if (getUrlParameter('modal')) {
        sessionStorage.setItem('modal', true);
      }

      return this.each(function() {
        $(this).ready(methods.fillControls);
      });
    },
    showCustomFields: function() {
      for (var field in settings.collectFields) {
        if (settings.collectFields[field].indexOf("{") >= 0) {
          field = JSON.parse(settings.collectFields[field]);
        } else {
          field = {"name": settings.collectFields[field]};
        }
        var predefinedBlock = $('#' + field.name + '_predefined_block');
        if (predefinedBlock.length > 0) {
          predefinedBlock.show();
          if (settings.predefinedFields[field.name]) {
            if (field.name == settings.amount) {
              var numArr;

              if (!/^\d+(\,\d{1,2})?(\.\d{1,2})?$/.test(settings.predefinedFields[field.name]) &&
                  settings.predefinedFields[field.name] !== "" ||
                  settings.predefinedFields[field.name] < settings.minAmount) {
                if (settings.predefinedFields[field.name] < settings.minAmount) {
                  methods.showError('Cумма должна быть больше ' + settings.minAmount + ' руб.');
                } else {
                  methods.showError('Указана некорректная сумма.');
                }
                methods.disablePage(true);
              }

              if (~settings.predefinedFields[field.name].indexOf(',')) {
                settings.predefinedFields[field.name] = settings.predefinedFields[field.name].replace(/\,/g, '.');
              }

              if (~(settings.predefinedFields[field.name]).indexOf('.')) {
                numArr = (settings.predefinedFields[field.name]).split('.');
              } else {
                numArr = (settings.predefinedFields[field.name] + '.00').split('.');
              }

              $("#" + settings.amount).val(numArr[0] + '.' + numArr[1]);
              $("#" + settings.amount).attr('value', numArr[0] + '.' + numArr[1]);
              $("#" + settings.amount).prop('disabled', true);
              $("#amountShow").show();
              $("#amount_predefined_block").hide();
              $("#amountShow .amount").text(numArr[0] + '.' + numArr[1]);
              $("#showAmount").text(numArr[0] + '.' + numArr[1]);
            } else {
              $("#" + field.name).val(settings.predefinedFields[field.name]);
              $("#" + field.name).attr('value', settings.predefinedFields[field.name]);
              $("#" + field.name).prop('disabled', true);
              if (field.name === 'description') {
                $("#" + field.name).text(decodeURIComponent(settings.predefinedFields[field.name]));
                $("." + field.name).text(decodeURIComponent(settings.predefinedFields[field.name]));
                $("." + field.name + '-block').show();
              }
            }
          }
        } else {
          $('#customInputs').show().append(
              methods.buildCustomField(field)
          )
        }
      }
    },
    buildCustomField: function(field) {
      var fieldConfig = settings.customFieldsConfig[field] || {
        label: field.label,
        placeholder: '',
        template: settings.defaultInputTemplate
      };
      fieldConfig.name = field.name;
      fieldConfig.placeholder = fieldConfig.label || field.label;
      fieldConfig.template = fieldConfig.template || settings.defaultInputTemplate;
      var content = fieldConfig.template;
      fieldConfig.template = null;
      content = fillTemplate(content, fieldConfig);
      return content;
    },
    bindControls: function() {
      $('#' + settings.paymentFormId).on('submit', methods.onSubmit);
      $("#" + settings.subPanInputId).on('keyup keypress paste blur', methods.validatePan);
      $("#" + settings.subPanInputId).on('keyup', methods.detectBank);
      $('#' + settings.panInputId).on('keypress', methods.checkNumberInput);
      $("#" + settings.cvcInputId).on('keyup paste blur', methods.validateCvc);
      $('#' + settings.cvcInputId).on('keypress', methods.checkNumberInput);
      $("#" + settings.amount).on('keypress paste blur change input', methods.checkAmountInput);
      $("#" + settings.email).on('keypress input paste blur', methods.validateEmail);
      $("#" + settings.email).on('keypress input', methods.clearEmail);
      $("#" + settings.amount).on('input', methods.checkAmount);

      $('#' + settings.submitId).on('click', methods.doSubmitForm);
      $("#" + settings.monthYearInputId).on('keyup keypress paste blur', methods.validateExpiry);
      $("#" + settings.monthYearInputId).on('input', methods.autoFocus);
      $("#customInputs input").on('input', methods.clearBottomBorder);

      $("#amountShow").on('click', methods.hideStaticAmount);
      $("#locale").change(methods.changeLanguage);
    },
    sendHeightToParent: function(offset) {
      var iframeHeight = $(document).height(),
          iframe;
      if (offset) {
        iframe = {height: iframeHeight - offset}
      } else {
        iframe = {height: iframeHeight}
      }
      var message = JSON.stringify(iframe);
      window.parent.postMessage(message, '*');
    },
    showLoader: function() {
      $('.load-block').show();
    },
    hideLoader: function() {
      $('.load-block').hide();
    },
    fillControls: function() {
      methods.showCustomFields();
      methods.bindControls();

      //What is type of expiry?
      if (settings.expiryIsInput) { //Input
        $('.expiry-select').remove();
        $('.expiry-input').show();
      } else { // select
        $('.expiry-input').remove();
        var yearSelect = $('#' + settings.yearSelectId);
        yearSelect.empty();
        var year = settings.currentYear;
        while (year < settings.currentYear + 20) {
          var option = "<li><a> " + year + "</a></li>";
          yearSelect.append($(option));
          year++;
        }
        yearSelect.on('click', 'a', function() {
          $('#' + settings.expiryYearValueElement).text(this.text)
          yearSelect.trigger('change');
        });
        var monthSelect = $('#' + settings.monthSelectId);
        monthSelect.on('click', 'a', function() {
          $('#' + settings.expiryMonthValueElement).text(pad($(this).parent().val(), 2));
          monthSelect.trigger('change');
        });
        $('.expiry-select').show();
      }
      if (settings.order[settings.amount]) {
        if (settings.order[settings.amount] < settings.minAmount) {
          methods.showError('Сумма заказа должна быть больше' + settings.minAmount + 'руб.');
          methods.disablePage(true);
        } else {
          $('#showAmount').text(settings.order[settings.amount]);
          $("#amountShow").show();
          $("#amountShow .amount").text(settings.order[settings.amount]);
          $('#amount_predefined_block').hide();
          $('#' + settings.amount).val(settings.order[settings.amount]);
          $("#" + settings.amount).attr('value', settings.order[settings.amount]);
          $("#" + settings.amount).prop('disabled', true);
        }
      }

      if (settings.order.description) {
        $('.description').text(settings.order.description);
        $('#description').text(settings.order.description);
        $('.description-block').show();
      }

      settings.onReady();
    },
    changeLanguage: function() {
      settings.language = $('#locale option:selected').val();
    },
    checkExpiryInput: function(event) {
      setTimeout(function() {
        var elem = $(event.target);
        elem.val(elem.val().replace(/[^0-9\/]/g, ""));
      }, 0);
    },
    checkAmountInput: function(event) {
      setTimeout(function() {
        var elem = $(event.target);
        elem.val(elem.val().replace(/,/g, '.').replace(/[^\d\.]/g, ''));
        if (!/^\d+\.?(\d{1,2})?$/ig.test(elem.val())) {
          elem.val(elem.val().substr(0, elem.val().length - 1));
        }
        if (event.type == 'change') {
          methods.showStaticAmount();
        }
      }, 0);
    },
    checkAmount: function (event) {
      var elem = $(event.target);
      elem.val(elem.val().replace(/^0+/, ''));
    },
    checkNumberInput: function(event) {
      setTimeout(function() {
        var elem = $(event.target);
        elem.val(elem.val().replace(/\D/g, ""));
      }, 0);
    },
    checkNameInput: function(event) {
      setTimeout(function() {
        var elem = $(event.target);
        elem.val(elem.val().replace(/[^a-zA-Z ' \-`.]/g, ""));
      }, 0);
    },
    checkPhoneInput: function(event) {
      setTimeout(function() {
        var elem = $(event.target);
        elem.val(elem.val().replace(/[^\d\(\)\+]/g, ""));
      }, 0);
    },
    autoFocus: function(event) {
      var elem = $(event.target);
      if (elem.val().length == elem.attr('maxlength')) {
        var nextTabindex = +elem.attr('tabindex') + 1;
        $('input[tabindex=' + nextTabindex + ']').focus();
      }
    },
    correctMonth: function(event) {
      setTimeout(function() {
        var elem = $(event.target);
        elem.val(elem.val().replace(/\D/g, ""));
        firstChar = elem.val().charAt(0);
        if (elem.val() > 1 && firstChar !== '0' && firstChar !== '1') {
          elem.val('0' + elem.val());
        }
        if (elem.val() > 12) {
          elem.val(12);
        }
        elem.focusout(function() {
          if (elem.val() == '1') {
            elem.val('01');
          }
        });
        elem.focusout(function() {
          if (elem.val() > '12') {
            elem.val('12');
          }
        });
      }, 0);
    },
    disablePage: function(enable) {
      $('input').prop('disabled', enable);
      enable ? $('#' + settings.submitId).hide() : $('#' + settings.submitId).show();
    },
    getPaymentSystem: function(pan) {
      var cardType = '';
      if (/^5/.test(pan)) {
        return 'MASTERCARD';
      } else if (/^220/.test(pan)) {
        return 'MIR';
      } else if (/^4/.test(pan)) {
        return 'VISA';
      } else if (/^6/.test(pan)) {
        return 'MAESTRO';
      }
    },
    changeCardType: function(pan) {
      $('.card-type').removeClass('MASTERCARD MIR VISA MAESTRO').addClass(methods.getPaymentSystem(pan));
    },
    onSubmit: function(event) {
      event.preventDefault();
      methods.sendPayment();
    },
    switchActions: function(isEnabled) {
      //$('#' + settings.submitId).attr('disabled', !isEnabled);
    },
    doSubmitForm: function() {
      if (!methods.validate()) {
        return;
      }

      var expiryTtemp = $('#' + settings.monthYearInputId).val().split('/');
      $('#expiry').val(('20' + expiryTtemp[1] + expiryTtemp[0]).trim()); // format: 032025 for 'March 2025'
      methods.switchActions(false);
      $('#formPayment').submit();
    },
    validateExpiry: function() {
      // check if card expiration date
      properties.month = $('#rbs_month').val();
      properties.year = $('#rbs_year').val();
      var expiryValue = $('#' + settings.monthYearInputId).val();
      if (/\d\d\/\d\d/.test(expiryValue) && payValid.expiry(properties.month, properties.year)) {
        validation.validExpiry = true;
      } else {
        validation.validExpiry = false;
      }
      methods.showFieldValidation($('#' + settings.monthYearInputId), validation.validExpiry);
    },
    validateCustomFields: function() {
      validation.customFields = [];
      $.each(settings.collectFields, function(i) {
        var valid = true;
        var field = settings.collectFields[i];
        if (field.indexOf("{") >= 0) {
          field = JSON.parse(field).name;
        }
        var input = $('#' + field);
        if (input.length == 0) {
          return;
        }
        var inputValue = input.val();
        var inputFormat = settings.customFieldsFormats[field];

        if (field === settings.amount) {
          valid = inputValue.length > 0;
        } else if (field === settings.phone) {
          valid = methods.validatePhone();
        } else {
          if (inputFormat == null) {
            valid = true;
          } else {
            valid = new RegExp(inputFormat).test(inputValue);
          }
        }

        var fieldValidObject = {};
        fieldValidObject[field] = valid;
        validation.customFields.push(fieldValidObject);
        if (!valid) {
          methods.showFieldValidation(input, valid);
        }
      });
    },
    showFieldValidation: function(input, isValid) {
      if (isValid) {
        input.addClass("ok").removeClass("error");
      } else {
        input.addClass("error").removeClass("ok");
      }
    },
    detectBank: function() {
      var numberCard = $('#' + settings.panInputId).val();
      if (numberCard.length >= 6) {
        prefix = numberCard.slice(0, 6);
        bankName = banksAndPrefixes.prefixes[prefix];
        if (bankName) {
          if (banksAndPrefixes.banks[bankName].logoSvg) {
            $('#' + settings.newCardTitle).hide();
            $('#' + settings.bankType).show();
            $('.' + settings.card).css('border-color', banksAndPrefixes.banks[bankName].backgroundColor);
            $('#' + settings.bankType).html('<img src="assets/img/banks-logos/' + banksAndPrefixes.banks[bankName].logoSvg + '" height="30">');
          } else if (banksAndPrefixes.banks[bankName].logoPng) {
            $('#' + settings.newCardTitle).hide();
            $('#' + settings.bankType).show();
            $('.' + settings.card).css('border-color', banksAndPrefixes.banks[bankName].backgroundColor);
            $('#' + settings.bankType).html('<img src="assets/img/banks-logos/' + banksAndPrefixes.banks[bankName].logoPng + '" height="30">');
          }
        }
      } else {
        $('#' + settings.newCardTitle).show();
        $('#' + settings.bankType).hide();
        $('.' + settings.card).css('border-color', '#d5d5d5');
      }
    },
    validatePan: function() {
      var panInput = $('#' + settings.panInputId),
          subPanInput = $('#' + settings.subPanInputId);
      validation.validPan = payValid.pan(settings.panInputId);
      methods.changeCardType(panInput.val());
      methods.showFieldValidation(subPanInput, validation.validPan);
    },
    validateAmount: function() {
      var amount = $('#' + settings.amount);
      if (!/^[0-9]{1,}$/.test(amount.val()) && amount.val() < settings.minAmount) {
        validation.validAmount = false;
      } else {
        validation.validAmount = true;
      }
      methods.showFieldValidation(amount, validation.validAmount);
    },
    validateCvc: function() {
      var cvcInput = $('#' + settings.cvcInputId),
          panInput = $('#' + settings.panInputId),
          paymentSystem = methods.getPaymentSystem(panInput.val());

      if (paymentSystem === 'MAESTRO' && cvcInput.val() === '' || /^\d{3}$/.test(cvcInput.val())) {
        validation.validCvc = true;
      } else {
        validation.validCvc = false;
      }
      methods.showFieldValidation(cvcInput, validation.validCvc);
      methods.validateExpiry();
    },
    clearEmail: function() {
      var email = $('#' + settings.email);
      email.val(email.val().replace(/[^a-zA-Z0-9._@-]/g, ''));
    },

    validateEmail: function() {
      var email = $('#' + settings.email);
      var valid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email.val());
      if (valid) {
        validation.validEmail = true;
      } else {
        validation.validEmail = false;
      }
      methods.showFieldValidation(email, validation.validEmail);
    },
    validatePhone: function() {
      var phone = $('#' + settings.phone);
      var valid = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7}$/.test(phone.val());
      methods.showFieldValidation(phone, valid);
      return valid;
    },
    validate: function() {
      methods.hideError();
      validation.showValid = false;
      validation.showErrors = true;
      methods.validatePan();
      methods.validateCvc();
      methods.validateExpiry();
      methods.validateCustomFields();
      methods.validateAmount();
      methods.validateEmail();
      var customFieldsValidation = true;
      if (validation.customFields.length > 0) {
        customFieldsValidation = !settings.collectFields.some(function(item, i) {
          return validation.customFields[i][item] == false;
        });
      }
      var isValid =
          validation.validPan &&
          validation.validExpiry &&
          validation.validCvc &&
          validation.validAmount &&
          validation.validEmail &&
          customFieldsValidation;

      validation.showErrors = false;
      validation.showValid = true;
      return isValid;
    },
    clearBottomBorder: function() {
      if ($(this).val().length > 0) {
        $(this).addClass('clear-btm-border');
      } else {
        $(this).removeClass('clear-btm-border');
      }
    },
    showStaticAmount: function() {
      var amount = $("#" + settings.amount).val();
      if (amount.length > 0) {
        if (~(amount).indexOf('.')) {
          var amountSplit = amount.split('.');
          if (amountSplit[1].length == 0) {
            amount = amount + '00';
          } else if (amountSplit[1].length == 1) {
            amount = amount + '0';
          }
        } else {
          amount = amount + '.00';
        }
        $("#amount_predefined_block").hide();
        $("#amountShow .amount").text(amount);
        $("#showAmount").text(amount);
        $("#amountShow").show().addClass('pointer');
        $("#" + settings.amount).val(amount);
      } else {
        $("#amount_predefined_block").show();
        $("#amountShow").hide();
        $("#amountShow .amount").text('--.--');
        $("#showAmount").text('0.00');
      }
    },
    hideStaticAmount: function() {
      if (!$("#" + settings.amount).attr('disabled')) {
        $("#amount_predefined_block").show();
        $("#amountShow").hide();
        $("#amountShow .amount").text('--.--');
      }
    },
    showProgress: function() {
      $('.load-block').show();
    },
    hideProgress: function() {
      $('.load-block').hide();
    },
    hideError: function() {
      var offset = document.getElementById("error-container").offsetHeight;
      $('#error-collapse').collapse('hide');
      $('#error-container').empty();
      $("#error-collapse").on('hidden.bs.collapse', function() {
      });
    },
    showError: function(message) {
      methods.hideProgress();
      $('#error-container').empty();
      $('#error-container').prepend('<p>' + message + "</p>");
      $('#error-collapse').collapse('show');
      $("#error-collapse").on('shown.bs.collapse', function() {
      });
    },
    redirect: function(destination, message) {
      if (message) {
        $('#infoBlock').empty();
        $('#infoBlock').prepend('<p>' + message + "</p>");
      }
      $('#numberCountdown').hide();
      $('#error-container').empty();
      $('#formPayment').attr('expired', '1');
      methods.switchActions(false);
      document.location = destination;
    },

    sendPayment: function() {
      methods.showProgress();
      settings.language = localStorage.getItem("locale");
      var orderId = validation.orderId,
          addParams = {};
      for (field in settings.collectFields) {
        var collectField = settings.collectFields[field];
        if ((collectField).indexOf("{") >= 0) {
          collectField = JSON.parse(collectField).name;
        }
        if (collectField == 'email' || collectField == 'amount') continue;
        addParams[collectField] = $("#" + collectField).val();
      }
      /*
      if (!settings.order[settings.amount] || settings.collectFields.indexOf(settings.amount) > -1) {
          settings.order[settings.amount] = $("#" + settings.amount).val();
      }
      */
      settings.order[settings.amount] = $("#" + settings.amount).val();
      $.ajax({
        url: settings.paymentUrl,
        type: 'POST',
        cache: false,
        contentType: "application/json",
        data: JSON.stringify({
          api_token: settings.token,
          order: settings.order,
          backUrl: settings.backUrl,
          card: {
            expiry: $("#expiry").val(),
            pan: $("#" + settings.panInputId).val(),
            cvc: $("#" + settings.cvcInputId).val()
          },
          client: {
            language: settings.language,
            email: $("#" + settings.email).val()
          },
          addParams: addParams
        }),
        dataType: 'json',
        error: function(data) {
          methods.showError(settings.messageAjaxError);
          methods.switchActions(true);
          return true;
        },
        success: function(data) {
          methods.switchActions(true);
          if (data['acsUrl'] != null) {
            methods.redirectToAcs(data);
          } else if ('redirect' in data) {
            methods.redirect(data['redirect'], data['info'], settings.messageRedirecting);
          } else if (('errorCode' in data) && data.errorCode == '0') {
            methods.redirect("finish_modal.html?orderId=" + data.orderId)
          } else if ('errorCode' in data && 'errorMessage' in data) {
            methods.showError(data.errorMessage);
          } else {
            methods.showError('Системная ошибка');
          }
          methods.hideProgress();
          return true;
        }

      });
    },
    prepareForMobile: function() {
      var userAgent = navigator.userAgent;
      if (/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini)/i.test(userAgent) &&
          !methods.isWinPhone() ) {  //IEMobile doesn't support mask tel type
        $('body').addClass('mobile');
        $("#" + settings.cvcInputId).attr('type', 'tel');
      }
    },
    isWinPhone: function() {
      return /(Windows Phone|iemobile|WPDesktop)/i.test(navigator.userAgent);
    },
    redirectToAcs: function(data) {
      $('#acs').attr('action', data['acsUrl']);
      $('#PaReq').val(data['paReq']);
      $('#MD').val(data['orderId']);
      $('#TermUrl').val(data['termUrl']);
      $('#acs').submit();
    }
  };


  $.fn.payment = function(method) {
    // Method calling logic
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      return $.error('Method ' + method + ' does not exist on jQuery.payment');
    }
  };
})(jQuery);

jQuery.fn.log = function(msg, type) {
  if (typeof lastSelector == 'undefined') {
    lastSelector = '--';
  }

  if (lastSelector != this.selector.slice(0, lastSelector.length)) {
    if (lastSelector != '--') {
      console.groupEnd();
      lastSelector = '--';
    }
    else {
      lastSelector = this.selector;
    }
    console.group("%s (%s)", msg, this.selector);
  }

  if (type == undefined) {
    type = "log";
  }
  switch (type) {
    case "log":
      console.log(this);
      break;
    case "warn":
      console.warn(this);
      break;
    case "info":
      console.info(this);
      break;
    case "error":
      console.error(this);
      break;
    case "time":
      console.time(msg);
      break;
    case "timestop":
      console.timeEnd(msg);
      break;
    case "profile":
      console.profile(msg);
      break;
    case "profilestop":
      console.profileEnd(msg);
      break;
  }
  return this;
};

/**
 * Is pressed key a number key
 * @param keyCode
 */
function isNumber(keyCode) {
  return ( keyCode > 47 && keyCode < 58 );
}

function isControl(keyCode) {
  return keyCode in {
    8: 1,
    9: 1,
    13: 1,
    16: 1,
    17: 1,
    18: 1,
    20: 1,
    37: 1,
    38: 1,
    39: 1,
    40: 1,
    45: 1,
    46: 1
  };
}

function pad(str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

function toggleClass(element, classFrom, classTo, direction) {
  if (direction == 'undefined') {
    direction = true;
  }

  $(element).removeClass(direction ? classFrom : classTo);
  $(element).addClass(direction ? classTo : classFrom);

}

function toggleClassForSomeTime(elements, classFrom, classTo, direction, timer, classFinal) {
  toggleClass(elements, classFrom, classTo, direction);
  window.setTimeout(toggleClass, timer, elements, direction ? classTo : classFrom, classFinal, true);
}

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  var paramValues = [];
  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      if (sParameterName[1] !== undefined) {
        paramValues.push(decodeURIComponent(sParameterName[1]));
      }
    }
  }
  if (paramValues.length > 1) {
    return paramValues;
  } else {
    return paramValues[0];
  }
};

function setupOrder(order, settings) {
  if (order === undefined || order === null) {
    return {currency: settings.defaultCurrency};
  }
  if (typeof order === 'string') {
    order = JSON.parse(order);
  }
  return order;
}

function setupCustomFields(settings) {
  var ask = getUrlParameter('ask');
  if (ask === undefined) {
    ask = 'email';
  } else if (~ask.indexOf('email')) {
    if (ask != 'email') {
      ask.push('email');
    }
  }
  if (!settings.order[settings.amount] && ask == undefined) {
    ask = settings.amount;
  } else if (ask == undefined) {
    return;
  }
  if (typeof ask !== 'object') {
    ask = [ask]
  }
  for (i in ask) {
    if (ask[i].indexOf("_optional") > 0) {
      ask[i] = ask[i].replace("_optional", "");
      settings.optionalFields.push(ask[i]);
    }
    settings.collectFields.push(ask[i]);
  }

  var def = getUrlParameter('def');
  if (def == undefined) {
    return;
  }
  if (typeof def !== 'object') {
    def = [def];
  }
  for (var d in def) {
    d = JSON.parse(def[d]);
    var name = Object.getOwnPropertyNames(d)[0];
    settings.predefinedFields[name] = d[name];
    settings.collectFields.push(name);
  }
  return ask;
}

function validateToken(token) {
  if (!token || !(typeof token === 'string')) {
    console.error("Token string must be provided");
    return null;
  }
  if (!/^[a-zA-Z0-9]{1,64}$/.test(token)) {
    console.error("Token must be of length 20 and contain only digits and uppercase letters A...Z");
    return null;
  }
  return token;
}

function luhn(num) {
  num = (num + '').replace(/\D+/g, '').split('').reverse();
  if (!num.length)
    return false;
  var total = 0, i;
  for (i = 0; i < num.length; i++) {
    num[i] = parseInt(num[i]);
    total += i % 2 ? 2 * num[i] - (num[i] > 4 ? 9 : 0) : num[i];
  }
  return (total % 10) == 0;
}

function fillTemplate(content, values) {
  for (v in values) {
    var val = values[v];
    content = content.replaceAll("{" + v + "}", val);
  }
  return content;
}

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};