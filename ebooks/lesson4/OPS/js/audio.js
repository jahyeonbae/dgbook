function audiorRead(id) {
    var tg= $(id).get(0);
    if (tg.paused) {
        tg.play();
    } else if (!tg.paused) {
        tg.pause();
        tg.currentTime = 0;
    }
}