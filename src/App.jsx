import { useState, useRef } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Raleway:wght@200;300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body { height: 100%; width: 100%; margin: 0; }

  body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    background: #111;
    font-family: 'Raleway', sans-serif;
  }

  .scene {
    width: 380px;
    height: 217px;
    perspective: 1000px;
    cursor: pointer;
    animation: rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  /* ── MOBILE SCALING ── */
  @media (max-width: 420px) {
    .scene {
      width: 92vw;
      height: calc(92vw * (217 / 380));
    }
  }

  .flipper {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.75s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .flipper.flipped {
    transform: rotateY(180deg) !important;
  }

  .card-side {
    position: absolute;
    inset: 0;
    border-radius: 10px;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    overflow: hidden;
  }

  /* ── FRONT ── */
  .front {
    background: #0f0f0f;
    box-shadow:
      0 0 0 1px rgba(196,163,90,0.25),
      0 25px 60px rgba(0,0,0,0.8),
      0 8px 24px rgba(0,0,0,0.5);
  }

  .front::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      180deg,
      transparent 0px, transparent 3px,
      rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px
    );
    pointer-events: none;
  }

  .front::after {
    content: '';
    position: absolute;
    left: 0; top: 16%; bottom: 16%;
    width: 2px;
    background: linear-gradient(to bottom, transparent, #C4A35A, transparent);
    border-radius: 2px;
  }

  .front-content {
    position: relative;
    z-index: 1;
    height: 100%;
    padding: 26px 28px 22px 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  @media (max-width: 420px) {
    .front-content {
      padding: 5.5vw 5.5vw 4.5vw 7vw;
    }
  }

  .name-block { padding-top: 36px; }

  @media (max-width: 420px) {
    .name-block { padding-top: 7vw; }
  }

  .f-name {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: 28px;
    letter-spacing: 3px;
    color: #E8E0D0;
    line-height: 1.1;
    text-transform: uppercase;
  }

  @media (max-width: 420px) {
    .f-name { font-size: 6vw; letter-spacing: 0.5vw; }
  }

  .f-name-italic {
    font-style: italic;
    font-weight: 300;
    color: #C4A35A;
    font-size: 27px;
    letter-spacing: 1px;
  }

  @media (max-width: 420px) {
    .f-name-italic { font-size: 5.8vw; }
  }

  .f-title {
    margin-top: 6px;
    font-size: 8px;
    font-weight: 400;
    letter-spacing: 3.5px;
    text-transform: uppercase;
    color: rgba(196,163,90,0.7);
  }

  @media (max-width: 420px) {
    .f-title { font-size: 1.7vw; letter-spacing: 0.6vw; margin-top: 1vw; }
  }

  .bottom-block {
    display: flex;
    flex-direction: column;
    gap: 5px;
    border-top: 1px solid rgba(196,163,90,0.15);
    padding-top: 14px;
  }

  @media (max-width: 420px) {
    .bottom-block { gap: 1vw; padding-top: 2.5vw; }
  }

  .contact-line {
    display: flex;
    align-items: baseline;
    gap: 10px;
  }

  @media (max-width: 420px) {
    .contact-line { gap: 2vw; }
  }

  .contact-key {
    font-size: 7px;
    font-weight: 500;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(196,163,90,0.5);
    width: 36px;
    flex-shrink: 0;
  }

  @media (max-width: 420px) {
    .contact-key { font-size: 1.5vw; letter-spacing: 0.3vw; width: 7vw; }
  }

  .contact-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.5px;
    color: rgba(232,224,208,0.75);
    cursor: copy;
    transition: color 0.2s;
    user-select: none;
  }

  @media (max-width: 420px) {
    .contact-val { font-size: 2.8vw; letter-spacing: 0.1vw; }
  }

  .contact-val:hover { color: #C4A35A; }

  .company-stamp {
    position: absolute;
    top: 22px;
    right: 26px;
    text-align: right;
  }

  @media (max-width: 420px) {
    .company-stamp { top: 4vw; right: 5vw; }
  }

  .co-name {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(196,163,90,0.8);
  }

  @media (max-width: 420px) {
    .co-name { font-size: 2.3vw; letter-spacing: 0.5vw; }
  }

  .co-sub {
    font-size: 7px;
    font-weight: 300;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(196,163,90,0.4);
    margin-top: 2px;
  }

  @media (max-width: 420px) {
    .co-sub { font-size: 1.4vw; letter-spacing: 0.3vw; }
  }

  /* ── BACK ── */
  .back {
    background: linear-gradient(145deg, #161410 0%, #1e1a0e 60%, #161410 100%);
    box-shadow:
      0 0 0 1px rgba(196,163,90,0.2),
      0 25px 60px rgba(0,0,0,0.8);
    transform: rotateY(180deg);
  }

  .back-content {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    position: relative;
    padding: 20px 22px;
    gap: 0;
    align-items: center;
  }

  @media (max-width: 420px) {
    .back-content {
      padding: 4vw;
    }
  }

  /* inset border */
  .back-content::before {
    content: '';
    position: absolute;
    inset: 10px;
    border: 1px solid rgba(196,163,90,0.1);
    border-radius: 6px;
    pointer-events: none;
  }

  /* vertical gold divider */
  .back-divider {
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(196,163,90,0.35), transparent);
    margin: 10px 0;
    align-self: stretch;
  }

  /* LEFT col — monogram + tagline */
  .back-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding-right: 14px;
    height: 100%;
  }

  .back-monogram {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-weight: 300;
    font-size: 52px;
    line-height: 1;
    letter-spacing: -3px;
    background: linear-gradient(160deg, #7a5b1c 0%, #C4A35A 40%, #e8d08a 60%, #C4A35A 80%, #7a5b1c 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    filter: drop-shadow(0 0 12px rgba(196,163,90,0.25));
    user-select: none;
  }

  @media (max-width: 420px) {
    .back-monogram {
      font-size: 11vw;
      letter-spacing: -0.5vw;
    }
    .back-left {
      gap: 1vw;
      padding-right: 2.5vw;
    }
  }

  .back-company {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600;
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(196,163,90,0.65);
    text-align: center;
  }

  @media (max-width: 420px) {
    .back-company { font-size: 1.9vw; letter-spacing: 0.5vw; }
  }

  .back-est {
    font-size: 7px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(196,163,90,0.3);
    text-align: center;
  }

  @media (max-width: 420px) {
    .back-est { font-size: 1.4vw; letter-spacing: 0.3vw; }
  }

  /* RIGHT col — contact details */
  .back-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    padding-left: 14px;
    height: 100%;
  }

  @media (max-width: 420px) {
    .back-right {
      gap: 1.5vw;
      padding-left: 2.5vw;
    }
  }

  .back-contact-item {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .back-contact-label {
    font-size: 6.5px;
    font-weight: 500;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(196,163,90,0.4);
  }

  @media (max-width: 420px) {
    .back-contact-label { font-size: 1.4vw; letter-spacing: 0.3vw; }
  }

  .back-contact-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 12px;
    font-weight: 400;
    color: rgba(232,224,208,0.7);
    letter-spacing: 0.3px;
    cursor: copy;
    transition: color 0.2s;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  @media (max-width: 420px) {
    .back-contact-val {
      font-size: 2.5vw;
      letter-spacing: 0;
    }
  }

  .back-contact-val:hover { color: #C4A35A; }

  /* social row */
  .back-social {
    display: flex;
    gap: 6px;
    margin-top: 2px;
    flex-wrap: wrap;
  }

  @media (max-width: 420px) {
    .back-social { gap: 1.2vw; margin-top: 0; }
  }

  .social-pill {
    font-size: 7px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(196,163,90,0.45);
    border: 1px solid rgba(196,163,90,0.2);
    border-radius: 20px;
    padding: 2px 7px;
    cursor: copy;
    transition: all 0.2s;
    user-select: none;
  }

  @media (max-width: 420px) {
    .social-pill {
      font-size: 1.5vw;
      padding: 0.4vw 1.5vw;
      letter-spacing: 0.3vw;
    }
  }

  .social-pill:hover {
    color: rgba(196,163,90,0.85);
    border-color: rgba(196,163,90,0.5);
  }

  /* corner dots */
  .dot {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(196,163,90,0.3);
  }
  .dot-tl { top: 16px; left: 16px; }
  .dot-tr { top: 16px; right: 16px; }
  .dot-bl { bottom: 16px; left: 16px; }
  .dot-br { bottom: 16px; right: 16px; }

  @media (max-width: 420px) {
    .dot { width: 2px; height: 2px; }
    .dot-tl { top: 3vw; left: 3vw; }
    .dot-tr { top: 3vw; right: 3vw; }
    .dot-bl { bottom: 3vw; left: 3vw; }
    .dot-br { bottom: 3vw; right: 3vw; }
  }

  /* hint */
  .hint {
    font-size: 8px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: rgba(196,163,90,0.3);
    user-select: none;
    animation: breathe 3s ease-in-out infinite;
  }
  @keyframes breathe {
    0%,100% { opacity: 0.3; }
    50%      { opacity: 0.65; }
  }

  @keyframes rise {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .toast {
    position: fixed;
    top: 28px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(196,163,90,0.1);
    border: 1px solid rgba(196,163,90,0.3);
    color: rgba(196,163,90,0.9);
    border-radius: 20px;
    padding: 7px 22px;
    font-size: 8px;
    letter-spacing: 3px;
    text-transform: uppercase;
    backdrop-filter: blur(8px);
    pointer-events: none;
    z-index: 999;
    animation: fadeToast 0.2s ease;
  }
  @keyframes fadeToast {
    from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;

export default function BusinessCard() {
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt]       = useState({ x: 0, y: 0 });
  const [toast, setToast]     = useState(null);
  const ref      = useRef(null);
  const timerRef = useRef(null);

  const onMove = (e) => {
    if (flipped) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const y = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    setTilt({ x: y * -7, y: x * 10 });
  };

  const copy = (value, label, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value).then(() => {
      clearTimeout(timerRef.current);
      setToast(`${label} copied`);
      timerRef.current = setTimeout(() => setToast(null), 1800);
    });
  };

  const style = !flipped
    ? { transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }
    : {};

  return (
    <>
      <style>{css}</style>

      {toast && <div className="toast">{toast}</div>}

      <div
        className="scene"
        ref={ref}
        onClick={() => setFlipped(f => !f)}
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      >
        <div className={`flipper${flipped ? " flipped" : ""}`} style={style}>

          {/* ── FRONT ── */}
          <div className="card-side front">
            <div className="front-content">

              <div className="company-stamp">
                <div className="co-name">De Food Group</div>
                <div className="co-sub">march. 2026</div>
              </div>

              <div className="name-block">
                <div className="f-name">
                  Latifat&nbsp;
                  <span className="f-name-italic">M.</span>
                  &nbsp;Musa
                </div>
                <div className="f-title">Executive Chef &amp; Proprietor</div>
              </div>

              <div className="bottom-block">
                <div className="contact-line">
                  <span className="contact-key">Tel</span>
                  <span className="contact-val" title="Click to copy"
                    onClick={(e) => copy('+2349029949372', 'Tel', e)}>
                    +2349029949372
                  </span>
                </div>
                <div className="contact-line">
                  <span className="contact-key">Email</span>
                  <span className="contact-val" title="Click to copy"
                    onClick={(e) => copy('latifatmm@defoodgroup.com', 'Email', e)}>
                    latifatmm@defoodgroup.com
                  </span>
                </div>
                <div className="contact-line">
                  <span className="contact-key">Web</span>
                  <span className="contact-val" title="Click to copy"
                    onClick={(e) => copy('defoodgroup.com', 'Web', e)}>
                    defoodgroup.com
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* ── BACK ── */}
          <div className="card-side back">
            <div className="back-content">

              <div className="dot dot-tl" />
              <div className="dot dot-tr" />
              <div className="dot dot-bl" />
              <div className="dot dot-br" />

              {/* Left — identity */}
              <div className="back-left">
                <div className="back-monogram">LMM</div>
                <div className="back-company">De Food Group</div>
                <div className="back-est">March. 2026 · Nigeria</div>
              </div>

              {/* Divider */}
              <div className="back-divider" />

              {/* Right — contacts */}
              <div className="back-right">
                <div className="back-contact-item">
                  <span className="back-contact-label">Tel</span>
                  <span className="back-contact-val" title="Click to copy"
                    onClick={(e) => copy('+2349029949372', 'Tel', e)}>
                    +2349029949372
                  </span>
                </div>
                <div className="back-contact-item">
                  <span className="back-contact-label">Email</span>
                  <span className="back-contact-val" title="Click to copy"
                    onClick={(e) => copy('latifatmm@defoodgroup.com', 'Email', e)}>
                    latifatmm@defoodgroup.com
                  </span>
                </div>
                <div className="back-contact-item">
                  <span className="back-contact-label">Web</span>
                  <span className="back-contact-val" title="Click to copy"
                    onClick={(e) => copy('defoodgroup.com', 'Web', e)}>
                    defoodgroup.com
                  </span>
                </div>
                <div className="back-social">
                  <span className="social-pill" title="Click to copy"
                    onClick={(e) => copy('linkedin.com/in/defoodgroup', 'LinkedIn', e)}>
                    in
                  </span>
                  <span className="social-pill" title="Click to copy"
                    onClick={(e) => copy('@defoodgroup', 'X handle', e)}>
                    𝕏
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
