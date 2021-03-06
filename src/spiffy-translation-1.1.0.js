
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

        buttons_paypal: 'Checkout with',
        buttons_order: 'Complete my purchase!',
        buttons_or: 'OR',

        footer_security: 'Payment secured by 256-bit encryption',
        footer_copyright: 'Copyright',
        footer_rights: 'All Rights Reserved',
        footer_terms: 'Terms, Privacy, &amp; Disclaimers',

        snippet_terms_notice: 'You must agree to the terms and conditions before placing your order.'

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
        terms.notice = translations.snippet_terms_notice;
    }

}

function billing_hook(){

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

function payment_hook(){

    // Payment
    jQuery('#cardNumber').attr('placeholder',translations.payment_cardnumber);
    jQuery('#verificationCode').attr('placeholder',translations.payment_cvc);
    jQuery('#expirationMonth option[disabled]').text(translations.payment_month);
    jQuery('#expirationYear option[disabled]').text(translations.payment_year);
    jQuery('.paymentMethodTable th').html(jQuery('.paymentMethodTable th').html().replace('Payment Info', translations.header_payment));

}

function payplan_hook(){

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
       );

    jQuery('#spiffy-footer').html(
       jQuery('#spiffy-footer').html()
           .replace('Copyright', translations.footer_copyright)
           .replace('All Rights Reserved', translations.footer_rights)
       );

    jQuery('.spiffy-footerterms').text(translations.footer_terms);


}
