$(function(){

    // 자음퀴즈 시작
    $('.jq_input').on('focus', function () {
        $(this).css('background', '#fff');
    })
    $('.jq_input').on('blur', function () {
        if (!$(this).val()) {
            $(this).css('background', 'transparent');
        }
    })
    // 자음퀴즈 정답확인
    $('.jaum_quiz .btn_ex').on('click', function () {
        $('.jq_input').each(function () {
            var a_val = $(this).val().replace(/\s/g, '');
            //var a_val = $(this).val();
            var cr_val = $(this).next('input[type="hidden"]').val().replace(/\s/g, '');
            //var cr_val = $(this).next('input[type="hidden"]').val();
            if (a_val != cr_val) {
                if (a_val != '')
                    $(this).css('color', 'red');
            }
        }).attr("disabled", true);
    })
    // 자음퀴즈 다시풀기
    $('.jaum_quiz .btn_undo').on('click', function () {
        $('.jq_input').val('').css({ 'background': 'transparent', 'color': '#000' });
        $('.jq_input').removeAttr("disabled");
        //  $('.jaum_quiz .btn_ex').show();
    })

    
})

// 페이지 복귀시 답이 있으면 정답확인 이벤트
$(window).load(function(){
    setTimeout(function(){        
        if($('.jq_input').val()) {
            //$('.jaum_quiz .btn_ex').trigger('click');
        }
    },1000);
});