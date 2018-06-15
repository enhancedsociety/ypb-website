// Global parameters
window.params = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
};


/**
 *
 * Check if element exist on page
 *
 * @param el {string} jQuery object (#popup)
 *
 * @return {bool}
 *
 */
function exist(el) {
    if ($(el).length > 0) {
        return true;
    } else {
        return false;
    }
}


jQuery(document).ready(function ($) {

    wow = new WOW({
        boxClass: 'wow', // default
        animateClass: 'animated', // default
        offset: 100, // default
        mobile: false, // default
        live: true // default
    })
    wow.init();


    // animate platform
    if ($(window).width() <= 576) {
        $('.build-images').addClass('intro-animation');
        setTimeout(function () {
            $('.build-images').removeClass('intro-animation').addClass('stable-animation');
        }, 9000);
    } else {
        setTimeout(function () {
            $('.build-images').addClass('intro-animation');
        }, 5000);
    
        setTimeout(function () {
            $('.build-images').removeClass('intro-animation').addClass('stable-animation');
        }, 11000);
    }

    $(".custom-scroll").mCustomScrollbar({
        theme: "dark-2"
    });

    /*---------------------------
                                  ADD CLASS ON SCROLL
    ---------------------------*/
    $(function () {
        var $document = $(document),
            $element = $('.toggle-menu'),
            $element2 = $('header'),
            className = 'hasScrolled';

        $document.scroll(function () {
            $element.toggleClass(className, $document.scrollTop() >= 1);
            $element2.toggleClass(className, $document.scrollTop() >= 1);
        });
    });


    /*---------------------------
                                 Info popup
    ---------------------------*/
    $('*[data-popup]').click(function () {
        var target = $(this).data('popup');
        $('.info-popup').removeClass('active');
        $(target).addClass('active');
    });

    $('.info-popup__close').click(function () {
        var popup = $(this).closest('.info-popup');
        popup.removeClass('active');
        // if inside faq
        if ($(this).closest('.faq__item').length > 0) {
            $('.faq__item').removeClass('active');
        }
    });

    // custom
    $('.faq__item').click(function () {
        var text = $(this).find('.faq__item__text');
        $('.faq__item').not(this).find('.faq__item__text').slideUp();
        text.slideToggle();
    });

    if (!window.params.isMobile) {
        $(".feature").addClass('desktop');
        $(".feature").hover(
            function () {
                var target = $(this).data('popup');
                $('.info-popup').removeClass('active');
                $(target).addClass('active');
            },
            function () {
                $('.info-popup').removeClass('active');
            }
        );
    }

    // prevent bubbling
    $(".info-popup").click(function (event) {
        event.stopPropagation();
    });

    /*---------------------------
                                PAGE ANCHORS
    ---------------------------*/
    $('.page-menu a, .anchor').click(function () {
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 50
        }, 800);
        return false;
    });

    /*---------------------------
                                  MENU TOGGLE
    ---------------------------*/
    $('.js-toggle-menu').on('click', function (event) {
        event.preventDefault();
        $(this).toggleClass('is-active');
        $(this).siblings('header').toggleClass('open');
    });



    /*---------------------------
                                  Fancybox
    ---------------------------*/
    $('.fancybox').fancybox({

    });


    /**
     *
     * Open popup
     *
     * @param popup {String} jQuery object (#popup)
     *
     * @return n/a
     *
     */
    function openPopup(popup) {
        $.fancybox.open([{
            src: popup,
            type: 'inline',
            opts: {}
        }], {
            loop: false
        });
    }



    /*---------------------------
                                  Form submit
    ---------------------------*/
    $('.ajax-form').on('submit', function (event) {
        event.preventDefault();
        var data = new FormData(this);
        $(this).find('button').prop('disabled', true);
        $.ajax({
            url: theme.url + '/forms.php',
            type: 'POST',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function (result) {
                if (result.status == 'ok') {
                    openPopup('#modal-popup-ok')
                } else {
                    openPopup('#modal-popup-error')
                }
            },
            error: function (result) {
                openPopup('#modal-popup-error');
            }
        }).always(function () {
            $('form').each(function (index, el) {
                $(this)[0].reset();
                $(this).find('button').prop('disabled', false);
            });
        });
    });


    // tabs
    $('ul.tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.tabs li').removeClass('current');
		$('.tab-content').slideUp();

		$(this).addClass('current');
		$("#"+tab_id).slideDown();
	})


}); // end file