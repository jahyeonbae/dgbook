(function ($) {

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
