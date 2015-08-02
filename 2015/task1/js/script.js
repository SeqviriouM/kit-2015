jQuery(document).ready(function ($) {

    function checkTheadWidth() {
        var tdWidth = [];
        
        $('#tablo tbody tr:first-of-type td').each(function (index, item) {
            tdWidth.push($(item).width());
        });

        $('#tablo thead tr.tablo-title__fixed th').each(function (index, item) {
            $(item).width(tdWidth[index]);
            $(item).css('min-width',tdWidth[index]);
        });
    }

    function columnSelection () {

    }

    checkTheadWidth();


    $(window).scroll(function () {
        var $normalTitle = $('.tablo-title__normal'),
            $fixedTitle = $('.tablo-title__fixed');

        if ($(window).scrollTop() > 65) {
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
        .on('click', 'a', function (e) {
            debugger;
            var targetRow = $(this).parent().parent().children();

            $('.popup__content tr td:nth-of-type(2)').each(function (index, value) {
                var targetContent = $(targetRow[index]).html();
                $(this).html(targetContent);
            })
        })
})