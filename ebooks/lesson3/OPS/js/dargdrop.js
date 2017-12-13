
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


