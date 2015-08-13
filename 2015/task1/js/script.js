jQuery(document).ready(function ($) {
    var $normalTitle = $('.tablo__title_normal'),
        $fixedTitle = $('.tablo__title_fixed'),
        $overlay = $('.overlay');

    /* Задание ширины колонок для заголовка таблицы в случае изменеии ширины экрана */
    function checkTheadWidth() {
        var tdWidth = [];
        
        $('.tablo tbody tr:first-of-type td').each(function (index, item) {
            tdWidth.push($(item).width());
        });

        $('.tablo thead tr.tablo__title_fixed th').each(function (index, item) {
            $(item).width(tdWidth[index]);
            $(item).css('min-width',tdWidth[index]);
        });
    }

    checkTheadWidth();

    /* Прилипание заголовка таблицы к верхней части экрана */
    $(window).scroll(function () {
        if ($(window).scrollTop() > 117) {
            $normalTitle.removeClass('show').addClass('hide');
            $fixedTitle.removeClass('hide').addClass('show');
        } else {
            $normalTitle.removeClass('hide').addClass('show');
            $fixedTitle.removeClass('show').addClass('hide');
        }
    })
    .resize(checkTheadWidth);

    $('.tablo')
        /* 
        Выделение колонок по наведению

        Метод выделения колонок по наведению без использования js описан в css файле
        */ 
        .on('mouseover mouseleave', 'td', function (e) {
            if (e.type === 'mouseover') {
                $('.tablo tbody tr td:nth-of-type(' + ($(this).index() + 1) + ')').addClass('hover');
            } else {
                $('.tablo tbody tr td:nth-of-type(' + ($(this).index() + 1) + ')').removeClass('hover');
            }
        })

        /*  
        Активация popup

        Можно было реализовать popup и без использования js: каждой ссылки задать 
        атрибут href="#description<номер строки>", а кнопке close проставить href="#". Но тогда бы
        пришлось для каждой строчки вставлять свой popup. Что довольно накладно, если учесть что 
        в таблице может быть пару сотен строк. К тому же popup обычно предполагает закрытие по нажатию
        вне зоны или клавишт esc, а не только на крестик. 
        */
        .on('click', 'td', function (e) {
            var targetRow = $(this).parent().children();

            $('.popup__content tr td:nth-of-type(2)').each(function (index, item) {
                var targetContent = $(targetRow[index]).html();
                $(this).html(targetContent);
            })
            $overlay.addClass('show');
        });

    /* Закрытие popup */
    $('body')
        .on('click', '.overlay, .popup__close', function (e) {
            $overlay.removeClass('show');
        })
        .on('click', '.popup', function (e) {
            return false;
        })
    $(document).on('keyup', function (e) {
        if (e.keyCode == 27) {
            $('.overlay').removeClass('show');
        }
    });
})