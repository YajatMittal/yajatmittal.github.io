// ===== sections.jsx =====
// ============== Section components ==============

function SectionHead({ label }) {
  return (
    <div className="section-head">
      <span className="diamond">◆</span>
      <span className="label" style={{ fontFamily: "serif" }}>{label}</span>
      <span className="rule" />
    </div>);

}

function Bullet({ marker = "◆", sub = false, children }) {
  return (
    <li>
      <span className={"marker" + (sub ? " sub" : "")}>{marker}</span>
      <span>{children}</span>
    </li>);

}

// ============== About ==============

function About({ onNavigate }) {
  const featured = FEATURED_NAMES.
  map((n) => PROJECTS.find((p) => p.name === n)).
  filter(Boolean);
  return (
    <section className="section" id="about">
      <div className="about-top">
        <img className="avatar" src="assets/profile.jpg" alt="Yajat Mittal" />
        <div>
          <div className="about-kicker">✦  hello, i’m</div>
          <h1 className="about-name" style={{ fontFamily: "SFMono-Regular" }}>Yajat Mittal<span className="accent-dot">.</span></h1>
          <p className="about-blurb">{ABOUT.blurb}</p>
        </div>
      </div>

      <ul className="bullets">
        <Bullet><b>Building</b> &middot; computer vision pipelines & ML systems</Bullet>
        <Bullet><b>Writing</b> &middot; technical articles for Roboflow</Bullet>
        <Bullet><b>Learning</b>  · everything from training to deployment</Bullet>
      </ul>

      <div className="skills">
        {ABOUT.skills.map((s) =>
        <span key={s} className="skill-pill">{s}</span>
        )}
      </div>

      <div className="social">
        <a className="social-link" href={LINKS.github} target="_blank" rel="noreferrer" aria-label="GitHub">
          <Icon.Github />
        </a>
        <a className="social-link" href={LINKS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <Icon.LinkedIn />
        </a>
        <a className="social-link" href={LINKS.email} aria-label="Email">
          <Icon.Mail />
        </a>
        <span className="social-divider" />
        <a className="social-resume" href={LINKS.resume} target="_blank" rel="noreferrer">
          <Icon.Resume /> resume
        </a>
      </div>

      <div className="featured-head">
        <span className="featured-label"><span className="diamond">◆</span> featured projects</span>
        <button className="featured-all" onClick={() => onNavigate("projects")}>
          all projects <Icon.ArrowUpRight />
        </button>
      </div>
      <div className="featured">
        {featured.map((p) =>
        <a key={p.name} className="featured-card" href={p.href} target="_blank" rel="noreferrer">
            <ProjCover cover={p.cover} />
            <div className="featured-body">
              <div className="featured-title">{p.name}</div>
              <div className="featured-tagline">{p.tagline}</div>
            </div>
          </a>
        )}
      </div>
    </section>);

}

// ============== Experience ==============

function ExpLogo({ logo }) {
  if (logo.type === "img") {
    const wrap = {
      background: logo.bg || undefined,
      borderRadius: logo.round ? "50%" : undefined
    };
    return (
      <div className="exp-logo exp-logo--img" style={wrap}>
        <img src={logo.src} alt="" style={{
          objectFit: logo.fit || "cover",
          padding: logo.pad || 0,
          borderRadius: logo.round ? "50%" : undefined
        }} />
      </div>);
  }
  return (
    <div className="exp-logo" style={{ background: logo.bg, color: logo.fg || "#fff", borderColor: logo.bg }}>
      {logo.glyph}
    </div>);

}

function Experience() {
  return (
    <section className="section" id="experience">
      <SectionHead label="experience" />
      <div className="exp-list">
        {EXPERIENCE.map((e) =>
        <a key={e.company} className="exp-item" href={e.href} target="_blank" rel="noreferrer">
            <ExpLogo logo={e.logo} />
            <div className="exp-body">
              <div className="exp-role-title">
                {e.role}
                {e.current && <span className="exp-badge" aria-label="current" />}
              </div>
              <div className="exp-sub">
                <span className="exp-company">{e.company}</span>
                {e.type && <><span className="sep">·</span>{e.type}</>}
              </div>
              <div className="exp-dates">{e.period}</div>
              {e.blurb && <div className="exp-blurb">{e.blurb}</div>}
            </div>
          </a>
        )}
      </div>
    </section>);

}

// ============== Projects ==============

function ytId(s) {
  // Accepts a bare ID or any common YouTube URL form and returns the 11-char ID.
  if (!s) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

// Ask the app-level lightbox to play a video (user-initiated, with sound).
function playVideo(id) {
  window.dispatchEvent(new CustomEvent("ym:playvideo", { detail: id }));
}

// Load the YouTube IFrame Player API once and resolve when ready.
let __ytApiPromise = null;
function loadYTApi() {
  if (__ytApiPromise) return __ytApiPromise;
  __ytApiPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) return resolve(window.YT);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {if (prev) prev();resolve(window.YT);};
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return __ytApiPromise;
}

// A YouTube cover that autoplays inline (muted, looping) via the IFrame Player API.
// The thumbnail shows underneath as a graceful fallback; clicking opens the lightbox
// to watch with sound.
function ProjVideoCover({ id }) {
  const mountRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const [playing, setPlaying] = React.useState(false);
  const [thumb, setThumb] = React.useState(`https://img.youtube.com/vi/${id}/maxresdefault.jpg`);

  React.useEffect(() => {
    let cancelled = false;
    let fadeTimer = null;
    loadYTApi().then((YT) => {
      if (cancelled || !mountRef.current) return;
      const holder = document.createElement("div");
      mountRef.current.appendChild(holder);
      playerRef.current = new YT.Player(holder, {
        videoId: id,
        playerVars: {
          autoplay: 1, mute: 1, controls: 0, loop: 1, playlist: id,
          playsinline: 1, rel: 0, modestbranding: 1, disablekb: 1, fs: 0, iv_load_policy: 3
        },
        events: {
          onReady: (e) => {try {e.target.mute();e.target.playVideo();} catch (_) {}},
          onStateChange: (e) => {
            // Wait a beat after playback truly starts so the brief YouTube
            // title/branding overlay passes before we fade the player in over
            // the clean thumbnail.
            if (e.data === YT.PlayerState.PLAYING) {
              clearTimeout(fadeTimer);
              fadeTimer = setTimeout(() => {if (!cancelled) setPlaying(true);}, 650);
            }
            if (e.data === YT.PlayerState.ENDED) {try {e.target.playVideo();} catch (_) {}}
          }
        }
      });
    });
    return () => {
      cancelled = true;
      clearTimeout(fadeTimer);
      try {playerRef.current && playerRef.current.destroy();} catch (_) {}
    };
  }, [id]);

  const onThumbLoad = (e) => {
    if (e.target.naturalWidth <= 121) setThumb(`https://img.youtube.com/vi/${id}/hqdefault.jpg`);
  };

  // Purely decorative: the looping clip never intercepts clicks, so the whole
  // card stays a single link to the project.
  return (
    <div className="proj-cover">
      <img className="cover-img" src={thumb} alt="" loading="lazy" decoding="async" onLoad={onThumbLoad} />
      <div className={"cover-yt-mount" + (playing ? " is-playing" : "")} ref={mountRef} />
    </div>);
}

// A local looping video cover that only downloads/plays once scrolled near the
// viewport (the project clips total tens of MB, so eager autoplay made every
// page load pull all of them at once).
function ProjFileVideoCover({ cover }) {
  const videoRef = React.useRef(null);
  React.useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!el.src) el.src = cover.video;
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, [cover.video]);

  // Some screen-recordings have a baked-in black band (browser chrome) at the
  // top/bottom. cover.crop = { scale, originY } zooms in to clip those bands.
  const crop = cover.crop || {};
  const vStyle = crop.scale ?
  { transform: `scale(${crop.scale})`, transformOrigin: `center ${crop.originY || "50%"}` } :
  undefined;
  return (
    <div className="proj-cover">
      <video
        className="cover-img"
        style={vStyle}
        ref={(el) => {videoRef.current = el;if (el) {el.muted = true;el.defaultMuted = true;el.volume = 0;}}}
        poster={cover.poster}
        muted
        loop
        playsInline
        preload="none" />
    </div>);
}

