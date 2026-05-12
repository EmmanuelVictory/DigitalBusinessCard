import { useState, useRef } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 100%; height: 100%; }

  body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    font-family: 'Inter', sans-serif;
    padding: 40px 16px;
    gap: 0;
  }

  .hint {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #c0392b;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 28px;
    margin-left: 120px;
    font-weight: 700;
  }

  .hdot {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: #c0392b;
    animation: hpulse 2.5s ease-in-out infinite;
    
  }

  @keyframes hpulse {
    0%, 100% { opacity: .4; transform: scale(1); }
    50%       { opacity: 1; transform: scale(1.5); }
  }

  .card-wrap {
    width: min(420px, 92vw);
    height: calc(min(420px, 92vw) * 0.565);
    position: relative;
    perspective: 1400px;
    cursor: pointer;
    animation: rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes rise {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .card-inner {
    width: 100%; height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.9s cubic-bezier(0.45, 0, 0.15, 1);
  }

  .card-inner.flipped { transform: rotateY(180deg); }

  .face {
    position: absolute; inset: 0;
    border-radius: 16px;
    overflow: hidden;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  /*  FRONT  */
  .front {
    background: #ffffff;
    transform: rotateY(0deg);
    box-shadow:
      0 20px 60px rgba(192, 57, 43, 0.12),
      0 4px 16px rgba(192, 57, 43, 0.08),
      inset 0 0 0 1px rgba(192, 57, 43, 0.35);
  }

  .front-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 90% 10%, rgba(255, 100, 80, 0.07) 0%, transparent 50%),
      radial-gradient(ellipse at 10% 90%, rgba(255, 80, 60, 0.05) 0%, transparent 45%);
  }

  .front-stripe {
    position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: linear-gradient(
      to bottom,
      rgba(192, 57, 43, 0),
      rgba(192, 57, 43, 1),
      rgba(231, 76, 60, 0.6),
      rgba(192, 57, 43, 0.8),
      rgba(192, 57, 43, 0)
    );
    box-shadow: 0 0 12px rgba(192, 57, 43, 0.4);
  }

  .front-body {
    position: relative; z-index: 2;
    height: 100%;
    padding: 20px 24px 18px 28px;
    display: flex; flex-direction: column; justify-content: space-between;
  }

  .f-top { display: flex; justify-content: flex-end; align-items: flex-start; }

  .f-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 11px; font-weight: 700;
    letter-spacing: 2.5px; text-transform: uppercase;
    color: #c0392b;
    line-height: 1.4; text-align: right;
  }

  .f-logo span {
    display: block;
    font-family: 'Inter', sans-serif;
    font-size: 7.5px; letter-spacing: 2px;
    color: rgba(192, 57, 43, 0.7);
    font-weight: 600; margin-top: 1px;
  }

  .f-mid { padding-top: 4px; }

  .f-name {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 700;
    font-size: clamp(22px, 5.5vw, 28px);
    letter-spacing: 3px;
    color: #c0392b;
    line-height: 1.15; text-transform: uppercase;
  }

  .f-name-2 {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 700; font-style: italic;
    font-size: clamp(22px, 5.5vw, 28px);
    letter-spacing: 2px;
    color: #c0392b;
    line-height: 1.15; text-transform: uppercase;
  }

  .f-role {
    margin-top: 5px;
    font-size: 8px; font-weight: 700; letter-spacing: 3px;
    text-transform: uppercase;
    color: #c0392b;
  }

  .f-contacts {
    border-top: 1.5px solid rgba(192, 57, 43, 0.3);
    padding-top: 11px;
    display: flex; flex-direction: column; gap: 5px;
  }

  .f-row { display: flex; align-items: baseline; gap: 10px; }

  .f-key {
    font-size: 7.5px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; color: #c0392b;
    width: 36px; flex-shrink: 0;
  }

  .copyable {
    cursor: pointer;
    transition: color 0.2s, opacity 0.2s;
    user-select: none;
  }
  .copyable:hover { opacity: 0.7; }
  .copyable:active { opacity: 0.5; }

  .f-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 13.5px; font-weight: 700;
    color: #c0392b;
    letter-spacing: 0.3px;
  }

  /*  BACK  */
  .back {
    background: #ffffff;
    transform: rotateY(180deg);
    box-shadow:
      0 20px 60px rgba(192, 57, 43, 0.12),
      0 4px 16px rgba(192, 57, 43, 0.08),
      inset 0 0 0 1px rgba(192, 57, 43, 0.35);
  }

  .back-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 20% 10%, rgba(255, 100, 80, 0.07) 0%, transparent 50%),
      radial-gradient(ellipse at 85% 88%, rgba(255, 80, 60, 0.05) 0%, transparent 45%);
  }

  .back-frame {
    position: absolute; inset: 12px;
    border: 1.5px solid rgba(192, 57, 43, 0.3);
    border-radius: 10px; pointer-events: none;
  }

  .corner { position: absolute; width: 11px; height: 11px; }
  .corner-tl { top: 16px; left: 16px;    border-top:    2px solid rgba(192,57,43,0.7); border-left:  2px solid rgba(192,57,43,0.7); }
  .corner-tr { top: 16px; right: 16px;   border-top:    2px solid rgba(192,57,43,0.7); border-right: 2px solid rgba(192,57,43,0.7); }
  .corner-bl { bottom: 16px; left: 16px;  border-bottom: 2px solid rgba(192,57,43,0.7); border-left:  2px solid rgba(192,57,43,0.7); }
  .corner-br { bottom: 16px; right: 16px; border-bottom: 2px solid rgba(192,57,43,0.7); border-right: 2px solid rgba(192,57,43,0.7); }

  .back-body {
    position: relative; z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    padding: 22px 22px 22px 26px;
  }

  .back-left {
    flex: 0 0 42%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding-right: 16px;
  }

  .b-mono {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic; font-weight: 700;
    font-size: 50px; line-height: 1; letter-spacing: -2px;
    color: #c0392b;
    user-select: none;
  }

  .b-divider {
    width: 54px; height: 1.5px;
    background: linear-gradient(to right, transparent, rgba(192,57,43,0.7), transparent);
    margin: 2px 0;
  }

  .b-company {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 700; font-size: 9px;
    letter-spacing: 2.5px; text-transform: uppercase;
    color: #c0392b; text-align: center; line-height: 1.65;
  }

  .b-est {
    font-family: 'Inter', sans-serif;
    font-size: 7px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    color: #c0392b; text-align: center;
    margin-top: 2px;
  }

  .back-sep {
    flex-shrink: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(192,57,43,0.5), transparent);
    margin: 10px 0;
  }

  .back-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 9px;
    padding-left: 16px;
  }

  .b-contact-row {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .b-label {
    font-family: 'Inter', sans-serif;
    font-size: 7px; font-weight: 700;
    letter-spacing: 2.5px; text-transform: uppercase;
    color: #c0392b;
  }

  .b-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 12px; font-weight: 700;
    color: #c0392b; letter-spacing: 0.3px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .b-socials {
    display: flex; gap: 8px; margin-top: 2px;
  }

  .b-pill {
    font-family: 'Inter', sans-serif;
    font-size: 7.5px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: #c0392b;
    border: 1.5px solid rgba(192, 57, 43, 0.45);
    border-radius: 20px; padding: 2px 10px;
    transition: all .2s;
  }

  .b-pill:hover { background: rgba(192,57,43,0.06); }

  .sub-hint {
    font-size: 10px;  margin-left: 70px; letter-spacing: 3px; text-transform: uppercase;
    color: #c0392b; margin-top: 24px; font-weight: 700;
  }

  .toast {
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    background: #c0392b;
    color: #fff;
    border-radius: 24px;
    padding: 8px 22px;
    font-family: 'Inter', sans-serif;
    font-size: 9px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
    pointer-events: none; z-index: 9999;
    animation: fadeToast 0.2s ease;
    box-shadow: 0 4px 20px rgba(192,57,43,0.3);
  }

  @keyframes fadeToast {
    from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;

export default function App() {
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt]       = useState({ x: 0, y: 0 });
  const [toast, setToast]     = useState(null);
  const wrapRef  = useRef(null);
  const timerRef = useRef(null);

  const copyToClipboard = (value) => {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value);
    }
    return new Promise((resolve, reject) => {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand("copy");
        document.body.removeChild(textarea);
        resolve();
      } catch (err) {
        document.body.removeChild(textarea);
        reject(err);
      }
    });
  };

  const copy = (value, label, e) => {
    e.stopPropagation();
    copyToClipboard(value)
      .then(() => {
        clearTimeout(timerRef.current);
        setToast(`${label} copied!`);
        timerRef.current = setTimeout(() => setToast(null), 2000);
      })
      .catch(() => {
        setToast("Copy failed — try long-press");
        timerRef.current = setTimeout(() => setToast(null), 2000);
      });
  };

  const onMove = (e) => {
    if (flipped) return;
    const r = wrapRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const y = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    setTilt({ x: y * -5, y: x * 8 });
  };

  const tiltStyle = !flipped
    ? { transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }
    : {};

  return (
    <>
      <style>{css}</style>

      {toast && <div className="toast">{toast}</div>}

      <div className="hint">
        <div className="hdot" />
        tap card to flip
        <div className="hdot" />
      </div>

      <div
        className="card-wrap"
        ref={wrapRef}
        onClick={() => { setFlipped(f => !f); setTilt({ x: 0, y: 0 }); }}
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      >
        <div className={`card-inner${flipped ? " flipped" : ""}`} style={tiltStyle}>

          {/*  FRONT  */}
          <div className="face front">
            <div className="front-bg" />
            <div className="front-stripe" />
            <div className="front-body">
              <div className="f-top">
                <div className="f-logo">
                  Heavenly Citizen Limited
                  <span>· WorldWide ·</span>
                </div>
              </div>
              <div className="f-mid">
                <div className="f-name">Imagodei</div>
                <div className="f-name-2">Emmanuel</div>
                <div className="f-role">Chief Executive Officer</div>
              </div>
              <div className="f-contacts">
                <div className="f-row">
                  <span className="f-key">Tel</span>
                  <span className="f-val copyable" title="Tap to copy" onClick={(e) => copy('+*****************', 'Tel', e)}>
                    +*****************
                  </span>
                </div>
                <div className="f-row">
                  <span className="f-key">Email</span>
                  <span className="f-val copyable" title="Tap to copy" onClick={(e) => copy('imagodei@heavenlycitizen.com', 'Email', e)}>
                    imagodei@heavenlycitizen.com
                  </span>
                </div>
                <div className="f-row">
                  <span className="f-key">Web</span>
                  <span className="f-val copyable" title="Tap to copy" onClick={(e) => copy('heavenlycitizen.com', 'Web', e)}>
                    heavenlycitizen.com
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/*  BACK  */}
          <div className="face back">
            <div className="back-bg" />
            <div className="back-frame" />
            <div className="corner corner-tl" />
            <div className="corner corner-tr" />
            <div className="corner corner-bl" />
            <div className="corner corner-br" />
            <div className="back-body">

              <div className="back-left">
                <div className="b-mono">IE</div>
                <div className="b-divider" />
                <div className="b-company">Heavenly Citizen<br />Limited</div>
                <div className="b-est"> · WorldWide ·</div>
              </div>

              <div className="back-sep" />

              <div className="back-right">
                <div className="b-contact-row">
                  <span className="b-label">Tel</span>
                  <span className="b-value copyable" title="Tap to copy" onClick={(e) => copy('+*****************', 'Tel', e)}>
                    +*****************
                  </span>
                </div>
                <div className="b-contact-row">
                  <span className="b-label">Email</span>
                  <span className="b-value copyable" title="Tap to copy" onClick={(e) => copy('imagodei@heavenlycitizen.com', 'Email', e)}>
                    imagodei@heavenlycitizen.com
                  </span>
                </div>
                <div className="b-contact-row">
                  <span className="b-label">Web</span>
                  <span className="b-value copyable" title="Tap to copy" onClick={(e) => copy('heavenlycitizen.com', 'Web', e)}>
                    heavenlycitizen.com
                  </span>
                </div>
                <div className="b-socials">
                  <span className="b-pill copyable" title="Tap to copy" onClick={(e) => copy('linkedin.com/in/heavenlycitizen', 'LinkedIn', e)}>
                    in
                  </span>
                  <span className="b-pill copyable" title="Tap to copy" onClick={(e) => copy('@heavenlycitizen', 'X handle', e)}>
                    𝕏
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <div className="sub-hint">tap any contact detail to copy</div>
    </>
  );
}