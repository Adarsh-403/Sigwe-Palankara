import { MapPin, Plus } from 'lucide-react';

/**
 * SpiceProductCard — upgraded product card with:
 * - Spice-toned gradient placeholder with SVG leaf watermark
 * - Farm origin line with map-pin icon
 * - Existing price + Add button layout
 *
 * @param {object} product - Product data object from API
 * @param {function} onAddToCart - Callback when Add is clicked
 * @param {string} [farmOrigin] - Override farm origin text (defaults to product.origin or "Mananthavady, Wayanad")
 */
export function SpiceProductCard({ product, onAddToCart, farmOrigin }) {
  const origin = farmOrigin || product?.origin || 'Mananthavady, Wayanad';

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        border: '1px solid #F0F0EE',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        overflow: 'hidden',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        cursor: 'default',
      }}
      className="spice-product-card"
    >
      <style>{`
        .spice-product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(39,80,10,0.12);
          border-color: #C0DD97 !important;
        }
        .spice-product-card:hover .spice-card-img {
          transform: scale(1.04);
        }
        .spice-add-btn:hover:not(:disabled) {
          background: #27500A !important;
          color: #EAF4E8 !important;
        }
      `}</style>

      {/* ── Image / Placeholder area ── */}
      <div
        style={{
          height: 180,
          position: 'relative',
          overflow: 'hidden',
          background: product?.image
            ? '#f1f3f0'
            : 'linear-gradient(135deg, #EAF4E8 0%, #C0DD97 50%, #FAEEDA 100%)',
        }}
      >
        {product?.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="spice-card-img"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
          />
        ) : (
          /* Gradient placeholder with leaf SVG watermark */
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              viewBox="0 0 80 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: 64, height: 80, opacity: 0.22 }}
            >
              <path
                d="M40 96 C40 96 4 64 8 28 C12 4 40 2 40 2 C40 2 68 4 72 28 C76 64 40 96 40 96Z"
                fill="#27500A"
              />
              <path d="M40 2 L40 96" stroke="#EAF4E8" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M40 36 Q56 26 68 32" stroke="#EAF4E8" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <path d="M40 54 Q24 44 12 50" stroke="#EAF4E8" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <path d="M40 70 Q52 62 62 66" stroke="#EAF4E8" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
        )}

        {/* Out of stock overlay */}
        {product?.stock <= 0 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.42)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                color: 'white',
                fontSize: 11,
                fontWeight: 700,
                background: '#DC2626',
                borderRadius: 999,
                padding: '3px 12px',
              }}
            >
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ── Card body ── */}
      <div style={{ padding: '14px 16px 16px' }}>
        {/* Product name */}
        <h3
          style={{
            fontSize: 14.5,
            fontWeight: 700,
            color: '#1A1A1A',
            margin: '0 0 4px',
            lineHeight: 1.3,
            fontFamily: 'Manrope, sans-serif',
          }}
        >
          {product?.name || 'Spice Product'}
        </h3>

        {/* Farm origin line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginBottom: 10,
          }}
        >
          <MapPin size={11} color="#639922" strokeWidth={2.5} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: '#639922', fontWeight: 500 }}>
            {origin}
          </span>
        </div>

        {/* Stock label */}
        {product?.stock > 0 && (
          <p style={{ fontSize: 11, color: '#639922', marginBottom: 10 }}>
            {product.stock} in stock
          </p>
        )}

        {/* Price + Add button row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#27500A',
              letterSpacing: '-0.01em',
            }}
          >
            ₹{product?.price}
          </span>
          <button
            onClick={() => onAddToCart && onAddToCart(product)}
            disabled={product?.stock <= 0}
            className="spice-add-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '7px 14px',
              borderRadius: 12,
              background: '#EAF4E8',
              color: '#27500A',
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              cursor: product?.stock <= 0 ? 'not-allowed' : 'pointer',
              opacity: product?.stock <= 0 ? 0.4 : 1,
              transition: 'background 0.18s, color 0.18s',
              fontFamily: 'inherit',
            }}
          >
            <Plus size={15} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default SpiceProductCard;
