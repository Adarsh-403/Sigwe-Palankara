import { useEffect, useState } from 'react';

/* ─────────────────────────────────────────────
   Animated Cart SVG
   Timeline (all CSS, GPU-composited):
   0.00s  cart slides in from right
   0.35s  product dot drops from above into basket
   0.55s  cart bounces down then up (catch impact)
   0.75s  check mark draws on
   2.40s  toast exits (slides down + fades)
───────────────────────────────────────────── */
function CartDropAnimation() {
  return (
    <>
      <style>{`
        /* Cart body slides in from the right */
        @keyframes cartArrive {
          0%   { transform: translateX(38px); opacity: 0; }
          60%  { transform: translateX(-4px); opacity: 1; }
          80%  { transform: translateX(2px); }
          100% { transform: translateX(0);   opacity: 1; }
        }
        /* Product dot falls into basket */
        @keyframes productDrop {
          0%   { transform: translateY(-22px) scale(1.1); opacity: 0; }
          30%  { opacity: 1; }
          70%  { transform: translateY(0px) scale(1); opacity: 1; }
          85%  { transform: translateY(-4px) scale(0.9); opacity: 0.8; }
          100% { transform: translateY(2px) scale(0.7); opacity: 0; }
        }
        /* Cart bounces on catch */
        @keyframes cartCatch {
          0%   { transform: translateY(0); }
          30%  { transform: translateY(4px) scaleY(0.94); }
          60%  { transform: translateY(-3px); }
          80%  { transform: translateY(1px); }
          100% { transform: translateY(0); }
        }
        /* Checkmark draws on */
        @keyframes checkDraw {
          from { stroke-dashoffset: 22; }
          to   { stroke-dashoffset: 0;  }
        }
        /* Wheel spin on arrival */
        @keyframes wheelSpin {
          from { transform-origin: center; transform: rotate(0deg); }
          to   { transform-origin: center; transform: rotate(360deg); }
        }

        .ca-cart   { animation: cartArrive 0.38s cubic-bezier(.34,1.36,.64,1) 0.05s both; }
        .ca-bounce { animation: cartCatch  0.35s ease 0.62s both; }
        .ca-drop   { animation: productDrop 0.48s cubic-bezier(.55,0,.45,1) 0.40s both; }
        .ca-check  { 
          stroke-dasharray: 22; stroke-dashoffset: 22;
          animation: checkDraw 0.3s ease 0.85s forwards;
        }
        .ca-wheel-l { animation: wheelSpin 0.5s linear 0.05s 1; transform-box: fill-box; transform-origin: center; }
        .ca-wheel-r { animation: wheelSpin 0.5s linear 0.12s 1; transform-box: fill-box; transform-origin: center; }

        @media (prefers-reduced-motion: reduce) {
          .ca-cart, .ca-bounce, .ca-drop, .ca-check, .ca-wheel-l, .ca-wheel-r {
            animation: none !important;
          }
        }
      `}</style>

      <div style={{ position: 'relative', width: 52, height: 44, flexShrink: 0 }}>
        {/* ── Falling product dot ── */}
        <div className="ca-drop" style={{
          position: 'absolute', top: 2, left: '50%',
          transform: 'translateX(-50%)',
          width: 10, height: 10,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #C0DD97, #639922)',
          boxShadow: '0 2px 6px rgba(99,153,34,0.5)',
          zIndex: 2,
        }} />

        {/* ── Cart (arrives + bounces) ── */}
        <div className="ca-cart" style={{ position: 'absolute', inset: 0 }}>
          <div className="ca-bounce" style={{ width: '100%', height: '100%' }}>
            <svg width="52" height="44" viewBox="0 0 52 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Handle */}
              <path d="M4 5 Q3 3 5.5 2.5" stroke="#C0DD97" strokeWidth="1.8" strokeLinecap="round"/>
              {/* Pole */}
              <line x1="5.5" y1="2.5" x2="11" y2="2.5" stroke="#C0DD97" strokeWidth="1.8" strokeLinecap="round"/>
              {/* Main cart body */}
              <path
                d="M11 2.5 L15 26 H44 L48 10 H17"
                stroke="#EAF4E8" strokeWidth="2.8"
                strokeLinecap="round" strokeLinejoin="round"
                fill="none"
              />
              {/* Basket fill */}
              <path
                d="M16 14 L44.5 14 L42 24 H17 Z"
                fill="rgba(192,221,151,0.18)"
              />
              {/* Basket horizontal lines */}
              <line x1="17" y1="18" x2="44" y2="18" stroke="#C0DD97" strokeWidth="1.2" strokeOpacity="0.6"/>
              {/* Left wheel */}
              <circle className="ca-wheel-l" cx="20" cy="30" r="4" stroke="#C0DD97" strokeWidth="2.2" fill="#27500A"/>
              <circle cx="20" cy="30" r="1.2" fill="#C0DD97"/>
              {/* Right wheel */}
              <circle className="ca-wheel-r" cx="38" cy="30" r="4" stroke="#C0DD97" strokeWidth="2.2" fill="#27500A"/>
              <circle cx="38" cy="30" r="1.2" fill="#C0DD97"/>
              {/* Checkmark (draws on after drop) */}
              <path
                className="ca-check"
                d="M30 18 L24 24 L21 21"
                stroke="#C0DD97" strokeWidth="2.4"
                strokeLinecap="round" strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Toast shell
───────────────────────────────────────────── */
export function CartToast({ productName, onDone }) {
  const [phase, setPhase] = useState('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('idle'),  20);
    const t2 = setTimeout(() => setPhase('exit'), 2500);
    const t3 = setTimeout(onDone,                  2860);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  const label = productName
    ? productName.length > 24
      ? `"${productName.slice(0, 22)}…" added`
      : `"${productName}" added`
    : 'Added to cart!';

  return (
    <>
      <style>{`
        @keyframes toastUp {
          0%   { transform: translate(-50%, 20px) scale(0.9); opacity: 0; }
          55%  { transform: translate(-50%, -4px) scale(1.02); opacity: 1; }
          100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
        }
        @keyframes toastDown {
          from { transform: translate(-50%, 0) scale(1);    opacity: 1; }
          to   { transform: translate(-50%, 18px) scale(0.93); opacity: 0; }
        }
        .toast-enter { animation: toastUp   0.40s cubic-bezier(.34,1.4,.64,1) forwards; }
        .toast-idle  { transform: translate(-50%, 0); opacity: 1; }
        .toast-exit  { animation: toastDown 0.32s ease-in forwards; }

        @media (prefers-reduced-motion: reduce) {
          .toast-enter, .toast-exit { animation: none !important; }
          .toast-idle { opacity: 1; }
        }
      `}</style>

      <div
        className={`toast-${phase}`}
        role="status"
        aria-live="polite"
        aria-label={`${label} cart`}
        style={{
          /* Position */
          position: 'fixed',
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 68px)',
          left: '50%',
          zIndex: 9999,

          /* Layout */
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          maxWidth: 'calc(100vw - 32px)',
          width: 'max-content',

          /* Visual */
          background: 'linear-gradient(135deg, #1e3d08 0%, #27500A 60%, #3B6D11 100%)',
          color: '#EAF4E8',
          borderRadius: 999,
          padding: '10px 20px 10px 12px',
          boxShadow: '0 8px 28px rgba(39,80,10,0.45), 0 2px 8px rgba(0,0,0,0.18)',
          border: '1px solid rgba(192,221,151,0.2)',

          /* Type */
          fontSize: 14,
          fontWeight: 700,
          fontFamily: 'Manrope, Inter, system-ui, sans-serif',
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',

          /* Interaction */
          pointerEvents: 'none',
          userSelect: 'none',

          /* GPU layer */
          willChange: 'transform, opacity',
        }}
      >
        <CartDropAnimation />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Hook — replaces on rapid taps (no stacking)
───────────────────────────────────────────── */
export function useCartAnimation() {
  const [toast, setToast] = useState(null);
  const triggerToast = (productName) => setToast({ productName, key: Date.now() });
  const clearToast   = () => setToast(null);
  return [toast, triggerToast, clearToast];
}
