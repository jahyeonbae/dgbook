
$(function(){
    // Embed 영상 재생
    $('.cbtn-play').on('click', function () {
        var vdo = $('#embed_vdo');
        vdo.get(0).play();
        $(this).hide();
        //vdo.find('.touch-pause').show();
    });

    // Embed 영상 일시정지 
    $('#embed_vdo').on('click', function(){
        var vdo = $('#embed_vdo');
        vdo.get(0).pause();
        $('.cbtn-play').show();
    });
})