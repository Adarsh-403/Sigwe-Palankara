import { useState } from 'react';

const ALL_CATEGORIES = [
  { id: 'all', label: 'All spices' },
  { id: 'curry-powders', label: 'Curry powders' },
  { id: 'whole-spices', label: 'Whole spices' },
  { id: 'masala-blends', label: 'Masala blends' },
  { id: 'pepper', label: 'Pepper' },
  { id: 'cardamom', label: 'Cardamom' },
  { id: 'turmeric', label: 'Turmeric' },
];

/**
 * CategoryFilterPills — horizontal scrollable pill row for the shop page
 *
 * @param {string} active - Currently active category id
 * @param {function} onChange - Callback with selected category id
 * @param {Array} categories - Override default categories
 */
export function CategoryFilterPills({ active = 'all', onChange, categories }) {
  const [selected, setSelected] = useState(active);
  const cats = categories || ALL_CATEGORIES;

  const handleSelect = (id) => {
    setSelected(id);
    if (onChange) onChange(id);
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 4,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
      className="spice-category-pills"
    >
      <style>{`
        .spice-category-pills::-webkit-scrollbar { display: none; }
        .spice-pill {
          transition: background 0.18s, color 0.18s, border-color 0.18s, box-shadow 0.18s;
          cursor: pointer;
          white-space: nowrap;
          outline: none;
          font-family: inherit;
        }
        .spice-pill:hover:not(.spice-pill--active) {
          border-color: #639922 !important;
          background: #F5FBF2 !important;
          color: #27500A !important;
        }
      `}</style>
      {cats.map((cat) => {
        const isActive = selected === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => handleSelect(cat.id)}
            className={`spice-pill ${isActive ? 'spice-pill--active' : ''}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '7px 16px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              border: `1.5px solid ${isActive ? '#27500A' : '#C0DD97'}`,
              background: isActive ? '#27500A' : '#FFFFFF',
              color: isActive ? '#EAF4E8' : '#6B7280',
              boxShadow: isActive ? '0 2px 8px rgba(39,80,10,0.15)' : 'none',
              flexShrink: 0,
            }}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilterPills;
