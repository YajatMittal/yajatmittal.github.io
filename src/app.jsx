// ===== app.jsx =====
// ============== App shell ==============

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "accent": ["#E8B57A", "60", "0.12"],
  "density": "regular",
  "layout": "regular",
  "fontPair": "sans",
  "headingTracking": 0.06,
  "headingFont": "newsreader"
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

function Nav({ theme, onThemeToggle, route, onNavigate }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
  ["about", "about"],
  ["experience", "experience"],
  ["projects", "projects"],
  ["blog", "blogs"]];

  return (
    <div className={"nav" + (scrolled ? " is-scrolled" : "")}>
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
  // detail is either a YouTube id (string) or a local clip { src, poster }
  if (typeof id === "object") {
    return (
      <div className="vlb" onClick={() => setId(null)}>
        <div className="vlb-inner" onClick={(e) => e.stopPropagation()}>
          <button className="vlb-close" onClick={() => setId(null)} aria-label="Close video">✕</button>
          <video src={id.src} poster={id.poster} controls autoPlay muted loop playsInline />
        </div>
      </div>);
  }
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

  // Hash-based routing (persists across refresh, back/forward works)
  React.useEffect(() => {
    const onHash = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
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
        
      </TweaksPanel>
    </>);

}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
