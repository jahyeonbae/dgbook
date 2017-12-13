
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
},1000);