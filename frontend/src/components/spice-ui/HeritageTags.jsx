/**
 * HeritageTags — decorative pill tags for collection headings / section labels
 */

const DEFAULT_TAGS = [
  'Hill country harvest',
  'Monsoon-grown',
  'Handpicked',
  'GI tagged region',
  "Kerala's spice coast",
];

/**
 * @param {string[]} tags - Override default tag labels
 */
export function HeritageTags({ tags }) {
  const list = tags || DEFAULT_TAGS;
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
      }}
    >
      {list.map((tag, i) => (
        <span
          key={i}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#F5FBF2',
            border: '1px solid #97C459',
            color: '#27500A',
            borderRadius: 8,
            padding: '5px 12px',
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#639922"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
          </svg>
          {tag}
        </span>
      ))}
    </div>
  );
}

export default HeritageTags;
