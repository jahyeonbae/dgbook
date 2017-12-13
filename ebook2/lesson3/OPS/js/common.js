
//OS 분기처리
var ipadOS = false;
if (navigator.appVersion.indexOf("iPad")!=-1) ipadOS = true;

var AndroidOS = false;
if ( navigator.userAgent.toLowerCase().indexOf("android") != -1 ) AndroidOS = true;

var isPc = (AndroidOS == false && ipadOS ) ? true : false;

var WindowsTenOS = false;
if ( navigator.userAgent.toLowerCase().indexOf("webview") != -1 ) WindowsTenOS = true;

$(document).ready(function(){

	//학습목표 레이어
	$('.ibtn.study').click(function(){
		$(this).parent().next('.popup-type2').toggle();
	});

	$('.popup-type1-close').click(function(){
		$('.popup-type2').hide();
	});

	// 정답 확인 버튼 클릭시 정답 보이는 레이어
	$(".answer_check").click(function(){
		var index = $(this).index();

		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$(this).children().next().css('display','none');
			//$(" :input").each(function(){
			$(this).parent().find('input, textarea').each(function(){
				$(this).val('');
				//console.error($(this).attr('id'));
				if (parent.API_ANNOTATION_INPUT_DELETE) parent.API_ANNOTATION_INPUT_DELETE($(this).attr('id'));
			});
		}else{
			$('.answer_check').each(function(idx){
				//if(index === idx){

				//}else{
					$(this).removeClass('active');
					$(this).children().next().css('display','none');
				//}
			});

			$(this).addClass('active');
			$(this).children().next().css('display','block');
		}
	});


	//용어정리 레이어
	$(".term").each(function(){
		$(this).on("click", function(){
			$this = $(this);
			$(".term_layer").each(function(){
				$(this).remove();
			});
			//layerAclose();
			terms($this);

		});
	});

	function terms($this){
		var termTop = $this.offset().top;
		var termLeft = $this.offset().left;
		var termWidth = $this.width();

		if (parent.ZOOMVALUE == undefined) {
			parent.ZOOMVALUE = 1;
		}
		var zoom = parent.ZOOMVALUE;

		termTop = termTop / zoom;
		termLeft = termLeft / zoom;

		/*화살표의 위치*/
		if (termTop > 400 && termTop < 900){
			posY = "b";
		}else{
			posY = "t";
		}

		if (termLeft > 400){
			posX = "r";
		}else{
			posX = "l";
		}

		posArrow = posY + posX;

		termId = $this.attr("data-term");

		$.ajax({
			type: "GET",
			url: "term_list.xml",
			dataType: "xml",
			success: function(xml) {
				$(xml).find('term_list').each(function(){
					$("term", $(this)).each(function(){
						term = $(this).attr("sid");
						if (termId == term )
						{
							tit = $(this).attr("title");
							des = "<div style='padding-right:9px; line-height:22px;text-align:justify;'>"+$(this).attr("des")+"</div>";
							asrc = $(this).attr("src");
							if (asrc != ""){
								src_str = "<div style='padding:5px'><img id='eee' width='280' /></div>";
							}else{
								src_str = "";
							}

							$termLayer = $("<div class='term_layer' style='width:300px;'>" +
								"<div style='position:absolute;top:0px;left:0px;width:100%;height:30px;background-color:rgb(248, 216, 56);border-radius:3px 3px 0px 0px;'>"+
								"<div style='position:absolute;top:4px;left:0px;font-size:16px;height:20px;padding:3px 10px; color:#fff;'>"+tit+"</div>"+
								"<div style='position:absolute;top:-2px;right:5px;'><img class='termclose' src='images/common/close.png'/></div>"+
								"</div>" +
								"<span class='" + posArrow +"'></span>" + des +
								src_str	+
								"</div>").appendTo("body");

							$('#eee').attr('src',asrc);

							setTimeout(function(){
								termLayerHeight = $termLayer.height();

								if (posY == 'b'){
									termLayerTop = termTop - termLayerHeight - 50-17;
								}else {
									termLayerTop = termTop + 29;
								}

								if (posX == 'r'){
									termLayerLeft = termLeft + termWidth -345 +37;
								}else {
									termLayerLeft = termLeft - 6 ;
								}

								$termLayer.css({
									top:termLayerTop,
									left:termLayerLeft
								});


								$(".term_layer").each(function(){
									$(this).on("click", function(){
										$(this).remove();
									});
								});
							},100);
						}
					});
				});
			}
		});
	}

	//별도 팝업(새창 1536 x 1024)
	$('.pop_wrap .pop_close').on('click',function(){
		window.close();
	});


	//레이어 팝업(768 x 1024)
	$('.layer_wrap .layer_close').on('click',function(){
		$('.layer_wrap').hide();
	});



	//type
	/*
	s_t:스스로탐구
	m_t모여서탐구
	s_p스스로평가
	s_j스스로점검
	j_f중단원평가
	d_f대단원평가
	dr_f동료평가
	d_r더알아보기
	b_h배운내용확인하기
	s_h생생한
	sh_p수행평가
	h_g활동지
	*/
	//레이어 OPEN 개별 js에서 함수를 호출 layer_open('s_t',0);
	var layer_open = function(type,tab){

		//$('.layer_wrap.'+ type).css('display','block');
		$('.layer_wrap.'+ type).fadeIn(100);
		$('.layer_wrap.'+ type).find('.tabs.note span').removeClass('active').eq(tab).addClass('active');
		$('.layer_wrap.'+ type).find('.layer_body ul.tab_layer> li').hide().eq(tab).css('display','block');


/*
		$('.layer_wrap.'+ type).css('visibility','visible');
		$('.layer_wrap.'+ type).find('.tabs.note span').removeClass('active').eq(tab).addClass('active');
		$('.layer_wrap.'+ type).find('.layer_body ul.tab_layer> li').css('visibility','hidden').eq(tab).css('visibility','visible');
		*/
	}
	//레이어 tab 체인지
	$('.tabs.note span').on('click',function(){
		var idx = $(this).index();
		var tabobj = $(this).closest('.layer_wrap');
		$(this).parent().find('.tabs.note span').removeClass('active').eq(idx).addClass('active');
		tabobj.find('ul.tab_layer> li').hide().eq(idx).css('display','block');

		//tab 체인지시 예시답안 닫기 및 버튼 name
		if(tabobj.find('.ex_anwser')){
			tabobj.find('.ex_anwser').each(function(){
				$(this).removeClass('active');
			});
			tabobj.find('.answer_check').each(function(){

				if(tabobj.hasClass('s_t') || tabobj.hasClass('m_t') || tabobj.hasClass('s_p') || tabobj.hasClass('dr_f')){
					$(this).html('예시답안');
				}
			});
		}
	});



	//내용핵심정리
	$('.summarize_wrap .summarize_btn').on('click',function(){
		layerAclose();
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$('.summarize_pop').hide();
		}else{
			$(this).addClass('active');
			$('.summarize_pop').show();
		}
	});
	//내용핵심정리 본문 클릭 닫기
	$('.summarize_wrap .summarize_pop').on('click',function(){
		$('.summarize_wrap .summarize_btn').removeClass('active');
		$('.summarize_pop').hide();
	});



	//ref 참조사항
	$('.ref .title').on('click',function(){
		//학습목표닫기
		if($('.learning_goal .learning_goal_title')){
			$('.learning_goal .learning_goal_title').removeClass('active').parent().children('.learning_goal_text').hide();
		}
		//용어설명 닫기
		//$(".term_layer").each(function(){
		//	$(this).remove();
		//});

		//ref 여러개 있을 경우 닫기
		var index = $(this).parent().index();//부모 index 값
		$('.ref .title').each(function(){
			var idx = $(this).parent().index();//부모 index 값
			if(idx !== index){
				$(this).removeClass('active');
				$(this).parent().children('.text').hide();
			}
		});

		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$(this).parent().children('.text').hide();
		}else{
			$(this).addClass('active');
			$(this).parent().children('.text').show();
		}

	});
	//ref 참조사항 본문 클릭 닫기
	$('.ref .text').on('click',function(){
		$(this).prev().removeClass('active');
		$(this).hide();
	});

	//학습목표
	$('.learning_goal .learning_goal_title').on('click',function(){
		//ref 참조사항
		if($('.ref .title')){
			$('.ref .title').removeClass('active').parent().children('.text').hide();
		}
		//용어설명 닫기
		//$(".term_layer").each(function(){
		//	$(this).remove();
		//});

		if($(this).hasClass('active')){
			$(this).removeClass('active');
			$(this).parent().children('.learning_goal_text').hide();
		}else{
			$(this).addClass('active');
			$(this).parent().children('.learning_goal_text').show();
		}

	});
	//학습목표 본문 클릭 닫기
	$('.learning_goal .learning_goal_text').on('click',function(){
		$('.learning_goal .learning_goal_img').removeClass('active');
		$('.learning_goal .learning_goal_text').hide();
	});


});

