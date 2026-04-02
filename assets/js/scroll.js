// Scroll progress indicator — fills the red notebook margin line
(function () {
  var p = document.getElementById('scrollProgress');
  var pi = document.getElementById('scrollProgressInner');
  if (!p) return;
  function update() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    p.style.height = pct + '%';
    if (pi) pi.style.height = pct + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
