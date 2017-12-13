//브라우저 확인
var browser_obj = {

    /*
	
    Description : 브러우져별 버그 발생시 사용함
	
    .browser_Check();
    브라우저 확인 반환값
	
    browser_obj.browser_user ;
    저장된 브라우져
	
    */
    borwoer_Type: ['ipad', 'android'],
    browser_Check: function () {
        $.each(this.os_Type, function (i, e) {
            if (navigator.userAgent.toLowerCase().indexOf(e) != -1) this.browser_user = e;
        });
        if (this.browser_user == undefined) this.browser_user = "webview";
        return this.browser_user;
    }
};


function tooltip(tg, spot) {

    spot = spot || 'top';

    $(tg).parent().find('.msg').show().css({
        position: 'absolute',
        left: function () {
            switch (spot) {
                case 'top':
                    var btnW = $(tg).outerWidth(true) / 2;
                    var tipW = $(this).outerWidth(true) / 2;
                    return -(tipW - btnW) + 'px';
                    break;
                case 'bottom':

                    var btnW = $(tg).outerWidth(true) / 2;
                    var tipW = $(this).outerWidth(true) / 2;
                    return -(tipW - btnW) + 'px';
                    break;

            }
        },
        top: function () {
            switch (spot) {
                case 'top':
                    var btnH = $(tg).outerHeight(true);
                    var tipH = $(this).outerHeight(true) * 2;
                    return -(tipH - btnH) + 'px';
                    break;
                case 'bottom':

                    var btnH = $(tg).outerHeight(true);
                    var tipH = $(this).outerHeight(true) * 2;
                    return (tipH - btnH) + 'px';
                    break;

            }

        }
    }).children('span').addClass(spot).parent('.msg').addClass('animated rubberBand');

}
//툴팁 제거
function tolltip_out(tg) {
    $(tg).parent().find('.msg').hide();

}

function hintpopup(tg, title, msg, answered) {
    if (msg == 'correctResponse' && answered){
        var ansArry = [];
        $(tg).parents('assessmentItem').find(msg).children('span').each(function(i,e){
            console.log(i)
            ansArry.push($(e).text());
        })
        
        $(answered).val(ansArry);

    }else{
        $('.blaind').fadeIn();
        msg = $(tg).parents('assessmentItem').find('modalFeedback').text();
        $('.popup_ex').find('.title span').text(title);
        $('.popup_ex').find('.contents span').text(msg);
        $('.popup_ex').fadeIn();
    }
    
}

function popclose() {
    $('.popup_ex').fadeOut();
    $('.blaind').fadeOut();
}