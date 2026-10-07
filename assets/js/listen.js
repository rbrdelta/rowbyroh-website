// listen.js — inline play buttons for audio samples (sound series).
// Markup: <button type="button" class="play" data-src="/path.wav">label</button>
// One clip plays at a time; pressing the playing clip stops it.
(function () {
    var current = null;

    function stop() {
        if (!current) return;
        current.audio.pause();
        current.audio.currentTime = 0;
        current.button.setAttribute('aria-pressed', 'false');
        current = null;
    }

    document.querySelectorAll('button.play[data-src]').forEach(function (button) {
        var audio = new Audio();
        audio.preload = 'none';
        button.setAttribute('aria-pressed', 'false');
        audio.addEventListener('ended', function () { if (current && current.audio === audio) stop(); });
        button.addEventListener('click', function () {
            var same = current && current.button === button;
            stop();
            if (same) return;
            if (!audio.src) audio.src = button.getAttribute('data-src');
            audio.play();
            button.setAttribute('aria-pressed', 'true');
            current = { audio: audio, button: button };
        });
    });
})();
