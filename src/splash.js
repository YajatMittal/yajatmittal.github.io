(function () {
  var s = document.getElementById("splash");
  if (!s) return;
  var reduce = false, seen = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  try { seen = !!sessionStorage.getItem("ym_intro_seen"); } catch (e) {}
  if (reduce || seen) { if (s.parentNode) s.parentNode.removeChild(s); return; }

  var gone = false;
  function done() {
    if (gone || !s) return;
    gone = true;
    try { sessionStorage.setItem("ym_intro_seen", "1"); } catch (e) {}
    s.classList.add("done");
    setTimeout(function () { if (s && s.parentNode) s.parentNode.removeChild(s); s = null; }, 600);
  }

  // Start the choreography only once the signature font can render crisply, so
  // the script font never swaps in mid-reveal (the cause of the occasional
  // jank). Everything starts in sync from here; a short safety timeout makes
  // sure a slow/blocked font never stalls the intro.
  var armed = false;
  function arm() {
    if (armed || !s) return;
    armed = true;
    s.classList.add("armed");
    // dismiss after the (now trimmed) ~2.4s choreography finishes
    setTimeout(done, 2500);
  }

  try {
    if (document.fonts && document.fonts.ready) {
      document.fonts.load('1em "Alex Brush"').catch(function () {});
      document.fonts.ready.then(arm);
    }
  } catch (e) {}
  setTimeout(arm, 700); // safety cap — never wait on the font longer than this

  s.addEventListener("click", done);
})();
