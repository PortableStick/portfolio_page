import $ from 'jquery';
window.$ = window.jQuery = $;
require('bootstrap');
$.noConflict(true);
import toastr from 'toastr';
import masonry from 'masonry-layout';
import bridget from 'jquery-bridget';
bridget('masonry', masonry, $);

$(document).ready(function() {
    'use strict';

    var topOffset = 50;

    $('body').scrollspy({
        target: '#main-nav',
        offset: topOffset
    }).on('activate.bs.scrollspy', function() {
        var loc = $('#main-nav').find('li.active a').attr('href');
        if (loc !== '#landing') {
            $('#main-nav').addClass('inbody');
        } else {
            $('#main-nav').removeClass('inbody');
        }
    });
    ( function() {
        var loc = $('#main-nav').find('li.active a').attr('href');
        if (loc !== '#landing') {
            $('#main-nav').addClass('inbody');
        } else {
            $('#main-nav').removeClass('inbody');
        }
    }());

    $("#email-form").on('submit', event => {
        event.preventDefault();
        $.post('http://localhost:9000/sendmail',$(event.target).serialize())
            .done(result => {
                console.log("Sent")
            }).catch(error => {
                console.error(error);
            });
    });
});
