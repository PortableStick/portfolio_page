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

function setNavbar(loc) {
    if (loc !== '#landing') {
        $mainNav.addClass('inbody');
        $footer.slideDown(250);
    } else {
        $mainNav.removeClass('inbody');
        $footer.slideUp(250);
    }
}

function checkLocation() {
    const loc = $('li.active a').attr('href');
    setNavbar(loc);
    if(loc !== '#portfolio') {
        closeFilter();
    }
}

function closeFilter() {
    $sortBtnsDialog.animate({
        left: '-999px'
    }, 500);
    $openFilterBtn.removeClass('open');
}

function openFilter() {
    $sortBtnsDialog.animate({
        left: '0'
    }, 500);
    $openFilterBtn.addClass('open');
}

$(document).ready(() => {

    $('.current-year').html(` ${currentYear} `);

    $('body').scrollspy({
        target: '#main-nav',
        offset: topOffset
    }).on('activate.bs.scrollspy', checkLocation);

    let $grid = $('.grid').masonry({
          itemSelector: '.grid-item',
          columnWidth: '.grid-sizer',
          gutter: 15,
          percentPosition: false,
          originTop: true,
          fitWidth: true,
          transitionDuration: '0.2s'
        });

    $gridItems.on('click', function(event) {
        if($(event.target).is('a.project-link') || $(event.target).is('a.github-link')) {
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

    $closeSortBtn.click(closeFilter);

    $openFilterBtn.click(event => {
        if($('li.active a').attr('href') !== "#portfolio") {
            window.location.hash = '#portfolio';
        }
        if($openFilterBtn.hasClass('open')) {
            closeFilter();
        } else {
            openFilter();
        }
    })

    $("#email-form").on('submit', event => {
        event.preventDefault();
        $.post('https://api.gregoftheweb.com/sendmail',$(event.target).serialize())
            .done(result => {
                toastr.success("Message sent!");
                $('#email, #message, #name, #send-button').prop('disabled', true);
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

         if($target.hasClass('active')) {
            $gridItems.fadeOut(500).promise().done(() => {
                $gridItems.css('display', 'inline-block').removeClass('big-item');
                $grid.masonry();
                $gridItems.fadeIn(500);
                $sortButtons.removeClass('active');
                if(window.innerWidth <= 768) {
                    closeFilter();
                }
            });
         } else {
            $sortButtons.removeClass('active');
            $gridItems.fadeOut(500).promise().done(() => {
                let $targetGridItems = $gridItems.filter((idx, target) => {
                    return $(target).find('span').hasClass($targetClass);
                }).css('display', 'inline-block').removeClass('big-item');
                $grid.masonry();
                $targetGridItems.fadeIn(500);
                $target.addClass('active');
                if(window.innerWidth <= 768) {
                    closeFilter();
                }
            });
         }
    });

    setNavbar($('li.active a').attr('href'));
});
