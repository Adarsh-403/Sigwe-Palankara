/**
 * FreshnessStrip — full-width banner strips highlighting quality attributes
 *
 * Renders two stacked strips:
 * 1. Green variant — harvest freshness
 * 2. Amber variant — stone-ground tradition
 */

function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

export function FreshnessStrip() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Green strip */}
      <div
        style={{
          width: '100%',
          background: '#F5FBF2',
          borderTop: '1px solid #C0DD97',
          borderBottom: '1px solid #C0DD97',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          color: '#3B6D11',
          fontSize: 13.5,
          fontWeight: 600,
          flexWrap: 'wrap',
          textAlign: 'center',
        }}
      >
        <span style={{ color: '#3B6D11', flexShrink: 0 }}><CheckCircleIcon /></span>
        Packed within 72 hours of harvest — no preservatives, no added colour
      </div>

      {/* Amber strip */}
      <div
        style={{
          width: '100%',
          background: '#FAEEDA',
          borderBottom: '1px solid #FAC775',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          color: '#633806',
          fontSize: 13.5,
          fontWeight: 600,
          flexWrap: 'wrap',
          textAlign: 'center',
        }}
      >
        <span style={{ color: '#633806', flexShrink: 0 }}><InfoIcon /></span>
        Traditional stone-ground — retains natural oils &amp; flavour
      </div>
    </div>
  );
}

export default FreshnessStrip;
