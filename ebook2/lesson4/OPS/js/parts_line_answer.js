
/*
    qSpotArea : 문제위치
    aSpotArea : 정답위치
    potin_area : 포인트 범위
    lineGame.answer_num : 정답배열
    lineCheck
*/

var c_color = 'background: #222; color: #bada55';
var w_color = 'color:#bada55';
var e_color = 'color:#F00';

/**
 * 선긋기 클래스
 * @param el
 * @constructor
 */
function CLineDrawing(el, gm) {

    var self = this;



    this.el = el;
    this.gm = gm;

    this.lineCheck = new Array();
    this.qSpotArea = new Array();
    this.aSpotArea = new Array();
    this.potin_area =  parseInt($(el).attr('data-rol-dotsize')) || 40;
    this.overlapCount = $(el).data("overlap-count");

    if (typeof(this.overlapCount) == 'undefined') this.overlapCount = 1;

    console.log(this.overlapCount);

    this.lineGame = {
        answer_num: [],
        start_idx: [],

        acceptList : []
    };


    function setDom() {

        var self = this;

        $(el).find('.question li').each(function (i, e) {
            //질문 셋팅
            $(e).children('span').attr('data-role-idx', i);
            self.expandTouchArea(e);
            self.qSpotArea.push($(e).children('span').offset());
        });


        $(el).find('.answer li').each(function (i, e) {
            //정답 셋팅
            $(e).children('span').attr('data-role-idx', i);
            self.expandTouchArea(e);
            self.aSpotArea.push($(e).children('span').offset());
            var lineTag = $(document.createElementNS('http://www.w3.org/2000/svg', 'line'));
            $(el).find('.answerView svg, .questionView svg').append(lineTag);
            //lineGame.answer_num.push(null);
        });

        $(el).on(gm.eventSelector('eventDown'), function(e){ self.onTouchStart.call(self,e) });
        $(el).on(gm.eventSelector('eventMove'), function(e){ self.onTouchMove.call(self,e) });
        $(el).on(gm.eventSelector('eventUp'), function(e){ self.onTouchEnd.call(self,e) });
    }


    // 팝업인 경우 지연 시작
    if (typeof($(el).parents(".fpop_wrap")[0]) !== 'undefined') {

        var self = this;
        var to = setInterval(function(){

            if ($(el).parents(".fpop_wrap").css("display") == 'block') {


                setDom.call(self);
                clearInterval(to);
            }



        }, 500);

    } else {
        setDom.call(this);
    }



}


/**
 * 터치 영역 확장
 */
CLineDrawing.prototype.expandTouchArea = function(element) {

    $(element).children('span').css({
        display: 'block',
        position: 'absolute',
        width: this.potin_area,
        height: this.potin_area,
        left: function () { return centerPoint('left', $(this)) },
        top: function () { return centerPoint('top', $(this)) }
    });


    function centerPoint(x, $this) {
        var touch_area_x, minusSize, itemSize;

        touch_area_x = parseInt($this.children('i').css(x));
        switch (x) {
            case 'left':
                minusSize = $this.innerWidth() * 0.5;
                itemSize = $this.children('i').width() / 2;
                break;

            case 'top':
                minusSize = $this.innerHeight() * 0.5;
                itemSize = $this.children('i').height() / 2;
                break;
        }
        return touch_area_x - minusSize + itemSize;
    }

    $(element).find('i').css({
        left: '50%',
        top: '50%',
        marginLeft: function () {
            return Math.floor(-1 * $(this).width() / 2);
        },
        marginTop: function () {
            return Math.floor(-1 * $(this).height() / 2);
        }
    });

};


/**
 *
 */
