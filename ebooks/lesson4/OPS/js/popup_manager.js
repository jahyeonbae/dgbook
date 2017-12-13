function mediaPop() {
    layerAclose();
    $('.zoom_img_wrap.a').delay(500).show(0);
    mediaInit(0);
}

function pop_vclose() {
    AllOff();
    $('.zoom_img_wrap').hide();
}


//common global
function openpop(tg) {
    console.log(tg)
    //$('.popup-text-wrap').hide();
    $(tg).show();
}


function redataPop(des, target) {
    if($('.zoom_img_wrap:not(.a)').length > 0){
        $('.zoom_img_wrap:not(.a)').show();
    } else {
        var ui_block = '<div class="zoom_img_wrap" style="display:block;"></div>';
        //$('.popup-text-wrap').parent().append(ui_block);
        $(target).parents('.wrap').append(ui_block);
    }    
    //$('.popup-text-wrap').show().delay(1000);
    //$('.popup-text-wrap').find('.text span>span').text(des)
    $(target).show().delay(1000);
    $(target).find('.text span>span').text(des)
    //$('.popup-text-content img').addClass('zoomIn');

    if (target){
        //$('.popup-text-content').hide();
        //$('.popup-text-content').show();
    }
    
}

$(function(){

    $('.fpop_close').on('click', function () {
        $(this).parents('.fpop_wrap').hide();
    });

})