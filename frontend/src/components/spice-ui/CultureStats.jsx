/**
 * CultureStats — responsive 3-column stat cards showing Wayanad spice heritage
 */

const STATS = [
  { value: '400+', label: 'Years of spice farming in Wayanad' },
  { value: '12',   label: 'Native spice varieties' },
  { value: '100%', label: 'Farmer-direct sourcing' },
];

/**
 * @param {Array<{value, label}>} stats - Override default stat data
 */
export function CultureStats({ stats }) {
  const data = stats || STATS;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: 12,
      }}
    >
      {data.map((s, i) => (
        <div
          key={i}
          style={{
            background: '#F5F5F3',
            borderRadius: 8,
            padding: '14px 16px',
            textAlign: 'center',
            border: '1px solid #E8E8E4',
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 500,
              color: '#3B6D11',
              lineHeight: 1.1,
              fontFamily: 'Manrope, sans-serif',
            }}
          >
            {s.value}
          </div>
          <div
            style={{
              fontSize: 11,
              color: '#9CA3AF',
              marginTop: 4,
              lineHeight: 1.4,
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CultureStats;