CLineDrawing.prototype.spotAreaSearch = function(status, element) {


    var self = this;

    var mouseX = element.pageX || element.originalEvent.changedTouches[0].clientX;
    var mouseY = element.pageY || element.originalEvent.changedTouches[0].clientY;

    var x = mouseX;
    var y = mouseY;

    switch (status) {
        case 'down':


            //dregAction.spotArea(element, mouseX, mouseY);
            //dregAction.addDrowLine(mouseX, mouseY, status, dregAction.idx);
            break;
        case 'up':

            //dregAction.spotArea(element, mouseX, mouseY);
            //dregAction.addDrowLine(mouseX, mouseY, status);
            break;
        case 'move':

            //this.addDrowLine(mouseX, mouseY, status);
            break;
    }





    $.each(this.qSpotArea, function (i, e) {
        var widthScope = $(self.el).find(".question li:eq(" + i + ")").children('span').width();

        widthScope = widthScope * zoomViews;

        var debug = "zoomViews : " + zoomViews;
        debug += "<br /> x : "+ x ;
        debug += "<br /> e.left : "+ e.left;
        debug += "<br /> widthScope : "+ widthScope;

        //$("#debugView").html(debug);


        if (x > e.left && x < e.left + widthScope && y > e.top && y < e.top + widthScope) {
            //정보추가
            if (status == 'down') {

                // 이미 연결된 선이 있으면 제거
                for (var j = 0; j < self.lineGame.acceptList.length; j++) {
                    if (self.lineGame.acceptList[j].q == i) {
                        self.lineGame.acceptList.splice(j,1);
                    }
                }


                self.idx = i;
                self.part = '.question';
                self.lineGame.start_idx.push(i);
            }


        }
    });


    $.each(this.aSpotArea, function (i, e) {
        var widthScope = $(self.el).find(".answer li:eq(" + i + ")").children('span').width();

        widthScope = widthScope * zoomViews;

        if (x > e.left && x < e.left + widthScope && y > e.top && y < e.top + widthScope) {

            // 이미 연결된 선이 있으면 reject
            var ovCnt = 0;
            for (var j = 0; j < self.lineGame.acceptList.length; j++) {
                if (self.lineGame.acceptList[j].a == i) {
                    ovCnt++;
                    if (ovCnt == self.overlapCount) return;
                }
            }

            //정보추가
            self.idx = i;
            self.part = '.answer';

            if (status == 'up') {
                self.lineGame.start_idx.push(i);

                self.lineGame.acceptList.push({
                    q : self.lineGame.start_idx[0],
                    a : self.lineGame.start_idx[1]
                });

            }

        }
    });


    this.doLineDraw(x,y,status);


};


/**
 *
 */
CLineDrawing.prototype.doLineDraw = function(x, y, status) {

    x = x - $(this.el).offset().left;
    y = y - $(this.el).offset().top;

    var st_x, st_y, en_x, en_y;


    switch (status) {
        case 'down':
            x = this.centerfix(x, 'x') / zoomViews;
            y = this.centerfix(y, 'y') / zoomViews;
            st_x = x;
            st_y = y;
            en_x = en_x || x;
            en_y = en_y || y;

            break;

        case 'move':
            en_x = x / zoomViews;
            en_y = y / zoomViews;
            break;

        case 'up':
            en_x = this.centerfix(x, 'x') / zoomViews;
            en_y = this.centerfix(y, 'y') / zoomViews;
            break;
    }



    $(this.el).find('.questionView > svg').children('line').eq(this.lineGame.start_idx[0]).attr({
        'x1': st_x,
        'y1': st_y,
        'x2': en_x,
        'y2': en_y
    });

};

/**
 *
 * @param val
 * @param type
 * @returns {number}
 */
CLineDrawing.prototype.centerfix = function (val, type, part, idx) {

    if (typeof(part) == 'undefined') {
        part = this.part;
        idx = this.idx;
    }

    var qs = this.qSpotArea[idx];
    var as = this.aSpotArea[idx];
    var w = this.potin_area * zoomViews;

    //var qs = {left : qsOrg.left, top : qsOrg.top/zoomViews};
    //var as = {left : asOrg.left/zoomViews, top : asOrg.top/zoomViews};

    

    if (part == '.question') {
        if ((val > qs.left || val > qs.left && val < qs.left + w || val < qs.left + w) && type == 'x') {
            var centerpoint = qs.left + w - w / 2 || qs.left + w - w / 2;
            centerpoint = centerpoint - $(this.el).offset().left;
        }

        if ((val > qs.top || val > qs.top && val < qs.top + w || val < qs.top + w) && type == 'y') {
            var centerpoint = qs.top + w - w / 2 || qs.top + w - w / 2;
            centerpoint = centerpoint - $(this.el).offset().top;
        }

    } else if (part == '.answer') {

        if ((val > as.left || val > as.left && val < as.left + w || val < as.left + w) && type == 'x') {
            var centerpoint = as.left + w - w / 2 || as.left + w - w / 2;
            centerpoint = centerpoint - $(this.el).offset().left;
        }

        if ((val > as.top || val > as.top && val < as.top + w || val < as.top + w) && type == 'y') {
            var centerpoint = as.top + w - w / 2 || as.top + w - w / 2;
            centerpoint = centerpoint - $(this.el).offset().top;
        }

    }
    return centerpoint;

};



