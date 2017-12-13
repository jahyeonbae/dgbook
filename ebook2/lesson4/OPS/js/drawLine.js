/*
*	Class 구현
*/
!function(){var t=!1,n=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/;this.Class=function(){},Class.extend=function(i){function r(){!t&&this.init&&this.init.apply(this,arguments)}var e=this.prototype;t=!0;var s=new this;t=!1;for(var o in i)s[o]="function"==typeof i[o]&&"function"==typeof e[o]&&n.test(i[o])?function(t,n){return function(){var i=this._super;this._super=e[t];var r=n.apply(this,arguments);return this._super=i,r}}(o,i[o]):i[o];return r.prototype=s,r.prototype.constructor=r,r.extend=arguments.callee,r}}();

/*	
 *	jQuery hitTest plugin
 */
//function Rectangle(e,t,n,r){this.x=e;this.y=t;this.width=n;this.height=r;this.toString=function(){return"(x="+this.x+", y="+this.y+", width="+this.width+", height="+this.height+")"};this.rectContainsPoint=function(e,t){return e>=this.x&&e<=this.x+this.width&&t>=this.y&&t<=this.y+this.height};this.intersects=function(e){return this.x<=e.x+e.width&&e.x<=this.x+this.width&&this.y<=e.y+e.height&&e.y<=this.y+this.height};this.intersection=function(e){var t=Math.max(this.x,e.x);var n=Math.min(this.x+this.width,e.x+e.width);if(t<=n){var r=Math.max(this.y,e.y);var i=Math.min(this.y+this.height,e.y+e.height);if(r<=i){return new Rectangle(t,r,n-t,i-r)}}return null}}(function(e){function t(t){var n=e(t).is("img");if(!n&&!e(t).is("canvas"))return null;var r=n?document.createElement("canvas"):t;if(!r.getContext)return null;var i;if(n){r.setAttribute("width",e(t).outerWidth());r.setAttribute("height",e(t).outerHeight());i=r.getContext("2d");i.drawImage(t,0,0,e(t).outerWidth(),e(t).outerHeight())}return r}e.fn.getRect=function(){var e=this.offset();if(!e)return null;var t=e.left;var n=e.top;return new Rectangle(t,n,this.outerWidth(),this.outerHeight())};e.fn.hitTestPoint=function(n){var r=e.extend({x:0,y:0,transparency:false},n);var i=this.getRect();var s=i.rectContainsPoint(r.x,r.y);var o=this[0];if(!r.transparency||!e(o).is("img")&&!e(o).is("canvas"))return s;if(!s)return false;var u=t(o);if(u==null)return true;var a=u.getContext("2d");var f=a.getImageData(r.x-i.x,r.y-i.y,1,1);return f.data[3]!=0};e.fn.objectHitTest=function(n){var r=e.extend({object:null,transparency:false},n);if(r.object==null)return false;var i=this.getRect();var s=r.object.getRect();var o=i.intersects(s);var u=this[0];if(!r.transparency||!e(u).is("img")&&!e(u).is("canvas"))return o;if(!o)return false;var a=t(u);var f=t(r.object[0]);if(a==null||f==null)return true;var l=a.getContext("2d");var c=f.getContext("2d");var h=i.intersection(s);if(!h)return true;var p=l.getImageData(h.x-i.x,h.y-i.y,h.width>0?h.width:1,h.height>0?h.height:1);var d=c.getImageData(h.x-s.x,h.y-s.y,h.width>0?h.width:1,h.height>0?h.height:1);var v=p.data;var m=d.data;var g=p.width*p.height*4;for(var y=0;y<g;y+=4){if(v[y+3]!=0&&m[y+3]!=0)return true}return false}})(jQuery);





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






