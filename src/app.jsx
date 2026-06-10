// ===== app.jsx =====
// ============== App shell ==============

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "accent": ["#E8B57A", "60", "0.12"],
  "density": "regular",
  "layout": "regular",
  "fontPair": "sans",
  "headingTracking": 0.06,
  "headingFont": "newsreader",
  "cursorFx": "brush"
} /*EDITMODE-END*/;

const ACCENT_OPTIONS = [
{ swatch: "#E8B57A", lch: { l: 0.78, c: 0.12, h: 60 }, name: "amber" },
{ swatch: "#7BA3DC", lch: { l: 0.72, c: 0.10, h: 240 }, name: "blue" },
{ swatch: "#86B89A", lch: { l: 0.72, c: 0.08, h: 150 }, name: "sage" },
{ swatch: "#C99BD4", lch: { l: 0.72, c: 0.10, h: 320 }, name: "lavender" }];


function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}
function applyAccentByName(name) {
  const opt = ACCENT_OPTIONS.find((o) => o.swatch === name) || ACCENT_OPTIONS[0];
  const { l, c, h } = opt.lch;
  const root = document.documentElement;
  root.style.setProperty("--accent", `oklch(${l} ${c} ${h})`);
  root.style.setProperty("--accent-soft", `oklch(${l} ${c} ${h} / 0.14)`);
  const isLight = root.getAttribute("data-theme") === "light";
  root.style.setProperty("--glow", `oklch(${l} ${c} ${h} / ${isLight ? 0.10 : 0.13})`);
}
function applyDensity(d) {document.documentElement.setAttribute("data-density", d);}
function applyLayout(l) {
  document.documentElement.setAttribute(
    "data-layout",
    l === "wide" ? "wide" : l === "narrow" ? "narrow" : "regular"
  );
}
function applyFontPair(f) {
  // f: "sans" (default), "mono", "serif"
  const body = document.body.style;
  if (f === "serif") {
    body.fontFamily = "var(--font-serif)";
    body.fontSize = "17px";
  } else if (f === "mono") {
    body.fontFamily = "var(--font-mono)";
    body.fontSize = "14px";
  } else {
    body.fontFamily = "var(--font-sans)";
    body.fontSize = "14.5px";
  }
}
function applyCursorFx(mode) {
  document.documentElement.setAttribute("data-cursorfx", mode || "spotlight");
}

function Nav({ theme, onThemeToggle, route, onNavigate }) {
  const links = [
  ["about", "about"],
  ["experience", "experience"],
  ["projects", "projects"],
  ["blog", "blogs"]];

  return (
    <div className="nav">
      <a className="nav-name" href="#about" onClick={(e) => {e.preventDefault();onNavigate("about");}}>
        yajat<span style={{ opacity: 0.5 }}>.</span>
      </a>
      <div className="nav-links">
        {links.map(([id, label]) =>
        <button
          key={id}
          className={"nav-link" + (route === id ? " active" : "")}
          onClick={() => onNavigate(id)}>
          
            {label}
          </button>
        )}
        <button className="theme-toggle" onClick={onThemeToggle} aria-label="toggle theme">
          {theme === "dark" ? <Icon.Sun width={14} height={14} /> : <Icon.Moon width={14} height={14} />}
        </button>
      </div>
    </div>);

}

const ROUTES = ["about", "experience", "projects", "blog"];
const ROUTE_LABEL = { about: "about", experience: "experience", projects: "projects", blog: "blogs" };

function PageIntro({ route, onNavigate }) {
  if (route === "about") return null;
  return (
    <div className="page-intro">
      <span className="crumb-home" onClick={() => onNavigate("about")}>yajat</span>
      <span className="sep">/</span>
      <span className="crumb-current">{ROUTE_LABEL[route]}</span>
    </div>);

}