CLineDrawing.prototype.lineReset = function (x) {


    if (typeof(x) == 'number'){
        $(this.el).find('.questionView > svg').children('line').eq(x).attr({
            'x1': 0,
            'y1': 0,
            'x2': 0,
            'y2': 0
        });
    } else if (x == 'reset'){
        $(this.el).find('.questionView > svg').children('line').attr({
            'x1': 0,
            'x2': 0,
            'y1': 0,
            'y2': 0
        });

        $(this.el).find('.answerView > svg').children('line').attr({
            'x1': 0,
            'x2': 0,
            'y1': 0,
            'y2': 0
        });

    }

};


/**
 * 
 * @param {*} type 
 * @param {*} idx 
 */
CLineDrawing.prototype.externalApi = function(type, idx) {

    console.log("externalApi");
    console.log(idx);

    if (typeof(idx) === 'undefined') idx = 0;

    var self = this;
    switch (type) {
        case 'reset' :

            this.lineGame.acceptList = [];
            this.lineReset(type);
            this.lineGame.answer_num = [];
            this.lineCheck = [];

            $(this).find('.answer li').each(function (i, e) {
                self.lineGame.answer_num[i] = null;
            });

            console.log(' lineAnswerView (' + type +'):정답 값 비움->'+this.lineGame.answer_num,c_color);

            break;

        default:
            var lc = $($('.line_check')[idx]);

            lc.hide();
            lc.parent().children('.btn_undo').show();

            this.lineCheck = [];
            //console.log(this.el);
            $(this.el).find('.question li').each(function(i,e){

                //console.log(self.lineGame.answer_num[i]);
                //console.log($(e).find('i').attr('data-role-value'));
                if ($(e).find('i').attr('data-role-value') == self.lineGame.answer_num[i]){
                    console.log('정답:' + $(e).find('i').attr('data-role-value'));
                    console.log('사용자정답:' + self.lineGame.answer_num[i]);
                    self.lineCheck.push(self.lineGame.answer_num[i]);
                }

            });
            
            window.lineCheck = this.lineCheck.length == $(this.el).find('.answer li').length;
            console.log("%c선긋기의 오지는 정답:"+this.lineCheck,e_color);

            console.log(idx);
            this.drawAnswerLine(idx);

            break;
    }
};


/**
 * 정답 선 긋기 (externalApi 에서 호출)
 */
CLineDrawing.prototype.drawAnswerLine = function(btnIdx) {

    if (typeof(btnIdx) == 'undefined') btnIdx = idx;

    var correctAnswer = [];
    var correctQuestion = [];
    var answer_num = [];

    var self = this;
    $(this.el).find('.question > li').each(function(i,e){
        var anum = Number($(e).find('i').attr('data-role-value'));
        var a = $(self.el).find('.answer>li').eq(anum);

        var offsetQ = $(e).find('i').offset();
        var offsetA = $(a).find('i').offset();

        answer_num.push(anum);

        correctAnswer.push($(e).find('i').offset());
        correctQuestion.push($(a).find('i').offset());
    });

    $(this.el).find('.answerView line').each(function(i,e){
        console.log(correctAnswer[i]);

        var x1 = self.centerfix(correctQuestion[i].left - $(self.el).offset().left, 'x', '.question', i) / zoomViews;
        var y1 = self.centerfix(correctQuestion[i].top - $(self.el).offset().top, 'y', '.question', i) / zoomViews;
        var x2 = self.centerfix(correctAnswer[i].left - $(self.el).offset().left, 'x', '.answer', answer_num[i]) / zoomViews;
        var y2 = self.centerfix(correctAnswer[i].top - $(self.el).offset().top, 'y', '.answer', answer_num[i]) / zoomViews;

        $(e).attr({x1:x1, y1:y1, x2:x2, y2:y2});

        /*
        $(e).attr({
            x1: correctQuestion[i].left - $(self.el).offset().left / zoomViews + ($(self.el).find('.question .dot').width()*zoomViews)/2,
            y1: correctQuestion[i].top - $(self.el).offset().top / zoomViews + ($(self.el).find('.question .dot').height()*zoomViews)/2,
            x2: correctAnswer[i].left - $(self.el).offset().left / zoomViews + ($(self.el).find('.answer .dot').width()*zoomViews)/2,
            y2: correctAnswer[i].top - $(self.el).offset().top / zoomViews + ($(self.el).find('.answer .dot').height()*zoomViews)/2
        });
        */
    });

    $(this.el).find('.question>li').each(function(i,e){
        if($(e).find(i).attr('data-role-value') == self.lineGame.answer_num[i]){
            self.lineGame.check = true;
        } else {
            self.lineGame.check = false;
            return false;
        }
    });

    $('.line_check').eq(btnIdx).hide().next().show();

};


