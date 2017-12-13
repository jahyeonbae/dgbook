$(function(){
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

