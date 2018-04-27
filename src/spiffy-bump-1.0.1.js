jQuery(document).ready(function($){

    // Initialize
    if(typeof spiffyBumpInitialized == 'undefined'){

        spiffyInitializeBumpOffer();

    }

    // Get ADD Action
    injectSpiffy('#UP_SELLS', function(){

        var $upsell = $('#upsellContainer');

        // Get add action
        if(spiffyHasUpsell() && !$upsell.hasClass('sp-injected')){

            $upsell.addClass('sp-injected');

            spiffyBumpSettings.upsellAdd = $upsell.find('a.upsellButton').attr('onclick');

            if(typeof spiffyBumpSettings.upsellAdd != 'undefined'){

                console.log('Bump ADD Action: '+spiffyBumpSettings.upsellAdd);

            }

        }

    });

    // Get REMOVE Action
    if(typeof summary_hook == 'function')
        var summary_hook_old = summary_hook;

    summary_hook = function(){

        spiffyUpdateBump();

        // Daisy chain for compatibility
        if(typeof summary_hook_old == 'function'){
            summary_hook_old();
        }

        if(spiffyHasUpsell() && spiffyBumpSettings.upsellRemove != $('#ORDER_FORM_PRODUCT_LIST tr td a:not(.updateCart)').attr('href')){

            spiffyBumpSettings.upsellRemove = $('#ORDER_FORM_PRODUCT_LIST tr td a:not(.updateCart)').attr('href');
            console.log('Bump REMOVE Action: '+spiffyBumpSettings.upsellRemove);

        }

        if(!spiffyBumpSettings.showSummary)
            $('#ORDER_FORM_PRODUCT_LIST tr td a:not(.updateCart)').parents('tr').hide();

    }

});

function spiffyHasUpsell(){

    if(jQuery('#upsellContainer').length > 0 || jQuery('.spiffy-ordersummary').length > 0){
        return true;
    }

    return false;

}

function spiffyInitializeBumpOffer(){

    // Set default setting
    if(typeof spiffyBumpSettings.insertAfter == 'undefined')
        spiffyBumpSettings.insertAfter = ".spiffy-ordersummary";

    var status;

    jQuery('<div class="spiffyBumpContainer" />').insertAfter(spiffyBumpSettings.insertAfter);

    if( spiffyIsUpsellAdded() ){
        var status = 'checked';
    }

    var bumpHtml = '<label for="bumpStatus" class="bumpTitle"><input type="checkbox" id="bumpStatus" name="bumpStatus" value="" '+status+' /> ' + spiffyBumpSettings.title + '</label><div class="bumpDescription">' + spiffyBumpSettings.description + '</div>'

    jQuery('.spiffyBumpContainer').html(bumpHtml);

    jQuery('#bumpStatus').on('change', function(e){

         spiffyUpdateBump();

    });

    spiffyBumpInitialized = true;

}

function spiffyUpdateBump(){

    if(spiffyBumpStatus() != spiffyIsUpsellAdded()){

        if(spiffyBumpStatus()){
            console.log('checked - adding bump - '+spiffyBumpSettings.upsellAdd);
            spiffyAddBump()
        }else{
            console.log('unchecked - removing bump - '+spiffyBumpSettings.upsellRemove);
            spiffyRemoveBump()
        }

    }

}

function spiffyAddBump(){

    eval(spiffyBumpSettings.upsellAdd);

}

function spiffyRemoveBump(){

    eval(spiffyBumpSettings.upsellRemove);

}

function spiffyBumpStatus(){

    return jQuery('#bumpStatus').prop('checked');

}

function spiffyIsUpsellAdded(){

    return ( jQuery('#ORDER_FORM_PRODUCT_LIST tr td a:not(.updateCart)').length > 0 ? true : false );

}
