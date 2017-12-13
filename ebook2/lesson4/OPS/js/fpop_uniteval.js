$(function () {

    // 작업을 위한 임시 코드
    //$('.scroll_wrap').scrollTop(10000000); // 늘어난 길이 하단으로 이동

    // 대단원평가 팝업
    $('.btn_fpop').on('click', function () {
        $('.fpop_wrap').show();
    });
    $('.fpop_close').on('click', function () {
        $(this).parents('.fpop_wrap').hide();
    });


    // Keris 변수 선언
    var ans = 0;

    // 대단원평가 정답확인
    $('.fpop_wrap.unit .btn_result_check').on('click', function () {
        
        //lineAnswerView(); // 선긋기 정답

        var fp = $('.fpop_wrap.unit');
        var qtot = fp.find('assessmentItem').not('[data-response-type="essay"]').length; // 총 문제 갯수
        var fa_tot = fp.find('assessmentItem[data-response-type="essay"]').length; // 서술형 문제 갯수
        var cr_tot = 0; // 정답 갯수 변수

        $('.fpop_wrap.unit assessmentItem').each(function () {
            var cr = $(this).find('correctResponse').text().replace(/\s/g, '');  // 해당 문항의 정답값
            var cr1 = cr.replace(/\[/g, "");
            var cr2 = cr1.replace(/\]/g, "");
            cr_arr = cr2.split(",");
            chkArr = [];

            // 문제유형 
            if ($(this).data('response-type') == 'fillInTheBlank') { // 텍스트 입력형
                $(this).find('input[type="text"]').each(function () {
                    chkArr.push($(this).val().replace(/\s/g, ''));
                });

                var compArr = [];
                var ma;
                $.each(cr_arr, function (i, e) {
                    $.each(chkArr, function (j, f) {
                        if (e == f) {
                            compArr.push(e);
                        }
                    })
                })
                compArr.length == cr_arr.length ? ma = true : ma = false;
            }
            else if ($(this).data('response-type') == 'singleChoice') { // 단일 선택형
                var an = $(this).find('input[type="radio"]:checked').val();
            }
            else if ($(this).data('response-type') == 'multipleChoice') { // 다중 선택형

                $(this).find('input[type="checkbox"]:checked').each(function () {
                    chkArr.push($(this).val());
                });
                cr_str = cr_arr.toString();
                chk_str = chkArr.toString();
                var ma;
                if (cr_str == chk_str)
                    ma = true;
                else
                    ma = false;
            }
            else if ($(this).data('response-type') == 'True/False') { // O,X 선택형
                var an = $(this).find('input[type="radio"]:checked').val();
            }
            else if ($(this).data('response-type') == 'essay') { // 서술형
                var fa = true;
            }
            else if ($(this).data('response-type') == 'etc') { // 매칭형 등 기타
                // 선긋기 등의 답 처리
                //ma.push(lineCheck);
            }

            if (cr == an || fa == true || ma == true) {  // 정답이거나 유형이 서술형이면
                // KERIS 변수
                var isCorrect = null;
                var ans = cr;
                isCorrect = true;

                if (!fa) { // 서술형이 아니면
                    $(this).addClass('co').find('modalFeedback').show();
                    cr_tot += 1; // 정답갯수 더하기
                } else {
                    $(this).find('modalFeedback').show();
                }
            } else {
                // KERIS 변수
                isCorrect = false;
                var ans = cr;
                console.log(cr);

                //var crok = '&lt;i class="ok"&gt;&lt;/i&gt;'; // 정답 번호 O 마크업
                var crok = '<i class="ok"></i>'; // 정답 번호 O 마크업
                $(this).addClass('cx').find('modalFeedback').show(); // 문항번호 O,x 표시               

                $(this).find('input[type="radio"]').each(function () {
                    if ($(this).val() == cr)
                        $(this).next('label').append(crok);
                })

                $(this).find('input[type="checkbox"]').each(function () {
                    if ($.inArray($(this).val(), cr_arr) != -1) {
                        $(this).next('label').append(crok);
                    };
                });
            }

            DTCaliperSensor.fire({
                correct: isCorrect, // 정답 여부입력 [true, false] 중에서 택일 
                itemObject: this, // 해당 문항 객체 
                value: ans // 실제 정답 데이터 입력 correctResponse에 입력된 값이랑 동일
            });

            cr, an, fa = ''; // 변수 초기화
        });

        // 채점 결과 출력
        $('.scoring').show().find('.btn_undo').show();
        result_text = "서술형 <i>" + fa_tot + "</i>문제를 제외한 <em>총 <span><i>" + qtot + "</i>개의 문제</span> 중 <span><i>" + cr_tot + "</i>문제</span>를 맞혔습니다.</em>";

        $('.result_score').empty().append(result_text);
        // $('.result_score i:eq(0)').text(fa_tot);
        // $('.result_score i:eq(1)').text(qtot);
        // $('.result_score i:eq(2)').text(cr_tot);
        $('.scroll_wrap').scrollTop(1000000); // 늘어난 길이 하단으로 이동

    });


    // 다시풀기
    $('.fpop_wrap.unit .btn_undo').on('click', function () {
        //lineAnswerView('reset');  // 선긋기 사용시 해제
        
        $('.scoring').hide();
        $('.fpop_wrap.unit').find('modalFeedback').hide();
        //$(this).hide().siblings('.btn_result_check').show();
        $('.fpop_wrap.unit assessmentItem').each(function () {
            $(this).find('input[type="text"]').val('');
            $(this).removeClass('cx co'); // 문항 정답 체크 해제
            $(this).find('input[type="radio"]').prop('checked', false);
            $(this).find('input[type="checkbox"]').prop('checked', false);
            $(this).find('i.ok').remove(); // 보기 정답 체크 해제
        })
    });

})