/**
 * TrustBadges — flex-wrap row of icon+text trust chips
 */

const BADGES = [
  {
    label: 'Naturally grown',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#639922" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
      </svg>
    ),
  },
  {
    label: 'FSSAI certified',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#639922" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
  },
  {
    label: 'Eco packaging',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#639922" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10"/>
        <polyline points="23 20 23 14 17 14"/>
        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
      </svg>
    ),
  },
  {
    label: 'No adulterants',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#639922" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="m4.9 4.9 14.2 14.2"/>
      </svg>
    ),
  },
  {
    label: 'Tribal farmer sourced',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#639922" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

/**
 * @param {Array<{label, icon}>} badges - Override default badge list
 */
export function TrustBadges({ badges }) {
  const list = badges || BADGES;
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
      }}
    >
      {list.map((b, i) => (
        <span
          key={i}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#F5F5F3',
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 600,
            color: '#6B7280',
            border: '1px solid #E8E8E4',
            whiteSpace: 'nowrap',
          }}
        >
          {b.icon}
          {b.label}
        </span>
      ))}
    </div>
  );
}

export default TrustBadges;
