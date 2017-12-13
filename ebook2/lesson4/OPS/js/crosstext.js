var crossAnswerObj = {
    target: []
}

var crossAnswer = {
    user:{
        width:[],
        height:[]
    },
    quiz:{
        width: [],
        height: []
    }
}
var qzTypeCheck;

$(function(){

   
    var crossEvent = function () {
        
    
    
        var textbox = "";
        classCheck = $(this).parent().attr('class');

        textbox += "<div class='textbox'>";
        textbox += "<button class='tb-close'>닫기</button>";
        textbox += "<div>";

        

        if (qzTypeCheck(classCheck)[0] == 'wh' || qzTypeCheck(classCheck) == 'hw' ){

            // textbox += "<button class='width' type='button' onclick='inputSelector(qzTypeCheck(classCheck))'>가로 입력</button>";
            // textbox += "<button class='height' type='button' onclick='inputSelector(qzTypeCheck(classCheck))'>세로 입력</button>";
            //textbox += '<div class="frm_box">';
            textbox += '<img src="./img/common/m_width.png" /><input type="radio" class="width" name="dir" id="in_w" onclick="whSelector(\''+qzTypeCheck(classCheck)[1][0]+'\')" /><label for="in_w">가로</label>';
            textbox += '<img src="./img/common/m_height.png" /><input type="radio" class="height" name="dir" id="in_h" onclick="whSelector(\''+ qzTypeCheck(classCheck)[1][1]+'\')" /><label for="in_h">세로</label>';
        } else if (qzTypeCheck(classCheck)[0] == 'w'){
            //가로 입력 셋팅
            inputSelector(qzTypeCheck(classCheck))
        } else if (qzTypeCheck(classCheck)[0] == 'h'){
            inputSelector(qzTypeCheck(classCheck))
            //세로 입력 셋팅
        } else{
            //클래스 정보가 잘못되었을 경우
        }

        textbox += "<input type='text' class='inputAnswer'/>";
        textbox += "<button class='confirm'>확인 <i class='fa fa-check'></i></button>";
        //textbox += '</div>';
        textbox += "</div></div>";

        $(this).parents('.crossquiz').append(textbox);
        $('.inputAnswer').focus();
        //$('.crossquiz').children('.textbox').children('.inputAnswer').attr('maxlength', crossAnswerObj.target.length);
        $('.crossquiz td input').off('click');
    }

    // 닫기 이벤트
    var closeEvent = function () {
        $('.crossquiz').children('.textbox').remove();
        $('.crossquiz td input').click(crossEvent);

        // 입력된 값이 있으면 정답버튼 노출
        $('.crossquiz input').each(function(){
            if($(this).val() != '')
                $('.btn_cross_check').show();
        })

    }

    // 입력이벤트
    var crossinput = function(){
        var inputVal = $(this).parent().children('.inputAnswer').val();

        $.each(crossAnswerObj.target,function(i,e){
            $(e).children('input').val(inputVal.substring(i, i + 1))

            
        })

        $('.cross').show()

        closeEvent();
    }

    qzTypeCheck = function(arr) {
        var arrs = arr.split(" ");
        var otiz = arrs.splice(arrs.indexOf('qz') + 1, arrs.length);
        var otizSet = [];
        var text = "";

        for (var i = 0 in otiz) {

            otizSet[i] = otiz[i].replace(/[(0-9),-]/g, "");
            text += otizSet[i];
        }
        otizSet[0] = text;
        otizSet[1] = otiz;

        return otizSet; // 교차지점이면 wh [wx-x, hx-x] 리턴
    }

    function inputSelector(d) {
        var headSec = d[1][0].split('-');

        //
        crossAnswerObj.target = [];
        $('.crossquiz td[class*=' + headSec[0] + ']').each(function (i, e) {
            crossAnswerObj.target.push(e);
        })
    }



    // 이벤트
    $('.crossquiz td input').click(crossEvent);
    $('.crossquiz').on('click', '.tb-close', closeEvent);
    $('.crossquiz').on('click', '.confirm', crossinput);

})


// 정답 버튼
function whSelector(d) {
    //var headSec = d.split(',');
    var headSec = d.split('-');

    

    crossAnswerObj.target = [];
    $('.crossquiz td[class*=' + headSec[0] + ']').each(function (i, e) {
        crossAnswerObj.target.push(e);
    })
}


function crossCheck() { // 정답확인 - chaney 1113

    
    
    

    $('.crossquiz').parents('assessmentitem').children('modalfeedback').children('ul').each(function(i,e){

        if($(e).index() == 0){

            var a = $(e).children('li').text();
            crossAnswer.quiz.width = a.split("");

        } else if ($(e).index() == 1) {

            var a = $(e).children('li').text();
            crossAnswer.quiz.height = a.split("");

        }
    });
    
    
    $(".cross").hide().next(".btn_undo").show();
    

    crossAnswer.user.width = []
    crossAnswer.user.height = [];
    $('.crossquiz').find('td[class*="w"]').each(function(i,e){
       
        var wsplitArr;
        wsplitArr = $(e).attr('class');
        wsplitArr = qzTypeCheck(wsplitArr);

        $.each(wsplitArr[1],function(j,k){

               if(k.indexOf('w') == 0){
                   crossAnswer.user.width.push('.' + k)
               } 
        })

        //$(this).hide().next(".btn_undo").show();

    });

  $('.crossquiz').find('td[class*="h"]').each(function (i, e) {
     
        var hsplitArr;
        hsplitArr = $(e).attr('class');
        hsplitArr = qzTypeCheck(hsplitArr);
        

        $.each(hsplitArr[1], function (j, k) {

            if (k.indexOf('h') == 0) {
                crossAnswer.user.height.push('.' + k)
            }
        })
    });

    crossAnswer.user.width = crossAnswer.user.width.sort();
    crossAnswer.user.height = crossAnswer.user.height.sort();


    




    $.each(crossAnswer.quiz.width, function (i, e) {

        //
        //
        //

        if ($(crossAnswer.user.width[i]).children('input').val() != e){
            $(crossAnswer.user.width[i]).children('input').css('color', 'red').val(e);
        }else{
            $(crossAnswer.user.width[i]).children('input').css('color', 'blue').val(e);
        }
        
    });


    //alert("dd");



    $.each(crossAnswer.quiz.height, function (i, e) {

        
        
        



        // 교차점의 경우 가로 체킹에서 이미 체크 했기때문에 건너뛴다
        var classCheck = $(crossAnswer.user.height[i]).attr("class");

        //
        if (qzTypeCheck(classCheck)[0] == "wh") {
            return;
        }



        if ($(crossAnswer.user.height[i]).children('input').val() != e) {
            $(crossAnswer.user.height[i]).children('input').css('color', 'red').val(e);
        } else {
            $(crossAnswer.user.height[i]).children('input').css('color', 'blue').val(e);
        }

    });

}

function crossreset(){
    $('.crossquiz').find('input').css('color', '#000').val("")
}