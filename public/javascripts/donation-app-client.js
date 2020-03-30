function getDonationAmount() {
  return $('#donation-input').val();
}

function getDonorName() {
  return $('#name-input').val();
}

function isEmpty(str) {
  return (!str || 0 === str.trim().length);
}

function validateDonorName(donorName) {
  var donorNameEmpty = isEmpty(donorName);
  if (donorNameEmpty) {
    $('#donor-name-error-field').html('Please fill out your name');
    $('#donor-name-error-field').show();
    $('#name-input').parent().addClass('error-box');
  }
  else {
    $('#donor-name-error-field').hide();
    $('#name-input').parent().removeClass('error-box');
  }
  return !donorNameEmpty;
}

function validateDonationAmount(donationAmount) {

  var donationAmountValid = true;
  var errorMsg = ''

  if (isEmpty(donationAmount)) {
    errorMsg = 'Please fill out donation amount';
    donationAmountValid = false;
  }
  else if (isNaN(donationAmount)) {
    errorMsg = 'Please fill a numeric value for donation amount';
    donationAmountValid = false;
  }

  if (!donationAmountValid) {
    $('#donation-amount-error-field').html(errorMsg);
    $('#donation-amount-error-field').show();
    $('#donation-input').parent().addClass('error-box');
  }
  else {
    $('#donation-amount-error-field').hide();
    $('#donation-input').parent().removeClass('error-box');
  }

  return donationAmountValid;
}

function validateDonorDetails() {
  var $donorNameInput = $('#name-input')
  var $donationInput = $('#donation-input');

  var donorName = $donorNameInput.val();
  var donationAmount = $donationInput.val();
  var donorDetailsValid = true;
  donorDetailsValid &= validateDonorName(donorName);
  donorDetailsValid &= validateDonationAmount(donationAmount);

  return donorDetailsValid;
}

function hideDonationInfoAndInput() {
  $('#payment-button-container').remove();
  $('#information-container').hide();
  $('#donor-details').hide();
}

function showDonationInfoAndInput() {
  $('#payment-button-container').show();
  $('#information-container').show();
  $('#donor-details').show();
}

function postTransactionDetailsToBackend(instance, payload) {
  // When the user clicks on the 'Submit payment' button this code will send the
  // encrypted payment information in a variable called a payment method nonce
  $.ajax({
    type: 'POST',
    url: '/checkout',
    data: {'paymentMethodNonce': payload.nonce,
            'donationAmount': getDonationAmount(),
            'donorName': getDonorName()}
  }).done(function(result) {
    // Tear down the Drop-in UI
    instance.teardown(function (teardownErr) {
      if (teardownErr) {
        console.error('Could not tear down Drop-in UI!');
      } else {
        console.info('Drop-in UI has been torn down!');
      }
    });

    if (result.success) {
      console.log(result);

      var message = '<h1>Thank you for your donation</h1><p>Dear ';
      message += result['donorName'];
      message += ', we have received your donation.</p><p>Your generosity is a great motivation for us to continue running this website.</p>'
      $('#main-message-container').html(message);

    } else {
      console.log(result);
      var message = '<h1>Error with donation</h1><p>Dear ';
      message += result['donorName'];
      message += ', we have encountered an error while processing your donation with our payment gateway provider.<p>';
      message += '<p>If you wish to try again, please <a href="#" onclick="location.reload(true); return false;">refresh this page</a></p>'
      $('#main-message-container').html(message);
    }
  });
}

function createPaymentButton(instance) {
  var paymentButton = $('<button/>',
  {
      id: 'payment-button',
      text: 'Donate',
      click: function () {
        if (validateDonorDetails()) {
          $('#donor-details').removeClass('error-box-thick');
          instance.requestPaymentMethod(function (requestPaymentMethodErr, payload) {
            if (!requestPaymentMethodErr) {
              postTransactionDetailsToBackend(instance, payload);
              hideDonationInfoAndInput();
            }
            else {
              showDonationInfoAndInput();
            }
          });
        }
        else {
          $('#donor-details').addClass('error-box-thick');
        }// if (validateDonorDetails())
      }
  });
  paymentButton.appendTo('#payment-button-container');

}

// Initialize page
$('#donor-details').hide();
braintree.dropin.create({
  // Insert your tokenization key here
  authorization: '<use_your_tokenization_key>',
  container: '#dropin-container'
}, function (createErr, instance) {
  if (!createErr) {
    // Dynamically show payment button only when dropin ui can be created successfully
    createPaymentButton(instance);
    showDonationInfoAndInput();
  }
  else {
    hideDonationInfoAndInput();
    $('#main-message-container').html('<h1 class="error-msg">Error creating donation form</h1>');
  } // end if (!createErr)
});
