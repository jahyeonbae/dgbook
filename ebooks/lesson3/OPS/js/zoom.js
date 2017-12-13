function zoomView(tg, x, y) {
    
    if ($(tg).children('i').is('.fa-search-plus')) {
        $(tg).children('i').removeClass('fa-search-plus').addClass('fa-search-minus');
    } else if (!$(tg).children('button').is('.fa-search-plus')){
        $(tg).children('i').removeClass('fa-search-minus').addClass('fa-search-plus');
    }

    switch (x) {
        case "left":
            $(tg).parent().children('img').css('left', '0');
            break;
        case "right":
            $(tg).parent().children('img').css('right', '0');
            break;

    }

    switch (y) {
        case "top":
            $(tg).parent().children('img').css('top', '0');
            break;
        case "bottom":
            $(tg).parent().children('img').css('bottom', '0');
            break;

    }


    $(tg).parent().toggleClass('zoomup');

    $(tg).parent().children('img')
        .css({
            positison: "absolute",
            zindex: 1000,
            boxShadow: '3px 3px 10px #666',
            borderRadius: '10px'
        }).toggle(300);
    }