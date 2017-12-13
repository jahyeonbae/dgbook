//OS 분기처리
var ipadOS = false;
if (navigator.appVersion.indexOf("iPad")!=-1) ipadOS = true;

var AndroidOS = false;
if ( navigator.userAgent.toLowerCase().indexOf("android") != -1 ) AndroidOS = true;

var isPc = (AndroidOS == false && ipadOS ) ? true : false;

var WindowsTenOS = false;
if ( navigator.userAgent.toLowerCase().indexOf("webview") != -1 ) WindowsTenOS = true;

$(document).ready(function(){


	//별도 팝업(새창 1536 x 1024)
	$('.pop_wrap .pop_close').on('click',function(){
		window.close();
	});


	//레이어 팝업(768 x 1024)
	$('.layer_wrap .layer_close').on('click',function(){
		$('.layer_wrap').hide();
	});



	//레이어 OPEN 개별 js에서 함수를 호출 layer_open('s_t',0);
	layer_open = function(type,tab){

		$('.layer_wrap.'+ type).show();
		$('.layer_wrap.'+ type).find('.tabs.note span').removeClass('active').eq(tab).addClass('active');
		$('.layer_wrap.'+ type).find('.layer_body ul.tab_layer> li').hide().eq(tab).show();
	}



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

	//ref 참조사항 본문 클릭 닫기
	$('.ref .text').on('click',function(){
		$(this).prev().removeClass('active');
		$(this).hide();
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
	if($('.ex_answer')){$('.ex_answer').hide().parent().removeClass('active');};
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
	//$("body").append("<textarea style='width:300px;height:300px;position:fixed;top:0;left:0;z-index:999999999;font-size:20px'>zoomRate :"+parent.ZOOMVALUE+" clientHeight : "+GameManager.event.clientHeight+" clientWidth : "+GameManager.event.clientWidth+" wrapHeight : "+GameManager.event.wrapHeight+" wrapWidth : "+GameManager.event.wrapWidth+"</textarea>");
    // alert(GameManager.event.zoomRate);
}


/* 웹뷰 Scale 조정치 */
currentScale=function()
{
	if( typeof WebKitCSSMatrix == "undefined" )
		return 1;

	if( window.getComputedStyle(document.body).webkitTransform == "none" )
		return 1;

	var curTransform = new WebKitCSSMatrix(window.getComputedStyle(document.body).webkitTransform);

	return curTransform.d;
}




function AllOff(){
	$("video, audio").each(function(){
		$(this).get(0).pause();
		$(this).parent().find('.play_pause_button').removeClass('pause');
		$(this).parent().find('.play_pause_button').addClass('play');
		$(this).parent().find('.play_pause_button').html('재생');
	});
	
	stopAllAudio();
	closePop(); //commstr.js: 모든 팝업 닫기
}


//####################################### 사운드 연속재생 관련
var audio = new Audio();
var playList = [];
var currentRed;
var listOn = false; //이어서 재생중인지
function setSoundList(whichStr){
	var slist = [
		{	id:'015_1',
			slist:['s401_015_01_01.mp3','s401_015_01_02.mp3','s401_015_01_03.mp3','s401_015_01_04.mp3',
			's401_015_01_05.mp3','s401_015_01_06.mp3','s401_015_01_07.mp3','s401_015_01_08.mp3']
		}
	];
	for (var i=0;i<slist.length;i++){
		if (slist[i].id == whichStr){
			playSoundList(slist[i].slist);
			break;
		}
	}
}
function playSoundOne(list){
	playList = list;
	playAudioNext();
}
function playSoundOneRed(list, elem){
	currentRed = null;
	playList = list;
	playAudioNext();
	currentRed = elem;
}

function playSoundList(list){			
	//문장 연속 읽어주기 사운드
	playList = [];
	for (var i=0;i<list.length;i++){
		playList.push("media/audio/" + list[i]);
	}
	playAudioNext();
}
function playDirectiveSound(mp3name){
	AllOff();
	playList = ["media/sound/directive/" + mp3name];
	playAudioNext();
}
function playEffSound(mp3name){
	playList = ["media/sound/effect/" + mp3name];
	playAudioNext();
}

function playAudioNext(){
	audio.pause();

	var song = playList.shift();
	if (song){

		audio = new Audio(song);
		audio.addEventListener('ended', onAudioEnd, false);
		audio.play();
	}else{
		audioComplete(); //commstr.js
	}
}
function onAudioEnd(){
	if (currentRed){		
		resignRed(currentRed);
	}
	playAudioNext();
}
function stopAllAudio(){
	console.log('[stopall]');
	audio.pause();
	playList = [];
	//
	resignRed(currentRed); //commstr.js
	destroyOnePlayer();
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

