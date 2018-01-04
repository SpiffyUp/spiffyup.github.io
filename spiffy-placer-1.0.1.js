/*
 *  Project: Spiffy Infusionsoft Placer Plugin
 *  Description: Adds class-based
 *
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
    var pluginName = "placer",
        defaults = {};

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
        this.active = false;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend( Plugin.prototype, {

        // initialization logic
        init: function() {

            var placer = this;

            if( placer.active ){
                return;
            }

            placer.insertDropzones(); // Adds zones

            placer.moveDropzoneElements();

            placer.active = true;

        },

        insertDropzones: function() {

            var dropzones = ['ORDER_FORM_BILLING_ENTRY', 'ORDER_FORM_SHIPPING_ENTRY', 'SpiffyShippingPreview', 'PAYMENT_SELECTION', 'QUANTITY_BUNDLES', 'PAYMENT_PLANS', 'SHIPPING_OPTIONS', 'ORDER_FORM_SUMMARY', 'UP_SELLS', 'CHECKOUT_LINKS'];
            var arrayLength = dropzones.length;

            for (var i = 0; i < arrayLength; i++) {

                if(dropzones[i] != 'ORDER_FORM_SUMMARY'){

                    $('<div class="dz dropzone__'+i+' dropzone__'+dropzones[i]+'" data-zone="'+i+'" />').insertBefore('#'+dropzones[i]);

                }else{

                    $('<div class="dz dropzone__'+i+' dropzone__'+dropzones[i]+'" data-zone="'+i+'" />').insertAfter('#'+dropzones[i-1]);

                }

            }

            // Add last dropzone
            $('<div class="dz dropzone__'+arrayLength+'" data-zone="'+arrayLength+'" />').insertAfter('.sp-security');

        },

        moveDropzoneElements: function(){

            $('[data-dropzone]').each(function(){

                var $this = $(this),
                    targetZone = $this.attr('data-dropzone');

                $this.appendTo('.dropzone__'+targetZone);

            });

        },

        setDropzoneStyles: function(){

            $('.dz').css({
                "margin-bottom":"15px"
            });

            $('.dropzone__3, .dropzone__0').css({
                "margin-top":"10px"
            });

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

// Initialize
jQuery(window).load(function(){

    // Initialize placer and set any settings - these show the defaults
    jQuery(document).placer();

});
