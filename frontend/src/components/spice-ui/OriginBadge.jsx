import { MapPin } from 'lucide-react';

/**
 * OriginBadge — pill-shaped badge indicating spice source
 * @param {string} text - Label text (default: "Sourced from Wayanad, Kerala")
 */
export function OriginBadge({ text = 'Sourced from Wayanad, Kerala' }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: '#EAF4E8',
        border: '1px solid #3B6D11',
        color: '#27500A',
        borderRadius: 999,
        padding: '4px 12px',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.01em',
        lineHeight: 1.4,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: '#639922',
          flexShrink: 0,
          boxShadow: '0 0 0 2px #C0DD97',
        }}
      />
      {text}
    </span>
  );
}

/**
 * MapChip — compact geo chip with map-pin icon
 * @param {string} label - Location label
 */
export function MapChip({ label = 'Wayanad Hills · Kerala, India · 900m altitude' }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: '#EAF4E8',
        border: '1px solid #3B6D11',
        color: '#27500A',
        borderRadius: 999,
        padding: '4px 12px',
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      <MapPin size={12} color="#639922" strokeWidth={2.5} />
      {label}
    </span>
  );
}

export default OriginBadge;
