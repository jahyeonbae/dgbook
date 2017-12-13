
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
	var splitSrc = src.split('/', '4');

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


	videoContainerHTML = '<video style="background-color:#fff;" id="vdo" class="vdos" poster="./media/'+ splitSrc[2] +'/'+ splitSrc[3] +'.jpg" controls="" webkit-playsinline="" playsinline="">';
	videoContainerHTML += '<source src="'+ src +'.mp4" type="video/mp4"></source>';
	videoContainerHTML += '</video>';
	videoContainerHTML += '<img class="thumImg" src="./media/'+ splitSrc[2] +'/'+ splitSrc[3] +'.jpg" />';
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
	//videoContainerHTML += '<div class="volbar"><input id="playVolume" type="range" min="0" max="100" step="1" oninput="panVolume(this.value)" onChange="panVolume(this.value)"/></div>'; // 1005 by Chaney 볼륨바 추가
	videoContainerHTML += '<div class="volbar"><input id="playVolume" type="range" min="0" max="100" step="1" /></div>'; // 1005 by Chaney 볼륨바 ie 테스트용
	// videoContainerHTML += '<div class="vcaption">자막 감추기</div>';
	videoContainerHTML += '<div class="fullsize">전체 화면</div>';
	videoContainerHTML += '</div>';
	videoContainerHTML += '</div>';
	// videoContainerHTML += '<div class="vclose"><img src="img/pop_top_close_o.png" alt="닫기"/></div>';

	videoContainer.innerHTML = videoContainerHTML;


	//document.querySelector('.captionBox').style.visibility = 'visible'; // 임시 캡션 끄기 -Chaney
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
			//caption = document.querySelector('.vcaption'), // 임시 캡션 끄기 -Chaney
			videoContainer = document.querySelector('.videoContainer');
			vclose =  document.querySelector('.vclose');

		play.innerHTML = '<img alt="" src="./img/btn_play.png"/>';
		stop.innerHTML = '<img alt="" src="./img/btn_stop.png"/>';
		mute.innerHTML = '<img alt="" src="./img/btn_mute.png"/>';// 1005 by Chaney 음소거 추가
		fullsize.innerHTML = '<img alt="" src="./img/btn_zoom.png"/>';// 1005 by Chaney 음소거 추가
		vdo.load();
		vdo.controls = false;
		vdo.play();		
		vdo.addEventListener('play',function(){
			//play.chidNodes[0].src = './img/common/controls/vdo/btnPause.png';
			document.querySelector('.thumImg').style.display = 'none';
			play.innerHTML = '<img alt="" src="./img/btn_pause.png"/>';
		});

		//신규추가
		vdo.addEventListener("pause", function () {
			play.innerHTML = '<img alt="" src="./img/btn_play.png"/>';
			blockSeek = false;
		});

		//음소거 추가 - 1005 by Chaney 음소거 추가
		vdo.addEventListener("mute", function () {
			mute.innerHTML = '<img alt="" src="./img/btn_mute.png"/>';
			blockSeek = false;
		});
		
		
		// 자막 버튼   // 임시 캡션 끄기 -Chaney
		/* caption.addEventListener('mousedown', function(e) {
			var captionBox = document.querySelector('.captionBox');
			if(captionBox.style.visibility == 'visible') {
				captionBox.style.visibility = 'hidden';
				document.querySelector('.vcaption').innerHTML = '자막 보이기';
			} else {
				captionBox.style.visibility = 'visible';
				document.querySelector('.vcaption').innerHTML = '자막 감추기';
			}
		}, false); */


		// 재생 및 일시정지 버튼
		play.addEventListener('click', function(e) {
			if(vdo.paused) {
				document.querySelector('.thumImg').style.display = 'none';
				play.childNodes[0].src = './img/btn_pause.png';
				vdo.play();
				fullFlag = false;
				screenFlag = true;
				blockSeek = false;
				vdo.controls = false;
				if(QS('.fullPlay_videoWrap') != null) {
					QS('.fullPlay_videoWrap').parentNode.removeChild(QS('.fullPlay_videoWrap'));
				}
			} else {
				play.childNodes[0].src = './img/btn_play.png';
				vdo.pause();
				blockSeek = false;
			}

		}, false);

		//팝업창 닫기
		vclose.addEventListener('click', function(e) {
			play.childNodes[0].src = './img/btn_play.png';
			vdo.pause();
			blockSeek = false;
		}, false);


		// 정지 버튼
		stop.addEventListener('click', function() {
			play.childNodes[0].src = './img/btn_play.png';
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
			if(vdo.muted == false) {
				vdo.muted = true;
				mute.childNodes[0].src = './img/btn_mute_on.png';
			} else {
				vdo.muted = false;
				mute.childNodes[0].src = './img/btn_mute.png';
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
        	play.childNodes[0].src = './img/btn_play.png';
			vdo.pause();
		} else {
			play.childNodes[0].src = './img/btn_pause.png';
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
	/* var sndtxt = document.querySelectorAll('.sndTxt'),
		captionTxt = document.querySelector('.captionTxt'),
		currTime = vdo.currentTime;

	for(var i = 0; i < mediaInfo[idxr].sync.length; i++) {
		if( (currTime >= mediaInfo[idxr].sync[i][0]) && (currTime <= mediaInfo[idxr].sync[i][1]) ) {
			captionTxt.innerHTML = mediaInfo[idxr].syncText[i];
		}
		else if(currTime >= mediaInfo[idxr].sync[i][1]) {
			captionTxt.innerHTML = '';
		}
	} */

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
		play.childNodes[0].src = './img/btn_play.png';
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
	var vdo = document.querySelector('#vdo'),
		mute = document.querySelector('#mute'); // 1005 by Chaney

		vdo.volume = val / 100;
	//console.log('After: ' + vdo.volume);
	//if(vdo.volume == 0){
	//	mute.trigger('click'); /*-------------------------------- 볼륨 0일때 1이상일때 음소거 버튼 전환 루틴 작업 필요 ---------*/
	//}	

}


// vdo.find('#playVolume').on('change', function(){ vdo.setVolume($(this).val()/100); }); // ie 테스트용

