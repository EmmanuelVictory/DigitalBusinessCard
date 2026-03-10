import { useState, useRef, useEffect } from "react";

export default function BusinessCard() {
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [toast, setToast] = useState(null);
  const [scale, setScale] = useState(1);
  const flipperRef = useRef(null);
  const timerRef = useRef(null);

  const CARD_W = 380;
  const CARD_H = 217;

  useEffect(() => {
    const update = () => {
      const maxW = Math.min(window.innerWidth * 0.92, CARD_W);
      setScale(maxW / CARD_W);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const onMove = (e) => {
    if (flipped) return;
    const r = flipperRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
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

  const flipperTransform = flipped
    ? `scale(${scale}) rotateY(180deg)`
    : `scale(${scale}) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`;

  return (
    <>
      <style>{`
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
          perspective: 1000px;
          cursor: pointer;
          animation: rise 0.9s cubic-bezier(0.22,1,0.36,1) both;
        }
        .flipper {
          position: relative;
          transform-style: preserve-3d;
          transform-origin: top left;
          transition: transform 0.75s cubic-bezier(0.4,0,0.2,1);
        }
        .card-side {
          position: absolute;
          inset: 0;
          border-radius: 10px;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          overflow: hidden;
        }
        .cv:hover { color: #C4A35A !important; }
        .sp:hover { color: rgba(196,163,90,0.85) !important; border-color: rgba(196,163,90,0.5) !important; }
        @keyframes rise {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeToast {
          from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {toast && (
        <div style={{
          position: "fixed", top: 28, left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(196,163,90,0.1)",
          border: "1px solid rgba(196,163,90,0.3)",
          color: "rgba(196,163,90,0.9)",
          borderRadius: 20, padding: "7px 22px",
          fontSize: 8, letterSpacing: 3,
          textTransform: "uppercase",
          backdropFilter: "blur(8px)",
          pointerEvents: "none", zIndex: 999,
          animation: "fadeToast 0.2s ease",
        }}>{toast}</div>
      )}

      {/* Outer wrapper reserves the scaled space */}
      <div
        className="scene"
        style={{ width: CARD_W * scale, height: CARD_H * scale }}
        onClick={() => setFlipped(f => !f)}
      >
        {/* Inner flipper: always natural 380×217, scaled via transform */}
        <div
          ref={flipperRef}
          className="flipper"
          style={{
            width: CARD_W,
            height: CARD_H,
            transform: flipperTransform,
          }}
          onMouseMove={onMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        >

          {/* ══ FRONT ══ */}
          <div className="card-side" style={{
            background: "#0f0f0f",
            boxShadow: "0 0 0 1px rgba(196,163,90,0.25), 0 25px 60px rgba(0,0,0,0.8), 0 8px 24px rgba(0,0,0,0.5)",
          }}>
            {/* scanlines */}
            <div style={{ position:"absolute",inset:0,pointerEvents:"none",
              backgroundImage:"repeating-linear-gradient(180deg,transparent 0px,transparent 3px,rgba(255,255,255,0.012) 3px,rgba(255,255,255,0.012) 4px)" }} />
            {/* gold left accent */}
            <div style={{ position:"absolute",left:0,top:"16%",bottom:"16%",width:2,
              background:"linear-gradient(to bottom,transparent,#C4A35A,transparent)",borderRadius:2 }} />

            <div style={{ position:"relative",zIndex:1,height:"100%",padding:"26px 28px 22px 32px",display:"flex",flexDirection:"column",justifyContent:"space-between" }}>
              {/* company stamp */}
              <div style={{ position:"absolute",top:22,right:26,textAlign:"right" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:11,letterSpacing:3,textTransform:"uppercase",color:"rgba(196,163,90,0.8)" }}>De Food Group</div>
                <div style={{ fontSize:7,fontWeight:300,letterSpacing:2,textTransform:"uppercase",color:"rgba(196,163,90,0.4)",marginTop:2 }}>march. 2026</div>
              </div>
              {/* name */}
              <div style={{ paddingTop:36 }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:300,fontSize:28,letterSpacing:3,color:"#E8E0D0",lineHeight:1.1,textTransform:"uppercase" }}>
                  Latifat&nbsp;<span style={{ fontStyle:"italic",color:"#C4A35A",fontSize:27,letterSpacing:1 }}>M.</span>&nbsp;Musa
                </div>
                <div style={{ marginTop:6,fontSize:8,fontWeight:400,letterSpacing:3.5,textTransform:"uppercase",color:"rgba(196,163,90,0.7)" }}>Executive Chef &amp; Proprietor</div>
              </div>
              {/* contacts */}
              <div style={{ display:"flex",flexDirection:"column",gap:5,borderTop:"1px solid rgba(196,163,90,0.15)",paddingTop:14 }}>
                {[["Tel","+2349029949372"],["Email","latifatmm@defoodgroup.com"],["Web","defoodgroup.com"]].map(([k,v]) => (
                  <div key={k} style={{ display:"flex",alignItems:"baseline",gap:10 }}>
                    <span style={{ fontSize:7,fontWeight:500,letterSpacing:2.5,textTransform:"uppercase",color:"rgba(196,163,90,0.5)",width:36,flexShrink:0 }}>{k}</span>
                    <span className="cv" style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:13,letterSpacing:0.5,color:"rgba(232,224,208,0.75)",cursor:"copy",transition:"color 0.2s",userSelect:"none" }}
                      onClick={(e)=>copy(v,k,e)}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══ BACK ══ */}
          <div className="card-side" style={{
            background: "linear-gradient(145deg,#161410 0%,#1e1a0e 60%,#161410 100%)",
            boxShadow: "0 0 0 1px rgba(196,163,90,0.2), 0 25px 60px rgba(0,0,0,0.8)",
            transform: "rotateY(180deg)",
          }}>
            {/* inset border */}
            <div style={{ position:"absolute",inset:10,border:"1px solid rgba(196,163,90,0.1)",borderRadius:6,pointerEvents:"none" }} />
            {/* corner dots */}
            {[[{top:16,left:16}],[{top:16,right:16}],[{bottom:16,left:16}],[{bottom:16,right:16}]].map(([pos],i)=>(
              <div key={i} style={{ position:"absolute",width:3,height:3,borderRadius:"50%",background:"rgba(196,163,90,0.3)",...pos }} />
            ))}

            <div style={{ height:"100%",display:"grid",gridTemplateColumns:"1fr 1px 1fr",padding:"20px 22px",alignItems:"center" }}>

              {/* LEFT — monogram */}
              <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,paddingRight:14,height:"100%" }}>
                <div style={{
                  fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontWeight:300,
                  fontSize:52,lineHeight:1,letterSpacing:-3,
                  background:"linear-gradient(160deg,#7a5b1c 0%,#C4A35A 40%,#e8d08a 60%,#C4A35A 80%,#7a5b1c 100%)",
                  WebkitBackgroundClip:"text",backgroundClip:"text",color:"transparent",
                  filter:"drop-shadow(0 0 12px rgba(196,163,90,0.25))",userSelect:"none",
                }}>LMM</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:9,letterSpacing:3,textTransform:"uppercase",color:"rgba(196,163,90,0.65)",textAlign:"center" }}>De Food Group</div>
                <div style={{ fontSize:7,letterSpacing:2,textTransform:"uppercase",color:"rgba(196,163,90,0.3)",textAlign:"center" }}>March. 2026 · Nigeria</div>
              </div>

              {/* DIVIDER */}
              <div style={{ width:1,background:"linear-gradient(to bottom,transparent,rgba(196,163,90,0.35),transparent)",alignSelf:"stretch",margin:"10px 0" }} />

              {/* RIGHT — contacts */}
              <div style={{ display:"flex",flexDirection:"column",justifyContent:"center",gap:9,paddingLeft:14,height:"100%",minWidth:0 }}>
                {[["Tel","+2349029949372"],["Email","latifatmm@defoodgroup.com"],["Web","defoodgroup.com"]].map(([label,val])=>(
                  <div key={label} style={{ display:"flex",flexDirection:"column",gap:2,minWidth:0 }}>
                    <span style={{ fontSize:6.5,fontWeight:500,letterSpacing:2.5,textTransform:"uppercase",color:"rgba(196,163,90,0.4)" }}>{label}</span>
                    <span className="cv" style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:12,color:"rgba(232,224,208,0.7)",letterSpacing:0.3,cursor:"copy",transition:"color 0.2s",userSelect:"none",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}
                      onClick={(e)=>copy(val,label,e)}>{val}</span>
                  </div>
                ))}
                {/* social pills */}
                <div style={{ display:"flex",gap:8 }}>
                  {[["in","linkedin.com/in/defoodgroup","LinkedIn"],["𝕏","@defoodgroup","X"]].map(([lbl,cp,name])=>(
                    <span key={name} className="sp"
                      style={{ fontSize:7,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(196,163,90,0.45)",border:"1px solid rgba(196,163,90,0.2)",borderRadius:20,padding:"2px 7px",cursor:"copy",transition:"all 0.2s",userSelect:"none" }}
                      onClick={(e)=>copy(cp,name,e)}>{lbl}</span>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}