//학습목표, 참조사항, 각종레이어 닫기
//레이어를 공통으로 닫기를 할 경우 이곳에 추가한다.
function layerAclose(){
	if($('.summarize_pop'))$('.summarize_pop').hide();
	if($('.ref .title'))$('.ref .title').removeClass('active').parent().children('.text').hide();
	if($('.learning_goal .learning_goal_img'))$('.learning_goal .learning_goal_img').removeClass('active').parent().children('.learning_goal_text').hide();
	if($('.a_ps'))$('.a_ps').hide();
	if($('.b_ps')){$('.b_ps').hide()};
	if($('.s_p_answer')){$('.s_p_answer').hide();};
	//if($('.ex_answer')){$('.ex_answer').hide().parent().removeClass('active');};
}

//슬라이더 js
var imageSlide = {

	init : function(){

		var slide_content = document.getElementsByClassName('slider_content');
		for(var i=0,j=slide_content.length; i<j; i++){
			var slider_image = slide_content[i].getElementsByClassName('slider_image')[0];
			var image = slider_image.children;
			var thumbnail = slide_content[i].getElementsByClassName('slider_thumbnail')[0];
			var prev_button = slide_content[i].getElementsByClassName('slide_prev_button')[0];
			var next_button = slide_content[i].getElementsByClassName('slide_next_button')[0];
			var thumbnail_list = thumbnail.children;
			slider_image.firstElementChild.classList.add('on')
			for(var m=0,n=thumbnail_list.length; m<n; m++){
				if(m===0) thumbnail_list[m].classList.add('on');
				thumbnail_list[m].addEventListener('mousedown',imageSlide.showImg,false);
				image[m].addEventListener('touchstart', imageSlide.swipe.swiper, false);
				image[m].addEventListener('touchmove', imageSlide.swipe.swiper, false);
				image[m].addEventListener('touchend',imageSlide.swipe.swiper, false);
			}



			prev_button.style.opacity = "0.3";
			prev_button.style.pointerEvents = 'none';
			prev_button.addEventListener('mousedown',function(){
				imageSlide.buttonAction.prevImageShow.call(this.parentNode);
			});
			next_button.addEventListener('mousedown',function(){
				imageSlide.buttonAction.nextImageShow.call(this.parentNode);
			});

		}
	},


	showImg  : function(){
		var content =  this.parentNode.parentNode.parentNode;
		var index = parseInt(this.getAttribute('data-num'));
		var slide = content.getElementsByClassName('slider_image')[0];
		var prevButton = content.getElementsByClassName('slide_prev_button')[0];
		var nextButton = content.getElementsByClassName('slide_next_button')[0];
		this.parentNode.getElementsByClassName('on')[0].classList.remove('on');
		this.classList.add('on');
		slide.getElementsByClassName('on')[0].classList.remove('on');
		slide.children[index-1].classList.add('on');
		if(index===slide.children.length) {
			nextButton.style.opacity = "0.3";
			nextButton.style.pointerEvents = 'none';
			prevButton.style.opacity = "1";
			prevButton.style.pointerEvents = 'auto';
		}else if(index===1){
			prevButton.style.opacity = "0.3";
			prevButton.style.pointerEvents = 'none';
			nextButton.style.opacity = "1";
			nextButton.style.pointerEvents = 'auto';
		}else {
			nextButton.style.opacity = "1";
			nextButton.style.pointerEvents = 'auto';
			prevButton.style.opacity = "1";
			prevButton.style.pointerEvents = 'auto';
		}


	},

	buttonAction : {

		prevImageShow : function(){
			console.log(this)
			var slide = this.getElementsByClassName('slider_image')[0];
			var thumbnail = this.getElementsByClassName('slider_thumbnail')[0];
			var index = parseInt(thumbnail.getElementsByClassName('on')[0].getAttribute('data-num'));
			var prevButton = this.getElementsByClassName('slide_prev_button')[0];
			var nextButton = this.getElementsByClassName('slide_next_button')[0];
			if(index === 1) {
				return false;
			}else{
				slide.getElementsByClassName('on')[0].classList.remove('on');
				slide.children[index-2].classList.add('on');
				thumbnail.getElementsByClassName('on')[0].classList.remove('on');
				thumbnail.children[index-2].classList.add('on');
				if(index === 2) {
					prevButton.style.opacity = "0.3";
					prevButton.style.pointerEvents = 'none';
					nextButton.style.opacity = "1";
					nextButton.style.pointerEvents = 'auto';
				}
			}


		},

		nextImageShow : function(){
			var slide = this.getElementsByClassName('slider_image')[0];
			var thumbnail = this.getElementsByClassName('slider_thumbnail')[0];
			var index = parseInt(thumbnail.getElementsByClassName('on')[0].getAttribute('data-num'));
			var prevButton = this.getElementsByClassName('slide_prev_button')[0];
			var nextButton = this.getElementsByClassName('slide_next_button')[0];

			if(index === slide.children.length) {
				return false;
			}
			else {
				slide.getElementsByClassName('on')[0].classList.remove('on');
				slide.children[index].classList.add('on');
				thumbnail.getElementsByClassName('on')[0].classList.remove('on');
				thumbnail.children[index].classList.add('on');
				if(index === slide.children.length-1) {
					nextButton.style.opacity = "0.3";
					nextButton.style.pointerEvents = 'none';
					prevButton.style.opacity = "1";
					prevButton.style.pointerEvents = 'auto';
				}else{
					nextButton.style.opacity = "1";
					nextButton.style.pointerEvents = 'auto';
					prevButton.style.opacity = "1";
					prevButton.style.pointerEvents = 'auto';
				}
			}
		}
	},
	swipe : {
		touch : null,
		start_x : null,
		start_y : null,
		end_x : null,
		end_y : null,
		move : false,
		swiper : function(event){
			if (typeof event !== 'undefined') {
				if (typeof event.touches !== 'undefined') {
					imageSlide.swipe.touch = event.touches[0];
					if(event.type === 'touchstart'){
						imageSlide.swipe.start_x = Math.floor(imageSlide.swipe.touch.pageX);
						imageSlide.swipe.start_y = Math.floor(imageSlide.swipe.touch.pageY);
						imageSlide.swipe.move = false;
					}else if(event.type === 'touchmove'){
						imageSlide.swipe.move = true;
						imageSlide.swipe.end_x = Math.floor(imageSlide.swipe.touch.pageX);
						imageSlide.swipe.end_y = Math.floor(imageSlide.swipe.touch.pageY);
					}else if(event.type === 'touchend'){
						if(imageSlide.swipe.move) imageSlide.swipe.start_x - imageSlide.swipe.end_x > 0 ? imageSlide.buttonAction.prevImageShow.call(this.parentNode.parentNode.parentNode.parentNode) : imageSlide.buttonAction.nextImageShow.call(this.parentNode.parentNode.parentNode.parentNode)

					}
			}
		}
	}
}
}

