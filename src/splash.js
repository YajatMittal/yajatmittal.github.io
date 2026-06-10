(function () {
  var s = document.getElementById("splash");
  if (!s) return;
  var reduce = false, seen = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  try { seen = !!sessionStorage.getItem("ym_intro_seen"); } catch (e) {}
  if (reduce || seen) { if (s.parentNode) s.parentNode.removeChild(s); return; }

  var start = Date.now();
  var gone = false;
  function done() {
    if (gone || !s) return;
    gone = true;
    try { sessionStorage.setItem("ym_intro_seen", "1"); } catch (e) {}
    s.classList.add("done");
    setTimeout(function () { if (s && s.parentNode) s.parentNode.removeChild(s); s = null; }, 600);
  }

  // Two separate concerns, kept independent so the intro feels the same every
  // visit regardless of font cache:
  //   CHOREO     — how long the reveal animation needs once it starts.
  //   MIN_TOTAL  — the floor on total on-screen time, measured from page load.
  // Without the floor, a warm font cache armed the reveal at ~0ms and the whole
  // intro flashed by in ~2.5s, while a cold load took ~3.2s — that swing is the
  // "super fast sometimes" you saw. Now it always stays up for at least MIN_TOTAL.
  var CHOREO = 2500;     // ms the reveal plays once armed
  var MIN_TOTAL = 3000;  // ms minimum on-screen time from page load
  var FONT_CAP = 800;    // ms max wait for the signature font before arming anyway
  var armed = false;
  function arm() {
    if (armed || !s) return;
    armed = true;
    s.classList.add("armed");
    // Give the reveal its full run, but never dismiss before the floor.
    var wait = Math.max(CHOREO, MIN_TOTAL - (Date.now() - start));
    setTimeout(done, wait);
  }

  // Arm only once the signature font (Alex Brush) can render, so the script font
  // never swaps in mid-reveal; the cap makes sure a slow/blocked font never stalls.
  try {
    if (document.fonts && document.fonts.load) {
      document.fonts.load('1em "Alex Brush"').then(arm, arm);
    }
  } catch (e) {}
  setTimeout(arm, FONT_CAP); // safety cap — never wait on the font longer than this

  s.addEventListener("click", done);
})();
