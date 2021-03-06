
// Initialize translation object
var translations = {};

// Set translations
spiffyTranslate = function( options ){

    // translation defaults
    var defaults = {
        fname: 'First Name',
        lname: 'Last Name',
        company: 'Company',
        email: 'Email',
        street1: 'Street Address',
        street2: 'Street Address Line 2 (optional)',
        city: 'City',
        state: 'State',
        zip: 'Zip/Postal Code',
        phone: 'Phone',

        header_billing: 'Billing Information',
        header_shipping: 'Shipping Information',
        header_shippingoptions: 'Shipping Options',
        header_payment: 'Payment Info',
        header_payplan: 'Select payment plan:',
        header_summary: 'Order Summary',

        shipping_prompt: 'Just begin filling out your billing info above.',
        shipping_change: 'Change Shipping Address &raquo;',

        payment_cardnumber: 'Credit Card Number',
        payment_cvc: 'CVV',
        payment_month: 'Month',
        payment_year: 'Year',

        payplan_single: 'Single payment of',
        payplan_multi: 'payments of',
        payplan_date: 'Due Now',
        payplan_financedate: 'Interest',
        payplan_scheduleheader: 'Schedule of Payments',

        summary_total: 'Total',
        summary_duetoday: 'Due Today', // for when a payment plan is selected
        summary_subtotal: 'Subtotal',
        summary_shipping: 'Shipping',
        summary_tax: 'Tax',
        summary_free: 'FREE',
        summary_promo_link: 'Have a promo code?',
        summary_promo_label: 'enter promo code...',
        summary_promo_apply: 'Apply',

        terms_text: 'I agree to the',
        terms_link: 'terms and conditions',

        buttons_paypal: 'Checkout with',
        buttons_order: 'Complete my purchase!',
        buttons_or: 'OR',

        footer_security: 'All payments are secured by 256-bit encryption',
        footer_copyright: 'Copyright',
        footer_rights: 'All Rights Reserved',
        footer_terms: 'Terms, Privacy, &amp; Disclaimers',

        error_default: "Please fill out all of the required fields.",
        error_terms: 'You must agree to the terms and conditions before placing your order.',
        error_creditcard: "Credit card number is required.",
        error_cerditcard_format: 'Credit card number should be numbers only, with no space or hyphen in between.',
        error_cvv: "Security code is required.",
        error_cvv_format: "Security code should be a three- or four-digit number.",
        error_email: "Email address is not a valid email address.",
        error_shipping: "You must select a shipping option.",
        error_shipping_paypal: "Please note that your shipping address will be overwritten with the address you choose using PayPal."

    };

    options = options || {};
    for (var opt in defaults){
        if (defaults.hasOwnProperty(opt) && !options.hasOwnProperty(opt)){
            options[opt] = defaults[opt];
        }
    }

    // return translation settings
    translations = options;

    spiffyNoHookTranslations();

}

// Adds back compatibility with pre 1.1.0 translations
if(typeof new_text != 'undefined')
    spiffyTranslate(new_text);


/* START TRANSLATIONS */
/* * * * * * * * * * * * * * * * * * * * * * * */

// Set Spiffy settings (no hooks required)
function spiffyNoHookTranslations(){

    window.button_text = translations.buttons_order;

    if(typeof terms != 'undefined'){
        terms.notice = translations.error_terms;
    }

    jQuery(window).load(function() {

            // Update spiffy terms and conditions
            jQuery('.spiffy-terms').html(
                jQuery('.spiffy-terms').html()
                    .replace('I agree to the', translations.terms_text)
                    .replace('terms and conditions', translations.terms_link)
            );

            // Use Infusionsoft's initialize API to translate error messages
            Infusion.Ecomm.OrderForms.init({
                "orderform.paymentType.required.error": "You must select a payment type.",
                "orderform.validation.creditCard.number.required.error": translations.error_creditcard,
                "orderform.validation.creditCard.number.format.error": translations.error_cerditcard_format,
                "orderform.validation.creditCard.cvc.required.error": translations.error_cvv,
                "orderform.validation.creditCard.cvc.format.error": translations.error_cvv_format,
                "order.form.tax": translations.summary_tax,
                "order.form.tax.displayTaxAsVat": "VAT",
                "orderform.validation.required.default.message": translations.error_default,
                "shopping.cart.shipping.required.error": translations.error_shipping,
                "shopping.cart.validation.email.invalid": translations.error_email,
                "orderform.validation.message.alreadySubmitted": "Your order is currently being processed.",
                "payment.payPal.shipping.address.warning": translations.error_shipping_paypal
            });

    });



}

// PAYMENT SELECTION HOOK
// Daisy chain for compatibility
if(typeof billing_hook == 'function'){
    var billing_hook_old = billing_hook;
}

billing_hook = function(){

    // Daisy chain for compatibility
    if(typeof billing_hook_old == 'function'){
        billing_hook_old();
    }

    // Field Labels
    jQuery('#firstName, #shipFirstName').attr('placeholder', translations.fname);
    jQuery('#lastName, #shipLastName').attr('placeholder', translations.lname);
    jQuery('#company, #shipCompany').attr('placeholder',translations.company);
    jQuery('#addressLine1, #shipAddressLine1').attr('placeholder',translations.street1);
    jQuery('#addressLine2, #shipAddressLine2').attr('placeholder',translations.street2);
    jQuery('#city, #shipCity').attr('placeholder',translations.city);
    jQuery('#state, #shipState').attr('placeholder',translations.state);
    jQuery('#zipCode, #shipZipCode').attr('placeholder',translations.zip);
    jQuery('#emailAddress').attr('placeholder',translations.email).attr('type', 'email');
    jQuery('#phoneNumber, #shipPhoneNumber').attr('placeholder',translations.phone).attr('type', 'tel');

    // Headers
    jQuery('.billingTable th').text(translations.header_billing);
    jQuery('.shippingTable th, .sp-heading').text(translations.header_shipping);

    // Shipping
    if(spiffyCheckHasShippingEnabled()){
        jQuery('#SpiffyShippingPreview .empty').text(translations.shipping_prompt);
        jQuery('#SpiffyShippingPreview .sp-changeshipping').text(translations.shipping_change);
    }

}

