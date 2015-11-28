(function () {
    "use strict";

    var topOffset = 50;

    $('body').scrollspy({
        target: '#main-nav',
        offset: topOffset
    }).on('activate.bs.scrollspy', function () {
        var loc = $('#main-nav').find('li.active a').attr('href');
        if (loc !== '#landing') {
            $('#main-nav').addClass('inbody');
        } else {
            $('#main-nav').removeClass('inbody');
        }
    });
    (function () {
        var loc = $('#main-nav').find('li.active a').attr('href');
        if (loc !== '#landing') {
            $('#main-nav').addClass('inbody');
        } else {
            $('#main-nav').removeClass('inbody');
        }
    }());

    $('.carousel').carousel({
        pause: "false"
    });
}());


