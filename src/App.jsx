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
    width: min(380px, 92vw);
    height: calc(min(380px, 92vw) * (217 / 380));
    perspective: 1000px;
    cursor: pointer;
    animation: rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .flipper {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.75s cubic-bezier(0.4, 0, 0.2, 1);
    /* Force GPU layer — helps mobile honour backface-visibility */
    will-change: transform;
  }

  .flipper.flipped {
    transform: rotateY(180deg) !important;
  }

  .card-side {
    position: absolute;
    inset: 0;
    border-radius: 10px;
    /* All four vendor prefixes for maximum mobile support */
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -ms-backface-visibility: hidden;
    overflow: hidden;
    /* translateZ(0) forces each face onto its own composite layer */
    -webkit-transform: translateZ(0);
  }

  /* ── FRONT ── */
  .front {
    background: #0f0f0f;
    /* Solid, fully opaque background — no transparency */
    box-shadow:
      0 0 0 1px rgba(196,163,90,0.25),
      0 25px 60px rgba(0,0,0,0.8),
      0 8px 24px rgba(0,0,0,0.5);
    transform: rotateY(0deg) translateZ(1px);
    -webkit-transform: rotateY(0deg) translateZ(1px);
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

  .name-block { padding-top: 36px; }

  .f-name {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-size: 28px;
    letter-spacing: 3px;
    color: #E8E0D0;
    line-height: 1.1;
    text-transform: uppercase;
  }

  .f-name-italic {
    font-style: italic;
    font-weight: 300;
    color: #C4A35A;
    font-size: 27px;
    letter-spacing: 1px;
  }

  .f-title {
    margin-top: 6px;
    font-size: 8px;
    font-weight: 400;
    letter-spacing: 3.5px;
    text-transform: uppercase;
    color: rgba(196,163,90,0.7);
  }

  .bottom-block {
    display: flex;
    flex-direction: column;
    gap: 5px;
    border-top: 1px solid rgba(196,163,90,0.15);
    padding-top: 14px;
  }

  .contact-line {
    display: flex;
    align-items: baseline;
    gap: 10px;
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

  .contact-val:hover { color: #C4A35A; }

  .company-stamp {
    position: absolute;
    top: 22px;
    right: 26px;
    text-align: right;
  }

  .co-name {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(196,163,90,0.8);
  }

  .co-sub {
    font-size: 7px;
    font-weight: 300;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(196,163,90,0.4);
    margin-top: 2px;
  }

  /* ── BACK ── */
  .back {
    /* Fully opaque solid background — critical fix */
    background: #161410;
    /* Layered gradient on top via pseudo-element so base stays opaque */
    box-shadow:
      0 0 0 1px rgba(196,163,90,0.2),
      0 25px 60px rgba(0,0,0,0.8);
    transform: rotateY(180deg) translateZ(1px);
    -webkit-transform: rotateY(180deg) translateZ(1px);
  }

  /* gradient overlay on back — separate from the base so background stays solid */
  .back::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(145deg, rgba(22,20,16,0) 0%, rgba(30,26,14,0.6) 60%, rgba(22,20,16,0) 100%);
    pointer-events: none;
    border-radius: 10px;
  }

  .back-content {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    position: relative;
    z-index: 1;
    padding: 20px 22px;
    gap: 0;
  }

  .back-content::before {
    content: '';
    position: absolute;
    inset: 10px;
    border: 1px solid rgba(196,163,90,0.1);
    border-radius: 6px;
    pointer-events: none;
  }

  .back-divider {
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(196,163,90,0.35), transparent);
    margin: 10px 0;
    align-self: stretch;
  }

  .back-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding-right: 18px;
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

  .back-company {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 600;
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(196,163,90,0.65);
    text-align: center;
  }

  .back-est {
    font-size: 7px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(196,163,90,0.3);
    text-align: center;
  }

  .back-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    padding-left: 18px;
  }

  .back-contact-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .back-contact-label {
    font-size: 6.5px;
    font-weight: 500;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(196,163,90,0.4);
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
  }

  .back-contact-val:hover { color: #C4A35A; }

  .back-social {
    display: flex;
    gap: 10px;
    margin-top: 2px;
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

  .social-pill:hover {
    color: rgba(196,163,90,0.85);
    border-color: rgba(196,163,90,0.5);
  }

  .dot {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(196,163,90,0.3);
    z-index: 2;
  }
  .dot-tl { top: 16px; left: 16px; }
  .dot-tr { top: 16px; right: 16px; }
  .dot-bl { bottom: 16px; left: 16px; }
  .dot-br { bottom: 16px; right: 16px; }

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
                  <span className="contact-val" onClick={(e) => copy('+2349029949372', 'Tel', e)}>
                    +2349029949372
                  </span>
                </div>
                <div className="contact-line">
                  <span className="contact-key">Email</span>
                  <span className="contact-val" onClick={(e) => copy('latifatmm@defoodgroup.com', 'Email', e)}>
                    latifatmm@defoodgroup.com
                  </span>
                </div>
                <div className="contact-line">
                  <span className="contact-key">Web</span>
                  <span className="contact-val" onClick={(e) => copy('defoodgroup.com', 'Web', e)}>
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

              <div className="back-left">
                <div className="back-monogram">LMM</div>
                <div className="back-company">De Food Group</div>
                <div className="back-est">March. 2026 · Nigeria</div>
              </div>

              <div className="back-divider" />

              <div className="back-right">
                <div className="back-contact-item">
                  <span className="back-contact-label">Tel</span>
                  <span className="back-contact-val" onClick={(e) => copy('+2349029949372', 'Tel', e)}>
                    +2349029949372
                  </span>
                </div>
                <div className="back-contact-item">
                  <span className="back-contact-label">Email</span>
                  <span className="back-contact-val" onClick={(e) => copy('latifatmm@defoodgroup.com', 'Email', e)}>
                    latifatmm@defoodgroup.com
                  </span>
                </div>
                <div className="back-contact-item">
                  <span className="back-contact-label">Web</span>
                  <span className="back-contact-val" onClick={(e) => copy('defoodgroup.com', 'Web', e)}>
                    defoodgroup.com
                  </span>
                </div>
                <div className="back-social">
                  <span className="social-pill" onClick={(e) => copy('linkedin.com/in/defoodgroup', 'LinkedIn', e)}>
                    in
                  </span>
                  <span className="social-pill" onClick={(e) => copy('@defoodgroup', 'X handle', e)}>
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