// PAYMENT SELECTION HOOK
// Daisy chain for compatibility
if(typeof payment_hook == 'function'){
    var payment_hook_old = payment_hook;
}

payment_hook = function(){

    // Daisy chain for compatibility
    if(typeof payment_hook_old == 'function'){
        payment_hook_old();
    }

    // Payment
    jQuery('#cardNumber').attr('placeholder',translations.payment_cardnumber);
    jQuery('#verificationCode').attr('placeholder',translations.payment_cvc);
    jQuery('#expirationMonth option[disabled]').text(translations.payment_month);
    jQuery('#expirationYear option[disabled]').text(translations.payment_year);
    jQuery('.paymentMethodTable th').html(jQuery('.paymentMethodTable th').html().replace('Payment Info', translations.header_payment));

}

// PAYPLAN HOOK
// Daisy chain for compatibility
if(typeof payplan_hook == 'function'){
    var payplan_hook_old = payplan_hook;
}

payplan_hook = function(){

    // Daisy chain for compatibility
    if(typeof payplan_hook_old == 'function'){
        payplan_hook_old();
    }

    jQuery('.payplanSummaryHeader').text(translations.payplan_scheduleheader);
    jQuery('.financeDate').text(translations.payplan_financedate);
    jQuery('.paymentDate').each(function(){
        jQuery(this).html(
        jQuery(this).html()
            .replace('Today', translations.payplan_date)
          );
    });

    jQuery('.payplanTable th').text(translations.header_payplan);
    jQuery('.payplanTable .listCell label').each(function(){
    	jQuery(this).html(
        jQuery(this).html()
            .replace('Single payment of', translations.payplan_single)
            .replace('payments of', translations.payplan_multi)
        );
    });

}

// SHIPPING OPTIONS
// Daisy chain for compatibility
if(typeof shippingoptions_hook == 'function'){
    var shippingoptions_hook_old = shippingoptions_hook;
}

shippingoptions_hook = function(){

    // Daisy chain for compatibility
    if(typeof summary_hook_old == 'function'){
        shippingoptions_hook_old();
    }

    jQuery('.shipMethodTable th').text(translations.header_shippingoptions);

}

// ORDER SUMMARY
// Daisy chain for compatibility
if(typeof summary_hook == 'function'){
    var summary_hook_old = summary_hook;
}

summary_hook = function(){

    // Daisy chain for compatibility
    if(typeof summary_hook_old == 'function'){
        summary_hook_old();
    }

    // Header
    jQuery('.viewCart .summaryTitle').text(translations.header_summary);

    // Product List
    jQuery('.viewCart .subscriptionPlan').each(function(){
        jQuery(this).html(
            jQuery(this).html()
                .replace('month', translations.payment_month)
                .replace('year', translations.payment_year)
        );
    });

    // Labels
    jQuery('.totalLabel').text(
            jQuery('.totalLabel').text()
                .replace('Total', translations.summary_total)
                .replace('Due Today', translations.summary_duetoday)
        );

    jQuery('.orderTotal').text(
            jQuery('.orderTotal').text()
                .replace('FREE', translations.summary_free)
        );

    jQuery('.orderSummary .listCell').each(function(){
    	jQuery(this).html(
            jQuery(this).html()
                .replace('Subtotal', translations.summary_subtotal)
                .replace('Shipping', translations.summary_shipping)
        );
    });

    // Tax
    jQuery('#taxLabel').text(jQuery('#taxLabel').text().replace('Tax', translations.summary_tax));

    // Promocode
    if(spiffyCheckHasPromoCodeEnabled()){
        jQuery('.promoField').attr('placeholder', translations.summary_promo_label);
        jQuery('.spiffy-coupon-toggle').text(translations.summary_promo_link);
        jQuery('.codeButton').text(translations.summary_promo_apply);
    }

}

// PAYPAL HOOK
// Daisy chain for compatibility
if(typeof paypalbutton_hook == 'function'){
    var paypalbutton_hook_old = paypalbutton_hook;
}

paypalbutton_hook = function(){

    // Daisy chain for compatibility
    if(typeof paypalbutton_hook_old == 'function'){
        paypalbutton_hook_old();
    }

    jQuery('.checkoutLinks .checkoutWithPayPalLink').html(
        jQuery('.checkoutLinks .checkoutWithPayPalLink').html()
            .replace('Checkout with', translations.buttons_paypal)
        );

    jQuery('.checkoutLinks .pp-or').text(translations.buttons_or);

    // Statics
    jQuery('.sp-security').html(
       jQuery('.sp-security').html()
            .replace('Payment secured by 256-bit encryption', translations.footer_security)
            .replace('All payments are secured by 256-bit encryption', translations.footer_security)
       );

    jQuery('#spiffy-footer').html(
       jQuery('#spiffy-footer').html()
           .replace('Copyright', translations.footer_copyright)
           .replace('All Rights Reserved', translations.footer_rights)
       );

    jQuery('.spiffy-footerterms').text(translations.footer_terms);


}
