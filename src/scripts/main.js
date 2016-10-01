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
    var loc = $('li.active a').attr('href');
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
          gutter: 15,
          percentPosition: false,
          originTop: true,
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

    $('.sort-buttons .btn').click((event) => {
        const $target = $(event.target),
         $targetClass = $(event.target).html().toLowerCase(),
         $gridItems = $('.grid-item');

        $gridItems.removeClass('big-item');

         if($target.hasClass('active')) {
            $gridItems.fadeOut(500).promise().done(() => {
                $gridItems.css('display', 'inline-block');
                $grid.masonry();
                $gridItems.fadeIn(500);
                $('.sort-buttons .btn').removeClass('active');
            });
         } else {
            $gridItems.fadeOut(500).promise().done(() => {
                let $targetGridItems = $gridItems.filter((idx, target) => {
                    return $(target).find('span').hasClass($targetClass);
                }).css('display', 'inline-block');
                $grid.masonry();
                $targetGridItems.fadeIn(500);
                $target.addClass('active');
            });
         }
    });

    setNavbar();
});
