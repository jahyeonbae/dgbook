(function ($) {
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