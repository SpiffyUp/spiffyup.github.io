/*
 *  Project: Spiffy Infusionsoft One-click Upsells
 *  Description: Enable native one-click upsells on Infusionsoft order forms without advanced actionsets,
 *               legacy features, or integrations
 *  Author: Spiffy, LLC - GoSpiffy.com
 *
 */


;( function( $, window, document, undefined ) {

    "use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variables rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "upsells",
        defaults = {
            buttonText: "Yes, Add to Order for {upsell_cost}!",
            noThanksText: "No thanks! Continue without adding to order",
            noticeText: "<strong>Order Not Yet Complete!</strong> See below to finish your order"
        };

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend( Plugin.prototype, {

        // initialization logic
        init: function() {

            var upsell = this;

            // hide default upsell
            $('#UP_SELLS').hide();

            // Get actions
            this.ca_loop = 0;
            this.ua_loop= 0;
            upsell.actionUpsell();
            upsell.actionCheckout();

            // Bind to order form submit
            $( "form" ).on( "submit.sp_upsell", function(e) {

                // logic to check if upsell is already added and no validation issues
                if( $('.productCell a').length < 1 && $("#submitted").val() != 'true'){

                    // Stop default form submit
                    e.preventDefault();

                    // hide default loader
                    $('#spiffy-loader').hide();

                    /**var submit_intval = setInterval(function(){

                        if($("#submitted").val() == 'true')
                            $("#submitted").trigger('change');

                    }, 250);**/


                    //$('#submitted').on('change', function(){

                        // unbind
                        //$('#submitted').off('change');
                        //clearInterval(submit_intval);

                        // define function vars
                        var upsell_cost = $('#UP_SELLS .upsellPrice').text();

                            upsell.settings['buttonText'] = upsell.settings['buttonText'].replace('{upsell_cost}', upsell_cost);

                        // build modal/upsell page
                        $('body').append('<div id="spiffyUpsell"><div class="row"><div class="column small-12 spUpsellNotice text-center alert-box warning">'+upsell.settings['noticeText']+'</div><div class="column small-12 inner"></div><div class="column small-12 spUpsellButtons text-center"><a href="#" class="sp-acceptupsell button large">'+upsell.settings['buttonText']+'</a><a href="#" class="sp-nothanks">'+upsell.settings['noThanksText']+'</a></div></div></div>');
                        $('#spUpsellContent').appendTo('#spiffyUpsell .inner');

                        // Start video autoplay (if applicable)
                        jQuery('#spiffyUpsell iframe').attr('src', jQuery('#spiffyUpsell iframe').attr('src')+'?autoplay=1');

                        // Do things we want to when order form submitted
                        $('#spUpsellContent, #spiffyUpsell').show(); // show upsell content
                        $('body').addClass('spDisableScroll'); // disabled scrollbar

                        // Bind upsell button actions
                        $('.sp-acceptupsell').on('click', function(){ upsell.spProcessUpsell(); }); // take upsell
                        $('.sp-nothanks').on('click', function(){ upsell.spProcessOrder(); }); // dont take upsell

                    //});

                }

            });

            console.log('Spiffy Upsell Initialized');

        },
        spProcessOrder: function(){

            var upsell = this,
                checkoutAction = upsell.checkoutAction;

            // show as processing
            upsell.showLoader();

            // unbind our stuff
            jQuery("form").off("submit.sp_upsell");

            // reset infusionsoft submit marker
            jQuery("#submitted").val('false');

            // process order
            eval(checkoutAction);
            console.log('Processing Order: ' + checkoutAction);

        },

        spProcessUpsell: function(){

            var upsell = this,
                upsellAction = this.upsellAction;

            // show as processing
            upsell.showLoader();

            // add upsell and then process order
            console.log('Adding Upsell: ' + upsellAction);

            upsell.allowProcessOrder = 1; // queue var to allow order processing

            // wait for all AJAX to be done before processing order (ensure upsell added)
            console.log('Waiting for order form reload');
            jQuery(document).ajaxStop(function(){
                if(upsell.allowProcessOrder){
                    upsell.allowProcessOrder = 0; // set var to avoid weird loops
                    upsell.spProcessOrder();
                }
            });

            eval(upsellAction);


        },

        // add upsell to order
        actionUpsell: function(){

            console.log('checking upsell action');

            if($('.upsellButton').length > 0){

                this.upsellAction = $('.upsellButton').attr('onclick');

            }

            // loop if we dont get what we need
            console.log(this.upsellAction);
            if(this.upsellAction == undefined && this.ua_loop < 6){
                this.ua_loop++; //count so we never are in an endless loop
                setTimeout(this.actionUpsell(), 250);
            }

        },

        // checkout/process order
        actionCheckout: function(){

            console.log('checking checkout action');

            if( $('.checkoutLinks .continueButton').length > 0 ){

                //"javascript:Infusion.Ecomm.OrderForms.placeOrder('false', 'orderForm', true, 0, 0);"
                this.checkoutAction = $('.checkoutLinks .continueButton').attr('href');

            }

            // loop if we dont get what we need
            console.log(this.checkoutAction);
            if(this.checkoutAction == undefined && this.ca_loop < 6){
                this.ca_loop++; //count so we never are in an endless loop
                setTimeout(this.actionCheckout(), 250);
            }

        },

        // show processing loader
        showLoader: function(){

            if(typeof spiffyEnableLoader == 'function'){

                // remove iframes - stops videos from playing
                $('#spUpsellContent iframe').remove();

                // call loader from spiffy core
                spiffyEnableLoader();

            }

        },

        // utility function for triggering upsell popup
        triggerSpiffyUpsell: function(){
            jQuery('form').trigger('submit');
        }
    } );

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function( options ) {
        return this.each( function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" +
                    pluginName, new Plugin( this, options ) );
            }
        } );
    };

} )( jQuery, window, document );
