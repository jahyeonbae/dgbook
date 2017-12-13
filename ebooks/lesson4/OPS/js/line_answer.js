

    //드레그 시작
    setTimeout(function(){
        initStart();
        itemSetting();
       
    },500);


    var GameManager = {
        isTouchDevice: 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch,
        eventSelector:function(eventType){
            var selectedEvent = null;
            switch (eventType) {
                case 'eventDown':
                    selectedEvent = this.isTouchDevice ? 'touchstart' : 'mousedown';
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
            this.correctAnswer.push($(element).children('i').offset());
        },
        questionPos:function(element){
            //문제위치정보 담기
            this.correctQuestion.push($(element).children('i').offset());
        }
    }
    //정답보기 기능
    function lineAnswerView(){
        quiz.answerSearch();
        $('.answerView line').each(function(i,e){
            
            $(e).attr({
                x1:(quiz.correctQuestion[i].left - $('.drag_quiz').offset().left) + ($('.dot').width()/2),
                y1:(quiz.correctQuestion[i].top - $('.drag_quiz').offset().top) + ($('.dot').width()/2),
                x2:(quiz.correctAnswer[i].left - $('.drag_quiz').offset().left) + ($('.dot').width()/2),
                y2:(quiz.correctAnswer[i].top  - $('.drag_quiz').offset().top) + ($('.dot').width()/2)
            })

        });
    }

    function itemSetting(){
        //답안관련 셋팅
        var lineTag = "";
       
        
        //질문인덱스 번호 생성
        $('.drag_quiz>.question>li').each(function(i,e){
            $(e).children('i').attr('data-role-idx',i);
            lineTag += '<line/>';
       });
       


        //답변인덱스 번호 생성
        $('.drag_quiz>.answer>li').each(function(i,e){
            $(e).children('i').attr('data-role-idx',i);
        });

        //태그생성
        $('.svg_container svg').html(lineTag);
    }

    //이벤트 셋팅
    var main_target = $('.drag_quiz')[0];

    function initStart(){
        main_target.addEventListener(GameManager.eventSelector('eventDown'),touchDown,false);
        main_target.addEventListener(GameManager.eventSelector('eventUp'),touchUp,false);
    }

    //다운이벤트
    function touchDown(e){
        e.preventDefault();
        //질문에만 선의 시작점 셋팅    
        if($(e.target).parent().parent().is('.question')){
             //클릭요소 번호
             lineGame.idx = $(e.target).attr('data-role-idx');
            main_target.addEventListener(GameManager.eventSelector('eventMove'),touchMove,false);
            posSearch("eventDown",e);
        }
    }

    //이동이벤트
    function touchMove(e){
        e.preventDefault();
        posSearch("eventMove",e);
    }

    //때기이벤트
    function touchUp(){
        main_target.removeEventListener(GameManager.eventSelector('eventMove'),touchMove,false);
        posSearch("eventUp");
        //이동이벤트 삭제
    } 

    function posSearch(eType,element){
        switch (eType) {
            case 'eventDown':
                    var status = 'Down';
                    var start_x = element.pageX || element.changedTouches[0].pageX;
                    var start_y = element.pageY || element.changedTouches[0].pageY;
                    addline(status,start_x,start_y);
                break;

            case 'eventMove':
                    var status = 'Move';
                    var end_x = element.pageX || element.changedTouches[0].pageX;
                    var end_y = element.pageY || element.changedTouches[0].pageY;
                    addline(status,end_x,end_y);
                    console.log(end_x,end_y);
                break;
            
            case 'eventUp':
                break;
        }
    }

    function addline(status,x,y){

        x = x - $('.drag_quiz').offset().left;
        y = y - $('.drag_quiz').offset().top;

        if(status == 'Down'){
            st_x = x;
            st_y = y;
        }else if(status == "Move"){
            en_x = x;
            en_y = y;
        }

        $('.drag_quiz').find('svg').children('line').eq(lineGame.idx).attr({
            'x1':st_x,
            'y1':st_y,
            'x2':en_x,
            'y2':en_y,
        });
    }

    


    //센터 접점 맞추기 기능
    //정답 보내기
    //예외 처리
    //다시 풀기
