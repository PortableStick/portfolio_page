import $ from 'jquery';
window.$ = window.jQuery = $;
require('bootstrap');
$.noConflict(true);
import toastr from 'toastr';
import masonry from 'masonry-layout';
import bridget from 'jquery-bridget';
bridget('masonry', masonry, $);

const topOffset = 50,
    currentYear = new Date(Date.now()).getFullYear(),
    $mainNav = $('#main-nav'),
    $footer = $('footer'),
    $gridItems = $('.grid-item'),
    $sortButtons = $('.sort-item'),
    $navBar = $('.navbar-nav'),
    $sortBtnsDialog = $('.sort-buttons'),
    $closeSortBtn = $('.close-sort-btn'),
    $openFilterBtn = $('.open-filter-panel');

function setNavbar() {
    var loc = $('li.active a').attr('href');
    if (loc !== '#landing') {
        $mainNav.addClass('inbody');
        $footer.slideDown(250);
    } else {
        $mainNav.removeClass('inbody');
        $footer.slideUp(250);
    }
}

$(document).ready(() => {

    $('.current-year').html(` ${currentYear} `);

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

    $gridItems.on('click', event => {
        if($(event.target).is('a.project-link')) {
            return;
        }
        if($(this).hasClass('big-item')) {
            $gridItems.removeClass('big-item');
        } else {
            $gridItems.removeClass('big-item');
            $(this).addClass('big-item');
        }
        $grid.masonry();
    });

    $closeSortBtn.click(event => {
        $sortBtnsDialog.animate({
            left: '-999px'
        }, 500);
        $openFilterBtn.removeClass('open');
    });

    $openFilterBtn.click(event => {
        if($(event.target).hasClass('open')) {
            $sortBtnsDialog.animate({
                left: '-999px'
            }, 500);
            $(event.target).removeClass('open');
        } else {
            $sortBtnsDialog.animate({
                left: '0'
            }, 500);
            $(event.target).addClass('open');
        }
    })

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

    $navBar.on('click', () => {
        $('#collapse.in').collapse('hide');
    });

    $sortButtons.click(event => {
        const $target = $(event.currentTarget),
         $targetClass = $(event.target).is('a') ? $(event.target).html().toLowerCase() : $(event.target).find('a').html().toLowerCase();
        $gridItems.removeClass('big-item');

         if($target.hasClass('active')) {
            $gridItems.fadeOut(500).promise().done(() => {
                $gridItems.css('display', 'inline-block');
                $grid.masonry();
                $gridItems.fadeIn(500);
                $sortButtons.removeClass('active');
                if(window.innerWidth <= 768) {
                    $sortBtnsDialog.animate({
                        left: '-999px'
                    }, 1000);
                    $openFilterBtn.removeClass('open');
                }
            });
         } else {
            $sortButtons.removeClass('active');
            $gridItems.fadeOut(500).promise().done(() => {
                let $targetGridItems = $gridItems.filter((idx, target) => {
                    return $(target).find('span').hasClass($targetClass);
                }).css('display', 'inline-block');
                $grid.masonry();
                $targetGridItems.fadeIn(500);
                $target.addClass('active');
                if(window.innerWidth <= 768) {
                    $sortBtnsDialog.animate({
                        left: '-999px'
                    }, 1000);
                    $openFilterBtn.removeClass('open');
                }
            });
         }
    });

    setNavbar();
});