/*
*	DrawLine
*/
(function ( $, undefined ) 
{
	'use strict';

	var touchTarget = null;
	var targetPath = null;
	var startX, startY, pageX, pageY;

	var touchstart = GameManager.event.eventSelector("eventDown");
	var touchmove = GameManager.event.eventSelector("eventMove");
	var touchend = GameManager.event.eventSelector("eventUp");

	if (parent.ZOOMVALUE == undefined) {
		parent.ZOOMVALUE = 1;
	}

	var zoom = parent.ZOOMVALUE;
	

	
	var DrawLine = DrawLine || (function ( )
	{

		function initDrawLine()
		{
			var owner = this;
			this.paper = $('<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:0;left:0;width:100%;height:100%"></svg>');
			this.element.append(this.paper);			
			if(this.options.type == "choice")
			{
				setChoiceMenu.call(owner);
			}
			setTimeout(function ()
			{
				setDrawLine.call(owner);
				cleateAnswerLine.call(owner);
			}, 500);
		}


		function setChoiceMenu()
		{
			var owner = this;
			this.element.find(".start").css({visibility:"hidden"});
			this.element.find(".menu").css({opacity:0});
			this.element.find(".menu").each(function ( i )
			{
				$(this).on(touchend, function ( e )
				{
					$(this).css({opacity:1}).off(touchend).css({"cursor":"default"});
					owner.element.find(".start").eq(i).css({visibility:"visible"});
				});
			});
		}


		function cleateAnswerLine()
		{
			for(var i=0; i<this.options.answer.length; i++)
			{
				var path = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
				path.attr("stroke", this.options.answerColor).attr("stroke-width", this.options.strokWidth);
				var start = this.element.find(".start").eq(this.options.answer[i]-1);
				var end = this.element.find(".end").eq(i);
				var sx = ((start.offset().left - this.paper.offset().left) / zoom)+(start.width()/2);
				var sy = ((start.offset().top - this.paper.offset().top) / zoom)+(start.height()/2);
				var ex = ((end.offset().left - this.paper.offset().left) / zoom)+(end.width()/2);
				var ey = ((end.offset().top - this.paper.offset().top) / zoom)+(end.width()/2);
				path.attr("d", "M "+sx+" "+sy+" L "+ex+" "+ey).hide();
				this.paper.append(path);
				this.answerPath.push(path);
			}
		}

		function setDrawLine()
		{
			this.element.find(".start").on(touchstart, $.proxy(touchStart, this));
			this.element.find(".end").on(touchstart, $.proxy(touchStart, this));
			$(window).on(touchmove, $.proxy(touchMove, this));
			$(window).on(touchend, $.proxy(touchEnd, this));
		}

		function touchStart( e )
		{
			if(!canDraw.call(this)) return;

			if(!$(e.currentTarget).data("path"))
			{
				touchTarget = $(e.currentTarget);
				targetPath = cleatePath.call(this);
				touchTarget.data("path", targetPath);
				startX = ((touchTarget.offset().left - this.paper.offset().left) / zoom)+(touchTarget.width()/2);
				startY = ((touchTarget.offset().top - this.paper.offset().top) / zoom)+(touchTarget.height()/2);
				targetPath.attr("d", "M "+startX+" "+startY+" L "+startX+" "+startY);
				e.preventDefault();
				e.stopPropagation();
			}
		}

		function touchMove( e )
		{
			var owner = this;
			
			if(targetPath)
			{
				pageX = e.pageX;
				pageY = e.pageY;

				if(GameManager.event.isTouchDevice)
				{
					pageX = e.originalEvent.changedTouches[0].clientX;
					pageY = e.originalEvent.changedTouches[0].clientY;
				}
				
				var moveX = (pageX - this.paper.offset().left) / zoom;
				var moveY = (pageY - this.paper.offset().top) / zoom;
				targetPath.attr("d", "M "+startX+" "+startY+" L "+moveX+" "+moveY);

				e.preventDefault();
				e.stopPropagation();
			}
		}

		function touchEnd( e )
		{
			if(touchTarget)
			{
				var owner = this;
				var drawTarget = null;
				var selector = ".end";
				if(touchTarget.is(".end")) selector = ".start";

				this.element.find(selector).each(function ( i )
				{
					if($(this).hitTestPoint( {"x":pageX, "y":pageY} ))
					{
						if(!$(this).data("path"))
						{
							drawTarget = $(this);
						}
					}
				});
				
				if(drawTarget)
				{
					drawTarget.data("path", targetPath);
					var moveX = ((drawTarget.offset().left - owner.paper.offset().left) / zoom)+(drawTarget.width()/2);
					var moveY = ((drawTarget.offset().top - owner.paper.offset().top) / zoom)+(drawTarget.height()/2);
					targetPath.attr("d", "M "+startX+" "+startY+" L "+moveX+" "+moveY);
				}
				else
				{
					removePath.call(this, targetPath);
					touchTarget.data("path", null);
				}

				this.element.trigger("drawLine.change"); // 

				touchTarget = null;
				targetPath = null;
				drawTarget = null;
			}
		}

		function cleatePath()
		{
			var owner = this;
			var path = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
			path.attr("stroke", owner.options.strokColor).attr("stroke-width", owner.options.strokWidth);
			owner.paper.prepend(path);
			owner.paths.push(path);
			return path;
		}

		function removePath( path )
		{
			var ar = new Array();
			for(var i=0; i<this.paths.length;i++)
			{
				if(path == this.paths[i]) 
				{
					path.remove();
				}
				else
				{
					ar.push(this.paths[i]);
				}
			}
			this.paths = ar;
		}

		function canDraw()
		{
			if(this.showAnswerFlag) return false;
			if(this.paths.length == this.options.answer.length) return false;
			return true;
		}


		return Class.extend(
		{

			/*
			* 생성자 
			*/
			init : function (element, options)
			{
				this.element = element;
				this.options = {type:"default", answer:[], strokColor:"blue", answerColor:"red", strokWidth:3};
				this.paper;
				this.paths = new Array();
				this.answerPath = new Array();
				this.showAnswerFlag = false;
				$.extend(this.options, options);
				initDrawLine.call(this);
			},

			/*
			* 초기화
			*/
			clear : function ()
			{
				var owner = this;
				$.each(owner.paths, function( i )
				{
					owner.paths[i].remove();
				});
				owner.paths = [];

				$.each(owner.answerPath, function( i )
				{
					owner.answerPath[i].hide();
				});
				owner.element.find(".start").data("path", null);
				owner.element.find(".end").data("path", null);
				this.showAnswerFlag = false;

				if(this.options.type == "choice")
				{
					setChoiceMenu.call(this);
				}
			},


			/*
			* 정답표시
			*/
			showAnswer : function ()
			{
				var owner = this;
				$.each(owner.answerPath, function( i )
				{
					owner.answerPath[i].show();
					//console.log(this.options.answer[i]);
				});
				this.showAnswerFlag = true;
				owner.element.find(".start").css({visibility:"visible"});
				if(this.options.type == "choice")
				{
					this.element.find(".menu").off(touchend).css({opacity:1});
				}

				// 추가 - temp
				var as = owner.options.answer;
				//console.log(d)
				return as;
			}

		});

	})();

	window.DrawLine = DrawLine;

})(jQuery);