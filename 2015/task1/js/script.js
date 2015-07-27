jQuery(document).ready(function ($) {

    // function checkTheadWidth() {
    //     var tdWidth = [];
        
    //     $('#tablo tbody tr:first-of-type td').each(function (index, value) {
    //         tdWidth.push($(value).width());
    //     })

    //     $('#tablo thead tr th').each(function (index, value) {
    //         $(value).width(tdWidth[index]);
    //     })

    //     console.log(tdWidth);
    // }

    // checkTheadWidth();


    $(window).scroll(function () {
        var $tabloTitle = $('#tablo-title');

        if ($(window).scrollTop() > 65) {
            $('#tablo-title .normal-title').removeClass('show');
            $('#tablo-title .normal-title').addClass('hide');
            $('#tablo-title .fixed-title').removeClass('hide');
            $('#tablo-title .fixed-title').addClass('show');
        } else {
            $('#tablo-title .normal-title').removeClass('hide');
            $('#tablo-title .normal-title').addClass('show');
            $('#tablo-title .fixed-title').removeClass('show');
            $('#tablo-title .fixed-title').addClass('hide');
        }
    })

     // $(window).resize(checkTheadWidth);
})