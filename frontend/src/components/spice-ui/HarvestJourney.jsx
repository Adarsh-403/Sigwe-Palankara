/**
 * HarvestJourney — vertical 4-step timeline showing the spice journey
 * from farm to consumer.
 */

const STEPS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 20h10"/>
        <path d="M10 20c5.5-2.5.8-6.4 3-10"/>
        <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/>
        <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>
      </svg>
    ),
    title: 'Grown in Wayanad hills',
    subtitle: 'Organic farms · 900m altitude · monsoon season',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2"/>
        <path d="M12 20v2"/>
        <path d="m4.93 4.93 1.41 1.41"/>
        <path d="m17.66 17.66 1.41 1.41"/>
        <path d="M2 12h2"/>
        <path d="M20 12h2"/>
        <path d="m6.34 17.66-1.41 1.41"/>
        <path d="m19.07 4.93-1.41 1.41"/>
      </svg>
    ),
    title: 'Sun-dried & hand-sorted',
    subtitle: 'Traditional Kerala method · no artificial drying',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.29 7 12 12 20.71 7"/>
        <line x1="12" y1="22" x2="12" y2="12"/>
      </svg>
    ),
    title: 'Cold-ground & sealed',
    subtitle: 'Retains essential oils & aroma',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
        <rect width="13" height="8" x="9" y="13" rx="2"/>
        <circle cx="6" cy="17" r="1.5"/>
        <circle cx="17" cy="17" r="1.5"/>
      </svg>
    ),
    title: 'Delivered fresh to you',
    subtitle: 'Within 72 hrs of packing',
  },
];

export function HarvestJourney() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {STEPS.map((step, i) => {
        const isLast = i === STEPS.length - 1;
        return (
          <div key={i} style={{ display: 'flex', gap: 16, position: 'relative' }}>
            {/* Left column: dot + line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flexShrink: 0 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#EAF4E8',
                  border: '2px solid #639922',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#27500A',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(99,153,34,0.15)',
                  zIndex: 1,
                  position: 'relative',
                }}
              >
                {step.icon}
              </div>
              {!isLast && (
                <div
                  style={{
                    width: 2,
                    flex: 1,
                    minHeight: 24,
                    background: '#C0DD97',
                    margin: '0 auto',
                  }}
                />
              )}
            </div>

            {/* Right column: content */}
            <div style={{ paddingBottom: isLast ? 0 : 24, paddingTop: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#27500A', lineHeight: 1.3 }}>
                {step.title}
              </div>
              <div style={{ fontSize: 12, color: '#639922', marginTop: 3, lineHeight: 1.5 }}>
                {step.subtitle}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default HarvestJourney;
