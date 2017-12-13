$(function(){

    // Keris 변수 선언
    var ans = 0;

    // 개념확인 정답확인
    $('.fpop_wrap.confirm .btn_result_check').on('click', function () {

        $(this).hide().siblings('.btn_undo').show(); // 다시풀기 버튼 노출

        // assessmentItem 반복
        $('.fpop_wrap.confirm assessmentItem').each(function () {

            // 문제유형별 정답 저장
            var cr = $(this).find('correctResponse').text().replace(/\s/g, '');
            var mcr = cr.split('|');
            var chk_cr = [];


            // 문제 유형 
            if ($(this).data('response-type') == 'fillInTheBlank') { // 텍스트 입력형				

                $(this).find('input[type="text"]').each(function (i) {
                    chk_cr[i] = false;
                    if ($(this).val() == mcr[i]) {
                        chk_cr[i] = true;
                    }
                })
            }

            else if ($(this).data('response-type') == 'singleChoice') { // radio 선택형
                if (mcr.length > 1) {
                    $(this).find('.radio_group').each(function (i) {
                        chk_cr[i] = false;
                        $(this).children('input:checked').each(function () {
                            if ($(this).val() == mcr[i]) {
                                chk_cr[i] = true;
                            }
                        })
                    })
                } else {
                    $(this).find('input:checked').each(function (i) {
                        if ($(this).val() == mcr[i]) {
                            chk_cr[i] = true;
                        } else {
                            chk_cr[i] = false;
                        }
                    })
                }
            }

            else if ($(this).data('response-type') == 'multipleChoice') { // checkbox 선택형

                if (mcr.length > 1) {	// 그룹	

                    $(this).find('.check_group').each(function (i) {

                        chk_sp = mcr[i].split(',');
                        var ok_cr = 0;

                        for (var a = 0; chk_sp.length > a; a++) {
                            $(this).children('input:checked').each(function () {
                                if ($(this).val() == chk_sp[a])
                                    ok_cr += 1;
                            })
                        }

                        if (chk_sp.length == ok_cr) {
                            chk_cr[i] = true;
                        } else {
                            chk_cr[i] = false;
                        }
                    })

                } else {	// 단일

                    chk_sp = cr.split(',');
                    var ok_cr = 0;

                    for (var a = 0; chk_sp.length > a; a++) {
                        $(this).find('input:checked').each(function (i) {
                            if ($(this).val() == chk_sp[a])
                                ok_cr += 1;
                        })
                    }
                    if (chk_sp.length == ok_cr) {
                        chk_cr.push(true);
                    } else {
                        chk_cr.push(false);
                    }
                }

            }

            else if ($(this).data('response-type') == 'True/False') { // O,X 선택형
                if (mcr.length > 1) {
                    $(this).find('.chk_ox').each(function (i) {
                        chk_cr[i] = false;
                        $(this).children('input:checked').each(function () {
                            if ($(this).val() == mcr[i]) {
                                chk_cr[i] = true;
                            }
                        })
                    })
                } else {
                    $(this).find('input:checked').each(function (i) {
                        if ($(this).val() == mcr[i]) {
                            chk_cr[i] = true;
                        } else {
                            chk_cr[i] = false;
                        }
                    })
                }
            }

            else if ($(this).data('response-type') == 'essay') { // 서술형
                var fa = true;
            }

            else if ($(this).data('response-type') == 'etc') { // 매칭형 등 기타
                // 선긋기 등의 답 처리

            }

            if ($.inArray(false, chk_cr) != -1 || chk_cr.length == 0) {
                an_chk = false;
            } else {
                an_chk = true;
            }

            // 정답,오답 체크 마크업
            if (an_chk == true || fa == true) {

                // KERIS 변수
                var isCorrect = null;
                var ans = cr;
                isCorrect = true;

                if (!fa) { // 서술형이 아니면
                    $(this).addClass('co').find('modalFeedback').show();
                } else {
                    $(this).find('modalFeedback').show();
                }

            } else {

                // KERIS 전송
                isCorrect = false;
                var ans = cr;

                //var crok = '&lt;i class="ok"&gt;&lt;/i&gt;'; // 정답 번호 O 마크업
                var crok = '<i class="ok"></i>'; // 정답 번호 O 마크업
                $(this).addClass('cx').find('modalFeedback').show(); // 문항번호 O,x 표시

                // 유형별 답 체크
                if (mcr.length > 1) {

                    $(this).find('.radio_group').each(function (i) {	// radio
                        $(this).children('input').each(function () {
                            if ($(this).val() == mcr[i]) {
                                $(this).next('label').append(crok);
                            }
                        })
                    })

                    $(this).find('.check_group').each(function (i) {		// checkbox

                        chk_sp = mcr[i].split(',');

                        for (var a = 0; chk_sp.length > a; a++) {

                            $(this).find('input').each(function () {
                                if ($(this).val() == chk_sp[a]) {
                                    $(this).next('label').append(crok);
                                }
                            })
                            //console.log(chk_sp[a])
                        }
                    })

                    $(this).find('.chk_ox').each(function (i) {		// checkbox

                        chk_sp = mcr[i].split(',');

                        for (var a = 0; chk_sp.length > a; a++) {

                            $(this).find('input').each(function () {
                                if ($(this).val() == chk_sp[a]) {
                                    $(this).next('label').append(crok);
                                }
                            })
                            //console.log(chk_sp[a])
                        }
                    })

                } else {

                    chk_sp = cr.split(',');

                    for (var a = 0; chk_sp.length > a; a++) {
                        $(this).find('input').each(function (i) {
                            if ($(this).val() == chk_sp[a]) {
                                $(this).next('label').append(crok);
                            }
                        })
                    }

                }

                DTCaliperSensor.fire({
                    correct: isCorrect, // 정답 여부입력 [true, false] 중에서 택일
                    itemObject: this, // 해당 문항 객체
                    value: ans // 실제 정답 데이터 입력 correctResponse에 입력된 값이랑 동일
                });

            }

            an_chk, fa = '';


        }) //-- assessmentItem 반복


    });


    // 다시풀기
    $('.fpop_wrap.confirm .btn_undo').on('click', function () {
        //lineAnswerView('reset');  // 선긋기 사용시 해제
        $('.fpop_wrap.confirm').find('modalFeedback').hide();
        $(this).hide().siblings('.btn_result_check').show();
        $('.fpop_wrap.confirm assessmentItem').each(function () {
            $(this).find('input[type="text"]').val('');
            $(this).removeClass('cx co'); // 문항 정답 체크 해제
            $(this).find('input[type="radio"]').prop('checked', false);
            $(this).find('input[type="checkbox"]').prop('checked', false);
            $(this).find('i.ok').remove(); // 보기 정답 체크 해제
        })
    });

})