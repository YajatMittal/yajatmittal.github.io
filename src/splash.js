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
    setTimeout(function () { if (s && s.parentNode) s.parentNode.removeChild(s); s = null; }, 800);
  }
  s.addEventListener("click", done);
  setTimeout(done, 3600);
})();
