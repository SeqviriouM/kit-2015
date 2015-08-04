jQuery(document).ready(function ($) {

    function checkTheadWidth() {
        var tdWidth = [];
        
        $('#tablo tbody tr:first-of-type td').each(function (index, item) {
            tdWidth.push($(item).width());
        });

        $('#tablo thead tr.tablo__title_fixed th').each(function (index, item) {
            $(item).width(tdWidth[index]);
            $(item).css('min-width',tdWidth[index]);
        });
    }

    checkTheadWidth();


    $(window).scroll(function () {
        var $normalTitle = $('.tablo__title_normal'),
            $fixedTitle = $('.tablo__title_fixed');

        if ($(window).scrollTop() > 117) {
            $normalTitle.removeClass('show').addClass('hide');
            $fixedTitle.removeClass('hide').addClass('show');
        } else {
            $normalTitle.removeClass('hide').addClass('show');
            $fixedTitle.removeClass('show').addClass('hide');
        }
    })
    .resize(checkTheadWidth);

    $('#tablo')
        .on('mouseover mouseleave', 'td', function (e) {
            if (e.type === 'mouseover') {
                $('#tablo tbody tr td:nth-of-type(' + ($(this).index() + 1) + ')').addClass('hover');
            } else {
                $('#tablo tbody tr td:nth-of-type(' + ($(this).index() + 1) + ')').removeClass('hover');
            }
        })
        .on('click', 'td', function (e) {
            var targetRow = $(this).parent().children();

            $('.popup__content tr td:nth-of-type(2)').each(function (index, value) {
                var targetContent = $(targetRow[index]).html();
                $(this).html(targetContent);
            })
            $('.overlay').addClass('show');
        });

        $('body')
            .on('click', '.overlay, popup__close', function (e) {
                $('.overlay').removeClass('show');
            })
        $(document).on('keyup', function (e) {
            if (e.keyCode == 27) {
                $('.overlay').removeClass('show');
            }
        })
})