/**
 * touch start
 */
CLineDrawing.prototype.onTouchStart = function(e) {

    var self = this;


    var entryType = $(this.el).attr('data-rol-etrytype') || 'question';
    if ($(e.target).parents('ul').is('.' + entryType)){
        active(e);
    }

    function active(a){
        self.spotAreaSearch('down', a);
        self.isDrawing = true;
        //$dreg_target.addEventListener(GameManager.eventSelector('eventMove'), dregEvent.tuchMove, false);
        //console.log('dregEvent.tuchDown : %c저장된 시작 인덱스 번호 ->' + lineGame.start_idx, c_color)
    }

    e.preventDefault();
    e.stopPropagation();

};


/**
 * touch end
 */
CLineDrawing.prototype.onTouchEnd = function(e) {

    if ($(e.target).parents('.question').is('.question') || $(e.target).parents('.answer').is('.answer')) {
        this.spotAreaSearch('up', e);
        switch (this.part) {
            case '.question':
                this.lineGame.answer_num[this.lineGame.start_idx[1]] = this.lineGame.start_idx[0];
                break;
            case '.answer':
                this.lineGame.answer_num[this.lineGame.start_idx[0]] = this.lineGame.start_idx[1];
                break;
        }

        this.lineGame.start_idx = [];

    } else {
        // 연결이 안됫을시
        this.lineGame.answer_num[this.lineGame.start_idx[0]] = null;
        //dregAction.reset(lineGame.start_idx[0]);
        this.lineReset(this.lineGame.start_idx[0]);
        this.lineGame.start_idx = [];
    }

    // 예시답안 확인버튼 노출
    if (this.lineGame.answer_num.indexOf(null) == -1){
        $('.line_check').show();
    }

    this.isDrawing = false;
    //$dreg_target.removeEventListener(GameManager.eventSelector('eventMove'), dregEvent.tuchMove, false);
    e.preventDefault();
    e.stopPropagation();

};

/**
 * touch move
 */
CLineDrawing.prototype.onTouchMove = function(e) {

    if (!this.isDrawing) return;

    this.spotAreaSearch('move', e);
    e.preventDefault();
    e.stopPropagation();
};




