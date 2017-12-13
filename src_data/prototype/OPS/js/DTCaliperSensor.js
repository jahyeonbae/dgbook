/*
    file name : DTCaliperSensor.js
    description : Digital Textbook 2017 CaliperSensor object
	create date : 2017-06-22
	creator : saltgamer
	version: 1.2
*/

'use strict';

var DTCaliperSensor = DTCaliperSensor || {};
DTCaliperSensor = (function () {

	var DTCaliper = {
		caliperSensorStoreUrl: 'https://www.keris.or.kr/sensor',
		sendCaliperEvent: function (params) {
			var resultJSON = {
				'sensor': this.caliperSensorStoreUrl,
				'sendTime': this.toDateTimeString(new Date()),
				'data': {
					'@context': 'http://purl.imsglobal.org/ctx/caliper/v1p1',
					'@type': 'http://purl.imsglobal.org/caliper/v1/AssessmentEvent',
					'actor': {
						'@id': 'https://www.keris.or.kr/user',
						'@type': 'http://purl.imsglobal.org/caliper/v1/lis/Person'
					},
					'action': params.action,
					'responseType': params.responseType,
					'url': document.location.href,
					'eventTime': this.toDateTimeString(new Date()),
					'session': {
						'@id': 'https://www.keris.or.kr/session/' + this.generateUID(),
						'@type': 'Session',
						'startedAtTime': '2017-11-15T10:00:00.000Z'
					},
					'id': 'urn:uuid:' + params.id	
				}
			};

			if (params.action === 'complete') {
				resultJSON.data.generated = {
					'@id': params.id + this.generateUID(),
					'@type': params.responseType,
					'attempt': 'https://example.edu/terms/201601/courses/7/sections/1/assess/1/items/3/users/554433/attempts/1',
					'dateCreated': this.toDateTimeString(new Date()),
					'startedAtTime': this.toDateTimeString(new Date()),
					'endedAtTime': this.toDateTimeString(new Date()),
					'score':params.score,
					'values':params.value
				}
			}

			console.log('--> resultJSON : ', resultJSON);
			console.log('--> resultJSON : ', JSON.stringify(resultJSON));
			// ==== [Native API] =============================================================================
			console.log('%c ▶▷ [Native API] storeCaliperSensorData ', 'color:#ff6600');

			var jsonData = {
				apiName : 'storeCaliperSensorData',
				parameters : {
					caliperSensorData: resultJSON
				},
				callBack : 'storeCaliperSensorDataCallBack'
			};

			window[jsonData.callBack] = function (response) {

				//********************************************
				// URL Decoding
				response = decodeURIComponent(response);
				response =  JSON.parse(response);
				//********************************************

				delete window[jsonData.callBack];
			};

			this.sendMessageToNative(jsonData.apiName, JSON.stringify(jsonData));
           	// ==== [Native API] =============================================================================

		},

		fire: function (params) {
			console.log('--> fire : ', params);
			
			var itemObj = params.itemObject,
				action, score;
			switch (params.correct) {
				case null:
					action = 'passed';
					break;
				case true:
					action = 'complete';
					score = 1;
					break;
				case false:
					action = 'complete';
					score = 0;
					break;
			}

			this.sendCaliperEvent({
				correct: params.correct,
				itemObject: params.itemObject,
				id: itemObj.getAttribute('data-qid'),
				action: action,
				score: score,
				value: params.value,
				responseType: itemObj.getAttribute('data-response-type')
			});

		},
		toDateString: function (oDate) {
			var y = oDate.getFullYear(),
				m = oDate.getMonth() + 1,
				d = oDate.getDate();
			return y + "-" + (m < 10 ? "0" : "") + m + "-" + (d < 10 ? "0" : "") + d;
		},
		toDateTimeString: function (oDate) {
			oDate = oDate instanceof Date ? oDate : this.parseDate(oDate);
			var h = oDate.getHours(),
			 	m = oDate.getMinutes(),
				s = oDate.getSeconds();
			return this.toDateString(oDate) + " " + (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;;
		},
		parseDate:function(dtstr) {
		    var dt = dtstr.split(/[: T-]/).map(parseFloat);
			return new Date(dt[0], dt[1] - 1, dt[2], dt[3] || 0, dt[4] || 0, dt[5] || 0, 0);
		},
		generateUID: function () {
            var d = new Date().getTime();
            if(window.performance && typeof window.performance.now === "function"){
                d += performance.now();; //use high-precision timer if available
            }
            var uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uid;
        },
        sendMessageToNative : function (API_NAME, jsonData) {
			console.log('☆ sendMessageToNative...');

			//***************************************
			// URL Encoding 
			jsonData = encodeURIComponent(jsonData);
			//***************************************

			var API_URL = 'studyProtocol://' + API_NAME + '?data=' + jsonData;
			console.log('%c ▷ API_URL Native ===> ', 'color:#ff6600', API_URL);
			console.log('studyProtocol://' + API_NAME + '?data=' + decodeURIComponent(jsonData));
            console.log('-> getPlatform : ', this.detect.getPlatform());
            switch (this.detect.getPlatform()) {
                case 'WIN':
					// for WIN
					if (typeof (window.external) !== 'undefined' && ('notify' in window.external)) {
	                    window.external.notify(API_URL);
					}
					break;
                case 'RT':
                    // for RT
					window.location.assign('http://studyProtocol/' + API_NAME + '?data=' + jsonData);
                    break;
                default:
                    // for iOS, Android
                    window.location.assign(API_URL);    
                    break;
            }
		},
        detect: {
            regexCheck : function (regexString) {
                return (regexString).test(navigator.userAgent);
            },
            isWindows : function () {
                return this.regexCheck(/(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i);
            },
            isWinRT : function () {
                return this.regexCheck(/(windows)\snt\s6\.2;\s(arm)/i);	
            },
            isWin10 : function () {
                return this.regexCheck(/(edge)\/((\d+)?[\w\.]+)/i);
            },
            isiOS : function () {
                return this.regexCheck(/(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i);
            },
            isMac : function () {
                return this.regexCheck(/(macintosh|mac(?=_powerpc)\s)/i);	
            },
            isAndroid : function () {
                return this.regexCheck(/(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i);		
            },
            isLinux : function () {
                return this.regexCheck(/(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i);			
            },
            getPlatform : function () {
                var platform;
                if (this.isWindows()) {
                    platform = 'WIN';
                } 
                if (this.isWin10()) {
                    platform = 'RT';
                }
                if (this.isiOS()) {
                    platform = 'IOS';
                } 
                if (this.isMac()) {
                    platform = 'MAC';
                } 
                if (this.isAndroid()) {
                    platform = 'ANDROID';
                } 
                if (this.isLinux()) {
                    platform = 'LINUX';
                } 		
                return platform;
            }
        }

	};

	return DTCaliper;


})();
