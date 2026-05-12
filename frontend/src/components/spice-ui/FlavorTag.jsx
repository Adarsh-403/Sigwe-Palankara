/**
 * FlavorTag — reusable flavor/aroma pill tag
 *
 * variants: 'warm' | 'earthy' | 'pungent' | 'aromatic' | 'cooling'
 */

const VARIANTS = {
  warm: {
    bg: '#FAEEDA',
    color: '#633806',
    label: 'Warm & Spicy',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
      </svg>
    ),
  },
  earthy: {
    bg: '#EAF4E8',
    color: '#27500A',
    label: 'Earthy',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
      </svg>
    ),
  },
  pungent: {
    bg: '#FCEBEB',
    color: '#501313',
    label: 'Pungent',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.7 7.7a2.5 2.5 0 0 1 1.8 4.3H5a2.5 2.5 0 0 1 1.8-4.3"/>
        <path d="M10.9 2.1a2.5 2.5 0 0 1 2.2 4.4"/>
        <path d="M16.5 17.5a5 5 0 0 1-9 0"/>
      </svg>
    ),
  },
  aromatic: {
    bg: '#EEEDFE',
    color: '#26215C',
    label: 'Aromatic',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        <path d="M20 3v4"/>
        <path d="M22 5h-4"/>
      </svg>
    ),
  },
  cooling: {
    bg: '#E1F5EE',
    color: '#085041',
    label: 'Cooling',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
      </svg>
    ),
  },
};

/**
 * @param {'warm'|'earthy'|'pungent'|'aromatic'|'cooling'} variant
 * @param {string} [label] - Override default label
 */
export function FlavorTag({ variant = 'earthy', label }) {
  const v = VARIANTS[variant] || VARIANTS.earthy;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: v.bg,
        color: v.color,
        borderRadius: 999,
        padding: '4px 10px',
        fontSize: 11.5,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {v.icon}
      {label || v.label}
    </span>
  );
}

/**
 * FlavorTagRow — renders a full flex-wrap row of flavor tags
 * @param {Array<{variant, label}>} tags
 */
export function FlavorTagRow({ tags }) {
  const defaultTags = [
    { variant: 'warm' },
    { variant: 'earthy' },
    { variant: 'aromatic' },
  ];
  const list = tags || defaultTags;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {list.map((t, i) => (
        <FlavorTag key={i} variant={t.variant} label={t.label} />
      ))}
    </div>
  );
}

export default FlavorTag;