function getRoute() {
  const h = (window.location.hash || "").replace(/^#/, "");
  return ROUTES.includes(h) ? h : "about";
}

function LoadingOverlay({ onFinish }) {
  React.useEffect(() => {
    const t = setTimeout(onFinish, 3600);
    return () => clearTimeout(t);
  }, [onFinish]);
  return (
    <div className="loader" onClick={onFinish} role="presentation">
      <div className="loader-inner">
        <div className="loader-eyebrow">portfolio</div>
        <div className="loader-sign">Yajat Mittal</div>
        <div className="loader-rule">
          <span className="loader-line" />
          <span className="loader-dot" />
        </div>
        <div className="loader-tag">computer vision · ml · ios</div>
      </div>
    </div>);

}

function VideoLightbox() {
  const [id, setId] = React.useState(null);
  React.useEffect(() => {
    const open = (e) => setId(e.detail);
    const onKey = (e) => {if (e.key === "Escape") setId(null);};
    window.addEventListener("ym:playvideo", open);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("ym:playvideo", open);
      window.removeEventListener("keydown", onKey);
    };
  }, []);
  React.useEffect(() => {
    document.body.style.overflow = id ? "hidden" : "";
    return () => {document.body.style.overflow = "";};
  }, [id]);
  if (!id) return null;
  const src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  return (
    <div className="vlb" onClick={() => setId(null)}>
      <div className="vlb-inner" onClick={(e) => e.stopPropagation()}>
        <button className="vlb-close" onClick={() => setId(null)} aria-label="Close video">✕</button>
        <iframe
          src={src}
          title="Project video"
          frameBorder="0"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen />
      </div>
    </div>);
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = React.useState(getRoute());

  // Apply tweaks
  React.useEffect(() => {
    applyTheme(t.theme);
    const sw = Array.isArray(t.accent) ? t.accent[0] : t.accent;
    applyAccentByName(sw); // re-run so glow tracks theme
  }, [t.theme]);
  React.useEffect(() => {
    const sw = Array.isArray(t.accent) ? t.accent[0] : t.accent;
    applyAccentByName(sw);
  }, [t.accent]);
  React.useEffect(() => {applyDensity(t.density);}, [t.density]);
  React.useEffect(() => {applyLayout(t.layout);}, [t.layout]);
  React.useEffect(() => {applyFontPair(t.fontPair);}, [t.fontPair]);
  React.useEffect(() => {
    document.documentElement.style.setProperty("--heading-tracking", t.headingTracking + "em");
  }, [t.headingTracking]);
  React.useEffect(() => {
    const map = { instrument: "var(--font-serif)", newsreader: "var(--font-display)" };
    document.documentElement.style.setProperty("--heading-font", map[t.headingFont] || "var(--font-serif)");
  }, [t.headingFont]);
  React.useEffect(() => {applyCursorFx(t.cursorFx);}, [t.cursorFx]);

  // Click ripples (only active in "ripple" cursor mode)
  React.useEffect(() => {
    if (t.cursorFx !== "ripple") return;
    const onDown = (e) => {
      const r = document.createElement("div");
      r.className = "ripple";
      r.style.left = e.clientX + "px";
      r.style.top = e.clientY + "px";
      document.body.appendChild(r);
      setTimeout(() => r.remove(), 720);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [t.cursorFx]);

  // Paintbrush light (only active in "brush" cursor mode): draws a glowing,
  // tapering stroke along the path the cursor travels, fading out behind it.
  React.useEffect(() => {
    if (t.cursorFx !== "brush") return;
    const canvas = document.querySelector(".cursor-brush");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf = null, dpr = 1, W = 0, H = 0;
    const LIFE = 600;                 // ms a point lives before it fully fades
    const MAXW = 15;                  // brush width at the head (px)
    const MINGAP = 2.4;               // min px between samples (kills clustered blobs)
    const pts = [];                   // {x, y, t}
    let cx = -100, cy = -100, seen = false;   // live pointer position (for a steady head glow)
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    // Drop samples that are too close together so a slow / paused cursor
    // doesn't pile up overlapping round dots — it just refreshes the head.
    const onMove = (e) => {
      cx = e.clientX; cy = e.clientY; seen = true;
      const last = pts[pts.length - 1];
      if (last && Math.hypot(e.clientX - last.x, e.clientY - last.y) < MINGAP) {
        last.t = performance.now();
        return;
      }
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
    };
    const accent = () => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#e8a13c";
    // Catmull-Rom: silky interpolation through the raw cursor samples
    const cr = (a, b, c, d, u) => {
      const u2 = u * u, u3 = u2 * u;
      return 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u2 + (-a + 3 * b - 3 * c + d) * u3);
    };
    const edges = (sm, scale) => {
      const L = [], R = [], m = sm.length;
      for (let i = 0; i < m; i++) {
        const a = sm[Math.max(0, i - 1)], b = sm[Math.min(m - 1, i + 1)];
        const dx = b.x - a.x, dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len, ny = dx / len, w = sm[i].hw * scale;
        L.push({ x: sm[i].x + nx * w, y: sm[i].y + ny * w });
        R.push({ x: sm[i].x - nx * w, y: sm[i].y - ny * w });
      }
      return { L, R, m };
    };
    const fillRibbon = ({ L, R, m }) => {
      ctx.beginPath();
      ctx.moveTo(L[0].x, L[0].y);
      for (let i = 1; i < m; i++) ctx.lineTo(L[i].x, L[i].y);
      for (let i = m - 1; i >= 0; i--) ctx.lineTo(R[i].x, R[i].y);
      ctx.closePath();
      ctx.fill();
    };
    const tick = () => {
      const now = performance.now();
      while (pts.length && now - pts[0].t > LIFE) pts.shift();
      ctx.clearRect(0, 0, W, H);
      const n = pts.length;
      const col = accent();
      if (n >= 3) {
        // raw half-widths: thick at the head (newest) tapering to nothing at the tail
        const raw = pts.map((p) => {
          const f = Math.max(0, 1 - (now - p.t) / LIFE);
          return { x: p.x, y: p.y, hw: Math.max(0.35, (MAXW * f * f) / 2) };
        });
        // resample the centerline with a spline for smooth, organic edges
        const sm = [];
        for (let i = 0; i < n - 1; i++) {
          const p0 = raw[Math.max(0, i - 1)], p1 = raw[i], p2 = raw[i + 1], p3 = raw[Math.min(n - 1, i + 2)];
          const SEG = 5;
          for (let s = 0; s < SEG; s++) {
            const u = s / SEG;
            sm.push({
              x: cr(p0.x, p1.x, p2.x, p3.x, u),
              y: cr(p0.y, p1.y, p2.y, p3.y, u),
              hw: p1.hw + (p2.hw - p1.hw) * u });
          }
        }
        sm.push(raw[n - 1]);

        ctx.fillStyle = col;
        ctx.shadowColor = col;
        // 1) wide soft halo
        ctx.shadowBlur = 22;
        ctx.globalAlpha = 0.18;
        fillRibbon(edges(sm, 1.15));
        // 2) mid body
        ctx.shadowBlur = 9;
        ctx.globalAlpha = 0.5;
        fillRibbon(edges(sm, 1));
        // 3) luminous near-white hot core down the centre — reads as actual light
        ctx.fillStyle = "rgba(255,248,236,0.9)";
        ctx.shadowColor = "rgba(255,240,210,0.9)";
        ctx.shadowBlur = 7;
        ctx.globalAlpha = 0.85;
        fillRibbon(edges(sm, 0.4));
      }
      // Steady glowing bloom at the LIVE cursor — drawn every frame (never blinks),
      // independent of the trailing stroke, so hovering/holding still keeps the light.
      if (seen) {
        const R = MAXW * 0.95;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
        g.addColorStop(0, "rgba(255,250,240,0.95)");
        g.addColorStop(0.4, col);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, W, H);
    };
  }, [t.cursorFx]);

  // Hash-based routing (persists across refresh, back/forward works)
  React.useEffect(() => {
    const onHash = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Cursor-following background (illuminated dot grid + halo)
  React.useEffect(() => {
    const root = document.documentElement.style;
    let raf = null,x = 0,y = 0;
    const onMove = (e) => {
      x = e.clientX;y = e.clientY;
      // reveal the cursor-following glow once the pointer has actually moved
      document.documentElement.setAttribute("data-pointer-active", "");
      if (raf) return;
      raf = requestAnimationFrame(() => {
        root.setProperty("--mx", x + "px");
        root.setProperty("--my", y + "px");
        raf = null;
      });
    };
    // Grow/fill the cursor ring when hovering anything clickable.
    const CLICKABLE = 'a, button, [role="button"], input:not([type="hidden"]), select, textarea, label, summary, [data-clickable], .clickable';
    const onOver = (e) => {
      const hit = e.target.closest && e.target.closest(CLICKABLE);
      document.documentElement.toggleAttribute("data-cursorhover", !!hit);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const navigate = (id) => {
    if (window.location.hash.replace(/^#/, "") !== id) {
      window.location.hash = id;
    }
    setRoute(id);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const toggleTheme = () => setTweak("theme", t.theme === "dark" ? "light" : "dark");
  const accentPalette = ACCENT_OPTIONS.map((o) => [o.swatch, String(o.lch.h), String(o.lch.c)]);

  const renderPage = () => {
    switch (route) {
      case "experience":return <Experience />;
      case "projects":return <Projects />;
      case "blog":return <Blog />;
      default:return <About onNavigate={navigate} />;
    }
  };

  return (
    <>
      <div className="page">
        <Nav theme={t.theme} onThemeToggle={toggleTheme} route={route} onNavigate={navigate} />
        <div className="view page-min-h" key={route}>
          <PageIntro route={route} onNavigate={navigate} />
          {renderPage()}
        </div>
        <Footer route={route} onNavigate={navigate} />
      </div>
      <VideoLightbox />

      <TweaksPanel>
        <TweakSection label="Theme" />
        <TweakRadio
          label="Mode"
          value={t.theme}
          options={["dark", "light"]}
          onChange={(v) => setTweak("theme", v)} />
        
        <TweakColor
          label="Accent"
          value={t.accent}
          options={accentPalette}
          onChange={(v) => setTweak("accent", v)} />
        

        <TweakSection label="Layout" />
        <TweakRadio
          label="Density"
          value={t.density}
          options={["compact", "regular", "comfy"]}
          onChange={(v) => setTweak("density", v)} />
        
        <TweakRadio
          label="Width"
          value={t.layout}
          options={["narrow", "regular", "wide"]}
          onChange={(v) => setTweak("layout", v)} />
        

        <TweakSection label="Typography" />
        <TweakRadio
          label="Body font"
          value={t.fontPair}
          options={["sans", "mono", "serif"]}
          onChange={(v) => setTweak("fontPair", v)} />
        
        <TweakRadio
          label="Heading font"
          value={t.headingFont}
          options={["instrument", "newsreader"]}
          onChange={(v) => setTweak("headingFont", v)} />
        
        <TweakSlider
          label="Heading spacing"
          value={t.headingTracking}
          min={0}
          max={0.06}
          step={0.002}
          unit="em"
          onChange={(v) => setTweak("headingTracking", v)} />
        
        <TweakSection label="Cursor" />
        <TweakSelect
          label="Effect"
          value={t.cursorFx}
          options={[
          { value: "spotlight", label: "Spotlight grid" },
          { value: "gridtrail", label: "Grid + comet trail" },
          { value: "brush", label: "Light brush" },
          { value: "glow", label: "Soft glow" },
          { value: "trail", label: "Comet trail" },
          { value: "ripple", label: "Click ripple" },
          { value: "off", label: "None" }]}
          onChange={(v) => setTweak("cursorFx", v)} />
        
      </TweaksPanel>
    </>);

}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