function ProjCover({ cover }) {
  // Cover options (checked in order):
  //   cover.youtube → a YouTube link or ID, embedded as a silent looping clip, e.g.
  //                 cover: { youtube: "https://youtu.be/dQw4w9WgXcQ" }
  //   cover.video → a looping muted video (drop file in assets/projects/, e.g.
  //                 cover: { video: "assets/projects/weathersphere.mp4", poster: "assets/projects/weather.jpg" })
  //                 poster is optional (shown while the video loads).
  //   cover.img   → a still image, e.g. cover: { img: "assets/projects/mask.png" }
  //   otherwise   → the generated striped placeholder (by hue/label).
  const yt = ytId(cover.youtube);
  if (yt) {
    return <ProjVideoCover id={yt} />;
  }
  if (cover.video) {
    return <ProjFileVideoCover cover={cover} />;
  }
  if (cover.img) {
    return (
      <div className="proj-cover">
        <img className="cover-img" src={cover.img} alt="" loading="lazy" decoding="async" />
      </div>);

  }
  // Generate a unique striped placeholder per hue
  const id = "g" + Math.abs(cover.hue);
  const a = `oklch(0.32 0.08 ${cover.hue})`;
  const b = `oklch(0.22 0.05 ${cover.hue})`;
  const c = `oklch(0.42 0.12 ${cover.hue})`;
  return (
    <div className="proj-cover">
      <svg className="stripes" viewBox="0 0 160 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={a} />
            <stop offset="100%" stopColor={b} />
          </linearGradient>
          <pattern id={id + "p"} x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill={`url(#${id})`} />
            <line x1="0" y1="0" x2="0" y2="6" stroke={c} strokeWidth="0.4" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="160" height="120" fill={`url(#${id}p)`} />
      </svg>
      <div className="ph">{cover.label}</div>
    </div>);

}