// 디바이 터치 등록
var GameManager = {
	event: {
		isTouchDevice: 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch,
		eventSelector: function (eventType) {
            // console.log('□ this.isTouchDevice :', this.isTouchDevice);
            var selectedEvent;
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
};

// createElement 초기 설정
function QSAll (target) {return document.querySelectorAll(target);}

function createElement (type, targetElement, className, width, height) {
	var createObject = document.createElement(type);

	if (className !== undefined) createObject.className = className;
	if (width !== undefined) 	 createObject.style.width = width + 'px';
	if (height !== undefined) 	 createObject.style.height = height + 'px';

	targetElement.appendChild(createObject);
	return createObject;
}


// 디바이 터치 등록
var GameManager = {
	event: {
		isTouchDevice: 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch,
		eventSelector: function (eventType) {
            // console.log('□ this.isTouchDevice :', this.isTouchDevice);
            var selectedEvent;
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
};


function QS (target) { return document.querySelector(target); }
function eventSelector (eventType, e) {
	var eventMaster;

	if (eventType === 'eventDown') {
		switch (GameManager.event.eventSelector('eventDown')) {
			case "mousedown":
			eventMaster = e;
			break;
			case "touchstart":
			e.preventDefault();
			eventMaster = e.touches.item(0);
			break;
		}
	} else if (eventType === 'eventMove') {
		switch (GameManager.event.eventSelector('eventMove')) {
			case "mousemove":
			eventMaster = e;
			break;
			case "touchmove":
			eventMaster = e.touches.item(0);
			break;
		}
	} else if (eventType === 'eventUp') {
		switch (GameManager.event.eventSelector('eventUp')) {
			case "mouseup":
			eventMaster = e;
			break;
			case "touchend":
			eventMaster = e.changedTouches[0];
			break;
		}
	} else if (eventType === 'eventOut') {
		switch (GameManager.event.eventSelector('eventOut')) {
			case "mouseout":
			eventMaster = e;
			break;
			case "touchleave":
			eventMaster = e.touches.item(0);
			break;
		}
	}
	return eventMaster;
}


// 이벤트(설정) 추가 : mousedown, mousemove, mouseup, mouseout
function addEvent (target, eType, fnc) {
	var eventType;
	switch(eType){
		case 'mousedown': eventType = GameManager.event.eventSelector('eventDown'); break;
		case 'mousemove': eventType = GameManager.event.eventSelector('eventMove'); break;
		case 'mouseup':   eventType = GameManager.event.eventSelector('eventUp'); break;
		case 'mouseout':  eventType = GameManager.event.eventSelector('eventOut'); break;
	}
	return target.addEventListener(eventType, fnc, false);
}

// 이벤트(설정) 삭제 : mousedown, mousemove, mouseup, mouseout
function removeEvent (target, eType, fnc) {
	var eventType;
	switch(eType) {
		case 'mousedown': eventType = GameManager.event.eventSelector('eventDown'); break;
		case 'mousemove': eventType = GameManager.event.eventSelector('eventMove'); break;
		case 'mouseup':   eventType = GameManager.event.eventSelector('eventUp'); break;
		case 'mouseout':  eventType = GameManager.event.eventSelector('eventOut'); break;
	}
	return target.removeEventListener(eventType, fnc, false);
}

// 선택 사운드 (mousedown, touchstart)
function soundEvent (target, src) {
	target.addEventListener(GameManager.event.eventSelector('eventDown'), function(){
		efSound(src);
	}, false);
}



function initScale(id) {
	//var wrap = document.getElementById('container');
	var wrap = document.getElementById(id);

	GameManager.event.clientWidth = document.body.clientWidth;
	GameManager.event.clientHeight = document.body.clientHeight;

	GameManager.event.wrapWidth = wrap.clientWidth;
	GameManager.event.wrapHeight = wrap.clientHeight;

	GameManager.event.zoomVertical = (GameManager.event.clientHeight / GameManager.event.wrapHeight) * 1.0;
	GameManager.event.zoomHorizontal = (GameManager.event.clientWidth / GameManager.event.wrapWidth) * 1.0;

	if(parent.ZOOMVALUE == undefined) {
		parent.ZOOMVALUE = 1;
	}
	if (GameManager.event.clientHeight < GameManager.event.clientWidth) {
		GameManager.event.zoomRate = parent.ZOOMVALUE;
	} else {
		GameManager.event.zoomRate = GameManager.event.zoomHorizontal;
	}

    // alert(GameManager.event.zoomRate);
}



function AllOff(){
	$("video, audio").each(function(){
		$(this).get(0).pause();
		$(this).parent().find('.play_pause_button').removeClass('pause');
		$(this).parent().find('.play_pause_button').addClass('play');
		$(this).parent().find('.play_pause_button').html('재생');

	});
}


//문제 클릭시 사운드
function play_sound_click(){
	if( $('audio#player-audio-click').length < 1){
		var audioStr_click='';
		audioStr_click=audioStr_click+'<audio id="player-audio-click">';
		audioStr_click=audioStr_click+'<source type="video/mp4">';
		audioStr_click=audioStr_click+'</audio>';
		$('body').append(audioStr_click);
	}
	var audioFix_click=$('audio#player-audio-click')[0];
	var aSrc_click='media/click.mp3';
	audioFix_click.src=aSrc_click;
	audioFix_click.load();
	audioFix_click.play();
}

//정답 사운드
function play_sound_o(){
	if( $('audio#player-audio-o').length < 1){
		var audioStr_click='';
		audioStr_click=audioStr_click+'<audio id="player-audio-o">';
		audioStr_click=audioStr_click+'<source type="video/mp4">';
		audioStr_click=audioStr_click+'</audio>';
		$('body').append(audioStr_click);
	}
	var audioFix_click=$('audio#player-audio-o')[0];
	var aSrc_click='media/eff_ok.mp3';
	audioFix_click.src=aSrc_click;
	audioFix_click.load();
	audioFix_click.play();
}
//오답 사운드
function play_sound_x(){
	if( $('audio#player-audio-x').length < 1){
		var audioStr_click='';
		audioStr_click=audioStr_click+'<audio id="player-audio-x">';
		audioStr_click=audioStr_click+'<source type="video/mp4">';
		audioStr_click=audioStr_click+'</audio>';
		$('body').append(audioStr_click);
	}
	var audioFix_click=$('audio#player-audio-x')[0];
	var aSrc_click='media/eff_fail.mp3';
	audioFix_click.src=aSrc_click;
	audioFix_click.load();
	audioFix_click.play();
}

//안드로이드 4.0 4.1 체크
function chkAndroid(){
	var uAgent = navigator.userAgent.toLowerCase();
	var mobilePhones = new Array('android 4.0','android 4.1');
	var isAndroid = false;
	for(var i=0;i < mobilePhones.length; i++){
		if(uAgent.indexOf(mobilePhones[i]) > -1)
		{
			isAndroid = true;
			break;
		}
	}
	return isAndroid;
}

//블라인드
function blind(){
	$('.blind').fadeIn();
};/*!
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
    
};
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
*/;function term_dic (tg,x,y){
    
    x = x || 0;
    y = y || 0;
 
    var wrapW = $('.wraps').width();
    var key = $(tg).find('.word').width();
    var keydd = $(tg).find('.descript').outerWidth(true);

    
    $(tg).find('.descript').addClass('animated bounce').css({
        marginLeft:function(){
            return -($(this).innerWidth() / 2) + x;
        }
    })

    if (x != 0) {
        $(tg).find('.descript').addClass('x');
        $('.dicstyle').remove();
        $('<style class="dicstyle" type="text/css">span.descript:after{margin-left:'+ -1*x +'px;}</style>').appendTo('head');

    }

    if(y=='bottom'){
        var h = $(tg).find('.descript').height();
        $(tg).find('.descript').css({
            'top':h/3,
            'height':'144px'
        }) 
        $('.dicstyle').remove();
        $('<style class="dicstyle" type="text/css">strong.dic span.descript:after{margin-left:' + -1 * x + 'px; bottom:none; top:-7px; border-left:2px solid #00A75E;border-top:2px solid #00A75E; border-right:0 none; border-bottom:0 none;}</style>').appendTo('head');
    }

    var status = $(tg).children('.descript').css('display');
    
    $('.dic').children('.descript').hide();

    setTimeout(function(){
        if (status == 'none'){
            $(tg).children('.descript').show();
        }else if (status == 'block'){
            $(tg).children('.descript').hide();
        }
        
    },100)


    

    


}

;
/*!
descript:슬라이드베너
file:parts_slide.js
refactoring before
*/

var slide_view = {
    slide : Array(),
    idx : Array(),
    init: function () {


        this.slide = $(".slide");
        for (var i = 0; i < this.slide.length; i++) {

            this.idx[i] = 0;
            var s = $(this.slide[i]);

            s.find('.next').addClass('on');
            s.find(".list > div").eq(0).addClass('on');

        }

    },
    slidemovemuent: function (slide, index, start, end) {
        // 이동
        var tg = slide.find('.list').children('div').children('div')

        tg.eq(index).css({
                'display': 'block',
                'left': start
            }).stop().animate({
                'left': end
            }).parent().addClass('on').siblings().removeClass('on');

    },
    nexts:function(e) {
        e.preventDefault();

        var slide = $(this).parents(".slide");
        var index = $(".slide").index(slide);

        var items = slide.find('.list>div');

        console.log(slide);

        if(slide_view.idx[index] == items.length-1){
           return;
        }else{
            slide_view.slidemovemuent(slide, slide_view.idx[index], '0', '-100%');
            slide_view.idx[index]++
            slide_view.slidemovemuent(slide, slide_view.idx[index], '100%', '0');

            if(slide_view.idx[index] == items.length - 1){
                slide.find('.next').removeClass('on');
                slide.find('.prev').addClass('on');
            }else if (slide_view.idx[index] != items.length - 1 && slide_view.idx[index] != 0){
                slide.find('.next').addClass('on');
                slide.find('.prev').addClass('on');
            }
        }
        
    },
    prevs: function (e) {
        e.preventDefault();

        var slide = $(this).parents(".slide");
        var index = $(".slide").index(slide);


        var items = slide.find('.list>div');

        if (slide_view.idx[index] <= 0) {
            return
        } else {
            slide_view.slidemovemuent(slide, slide_view.idx[index], '0', '100%');
            slide_view.idx[index] --;
            slide_view.slidemovemuent(slide, slide_view.idx[index], '-100%', '0');

            if (slide_view.idx[index] <= 0) {
                slide.find('.next').addClass('on');
                slide.find('.prev').removeClass('on');
                
            }else if (slide_view.idx[index] != items.length - 1 && slide_view.idx[index] != 0) {
                slide.find('.next').addClass('on');
                slide.find('.prev').addClass('on');
            }
        }
    },
    quickEvent:function(e){
        e.preventDefault();

        var slide = $(this).parents(".slide");
        var index = $(".slide").index(slide);
        var items = slide.find('.list>div');


        slide_view.idx[index] = $(this).parent().index();
        var hisnum = slide.find('.list>div.on').index();

        if (slide_view.idx[index] > hisnum){

            slide_view.slidemovemuent(slide, hisnum, '0', '-100%');
            slide_view.slidemovemuent(slide, slide_view.idx[index], '100%', '0');

            if (slide_view.idx[index] == items.length - 1) {

                slide.find('.next').removeClass('on');
                slide.find('.prev').addClass('on');

            } else if (slide_view.idx[index] != items.length - 1 && slide_view.idx[0] != 0) {

                slide.find('.next').addClass('on');
                slide.find('.prev').addClass('on');

            }

        }else if(slide_view.idx[index] < hisnum){

            slide_view.slidemovemuent(slide, hisnum, '0', '100%');
            slide_view.slidemovemuent(slide, slide_view.idx[index], '-100%', '0');

            if (slide_view.idx[index] <= 0) {

                slide.find('.next').addClass('on');
                slide.find('.prev').removeClass('on');

            } else if (slide_view.idx[index] != items.length - 1 && slide_view.idx[index] != 0) {

                slide.find('.next').addClass('on');
                slide.find('.prev').addClass('on');

            }
        }else{
            return;
        }
    }
}


$(window).load(function(){
    slide_view.init();
    $('.slide .next').on('click', slide_view.nexts);
    $('.slide .prev').on('click', slide_view.prevs);
    $('.slide a').on('click', slide_view.quickEvent);

});
setTimeout(function(){
    $('.input_answer').trigger('keyup');
},1000);;$(function(){

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
});;$(function(){
    // 별도팝업 탭 기능
    var $div = $(".tab_list li div"),
        $firstList = $(".tab_list li:first-child");
    
    $div.hide();
    $firstList.addClass("on").find("div").show();
    
    $(".tab_list li > button").on("click", function () {
        var $this = $(this);

        $div.hide().parent("li").removeClass("on");
        $this.parent("li").addClass("on").end()
        .next().show();
    });


})

// 범례
function toggleimg (ti) {
    var idx = $(ti).index();
    console.log(idx)
    $(ti).toggleClass('on');
    $(ti).parents().next().children('li').eq(idx).toggleClass('on animated flash');
}

;$(function () {

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

});$(function () {

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

});
// ******************************************************************************
/*
// createElement 초기 설정
function QS (target) { return document.querySelector(target); }
function createElement (type, targetElement, className, width, height) {
    var createObject = document.createElement(type);

    if (className !== undefined) createObject.className = className;
    if (width !== undefined) 	 createObject.style.width = width + 'px';
    if (height !== undefined) 	 createObject.style.height = height + 'px';

    targetElement.appendChild(createObject);
    return createObject;
}
*/


// ******************************************************************************
// 미디어 컨트롤 : 초기 설정
var idxr=0;
function mediaInit(idx) {
	var wrap = document.querySelector('#vwrap'),
	videoWrap = wrap.getElementsByClassName('videoWrap');
	AllOff();
		
	if(videoWrap.length > 0) {
		mediaType(mediaInfo[idx].folder[0]);
	}
	idxr = idx;

}


// 변수 설정
var videoArray = [],
	soundFlag = false,
	vdoFlag = false,
	fullFlag = false,
	screenFlag = false;

var duration, vdoWasPaused;
var blockSeek = false;


// 미디어 컨트롤 : 이벤트
function mediaType(src) {
	console.log('@ mediaControl ...');

	var wrap = document.querySelector('#vwrap'),
		ani = wrap.getElementsByClassName('ani'),
		videoWrap = wrap.getElementsByClassName('videoWrap');
		
	var ani_p = ani[0];
	var videoWrap_p = videoWrap[0];

	if(document.querySelector('.videoContainer')){//기존 비디오가 있으면 삭제		
		document.querySelector('#playBar').value = 0;
		document.querySelector('#vdo').currentTime = 0;
		//document.querySelector('.videoContainer').remove();
		document.querySelector('.videoContainer').parentNode.removeChild(document.querySelector('.videoContainer'));
	}

	var videoContainer = createElement('div', videoWrap_p, 'videoContainer');
	var videoContainerHTML = document.querySelector('.videoContainer');
	console.log(src)
	var splitSrc = src.split('/', '3');

	console.log(splitSrc);

	// 비디오 태그 생성
	/* videoContainerHTML = '<video style="background-color:#fff;" id="vdo" class="vdos" poster="./media/'+ splitSrc[2] +'/'+ splitSrc[3] +'.jpg" controls="" webkit-playsinline="" playsinline=""><source src="'+ src +'.mp4" type="video/mp4"></source></video>';
	videoContainerHTML += '<img class="thumImg" src="./media/'+ splitSrc[2] +'/'+ splitSrc[3] +'.jpg" />';
	videoContainerHTML += '<div class="captionBox"><div class="captionbg"></div><div class="captionTxt"></div></div>';
	videoContainerHTML += '<div class="controlsbg"></div>';
	videoContainerHTML += '<div class="videoControls">';
	videoContainerHTML += '<div id="play" class="controls"></div>';
	videoContainerHTML += '<div id="stop" class="controls"></div>';
	videoContainerHTML += '<div class="bar"><input id="playBar" type="range" min="0" max="100" value="0" step="1" oninput="onSeek(this.value)" onchange="onSeekRelease(this.value)"/></div>';
	videoContainerHTML += '<div class="time"><span id="curtime">00:00</span> | <span id="durtime">00:00</span></div>';
	videoContainerHTML += '<div class="vcaption">자막 감추기</div>';
	videoContainerHTML += '<div class="fullsize">전체 화면</div>';
	videoContainerHTML += '</div>'; */


	videoContainerHTML = '<video style="background-color:#fff;" id="vdo" class="vdos" poster="./media/'+ splitSrc[2] +'.jpg" controls="" webkit-playsinline="" playsinline="">';
	videoContainerHTML += '<source src="'+ src +'.mp4" type="video/mp4"></source>';
	videoContainerHTML += '</video>';
	videoContainerHTML += '<img class="thumImg" src="./media/'+ splitSrc[2] +'.jpg" />';
	videoContainerHTML += '<div class="captionBox">';
	videoContainerHTML += '<div class="captionbg"></div>';
	videoContainerHTML += '<div class="captionTxt"></div>';
	videoContainerHTML += '</div>';
	videoContainerHTML += '<div class="controlsbg">';
	videoContainerHTML += '<div class="videoControls">';
	videoContainerHTML += '<div id="play" class="controls"></div>';
	videoContainerHTML += '<div id="stop" class="controls"></div>';
	videoContainerHTML += '<div class="bar"><input id="playBar" type="range" min="0" max="100" value="0" step="1" oninput="onSeek(this.value)" onchange="onSeekRelease(this.value)"/></div>';
	videoContainerHTML += '<div class="time"><span id="curtime">00:00</span> | <span id="durtime">00:00</span></div>';
	videoContainerHTML += '<div id="mute" class="controls"></div>'; // 1005 by Chaney 음소거 추가
	videoContainerHTML += '<div class="volbar"><input id="playVolume" type="range" min="0" max="100" step="1" oninput="panVolume(this.value)" onchange="panVolume(this.value)"/></div>'; // 1005 by Chaney 볼륨바 추가
	//videoContainerHTML += '<div class="vcaption">자막 감추기</div>';
	videoContainerHTML += '<div class="vcaption">자막 감추기</div>';
	videoContainerHTML += '<div class="fullsize">전체 화면</div>';
	videoContainerHTML += '</div>';
	videoContainerHTML += '</div>';
	// videoContainerHTML += '<div class="vclose"><img src="img/pop_top_close_o.png" alt="닫기"/></div>';

	videoContainer.innerHTML = videoContainerHTML;


	document.querySelector('.captionBox').style.visibility = 'hidden';
	videoWrap_p.appendChild(videoContainer);

	var vdo = document.querySelector('#vdo'),
		play = document.querySelector('#play');

	setTimeout(function () {
		var vdo = document.querySelector('#vdo'),
			play = document.querySelector('#play'),
			stop = document.querySelector('#stop'),
			mute = document.querySelector('#mute'), // 1005 by Chaney 음소거 추가
			playBar = document.querySelector('#playBar'),
			playVolume = document.querySelector('#playVolume'),
			fullsize = document.querySelector('.fullsize'),
			caption = document.querySelector('.vcaption'), 
			videoContainer = document.querySelector('.videoContainer');
			//vclose =  document.querySelector('.vclose');

		play.innerHTML = '<img alt="" src="./img/common/vdo/btn_play.png"/>';
		stop.innerHTML = '<img alt="" src="./img/common/vdo/btn_stop.png"/>';
		mute.innerHTML = '<img alt="" src="./img/common/vdo/btn_mute.png"/>';// 1005 by Chaney 음소거 추가
		caption.innerHTML = '<img alt="" src="./img/common/vdo/btn_cap.png"/>';// 1005 by Chaney 자막 추가
		fullsize.innerHTML = '<img alt="" src="./img/common/vdo/btn_zoom.png"/>';// 1024 by Chaney 전체화면 추가
		vdo.load();
		vdo.controls = false;
		vdo.play();		
		vdo.addEventListener('play',function(){
			//play.chidNodes[0].src = './img/common/controls/vdo/btnPause.png';
			document.querySelector('.thumImg').style.display = 'none';
			play.innerHTML = '<img alt="" src="./img/common/vdo/btn_pause.png"/>';
		});

		//신규추가
		vdo.addEventListener("pause", function () {
			play.innerHTML = '<img alt="" src="./img/common/vdo/btn_play.png"/>';
			blockSeek = false;
		});

		//음소거 추가 - 1005 by Chaney
		vdo.addEventListener("mute", function () {
			mute.innerHTML = '<img alt="" src="./img/common/vdo/btn_mute.png"/>';
			blockSeek = false;
		});	
		
		// 자막 버튼 
		caption.addEventListener('mousedown', function(e) {
			var captionBox = document.querySelector('.captionBox');
			if(captionBox.style.visibility == 'visible') {
				captionBox.style.visibility = 'hidden';
				document.querySelector('.vcaption').innerHTML = '<img alt="" src="./img/common/vdo/btn_cap.png"/>'; // 자막 보이기
			} else {
				captionBox.style.visibility = 'visible';
				document.querySelector('.vcaption').innerHTML = '<img alt="" src="./img/common/vdo/btn_cap_on.png"/>'; // 자막 감추기
			}
		}, false);


		// 재생 및 일시정지 버튼
		play.addEventListener('click', function(e) {
			if(vdo.paused) {
				document.querySelector('.thumImg').style.display = 'none';
				play.childNodes[0].src = './img/common/vdo/btn_pause.png';
				vdo.play();
				fullFlag = false;
				screenFlag = true;
				blockSeek = false;
				vdo.controls = false;
				if(QS('.fullPlay_videoWrap') != null) {
					QS('.fullPlay_videoWrap').parentNode.removeChild(QS('.fullPlay_videoWrap'));
				}
			} else {
				play.childNodes[0].src = './img/common/vdo/btn_play.png';
				vdo.pause();
				blockSeek = false;
			}

		}, false);

		//팝업창 닫기
		// vclose.addEventListener('click', function(e) {
		// 	play.childNodes[0].src = './img/btn_play.png';
		// 	vdo.pause();
		// 	blockSeek = false;
		// }, false);


		// 정지 버튼
		stop.addEventListener('click', function() {
			play.childNodes[0].src = './img/common/vdo/btn_play.png';
			playBar.value = 0;
			vdo.currentTime = 0;
			vdo.pause();

			document.querySelector('.thumImg').style.display = 'block';
			screenFlag = false;
			vdo.controls = false;
			blockSeek = false;

		}, false);

		// 음소거 버튼
		mute.addEventListener('click', function(e) {
			playVolume = document.querySelector('#playVolume');
			if(vdo.muted == false) {
				vdo.muted = true;
				mute.childNodes[0].src = './img/common/vdo/btn_mute_on.png';
				vdo.volume = 0;
				playVolume.value = '0';
			} else {
				vdo.muted = false;
				mute.childNodes[0].src = './img/common/vdo/btn_mute.png';
				vdo.volume  = 0.5;
				playVolume.value = '50%';
			}

		}, false); 



		// 전체화면 버튼
		fullsize.addEventListener('click', function(e) {
			var page_1 = document.querySelector('.page_1'),
				pageContainer = document.querySelector('.pageContainer'),
				videoWrap = document.querySelector('.videoWrap');
			
			if (vdo.requestFullscreen) {
				if (vdo.fullScreenElement) {
					vdo.cancelFullScreen();
					vdo.controls = false;
				} else {
					vdo.requestFullscreen();
					vdo.controls = true;
				}
			} else if (vdo.msRequestFullscreen) {
				if (vdo.msFullscreenElement) {
					vdo.msExitFullscreen();
					vdo.controls = false;
				} else {
					vdo.msRequestFullscreen();
					vdo.controls = true;
				}
			} else if (vdo.mozRequestFullScreen) {
				if (vdo.mozFullScreenElement) {
					vdo.mozCancelFullScreen();
					vdo.controls = false;
				} else {
					vdo.mozRequestFullScreen();
					vdo.controls = true;
				}
			} else if (vdo.webkitRequestFullscreen) {
				
				if (vdo.webkitFullscreenElement) {
					vdo.webkitCancelFullScreen();
					vdo.controls = false;
				} else {					
					vdo.webkitRequestFullscreen();
					vdo.controls = true;
				}
			}

			setTimeout(function () {
				var state = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
				var event = state ? 'FullscreenOn' : 'FullscreenOff';

				if(event == 'FullscreenOn') {
					vdo.controls = true;
				} else if(event == 'FullscreenOff') {
					vdo.controls = false;
				}
			}, 200);

		}, false);


		controlBar();
		controlSliders();

		document.body.addEventListener('mousedown', function(e) {
			//console.error(1);
			setTimeout(function () {
				var state = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
				var event = state ? 'FullscreenOn' : 'FullscreenOff';

				if(event == 'FullscreenOn') {
					vdo.controls = true;
				} else if(event == 'FullscreenOff') {
					vdo.controls = false;
				}
				// console.log('body : ' + event);
			}, 200);
		});
		
		//풀스크린 모드 control 제어
		document.addEventListener('webkitfullscreenchange', function (e) {
			var state = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
			var event = state ? 'FullscreenOn' : 'FullscreenOff';

			if(event == 'FullscreenOn') {
				vdo.controls = true;
			} else if(event == 'FullscreenOff') {
				vdo.controls = false;
			}
		});
		document.addEventListener('mozfullscreenchange', function (e) {
			var state = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
			var event = state ? 'FullscreenOn' : 'FullscreenOff';

			if(event == 'FullscreenOn') {
				vdo.controls = true;
			} else if(event == 'FullscreenOff') {
				vdo.controls = false;
			}
		});
		document.addEventListener('fullscreenchange', function (e) {
			var state = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
			var event = state ? 'FullscreenOn' : 'FullscreenOff';

			if(event == 'FullscreenOn') {
				vdo.controls = true;
			} else if(event == 'FullscreenOff') {
				vdo.controls = false;
			}
		});
		
	}, 20);
}



// ************************************************************************************
// 동영상 컨트롤바 기본 설정
function controlBar() {
	var vdo = document.querySelector('#vdo'),
    	playBar = document.querySelector('#playBar'),
		play = document.querySelector('#play'),
		stop = document.querySelector('#stop'),
		curtime = document.querySelector('#curtime');
		mute = document.querySelector('#mute'); // 1005 by Chaney
		caption = document.querySelector('#vcatopn'); // 1024 by Chaney
		playVolume = document.querySelector('#playVolume'); // 1005 by Chaney
//console.error('curtime',curtime);
    vdo.addEventListener('emptied', enableDisableplayBar, false);
    vdo.addEventListener('loadeddata', enableDisableplayBar, false);
    vdo.addEventListener('timeupdate', onTimeupdate, false);

    vdo.addEventListener('durationchange', enableDisableplayBar, false);
    vdo.addEventListener('durationchange', onTimeupdate, false);

    playBar.addEventListener('mousedown', onSeek, false);
    playBar.addEventListener('change', onSeekRelease, false);
	
}

// 동영상 : 로드(총 시간)
function enableDisableplayBar() {
	var vdo = document.querySelector('#vdo'),
    	playBar = document.querySelector('#playBar'),
		play = document.querySelector('#play'),
		stop = document.querySelector('#stop');

		curtime = document.querySelector('#curtime');
		durtime = document.querySelector('#durtime');
		duration = Math.round(vdo.duration);

	if(duration && !isNaN(duration)) {
    	playBar.max = duration;
    }

    // play time
    var curmins = Math.floor(Math.round(vdo.currentTime) / 60),
        cursecs = Math.floor(Math.round(vdo.currentTime) - curmins * 60),
        durmins = Math.floor(Math.round(vdo.duration) / 60),
        dursecs = Math.floor(Math.round(vdo.duration) - durmins * 60);

    if(cursecs < 10) { cursecs = '0' + cursecs; }
    if(dursecs < 10) { dursecs = '0' + dursecs; }
    if(curmins < 10) { curmins = '0' + curmins; }
    if(durmins < 10) { durmins = '0' + durmins; }

    curtime.innerHTML = curmins + ':' + cursecs;
    durtime.innerHTML = durmins + ':' + dursecs;

    setTimeout(function () {
		var state = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
		var event = state ? 'FullscreenOn' : 'FullscreenOff';

		if(event == 'FullscreenOn') {
			vdo.controls = true;
		} else if(event == 'FullscreenOff') {
			vdo.controls = false;
		}
	}, 200);
}


// 동영상 : 플레이바(체크) 진행
function onSeek() {
	var vdo = document.querySelector('#vdo'),
		playBar = document.querySelector('#playBar'),
		play = document.querySelector('#play'),
		stop = document.querySelector('#stop');

	window.requestAnimationFrame(function () {
		vdo.currentTime = playBar.value;		
	});
    
	if(!blockSeek) {
        blockSeek = true;
        vdoWasPaused = vdo.paused;
        vdo.pause();
    }

    setTimeout(function () {
		var state = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
		var event = state ? 'FullscreenOn' : 'FullscreenOff';

		if(event == 'FullscreenOn') {
			vdo.controls = true;
		} else if(event == 'FullscreenOff') {
			vdo.controls = false;
		}
	}, 200);
}

// 동영상 : 플레이바(체크) 갱신
function onSeekRelease() {
	var vdo = document.querySelector('#vdo'),
		playBar = document.querySelector('#playBar'),
		play = document.querySelector('#play'),
		stop = document.querySelector('#stop');

	window.requestAnimationFrame(function () {
		vdo.currentTime = playBar.value;
	});

    if(!vdoWasPaused) {
        //console.error('control',playBar.max,Math.round(vdo.currentTime));
		if(playBar.max == Math.round(vdo.currentTime)) {
        	play.childNodes[0].src = './img/common/vdo/btn_play.png';
			vdo.pause();
		} else {
			play.childNodes[0].src = './img/common/vdo/btn_pause.png';
			vdo.oncanplaythrough = function(){ 	// 콘솔오류 fixed - Chaney
				vdo.play();
			};
		}
    }
    blockSeek = false;
}

// 동영상 : 시간 업데이트
function onTimeupdate() {
	var vdo = document.querySelector('#vdo'),
		playBar = document.querySelector('#playBar'),
		play = document.querySelector('#play'),
		stop = document.querySelector('#stop');

	if(!blockSeek) {
	    playBar.value = vdo.currentTime;
	}

	// 텍스트 씽크  // 임시 캡션 끄기 -Chaney
	var sndtxt = document.querySelectorAll('.sndTxt'),
		captionTxt = document.querySelector('.captionTxt'),
		currTime = vdo.currentTime;

	for(var i = 0; i < mediaInfo[idxr].sync.length; i++) {
		if( (currTime >= mediaInfo[idxr].sync[i][0]) && (currTime <= mediaInfo[idxr].sync[i][1]) ) {
			captionTxt.innerHTML = mediaInfo[idxr].syncText[i];
		}
		else if(currTime >= mediaInfo[idxr].sync[i][1]) {
			captionTxt.innerHTML = '';
		}
	}

	setTimeout(function () {
		var state = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
		var event = state ? 'FullscreenOn' : 'FullscreenOff';

		if(event == 'FullscreenOn') {
			vdo.controls = true;
		} else if(event == 'FullscreenOff') {
			vdo.controls = false;
		}
	}, 200);
}



// ************************************************************************************
// 동영상 컨트롤바 : 타임에 따른 컨트롤 적용
function controlSliders() {
	var vdo = document.querySelector('#vdo'),
		playBar = document.querySelector('#playBar'),
		sliders = document.querySelectorAll('input[type=range]'),
		play = document.querySelector('#play'),
		bar = document.querySelector('.bar');

	for (var i = 0; i < sliders.length; i++) {
		var st = document.createElement('style');
		st.id = 's' + sliders[i].id;
		document.head.appendChild(st);

		sliders[0].addEventListener('input', function () { handleSlider(this)}, false);
		sliders[0].addEventListener('change', function () { handleSlider(this)}, false);
	}

	vdo.addEventListener('timeupdate', function () { handleSlider(this)}, false);

	vdo.addEventListener('ended', function() {
		play.childNodes[0].src = './img/common/vdo/btn_play.png';
		vdo.pause();

		var state = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
		var event = state ? 'FullscreenOn' : 'FullscreenOff';

		if(event == 'FullscreenOn') {
			vdo.controls = true;
		} else if(event == 'FullscreenOff') {
			vdo.controls = false;
		}
	}, false);
}

// 동영상 컨트롤바 : 타임에 따른 진행(스타일) 적용
function handleSlider() {
	var vdo = document.querySelector('#vdo');
	var tracks = [ '-webkit-slider-runnable-track',	];
	var thumbs = [ '-webkit-slider-thumb', ];

	var playBar = document.querySelector('#playBar');

    var gradValue = Math.round((playBar.value / playBar.getAttribute('max') * 0.99) * 100);
	var grad = 'linear-gradient(90deg,#FDD303 ' + gradValue + '%,#999 ' + (gradValue + 0.99) + '%)';
	var rangeSelector = 'input[id='+ playBar.id +']::';
	var rangeSelector = 'input[id=playBar]::';
	var styleString = '';
	var printedValue = (playBar.values) ? playBar.values[playBar.value] : playBar.value;

	for (var j = 0; j < tracks.length; j++) {
		styleString += rangeSelector + tracks[j] + ' { background: ' + grad + '; }';
	}
	if(gradValue == 0) {
		styleString = '';
	}
	document.getElementById('s' + playBar.id).textContent = styleString;
	//console.error(document.getElementById('s' + playBar.id).textContent);
	// play time
	var curmins = Math.floor(Math.round(vdo.currentTime) / 60),
		cursecs = Math.floor(Math.round(vdo.currentTime) - curmins * 60),
		durmins = Math.floor(Math.round(vdo.duration) / 60),
		dursecs = Math.floor(Math.round(vdo.duration) - durmins * 60);

	if(cursecs < 10) { cursecs = '0' + cursecs; }
	if(dursecs < 10) { dursecs = '0' + dursecs; }
	if(curmins < 10) { curmins = '0' + curmins; }
	if(durmins < 10) { durmins = '0' + durmins; }

	curtime.innerHTML = curmins + ':' + cursecs;
	durtime.innerHTML = durmins + ':' + dursecs;
}


// 동영상 볼륨조절 -- by Chaney 1005
function panVolume(val) { // Volume Control by Chaney - 1005
	var vdo = document.querySelector('#vdo');
		//mute = document.querySelector('#mute'),
		//playVolume = document.querySelector('#playVolume');

	vdo.volume = val / 100;

	if(vdo.volume > 0) {
		vdo.muted = false;
		mute.childNodes[0].src = './img/common/vdo/btn_mute.png';
	} else {
		vdo.muted = true;
		mute.childNodes[0].src = './img/common/vdo/btn_mute_on.png';
	}
		
	console.log('After: ' + vdo.volume);
}


// vdo.find('#playVolume').on('change', function(){ vdo.setVolume($(this).val()/100); }); // ie 테스트용

;function zoomView(tg, x, y) {
    
    if ($(tg).children('i').is('.fa-search-plus')) {
        $(tg).children('i').removeClass('fa-search-plus').addClass('fa-search-minus');
    } else if (!$(tg).children('button').is('.fa-search-plus')){
        $(tg).children('i').removeClass('fa-search-minus').addClass('fa-search-plus');
    }

    switch (x) {
        case "left":
            $(tg).parent().children('img').css('left', '0');
            break;
        case "right":
            $(tg).parent().children('img').css('right', '0');
            break;

    }

    switch (y) {
        case "top":
            $(tg).parent().children('img').css('top', '0');
            break;
        case "bottom":
            $(tg).parent().children('img').css('bottom', '0');
            break;

    }


    $(tg).parent().toggleClass('zoomup');

    $(tg).parent().children('img')
        .css({
            positison: "absolute",
            zindex: 1000,
            boxShadow: '3px 3px 10px #666',
            borderRadius: '10px'
        }).toggle(300);
    };
$(function(){
    // Embed 영상 재생
    $('.cbtn-play').on('click', function () {
        var vdo = $('#embed_vdo');
        vdo.get(0).play();
        $(this).hide();
        //vdo.find('.touch-pause').show();
    });

    // Embed 영상 일시정지 
    $('#embed_vdo').on('click', function(){
        var vdo = $('#embed_vdo');
        vdo.get(0).pause();
        $('.cbtn-play').show();
    });
});
/*!
writer:doongi
descript:별점
file:stars.js
*/
$(function(){

    var ckecks = false;
    $('.stars span').on('click', function (e) {
        
        var idx = $(this).index();

        $(this).prevAll().children('input').prop('checked',true);
        $(this).nextAll().children('input').removeAttr('checked');

      
        if(idx <= 1){
            $(this).parent().next('button').css('visibility','visible');
        } else{
            $(this).parent().next('button').css('visibility', 'hidden');
        }

        if (idx == 0 && !$(this).children('input').is(':checked')) {
            $(this).parent().next('button').css('visibility', 'hidden');
        }
            
    });

});function mediaPop() {
    layerAclose();
    $('.zoom_img_wrap.a').delay(500).show(0);
    mediaInit(0);
}

function pop_vclose() {
    AllOff();
    $('.zoom_img_wrap').hide();
}


//common global
function openpop(tg) {
    console.log(tg)
    //$('.popup-text-wrap').hide();
    $(tg).show();
}


function redataPop(des, target) {
    if($('.zoom_img_wrap:not(.a)').length > 0){
        $('.zoom_img_wrap:not(.a)').show();
    } else {
        var ui_block = '<div class="zoom_img_wrap" style="display:block;"></div>';
        //$('.popup-text-wrap').parent().append(ui_block);
        $(target).parents('.wrap').append(ui_block);
    }    
    //$('.popup-text-wrap').show().delay(1000);
    //$('.popup-text-wrap').find('.text span>span').text(des)
    $(target).show().delay(1000);
    $(target).find('.text span>span').text(des)
    //$('.popup-text-content img').addClass('zoomIn');

    if (target){
        //$('.popup-text-content').hide();
        //$('.popup-text-content').show();
    }
    
}

$(function(){

    $('.fpop_close').on('click', function () {
        $(this).parents('.fpop_wrap').hide();
    });

});function audiorRead(id) {
    var tg= $(id).get(0);
    if (tg.paused) {
        tg.play();
    } else if (!tg.paused) {
        tg.pause();
        tg.currentTime = 0;
    }
};var crossAnswerObj = {
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
};
(function($){
    
    $.fn.drag = function (info) {
        /*
            info 
                .item position 위치정보
                .contain position 위치정보
                .idx 타겟인덱스
                .traget 목표
        */ 

        
        var zoomViews;
        var $this = $(this)[0];

        var this_idx = $(".drag").index(this);

        info = {
            magnetic: true
        };

        info.orgItem = new Array;
        info.curItem = new Array;
        info.itembox = new Array;
        info.contain = new Array;
        
        $(this).find('>div').css({
            'position': 'absolute',
            'zIndex': '10'
        });

        $(this).off('click');

        $(this).find('>div.dr_item').css('zIndex', '20')

        
        $(this).find('.dr_item').each(function (i, e) {
            info.orgItem.push($(e).position()); // 좌표 복원용 (원래 있던자리)
            info.curItem.push($(e).position()); // 좌표 비교용 (현재 item 이 있는곳
        });

        $(this).find('.dr_container').each(function (i, e) {
            info.contain.push($(e).position());
        });

        function viewport() {

            if (parent.ZOOMVALUE == undefined) {
                parent.ZOOMVALUE = 1;
            }

            zoomViews = parent.ZOOMVALUE;
            console.log(zoomViews)
        }

        $(window).resize(function () {
            viewport();
        })

        var eventDown = function(e){
            //눌럿을때
            targetMove('start',e,$(this));

            e.preventDefault();
            e.stopPropagation();
        };
        
        var eventMove  = function (e) {
            targetMove('move', e, $(this));
            e.preventDefault();
            e.stopPropagation();
        };

        var eventUp = function (e) {
            $this.removeEventListener(GameManager.eventSelector('eventMove'), eventMove, false);
            targetMove('end', e, $(this));
            e.preventDefault();
            e.stopPropagation();
        };

        var targetMove = function (type,element,tg){
            
            var mouseX = element.pageX || element.changedTouches[0].pageX;
            var mouseY = element.pageY || element.changedTouches[0].pageY;
            
            mouseX = mouseX - tg.offset().left;
            mouseY = mouseY - tg.offset().top;

            
            


           switch (type) {
                case 'start':

                    // 컨테이너 클릭시 동작 하지 않도록
                    if ($(element.target).hasClass("dr_container")) {
                        info.idx = -1;
                    }

                   $this.addEventListener(GameManager.eventSelector('eventMove'), eventMove, false);
                   $.each(info.curItem, function (i, e){
                       $(element.target).is('.dr_item') || !$(element.target).is('.dr_item') ? info.target = element.target : info.target = undefined;
                       if (posArea(element, e, mouseX, mouseY)) {
                           info.idx = i;
                       }
                   });

                   if ($(info.target).is('.dr_item')) {
                       itemMove(info.target, mouseX, mouseY,'ani');
                       boxArea(info.target)
                   }
                   
                   break;
                case 'move':
                   
                    if ($(info.target).is('.dr_item')){
                       itemMove(info.target, mouseX, mouseY);
                       boxArea(info.target)
                    }
                  
                    break;
                case 'end':

                    // 컨테이너 클릭시 동작 방지
                    if (info.idx == -1) return;

                    var isMagnetic = false;
                    var containers = tg.find('.dr_container');

                    for (var i = 0; i < containers.length; i++) {

                        var magneticX = false;
                        var magneticY = false;

                        var e = containers[i];

                        var cLeft = $(e).position().left/zoomViews;
                        var cTop = $(e).position().top/zoomViews;


                        var debug = "zoomViews : " + zoomViews;
                        debug += "<br /> cLeft : "+ cLeft ;
                        debug += "<br /> cTop : "+ cTop;
                        debug += "<br /> mouseX : "+ mouseX;
                        debug += "<br /> mouseY : "+ mouseY;
                
                        //$("#debugView").html(debug);

                        if (info.itembox[0] > cLeft && info.itembox[0] < cLeft + $(e).width()) magneticX = true;
                        if (info.itembox[0] + $(info.target).width() > cLeft && info.itembox[0] + $(info.target).width() < cLeft + $(e).width()) magneticX = true;
                        if (info.itembox[1] > cTop && info.itembox[1] < cTop + $(e).height()) magneticY = true;
                        if (info.itembox[1] + $(info.target).height() > cTop && info.itembox[1] + $(info.target).height() < cTop + $(e).height()) magneticY = true;


                        if (magneticX && magneticY) {

                            // 이미 들어가있는 item 이 있으면 out
                            var j = 0;
                            for (; j < info.curItem.length; j++) {
                                if (cLeft == info.curItem[j].left && cTop == info.curItem[j].top) break;
                            }

                            if (j == info.curItem.length) {
                                info.curItem[info.idx].left = cLeft;
                                info.curItem[info.idx].top = cTop;

                                $(info.target).animate({
                                    left: cLeft,
                                    top: cTop,
                                });

                                isMagnetic = true;
                                break;
                            }


                        }

                    }

                    // 붙은게 없으면 원복
                    if (!isMagnetic) {

                        info.curItem[info.idx].left = info.orgItem[info.idx].left / zoomViews;
                        info.curItem[info.idx].top = info.orgItem[info.idx].top / zoomViews;

                        $(info.target).animate({
                            left: info.orgItem[info.idx].left / zoomViews,
                            top: info.orgItem[info.idx].top / zoomViews,
                        });
                    }


                    console.log(info.idx);

                    magneticX = false;
                    magneticY = false;
                    $('.drganswer').eq(this_idx).show();
                break;
                
            }

        };

        function posArea(el, tg, x, y) {
            var statusArea;
            el = $(el.target);
            statusArea = x > tg.left && x < tg.left + el.width() && y > tg.top && y < tg.top + el.height();
            return statusArea
        }

        function boxArea(tg,area){
            info.itembox[0] = $(tg).position().left / zoomViews;
            info.itembox[1] = $(tg).position().top / zoomViews;
            
        }

        function itemMove(tg,x,y,type){
            switch (type) {
                case 'ani':
                    $(tg).stop().animate({
                        left: (x - $(tg).width() / 2) / zoomViews,
                        top: (y - $(tg).height() / 2) / zoomViews
                    }, 100)
                    break;
            
                default:
                    $(tg).stop().css({
                        left: (x - $(tg).width() / 2) / zoomViews,
                        top: (y - $(tg).height() / 2) / zoomViews
                    }, 500)
                    break;
            }
            
        }

      

        $(window).trigger('resize');

        $this.addEventListener(GameManager.eventSelector('eventDown'), eventDown,false);
        $this.addEventListener(GameManager.eventSelector('eventUp'), eventUp,false);
        $('.drgrest').hide();

        $('.drgrest').on('click',function(){
            $(this).hide();

            $(this).parent().find('.drganswer').show();
            $.each(info.orgItem,function(i,e){

                info.curItem[i].left = info.orgItem[i].left;
                info.curItem[i].top = info.orgItem[i].top;

                $($this).find('.dr_item').eq(i).css({
                    left:info.orgItem[i].left,
                    top: info.orgItem[i].top
                })
            })
        });
        

        $('.drganswer').on('click', function () {
            $(this).parent().find('.drgrest').show();
            $(this).hide();
            $($this).find('.dr_container').each(function(i,e){
                var val = $(this).attr('data-role-val');

                /*
                $($this).find('.dr_item:eq('+i+')').animate({
                    left: info.contain[val].left,
                    top: info.contain[val].top
                });
                */
                
                
            })
        })
    }

})(jQuery);


;(function ($) {

    $.fn.gameDice = function () {

        var $this = $(this);
        var imgPath = 'img/object/';
        var duration = 1500;
        var defaultDice = 6;
        var sumResultNum = 0;
        
        //팝업오픈
        var fn_diceOpen = function () {
            $this.find('.dice_pop').fadeIn(500);
            playdice();
        }

        var fn_diceClose = function () {
            $this.find('.dice_pop').fadeOut(500, function () {
                $(this).find('.dice').css('backgroundImage', 'url(' + imgPath + 'dice_01_01.png)');
            });

        }

        function result() {
            //주사위 결과값
            return Math.floor(Math.random() * defaultDice);
            
        }

        function sum(x) {
            //더하기 합산 결과 
            sumResultNum += x;
        }

        // 이름 생성기
        // function cerateNames(tg,n) {
        //     var replaceTarget = $(tg).css('background-image');
        //     var fileName = replaceTarget.split('/');
        //     var lentext = fileName[fileName.length - 1];
        //     var fileName = fileName[fileName.length - 1].substring(0, lentext.length-7);
        //     var randomNum = n;
        //     var createfileName = fileName + randomNum + '.png';

        //     sum(randomNum);
        //     return imgPath + createfileName;
        // }

        function playdice() {
            //TODO 주사위 이미지 순환
            var defaultNum = 0;

            var movement = setInterval(function () {
                $this.find('.dice_pop div').eq(0).removeClass().addClass('dic'+defaultNum);
                defaultNum++;
                $this.find('.dice_pop div').eq(1).removeClass().addClass('dic'+defaultNum);
                
                
                if(defaultNum == defaultDice){
                    defaultNum = 0;
                }

            }, 30);

            sumResultNum = 0;
            setTimeout(function () {
                clearInterval(movement);

                $this.find('.dice_pop div').each(function (i, e) {

                    console.log(result())

                    $(e).addClass('dic'+result());
                })
           
            }, duration);

        }

        $this.find('.dice_close').click(fn_diceClose);
        $this.find('.icon-imgC-key').click(fn_diceOpen);
    }



})(jQuery);
;(function ($) {
    $.fn.yut = function () {

        var $this = $(this);

        function randoms() {
            return Math.floor(Math.random() * 6)
        }

        var count = 1;
        var playYut = function () {
            $this.show();

            var play = setInterval(function () {
                count++; 

                $this.children('div').first().removeClass().addClass('y' + count);
                if (count == 10) {
                    count = 1
                }

            }, 130)

            setTimeout(function () {
                clearInterval(play)
                var a = 'a' + randoms()
                console.log(a)
                $this.children('div').first().removeClass().addClass(a)
            }, 900)


        }

        var close_yut = function () {
            $this.hide();
        }

        $this.next('div').children('.play-yut').click(playYut);
        $this.find('button.close_yut').click(close_yut)
    }

})(jQuery);