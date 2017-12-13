$(function () {

    // 작업을 위한 임시 코드
    //$('.scroll_wrap').scrollTop(10000000); // 늘어난 길이 하단으로 이동

    // 개념확인 팝업
    $('.btn_fpop').on('click', function () {
        $('.fpop_wrap').show();
    });
    $('.fpop_close').on('click', function () {
        $(this).parents('.fpop_wrap').hide();
    });

    // Keris 변수 선언
    var ans = 0;

    // 개념확인 정답확인
    $('.fpop_wrap.confirm .btn_result_check').on('click', function () {    

        $(this).hide().siblings('.btn_undo').show(); // 다시풀기 버튼 노출

        // assessmentItem 반복
        $('.fpop_wrap.confirm assessmentItem').each(function () {

            // 문제유형별 정답 저장
            var cr = $(this).find('correctResponse').text().replace(/\s/g, '');
            //var cr = $(this).find('correctResponse').text();
            var mcr = cr.split('|');
            var chk_cr = [];

            
            // 문제 유형 
            if ($(this).data('response-type') == 'fillInTheBlank') { // 텍스트 입력형				

                // input이 그룹이면 입력 순서 상관없이 정답확인
                if($(this).find('.text_group').length > 0) {

                    $(this).find('.text_group').each(function (i){
                        input_sp = mcr[i].split(',');
                        var ok_cr = 0;

                        for (var a = 0; input_sp.length > a; a++) {
                            $(this).find('input[type="text"]').each(function(){
                                an_str = $(this).val().replace(/\s/g, '');  // 띄어쓰기 체크 안함
                                //an_str = $(this).val();   // 띄어쓰기 체크함
                                if (an_str == input_sp[a])
                                    ok_cr += 1;
                            })
                        }

                        if (input_sp.length == ok_cr) {
                            chk_cr[i] = true;
                        } else {
                            chk_cr[i] = false;
                        }
                    });

                    // var an_val = [];
                    // $(this).find('.text_group input[type="text"]').each(function(){
                    //     //an_val.push($(this).val().replace(/\s/g, ''));
                    //     an_val.push($(this).val());
                    // })                  
                    // an_val.sort();
                    // mcr.sort();
                    
                    // for(var i=0;mcr.length>i; i++) {
                    //     if(an_val[i] != '' && an_val[i] == mcr[i]) {
                    //         chk_cr.push(true);
                    //     } else {
                    //         chk_cr.push(false);
                    //     } 
                    // }
                
                // text + radio 순 조합
                } else if($(this).find('.input_radio_mix').length > 0) {

                    $(this).find('.input_radio_mix input[type="text"]').each(function (i) {
                        chk_cr[i] = false;
                        an_str = $(this).val().replace(/\s/g, '');  // 띄어쓰기 체크 안함
                        //an_str = $(this).val();   // 띄어쓰기 체크함
                        if (an_str == mcr[i]) {
                            chk_cr[i] = true;
                        }
                    })

                    var mix = $(this).find('.input_radio_mix input[type="radio"]');
                    var chk_num = 0;
                    if (mix.length > 0) {
                        var o_cr = mcr[1];
                        $(this).find('.input_radio_mix input[type="radio"]:checked').each(function () {
                            if ($(this).val() == o_cr) {
                                chk_cr.push(true);
                                chk_num++;
                            }
                        })
                        // 체크된 값이 없으면 
                        if (!chk_num) chk_cr.push(false);
                    }    

                // radio + text 순 조합
                } else if($(this).find('.radio_input_mix').length > 0) {

                    var mix = $(this).find('.radio_input_mix input[type="radio"]');
                    var chk_num = 0;
                    if (mix.length > 0) {
                        var o_cr = mcr[0];
                        $(this).find('.radio_input_mix input[type="radio"]:checked').each(function () {
                            if ($(this).val() == o_cr) {
                                chk_cr.push(true);
                                chk_num++;
                            }
                        })
                        // 체크된 값이 없으면 
                        if (!chk_num) chk_cr.push(false);
                    }

                    $(this).find('.radio_input_mix input[type="text"]').each(function () {
                        //chk_cr[i] = false;
                        an_str = $(this).val().replace(/\s/g, '');  // 띄어쓰기 체크안함
                        //an_str = $(this).val();   // 띄어쓰기 체크함
                        if (an_str == mcr[1]) {
                            chk_cr.push(true);
                        } else {
                            chk_cr.push(false);
                        }
                    })

                // 입력형
                } else {

                    $(this).find('input[type="text"]').each(function (i) {
                        chk_cr[i] = false;
                        an_str = $(this).val().replace(/\s/g, '');  // 띄어쓰기 체크안함
                        //an_str = $(this).val();   // 띄어쓰기 체크함
                        if (an_str == mcr[i]) {
                            chk_cr[i] = true;
                        }
                    })
                }

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

                var idx = $(this).data("lineckeck-idx");
                if (typeof(idx) === 'undefined') idx = 0;

                lineAnswerView('check', idx);  // 선긋기 정답
                chk_cr.push(lineCheck);
            }


            
            //-------------- 정답 체크 --------------//
            var an_chk;
            if ($.inArray(false, chk_cr) != -1 || chk_cr.length == 0) {
                an_chk = false;
            } else {
                an_chk = true;
            }

            // KERIS 변수
            var isCorrect = null;

            // 정답 체크 마크업
            if (an_chk == true || fa == true) {

                // KERIS 변수
                var ans = cr;
                isCorrect = true;

                if (!fa) { // 서술형이 아니면
                    $(this).addClass('co').find('modalFeedback').show();
                } else {
                    $(this).find('modalFeedback').show();
                }
                
            } else {

                // KERIS 변수
                isCorrect = false;
                var ans = cr;

                //var crok = '&lt;i class="ok"&gt;&lt;/i&gt;'; // 정답 번호 O 마크업
                var crok = '<i class="ok"></i>'; // 정답 번호 O 마크업
                $(this).addClass('cx').find('modalFeedback').show(); // 문항번호 O,x 표시

                // 유형별 답 체크 - 1115 지학사 o 체크 제거 요청
                /* if (mcr.length > 1) {

                    $(this).find('.radio_group').each(function (i) {
                        $(this).children('input').each(function () {
                            if ($(this).val() == mcr[i]) {
                                $(this).next('label').append(crok);
                            }
                        })
                    })

                    $(this).find('.check_group').each(function (i) {

                        chk_sp = mcr[i].split(',');

                        for (var a = 0; chk_sp.length > a; a++) {

                            $(this).find('input').each(function () {
                                if ($(this).val() == chk_sp[a]) {
                                    $(this).next('label').append(crok);
                                }
                            })
                        }
                    })

                    $(this).find('.chk_ox').each(function (i) {

                        chk_sp = mcr[i].split(',');

                        for (var a = 0; chk_sp.length > a; a++) {

                            $(this).find('input').each(function () {
                                if ($(this).val() == chk_sp[a]) {
                                    $(this).next('label').append(crok);
                                }
                            })
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

                } */

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
        $('.fpop_wrap.confirm assessmentItem').each(function(){ // 선긋기 있을 경우
            if($(this).data('response-type') == 'etc') {

                var idx = $(this).data("lineckeck-idx");
                if (typeof(idx) === 'undefined') idx = 0;

                lineAnswerView('reset', idx);  // 선긋기 사용시 해제
            }
        });
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