function Projects() {
  return (
    <section className="section" id="projects">
      <SectionHead label="projects" />
      <div className="proj-list">
        {PROJECTS.map((p) =>
        <a key={p.name} className="proj-card" href={p.href} target="_blank" rel="noreferrer">
            <ProjCover cover={p.cover} />
            <div className="proj-body">
              <div className="proj-title-row">
                <div className="proj-title" style={{ fontFamily: "Newsreader" }}>{p.name}</div>
                <div className="proj-actions">
                  <span className="proj-action" aria-label="github"><Icon.Github /></span>
                  <span className="proj-action" aria-label="open"><Icon.External /></span>
                </div>
              </div>
              <div className="proj-desc">{p.desc}</div>
              <div className="proj-tags">
                {p.tags.map((t) => <span key={t} className="proj-tag">{t}</span>)}
              </div>
            </div>
          </a>
        )}
      </div>
    </section>);

}

// ============== Blog ==============

function Blog() {
  return (
    <section className="section" id="blog">
      <SectionHead label="blogs" />
      <div className="blog-list">
        {BLOG.map((b) =>
        <a key={b.title} className="blog-card" href={b.href} target="_blank" rel="noreferrer">
            <div className="blog-cover">
              <img src={b.cover} alt="" loading="lazy" decoding="async" />
            </div>
            <div>
              <div className="blog-title">{b.title}</div>
              <div className="blog-meta">
                <span className="pub">{b.tag}</span>
                <span>·</span>
                <span>{b.date}</span>
              </div>
            </div>
            <span className="blog-arrow"><Icon.ArrowUpRight /></span>
          </a>
        )}
      </div>
    </section>);

}

// ============== Footer ==============

function Footer({ route, onNavigate }) {
  const order = ["about", "experience", "projects", "blog"];
  const idx = order.indexOf(route);
  const prev = idx > 0 ? order[idx - 1] : null;
  const next = idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null;
  return (
    <>
      <div className="pager">
        {prev ?
        <button className="pager-btn prev" onClick={() => onNavigate(prev)}>
            <span className="pager-dir">← prev</span>
            <span className="pager-page">{ROUTE_LABEL[prev]}</span>
          </button> :
        <span />}
        {next ?
        <button className="pager-btn next" onClick={() => onNavigate(next)}>
            <span className="pager-dir">next →</span>
            <span className="pager-page">{ROUTE_LABEL[next]}</span>
          </button> :
        <span />}
      </div>
      <div className="footer">
        <span className="footer-copy" style={{ fontFamily: "\"JetBrains Mono\"", color: "rgb(203, 201, 195)" }}>2026 © Yajat Mittal</span>
        <span className="footer-sig">made with caffeine ☕️</span>
      </div>
    </>);

}

Object.assign(window, { About, Experience, Projects, Blog, Footer, SectionHead });
