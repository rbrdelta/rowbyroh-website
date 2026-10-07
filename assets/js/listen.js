// listen.js — listen-and-guess pairs (sound series).
// Markup: <div class="listen-pair" data-target="minor">
//           <h3>…</h3><p class="listen-q">…</p>
//           <audio data-name="major" src="…"></audio>
//           <audio data-name="minor" src="…"></audio>
//           <div class="listen-reveal" hidden>…</div>
//         </div>
// The two clips are shown in random order as Clip A / Clip B. The reader
// guesses which one is data-target; the reveal then says which it was.
(function () {
    var playing = null;

    function stopPlaying() {
        if (playing) { playing.pause(); playing.currentTime = 0; playing = null; }
    }

    document.querySelectorAll('.listen-pair').forEach(function (pair) {
        var audios = Array.prototype.slice.call(pair.querySelectorAll('audio'));
        if (audios.length !== 2) return;
        if (Math.random() < 0.5) audios.reverse();
        var target = pair.getAttribute('data-target');
        var reveal = pair.querySelector('.listen-reveal');
        var letters = ['A', 'B'];

        var play = document.createElement('div');
        play.className = 'listen-row';
        var guess = document.createElement('div');
        guess.className = 'listen-row';
        guess.innerHTML = '<span class="listen-label">Which one is ' + pair.getAttribute('data-target-label') + '?</span>';

        audios.forEach(function (a, i) {
            a.preload = 'none';
            var b = document.createElement('button');
            b.type = 'button';
            b.textContent = 'Play clip ' + letters[i];
            b.addEventListener('click', function () {
                var same = playing === a;
                stopPlaying();
                if (!same) { a.play(); playing = a; }
            });
            a.addEventListener('ended', function () { if (playing === a) playing = null; });
            play.appendChild(b);

            var g = document.createElement('button');
            g.type = 'button';
            g.textContent = 'Clip ' + letters[i];
            g.setAttribute('aria-pressed', 'false');
            g.addEventListener('click', function () {
                guess.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
                g.setAttribute('aria-pressed', 'true');
                var right = a.getAttribute('data-name') === target;
                var answer = letters[audios.findIndex(function (x) { return x.getAttribute('data-name') === target; })];
                var v = reveal.querySelector('.listen-verdict');
                v.textContent = (right ? 'Right. ' : 'Not this time. ') + 'Clip ' + answer + ' was ' + pair.getAttribute('data-target-label') + '.';
                reveal.hidden = false;
            });
            guess.appendChild(g);
        });

        var q = pair.querySelector('.listen-q');
        q.parentNode.insertBefore(play, q.nextSibling);
        play.parentNode.insertBefore(guess, play.nextSibling);
    });
})();
