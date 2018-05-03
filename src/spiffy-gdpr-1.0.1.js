// Initialize settings object
var spiffyGDPR = {};

// Initialize Plugin
spiffyGDPR = function( options ){

    // Defaults Settings
    var defaults = {
        custom_field: "Contact0_EUMarketingOptIn",
        checkbox_text: "I want to receive future promotions and free training.",
        checkbox_subtext: "", // (optional)
        required: false, // (optional)
        required_error: 'Please agree to terms', // (optional)
        show_always: false // (optional)
    };

    // Make sure we're an array
    if (!options instanceof Array) {
        console.log('Could not start GDPR checkbox plugin - settings not in an array');
        return;
    }

    for (var i = 0; i < options.length; i++) {

        options[i] = options[i] || {};
        for (var opt in defaults){
            if (defaults.hasOwnProperty(opt) && !options[i].hasOwnProperty(opt)){
                options[i][opt] = defaults[opt];
            }
        }

    }

    // Set settings object
    spiffyGDPR.settings = options;

    // Initialization scripts
    jQuery(document).ready(function($){

        for (var i = 0; i < spiffyGDPR.settings.length; i++) {

            initialize(i);

        }

        // Bind to country change
        if(typeof billing_hook == 'function')
            var billing_hook_old = billing_hook;

        billing_hook = function () {

            // Daisy chain for compatibility
            if(typeof billing_hook_old == 'function'){
                billing_hook_old();
            }



            jQuery('#country').on('change', function (e) {

                for (var i = 0; i < spiffyGDPR.settings.length; i++) {

                    // Hide/show opt-in depending on selected country
                    if (!spiffyGDPR.settings[i].show_always) {

                        var $this = jQuery(this);

                        if (isEuropeanUnion($this.val())) {

                            showGDPRCheckboxes(i);

                        } else {

                            hideGDPRCheckboxes(i);

                        }
                    }
                }
            }).trigger('change')

        }

    });

    initialize = function (index) {

        // Add checkbox/label
        jQuery('<div class="spiffy_gdpr_terms" data-cb-index="'+ index +'"><input type="checkbox" name="spiffy_gdpr_terms" id="spiffy_gdpr_terms"/> ' + spiffyGDPR.settings[index].checkbox_text + '<br><span style="font-size:10px;">' + spiffyGDPR.settings[index].checkbox_subtext + '</span></div>')
            .css({
                'font-size':'13px',
                'padding':'0 0 30px 0',
                'text-align':'center'
            })
            .insertBefore('#CHECKOUT_LINKS');

        // Add custom field
        jQuery('<input type="hidden" value="false" name="' + spiffyGDPR.settings[index].custom_field + '" />').prependTo('#orderForm');

        // Bind actions
        jQuery('[data-cb-index='+ index +'] input').on('change', function () {

            var checked = jQuery(this).is(":checked");
            var new_val = ( checked ? checked +' '+ getTimeStamp() : checked )

            jQuery('input[name=' + spiffyGDPR.settings[index].custom_field + ']').val( new_val );

        });

    }

    // Bind required validations
    injectSpiffy("#CHECKOUT_LINKS", function() {

        if (jQuery("#CHECKOUT_LINKS a.complete-purchase").length > 0 && jQuery("#CHECKOUT_LINKS .gdpr_validations").length < 1) {
            bindValidations();
        }

    }, 100);


    // UTILITY FUNCTIONS
    //
    bindValidations = function () {

        jQuery(".checkoutLinks > a.complete-purchase").each(function() {

            var original = "";

            if (jQuery(this).attr('href') != undefined) {

                original = jQuery(this).attr('href').replace(/javascript:/g, "");
                window.checkoutAction = original; // set global for use by Upsell and other snippets.
                jQuery(this).addClass('gdpr_validations');

            } else {

                original = jQuery(this).attr('onclick');
                jQuery(this).attr('onclick', "").addClass('gdpr_validations');

            }

            jQuery(this).off('click').on('click', function(event) {

                event.preventDefault();

                if (validateRequired()) {

                    eval(original);

                }

            });

        });

    }

    validateRequired = function () {

        var err = [];

        for (var i = 0; i < spiffyGDPR.settings.length; i++) {

            if (spiffyGDPR.settings[i].required &&
                !jQuery('.spiffy_gdpr_terms[data-cb-index='+ i +'] input').is(":checked") ) {

                alert(spiffyGDPR.settings[i].required_error);
                return false;

            }

        }

        return true;

    }

    // hide checkbox
    hideGDPRCheckboxes = function (index) {

        jQuery('.spiffy_gdpr_terms[data-cb-index='+ index +']').hide();

    }

    // show checkbox
    showGDPRCheckboxes = function (index) {

        jQuery('.spiffy_gdpr_terms[data-cb-index='+ index +']').show();

    }

    // check if this is an EU country
    isEuropeanUnion =  function (country) {

        var eu_countries = ["Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden", "United Kingdom"]

        if (eu_countries.indexOf(country) >= 0) {

            return true;

        }

        return false;

    }

    // Get Timestamp
    function getTimeStamp() {

        // Create a date object with the current time
        var now = new Date();
        // Create an array with the current month, day and time
        var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
        // Create an array with the current hour, minute and second
        var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
        // Determine AM or PM suffix based on the hour
        var suffix = ( time[0] < 12 ) ? "AM" : "PM";
        var timezone = -(now.getTimezoneOffset() / 60)
        // Convert hour from military time
        time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
        // If hour is 0, set it to 12
        time[0] = time[0] || 12;
        // If seconds and minutes are less than 10, add a zero
        for ( var i = 1; i < 3; i++ ) {
            if ( time[i] < 10 ) {
                time[i] = "0" + time[i];
            }
        }
        // Return the formatted string
        return date.join("/") + " " + time.join(":") + " " + suffix + " UTC" + timezone;

    }

}