(function($){

    var c_color = 'background: #222; color: #bada55';
    var w_color = 'color:#bada55';
    var e_color = 'color:#F00';

    var lineAnswerView;
    var zoomViews;
    var linePops;

    var GameManager = {
        isTouchDevice: 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch,
        eventSelector: function (eventType) {
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
    };
    window.GameManager = GameManager;


    function viewport() {
        if (parent.ZOOMVALUE == undefined) {
            parent.ZOOMVALUE = 1;
        }
        zoomViews = parent.ZOOMVALUE;
        window.zoomViews = zoomViews;
    }
    $(window).resize(function () {
        viewport();
    });



    var cLineDrawingList = [];
    function init() {

        viewport();
        var ldElements = $('.drag_quiz');
        for (var i = 0; i < ldElements.length; i++) {
            cLineDrawingList.push(new CLineDrawing(ldElements[i], GameManager));
        }



        window.lineAnswerView = function(type, idx) {

            if (typeof(idx) === 'undefined') {
                idx = 0;
            }

            //console.log(cLineDrawingList);
            var ldObj = cLineDrawingList[idx];
            ldObj.externalApi.call(ldObj, type, idx);
        };

    }


    $(function(){

        setTimeout(function(){
            init();
        },500);


    });
})(jQuery);



/*
var c_color = 'background: #222; color: #bada55';
var w_color = 'color:#bada55';
var e_color = 'color:#F00';

var lineAnswerView;
var zoomViews;
var linePops;
var lineCheck = new Array;

var GameManager = {
    isTouchDevice: 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch,
    eventSelector: function (eventType) {
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

$(function () {

    lineGame = {
        answer_num: [],
        start_idx: []
    }


    // 리셋, 버튼 등...
    lineAnswerView = function(type){

        switch (type) {
            case 'reset' :

                dregAction.reset(type);
                lineGame.answer_num = [];
                lineCheck = [];

                $('.drag_quiz .answer li').each(function (i, e) {
                    lineGame.answer_num[i] = null;
                })

                console.log(' lineAnswerView (' + type +'):정답 값 비움->'+lineGame.answer_num,c_color);

                break;

            default:

                $('.line_check').hide();
                $('.line_check').parent().children('.btn_undo').show();

                console.log('lineAnswerView (' + type + ')->', lineGame.answer_num);

                lineCheck = [];
                $('.question li').each(function(i,e){

                    if ($(e).find('i').attr('data-role-value') == lineGame.answer_num[i]){
                        console.log('정답:' + $(e).find('i').attr('data-role-value'));
                        console.log('사용자정답:' + lineGame.answer_num[i]);
                        lineCheck.push(lineGame.answer_num[i]);
                    }

                })
                console.log('lineCheck : ' + lineCheck);
                lineCheck = lineCheck.length == $('.answer li').length;
                console.log("%c선긋기의 오지는 정답:"+lineCheck,e_color);


                break;
        }
    }


    function viewport() {

        if (parent.ZOOMVALUE == undefined) {
            parent.ZOOMVALUE = 1;
        }

        zoomViews = parent.ZOOMVALUE;
    }

    $(window).resize(function () {
        viewport();
    })
    
    $(window).trigger('resize');

    var $dreg_target = $('.drag_quiz')[0];

    var dregLineSetting = {
        qSpotArea: new Array(),
        aSpotArea: new Array(),
        potin_area: parseInt($('.drag_quiz').attr('data-rol-dotsize')) || 40,
        init: function () {
            // 기초셋팅

            $(window).trigger('resize')
            $('.drag_quiz .question li').each(function (i, e) {
                //질문 셋팅
                $(e).children('span').attr('data-role-idx', i);
                dregLineSetting.touchArea(e);
                dregLineSetting.qSpotArea.push($(e).children('span').offset());
            });


            $('.drag_quiz .answer li').each(function (i, e) {
                //정답 셋팅
                $(e).children('span').attr('data-role-idx', i);
                dregLineSetting.touchArea(e);
                dregLineSetting.aSpotArea.push($(e).children('span').offset());
                lineTag = $(document.createElementNS('http://www.w3.org/2000/svg', 'line'));
                $('.answerView svg,#svg_container').append(lineTag);
                lineGame.answer_num.push(null);
            });
        },
        touchArea: function (element) {

            //터치영역 확장
            $(element).children('span').css({
                backgroundColor: 'rgba(0,0,0,.3)',
                display: 'block',
                position: 'absolute',
                width: dregLineSetting.potin_area,
                height: dregLineSetting.potin_area,
                left: function () { return centerPoint('left', $(this)) },
                top: function () { return centerPoint('top', $(this)) }
            });


            function centerPoint(x, $this) {
                var touch_area_x, minusSize, itemSize;

                touch_area_x = parseInt($this.children('i').css(x));
                switch (x) {
                    case 'left':
                        minusSize = $this.innerWidth() * 0.5;
                        itemSize = $this.children('i').width() / 2;
                        break;

                    case 'top':
                        minusSize = $this.innerHeight() * 0.5;
                        itemSize = $this.children('i').height() / 2;
                        break;
                }
                return touch_area_x - minusSize + itemSize;
            }

            $(element).find('i').css({
                left: '50%',
                top: '50%',
                marginLeft: function () {
                    return Math.floor(-1 * $(this).width() / 2);
                },
                marginTop: function () {
                    return Math.floor(-1 * $(this).height() / 2);
                }
            })
        },
    }

    //이벤트 동작
    var dregEvent = {
        tuchDown: function (e) {
            var entryType = $('.drag_quiz').attr('data-rol-etrytype') || 'question';
            console.log('%c현재 .' + entryType + '에서 시작하도록 설정되어있습니다.',e_color);
            if ($(e.target).parents('ul').is('.' + entryType)){
                ative(e);
            }

            function ative(a){
                dregAction.stopSearch('down', a);
                $dreg_target.addEventListener(GameManager.eventSelector('eventMove'), dregEvent.tuchMove, false);
                console.log('dregEvent.tuchDown : %c저장된 시작 인덱스 번호 ->' + lineGame.start_idx, c_color)
            }

            e.preventDefault();
            e.stopPropagation();
        },
        tuchUp: function (e) {

            if ($(e.target).parents('.question').is('.question') || $(e.target).parents('.answer').is('.answer')) {
                dregAction.stopSearch('up', e);

                switch (dregAction.part) {
                    case '.question':
                        lineGame.answer_num[lineGame.start_idx[1]] = lineGame.start_idx[0];
                        break;
                    case '.answer':
                        lineGame.answer_num[lineGame.start_idx[0]] = lineGame.start_idx[1];
                        break;
                }
                console.log('dregEvent.tuchDown : %c저장된 시작 인덱스 번호 ->' + lineGame.start_idx[1], c_color);
                lineGame.start_idx = [];

            } else {
                // 연결이 안됫을시
                lineGame.answer_num[lineGame.start_idx[0]] = null;
                dregAction.reset(lineGame.start_idx[0]);
                lineGame.start_idx = [];
            }

            console.log("touchUpEvent ->%c"+lineGame.answer_num,e_color);

            // 예시답안 확인버튼 노출
            if (lineGame.answer_num.indexOf(null) == -1){
                $('.line_check').show();
            }

            $dreg_target.removeEventListener(GameManager.eventSelector('eventMove'), dregEvent.tuchMove, false);
            e.preventDefault();
            e.stopPropagation();
        },
        tuchMove: function (e) {
            dregAction.stopSearch('move', e);
            e.preventDefault();
            e.stopPropagation();
        }
    }


    var dregAction = {
        idx_stap: [],
        reset: function (x) {
            //reset
            console.log('전달받은 reset 값 ->'+x)

            if (typeof(x) == 'number'){
                $('#svg_container').children('line').eq(x).attr({
                    'x1': 0,
                    'y1': 0,
                    'x2': 0,
                    'y2': 0
                });
            } else if (x == 'reset'){
                cconsole.log('그렇다면 내가 오지게 실행되야하는 부분인거 인정?]')
                $('#svg_container').children('line').attr({
                    'x1': 0,
                    'x2': 0,
                    'y1': 0,
                    'y2': 0
                });

            }

        },
        centerfixe: function (val, type) {

            var qs = dregLineSetting.qSpotArea[dregAction.idx];
            var as = dregLineSetting.aSpotArea[dregAction.idx];
            var w = dregLineSetting.potin_area;

            if (dregAction.part == '.question') {
                if ((val > qs.left || val > qs.left && val < qs.left + w || val < qs.left + w) && type == 'x') {
                    var centerpoint = qs.left + w - w / 2 || qs.left + w - w / 2;
                    centerpoint = centerpoint - $($dreg_target).offset().left;
                }

                if ((val > qs.top || val > qs.top && val < qs.top + w || val < qs.top + w) && type == 'y') {
                    var centerpoint = qs.top + w - w / 2 || qs.top + w - w / 2;
                    centerpoint = centerpoint - $($dreg_target).offset().top;
                }

            } else if (dregAction.part == '.answer') {

                if ((val > as.left || val > as.left && val < as.left + w || val < as.left + w) && type == 'x') {
                    var centerpoint = as.left + w - w / 2 || as.left + w - w / 2;
                    centerpoint = centerpoint - $($dreg_target).offset().left;
                }

                if ((val > as.top || val > as.top && val < as.top + w || val < as.top + w) && type == 'y') {
                    var centerpoint = as.top + w - w / 2 || as.top + w - w / 2;
                    centerpoint = centerpoint - $($dreg_target).offset().top;
                }

            }
            return centerpoint;

        },
        stopSearch: function (status, element) {

            switch (status) {
                case 'down':
                    console.log('stopSearch(' + status + ')->%c' + status + ' 위치찾음',c_color );
                    var mouseX = element.pageX || element.changedTouches[0].clientX;
                    var mouseY = element.pageY || element.changedTouches[0].clientY;
                    dregAction.spotArea(element, mouseX, mouseY);
                    dregAction.addDrowLine(mouseX, mouseY, status, dregAction.idx);
                    break;
                case 'up':
                    console.log('stopSearch(' + status + ')->%c' + status + ' 위치찾음', w_color);
                    var mouseX = element.pageX || element.changedTouches[0].clientX;
                    var mouseY = element.pageY || element.changedTouches[0].clientY;
                    dregAction.spotArea(element, mouseX, mouseY);
                    dregAction.addDrowLine(mouseX, mouseY, status);
                    break;
                case 'move':
                    var mouseX = element.pageX || element.changedTouches[0].clientX;
                    var mouseY = element.pageY || element.changedTouches[0].clientY;
                    dregAction.addDrowLine(mouseX, mouseY, status);
                    break;
            }
        },
        spotArea: function (element, x, y) {


            $.each(dregLineSetting.qSpotArea, function (i, e) {
                var widthScope = $($dreg_target).find(".question li:eq(" + i + ")").children('span').width();
                if (x > e.left && x < e.left + widthScope && y > e.top && y < e.top + widthScope) {
                    //정보추가
                    dregAction.idx = i;
                    dregAction.part = '.question';
                    lineGame.start_idx.push(i);
                }
            });


            $.each(dregLineSetting.aSpotArea, function (i, e) {
                var widthScope = $($dreg_target).find(".answer li:eq(" + i + ")").children('span').width();
                if (x > e.left && x < e.left + widthScope && y > e.top && y < e.top + widthScope) {
                    //정보추가
                    dregAction.idx = i;
                    dregAction.part = '.answer';
                    lineGame.start_idx.push(i)

                }
            });
        },
        addDrowLine: function (x, y, status, idx) {
            x = x - $($dreg_target).offset().left;
            y = y - $($dreg_target).offset().top;

            var st_x, st_y, en_x, en_y;


            switch (status) {
                case 'down':
                    x = dregAction.centerfixe(x, 'x') / zoomViews;
                    y = dregAction.centerfixe(y, 'y') / zoomViews;
                    st_x = x;
                    st_y = y;
                    en_x = en_x || x;
                    en_y = en_y || y;

                    break;

                case 'move':
                    en_x = x / zoomViews;
                    en_y = y / zoomViews;
                    break;

                case 'up':
                    en_x = dregAction.centerfixe(x, 'x') / zoomViews;
                    en_y = dregAction.centerfixe(y, 'y') / zoomViews;

                    break;
            }



            $('#svg_container').children('line').eq(lineGame.start_idx[0]).attr({
                'x1': st_x,
                'y1': st_y,
                'x2': en_x,
                'y2': en_y
            });

        }
    }

    linePops = setTimeout(function () {
        //초기설정
        var startGragLine = function () {
            console.log('실행됨');
            dregLineSetting.init();
            $dreg_target.addEventListener(GameManager.eventSelector('eventDown'), dregEvent.tuchDown, false);
            $dreg_target.addEventListener(GameManager.eventSelector('eventUp'), dregEvent.tuchUp, false);
        }

        $('.drag_quiz').each(function (i, e) {
            $(this).attr('id', 'pop_' + i);
            dregLineSetting['pop_' + i] = false;
            console.log('%c퀴즈이벤트 -> ' + i + '개 있습니다.' + 'idx_' + i + '가 부여 되었습니다.', w_color)
        });

        var taridx = $('.drag_quiz').attr('id');

        if ($('.drag_quiz').parents('.fpop_wrap').is('.confirm')){
            $('.btn_fpop').click(function(){
                if (!dregLineSetting[taridx]){
                    startGragLine()
                }
                dregLineSetting[taridx] = true;
            });
        } else if ($('div').is('.drag_quiz')){
            startGragLine()
        }
    }, 100);

})
*/