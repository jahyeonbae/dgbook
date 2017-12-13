/*!
writer:doongi
descript:선긋기
file:parts_line_answer.js
*/

    //드레그 시작

    setTimeout(function(){
        if ($('div').is('.drag_quiz')){
            initStart();
            itemSetting();
        }
    },500);


var zoomViews;

function viewport(){

    if (parent.ZOOMVALUE == undefined) {
        parent.ZOOMVALUE = 1;
    }

    zoomViews = parent.ZOOMVALUE;
}

$(window).resize(function(){
    viewport();
})

$(window).trigger('resize');

    var GameManager = {
        isTouchDevice: 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch,
        eventSelector:function(eventType){
            var selectedEvent = null;

            switch (eventType) {
                case 'eventDown':
                    selectedEvent = this.isTouchDevice ? 'touchstart' : 'mousedown' ;
                    break;
                case 'eventMove':
                    selectedEvent = this.isTouchDevice ? 'touchmove' : 'mousemove';
                    break;
                case 'eventUp':
                    selectedEvent = this.isTouchDevice ? 'touchend' : 'mouseup';
                    break;
                case 'eventOut':
                    selectedEvent = this.isTouchDevice ? 'touchleave' : 'mouseout';
                    break;
            }
            return selectedEvent;
        }
    }


    var lineGame = new Object; //게임정보 기록
    lineGame = {
        answer_num:[]
    }
    //문제정답 기록
    var quiz = {
        correctQuestion:new Array, //정답위치
        correctAnswer:new Array, //답위치 
        correctPos:new Array,
        answerSearch:function(){

            $('.drag_quiz>.question>li').each(function(i,e){
                var answer_num = Number($(e).children('i').attr('data-role-value'));
                //정답담기
                
                quiz.questionPos(e);
                quiz.answerPos($('.drag_quiz>.answer>li').eq(answer_num));
            });

        },
        answerPos:function(element){
            //정답위치정보 담기
            this.correctAnswer.push($(element).find('i').offset());
        },
        questionPos:function(element){
            //문제위치정보 담기
            this.correctQuestion.push($(element).find('i').offset());
        }
    }
    //정답보기 기능
    function lineAnswerView(type){
        

        if(type == 'reset'){
            
            $('.answerView line,.svg_container line').each(function(i,e){
                $(e).attr({
                    x1:0,
                    y1:0,
                    x2:0,
                    y2:0
                })
            });
            $('.answer li .dot').removeClass('on')
            lineGame.answer_num = [];
            
        }else{
            quiz.answerSearch();
            $('.answerView line').each(function(i,e){
                
                console.log(quiz.correctAnswer[i])
                $(e).attr({
                    x1:quiz.correctQuestion[i].left - $('.drag_quiz').offset().left / zoomViews + $('.question .dot').width()/2,
                    y1: quiz.correctQuestion[i].top - $('.drag_quiz').offset().top / zoomViews + $('.question .dot').height()/2,
                    x2: quiz.correctAnswer[i].left - $('.drag_quiz').offset().left / zoomViews + $('.answer .dot').width()/2,
                    y2: quiz.correctAnswer[i].top - $('.drag_quiz').offset().top / zoomViews + $('.answer .dot').height()/2
                })
            });

            $('.drag_quiz>.question>li').each(function(i,e){


                if($(e).children(i).attr('data-role-value') == lineGame.answer_num[i]){
                    lineGame.check = true;
                    
                }else{
                    lineGame.check = false;
                    return false;
                }
            })

            $('.line_check').hide().next().show();
            
        }   
    }

    function itemSetting(){

        //답안관련 셋팅
        var lineTag = "";
       
        //질문인덱스 번호 생성
        $('.drag_quiz>.question>li').each(function(i,e){
            $(e).find('i').attr('data-role-idx',i);
            touchArea(e)
            lineTag = $(document.createElementNS('http://www.w3.org/2000/svg', 'line'));
            $('#svg_container').append(lineTag);
            lineGame.answer_num.push(null);
        });
        //답변인덱스 번호 생성
        $('.drag_quiz>.answer>li').each(function(i,e){
            $(e).find('i').attr('data-role-idx',i);
            touchArea(e)
            lineTag = $(document.createElementNS('http://www.w3.org/2000/svg', 'line'));
            $('.answerView svg').append(lineTag);
        });
    }

    function touchArea(e) {
        //영역셋팅
        $(e).children('span').css({
            backgroundColor:'rgba(0,0,0,.3)',
            display: 'block',
            position: 'absolute',
            width:'40px',
            height:'40px',
            left: function () {
                var touch_area_x = parseInt($(this).children('i').css('left'));
                var minusSize = $(this).innerWidth() * 0.5;
                var itemSize = $(this).children('i').width() / 2;
                return touch_area_x - minusSize + itemSize;
            },
            top: function () {
                var touch_area_y = parseInt($(this).children('i').css('top'));
                var minusSize = $(this).innerHeight() * 0.5;
                var itemSize = $(this).children('i').height() / 2;
                return touch_area_y - minusSize + itemSize;
            }
        });

        $(e).find('i').css({
            left: '50%',
            top: '50%',
            marginLeft:function(){
                return Math.floor(-1*$(this).width()/2);
            },
            marginTop: function () {
                return Math.floor(-1*$(this).height()/2);
            }
        })
    }

    //이벤트 셋팅
    var main_target = $('.drag_quiz')[0];
    
    function initStart(){
        main_target.addEventListener(GameManager.eventSelector('eventDown'),touchDown,false);
        main_target.addEventListener(GameManager.eventSelector('eventUp'),touchUp,false);
        //main_target.addEventListener("mouseup", touchUp, false);

        $(".answer > li > span").on("", function(e){

            console.log("jq touch end");
            console.log(e);

        });

    }

    //다운이벤트
    function touchDown(e){
        
        //질문에만 선의 시작점 셋팅    
        console.log($(e))
        if ($(e.path[0]).parents('.question').is('.question')){
             //클릭요소 번호
            lineGame.idx = $(e.path[0]).attr('data-role-idx');
            main_target.addEventListener(GameManager.eventSelector('eventMove'),touchMove,false);
            posSearch("eventDown",e);
            $('.drag_quiz>.answer>li').eq(lineGame.answer_num[lineGame.idx]).children('i').removeClass('on')
        }
        e.preventDefault();
        e.stopPropagation();
    }

    //이동이벤트
    function touchMove(e){
        e.preventDefault();
        posSearch("eventMove",e);
    }

    //때기이벤트
    function touchUp(e){
        
        console.log(e);

        lineGame.answer_num[lineGame.idx] = $(e.path[0]).attr('data-role-idx');
        main_target.removeEventListener(GameManager.eventSelector('eventMove'),touchMove,false);
        
        posSearch("eventUp", e);

        $('.line_check').show();

        //이동 이벤트 취소
        if (!$(e.path[2]).is('.answer') || $(e.path[0]).is('.on')){
            $('#svg_container').children('line').eq(lineGame.idx).attr({
                'x1': 0,
                'x2': 0,
                'y1': 0,
                'y2': 0
            })
        }else{
            $(e.path[0]).addClass('on');
        } 
    } 

    
    
    function posSearch(eType,element){
        switch (eType) {
            case 'eventDown':
                    var status = 'Down';
                    var w = $(element.path[0]).width();
                    var px = $(element.path[0]).offset().left;
                    var h = $(element.path[0]).height();
                    var py = $(element.path[0]).offset().top;

                    var wx = px + (w/2);
                    var hx = py + (h/2);
                    addline(status, wx, hx);

                break;

            case 'eventMove':
                    var status = 'Move';
                    var end_x = element.pageX || element.changedTouches[0].pageX;
                    var end_y = element.pageY || element.changedTouches[0].pageY;
                    addline(status,end_x,end_y);
                  
                break;
            
            case 'eventUp':
                    var status = 'Up'; 
                    var w = $(element.path[0]).width();
                    var px = $(element.path[0]).offset().left;
                    var h = $(element.path[0]).height();
                    var py = $(element.path[0]).offset().top;

                    var wx = px + (w / 2);
                    var hx = py + (h / 2);
                    addline(status, wx, hx);
                break;
        }
    }

    function addline(status,x,y){
        
        
        x = x - $('.drag_quiz').offset().left ;
        y = y - $('.drag_quiz').offset().top ;

        console.log('sfsf')

        if(status == 'Down'){
            st_x = x;
            st_y = y;
        }else if(status == "Move"){
            en_x = x;
            en_y = y;
        } else if (status == "Up"){
            en_x = x;
            en_y = y;
        }



        $('.drag_quiz').find('svg').children('line').eq(lineGame.idx).attr({
            'x1': st_x / zoomViews,
            'y1': st_y / zoomViews,
            'x2': en_x / zoomViews,
            'y2': en_y / zoomViews
        });

    }

    //센터 접점 맞추기 기능

    //예외 처리
   
