/*!
writer:doongi
descript:예시답안,정답 아이콘및 팝업 출력
file:parts_info_btn.js
*/

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


function addEntry(agr, tg, toggle) {

    if (agr == "show") {
        $(tg).show();
    } else if (agr == 'hide') {
        $(tg).hide();
    } else if (agr == 'toggle') {
        $(tg).toggle();
    }

    var a = $(toggle).hide().next().show() || 'hi~'

    var checks = '.btn_ex' || '.chk'
    if (tg == checks) {
        $(tg).parents('assessmentItem').find('.btn_undo').hide()
    }

}

function reshow(tg) {
    $(tg).prev().show()
}


function tooltip(tg, spot,x) {
    spot = spot || 'top';
    x = x || 0;

    if ($(tg).parent().find('.msg').css('display') == 'block') {
        tolltip_out(tg);
    }else{
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
                        return -(tipW - btnW)+x  + 'px';
                        break;
                }
            },
            
            top: function () {
                switch (spot) {
                    case 'top':
                        return 'auto';
                        break;
                    case 'bottom':
                        var btnH = $(tg).outerHeight() + 5;
                        return btnH + 'px';
                        break;
                }
            },
            bottom: function () {
                switch (spot) {
                    case 'top':
                        var btnH = $(tg).outerHeight() + 5;
                        return btnH;
                        break;
                    case 'bottom':

                        return 'auto';
                        break; 
                }
            }
        }).children('span').addClass(spot).parent('.msg').addClass('animated rubberBand');

    }

   
   
    
}
//툴팁 제거
function tolltip_out(tg) {
    $(tg).parent().find('.msg').hide();

}

function hintpopup(tg, title, msg, type, spot, hei) {
    
    if(type == "table"){
        msg = $(tg).parents('assessmentItem').find('modalFeedback').html();
        $('.popup_ex').find('.contents span').hide();
        $('.popup_ex').find('.contents div').removeClass().addClass('tables');
        $('.popup_ex').find('.contents div').html(msg).show();
    }else if(type == "custom"){
        msg = $(tg).parents('assessmentItem').find('modalFeedback').html();
        $('.popup_ex').find('.contents span').hide();
        $('.popup_ex').find('.contents div').removeClass().addClass('custom');
        $('.popup_ex').find('.contents div').html(msg).show();
    }else{
       
        msg = $(tg).parents('assessmentItem').find('modalFeedback').html();
        console.log(msg)
        $('.popup_ex').find('.contents div').removeClass()
        $('.popup_ex').find('.contents div').html(msg).show();
    }
    $('.popup_ex').find('.title span').text(title);

    if (!spot){
        $('.popup_ex').css('top', $(tg).offset().top);
    } else if (spot){
        $('.popup_ex').css('top', spot);
    }

    if(hei) $('.popup_ex .contents').height(hei);

    $('.popup_ex').fadeIn();
    
}


function popclose() {
    $('.popup_ex').fadeOut();
    $('.blaind').fadeOut();
}

// 활동 길잡이

function showContent(tt, tg) {
    $(tt).children('i').toggle();
    $(tg).toggle();
}

$(function(){

    // 답 입력 버튼 노출
    $('.input_answer').on('keyup', function () {
        var chkStr = $(this).val().length; // 입력 확인
        
        if (chkStr > 0) { // 입력값이 있으면
            $(this).parents('assessmentItem').find('.btn_undo').hide();
            $(this).parents('assessmentItem').find('.btn_ex').show();
        }else{
            $(this).parents('assessmentItem').find('.btn_ex, .btn_undo').hide();
        }
    });

    $('.btn_chk').on('click',function(){
        $(this).next('.btn_undo').show();
        $(this).hide();
    })

    $('.btn_undo.chk').on('click',function(){
        $(this).hide();
        $(this).prev('.btn_chk').show();
    })


    // 팝업활성화
    $('.btn_ex').on('click', function () {
        
        if ($(this).is('.answer')){
            $('.popup_ex').addClass('answer');
        } else if (!$(this).is('.answer')){
            $('.popup_ex').removeClass('answer');
        }

        var feedback = $(this).parents('assessmentItem').find('modalFeedback').text();

        $('.popup_ex').show().find('.contents span').text(feedback);
        $(this).hide().siblings('.btn_undo').show();


    });

    $('.checkin input').on('click', function () {
        if ($(this).is(':checked')) {
            $(this).parents('itemBody').find('.btn_ex').show()
        }
    })

    $('.btn_undo').on('click', function () {
        $(this).parents('assessmentItem').find('.input_answer').val('').focus();
            
            if ($('.popup_ex').show()){
                $('.popup_ex').hide();
            }

        $(this).hide();
    });

    // 내용정리 팝업
    // $('.btn_content').on('click', function () {
    //     $('.popup-text-wrap').show();
    // });
    
    $('.popup_close').on('click', function () {
        $(this).parents('.popup-text-wrap').hide();
        $('.zoom_img_wrap').hide();
    });

    // // 이 단원을 배우고 나면 - 드랍다운
    // $('.droptitle01').on('click', function () {
    //     if ($('.dropdown01').css('display') == 'none') {
    //         $('.dropdown01').show();
    //         $(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
    //     } else {
    //         $('.dropdown01').hide();
    //         $(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
    //     }
    // });

});

function radio_reset(rid) {
    // 라디오 선택 리셋
    $(rid).find('.radio_chk , .radio_chk.circle').prop('checked', false);
    
}