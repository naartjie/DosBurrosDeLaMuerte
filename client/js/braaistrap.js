'use strict';

var minimalAjax = function(url, callback) {
    var xmlHTTP = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('MicrosoftXMLHTTP');
    xmlHTTP.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200)
            callback(this.responseText);
    };
    xmlHTTP.open('GET', url, true);
    xmlHTTP.send();
};
 
minimalAjax('/api', function(dataStr) {
    var data = JSON.parse(dataStr);
    var content = swig.run(mainTemplate, data);

    document.querySelector('#main_content').innerHTML = content;
});

$(window).scroll(function() {
    var scroll = $(this).scrollTop();

    if (scroll < 1) {
        $('.sticky').removeClass('sticky');
        return;
    }
    
    var tag = null;
    var idx = null;

    $('.page-header').each(function(i) {
        if ($(this).hasClass('sticky')) {
            return true;
        }
        var height = $(this).position().top - scroll;

        if (height <= 0) {
            // $('.sticky').removeClass('sticky');
            if (!tag) {
                tag = $(this);
                idx = i;
            } else {
                if (tag.position().top - scroll < height) {
                    tag = $(this);
                    idx = i;
                }
            }
        }
    });

    if (tag) {
        // $('.sticky').removeClass('sticky');
        $('.page-header:eq(' + idx + ')').addClass('sticky');
        $('.wrapper:eq(' + idx + ')').addClass('sticky');
    }

    $('.wrapper').each(function(i) {
        if ( $(this).position().top - scroll > 0 ) {
            $('.page-header:eq(' + i + ')').removeClass('sticky');
            $('.wrapper:eq(' + i + ')').removeClass('sticky');
        }
    });

});
