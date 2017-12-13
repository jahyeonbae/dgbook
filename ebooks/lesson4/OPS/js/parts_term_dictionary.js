function term_dic (tg,x,y){
    
    x = x || 0;
    y = y || 0;
 
    var wrapW = $('.wraps').width();
    var key = $(tg).find('.word').width();
    var keydd = $(tg).find('.descript').outerWidth(true);

    
    $(tg).find('.descript').addClass('animated bounce').css({
        marginLeft:function(){
            return -($(this).innerWidth() / 2) + x;
        }
    })

    if (x != 0) {
        $(tg).find('.descript').addClass('x');
        $('.dicstyle').remove();
        $('<style class="dicstyle" type="text/css">span.descript:after{margin-left:'+ -1*x +'px;}</style>').appendTo('head');

    }

    if(y=='bottom'){
        var h = $(tg).find('.descript').height();
        $(tg).find('.descript').css({
            'top':h/3,
            'height':'144px'
        }) 
        $('.dicstyle').remove();
        $('<style class="dicstyle" type="text/css">strong.dic span.descript:after{margin-left:' + -1 * x + 'px; bottom:none; top:-7px; border-left:2px solid #00A75E;border-top:2px solid #00A75E; border-right:0 none; border-bottom:0 none;}</style>').appendTo('head');
    }

    var status = $(tg).children('.descript').css('display');
    
    $('.dic').children('.descript').hide();

    setTimeout(function(){
        if (status == 'none'){
            $(tg).children('.descript').show();
        }else if (status == 'block'){
            $(tg).children('.descript').hide();
        }
        
    },100)


    

    


}

