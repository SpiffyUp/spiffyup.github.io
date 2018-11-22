if (jQuery) {
    // Minification vars
    var m_href = 'href'

    jQuery(document).ready(function ($) {
        var persistedQueryParam = window.location.search.replace('?', '');
        if (persistedQueryParam && persistedQueryParam.length > 0) {
            $('a[href]').each(function () {
                var elem = $(this);
                var href = elem.attr(m_href);
                if(href.indexOf('#') === -1) {
                    elem.attr(m_href, href + (href.indexOf('?') != -1 ? '&' : '?') + persistedQueryParam);
                }
            });
        }
    });
} else { console.log('Spiffy UTM Utility Requires jQuery!'); }
