
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

})