import $ from 'jquery';
window.$ = window.jQuery = $;
require('bootstrap');
$.noConflict(true);
import toastr from 'toastr';
import masonry from 'masonry-layout';
import bridget from 'jquery-bridget';
bridget('masonry', masonry, $);

const topOffset = 50;

function setNavbar() {
    console.log("Checking for active link");
    var loc = $('li.active a').attr('href');
    console.log("loc is ", loc);
    if (loc !== '#landing') {
        $('#main-nav').addClass('inbody');
    } else {
        $('#main-nav').removeClass('inbody');
    }
}

$(document).ready(function() {

    $('body').scrollspy({
        target: '#main-nav',
        offset: topOffset
    }).on('activate.bs.scrollspy', setNavbar);

    let $grid = $('.grid').masonry({
          itemSelector: '.grid-item',
          columnWidth: '.grid-sizer',
          gutter: '.gutter-sizer',
          percentPosition: false,
          originTop: false,
          fitWidth: true,
          transitionDuration: '0.2s'
        });

    $('.grid-item').on('click', function(event) {
        if($(event.target).is('a.project-link')) {
            return;
        }
        if($(this).hasClass('big-item')) {
            $('.grid-item').removeClass('big-item');
        } else {
            $('.grid-item').removeClass('big-item');
            $(this).addClass('big-item');
        }
        $grid.masonry();
    });

    $("#email-form").on('submit', event => {
        event.preventDefault();
        $.post('http://localhost:9000/sendmail',$(event.target).serialize())
            .done(result => {
                toastr.success("Message sent!");
            }).catch(error => {
                toastr.error("Message could not be sent!");
                console.error(error);
            });
    });

    $('.navbar-nav').on('click', () => {
        $('#collapse.in').collapse('hide');
    });

    setNavbar();
});
