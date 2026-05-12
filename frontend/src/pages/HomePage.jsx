import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, TreePine, Wind, LogIn, Leaf, MapPin } from 'lucide-react';
import { WayanadMountainBg } from '../components/spice-ui/WayanadMountainBg';
import { OriginBadge, MapChip } from '../components/spice-ui/OriginBadge';
import { FreshnessStrip } from '../components/spice-ui/FreshnessStrip';
import { CultureStats } from '../components/spice-ui/CultureStats';
import { HarvestJourney } from '../components/spice-ui/HarvestJourney';
import { TrustBadges } from '../components/spice-ui/TrustBadges';
import { HeritageTags } from '../components/spice-ui/HeritageTags';
import { FlavorTagRow } from '../components/spice-ui/FlavorTag';

/* ── Animated floating leaf ── */
function FloatingLeaf({ style, delay = 0 }) {
  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        top: style.top, left: style.left, right: style.right,
        '--r': style.rotate || '0deg',
        animation: `leafFloat ${7 + (delay % 4)}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        filter: 'drop-shadow(0 2px 6px rgba(45,90,39,0.20))',
      }}
    >
      <svg viewBox="0 0 40 54" fill="none"
        style={{ width: style.size || 32, height: (style.size || 32) * 1.35, transform: `rotate(${style.rotate || '0deg'})` }}>
        <path d="M20 52 C20 52 1 32 4 14 C7 1 20 1 20 1 C20 1 33 1 36 14 C39 32 20 52 20 52Z"
          fill={style.color || '#4CAF50'} />
        <path d="M20 1 L20 52" stroke={style.stroke || '#2D5A27'} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 20 Q28 15 34 18" stroke={style.stroke || '#2D5A27'} strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
        <path d="M20 30 Q12 25 6 28" stroke={style.stroke || '#2D5A27'} strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      </svg>
    </div>
  );
}

/* ── Animated counter ── */
function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);
  return [count, ref];
}

function StatCard({ value, suffix, label }) {
  const [count, ref] = useCounter(value);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-emerald-200 mt-1 text-sm">{label}</div>
    </div>
  );
}

const FLAVOR_TAGS = [
  { variant: 'warm' }, { variant: 'earthy' }, { variant: 'aromatic' },
  { variant: 'pungent' }, { variant: 'cooling' },
];

const features = [
  { icon: '🌱', title: 'Natural Spice Shop', desc: 'Browse curry powders, whole spices, and masala blends sourced directly from Wayanad tribal farms.' },
  { icon: '📍', title: 'Farm-to-Table Tracking', desc: 'Every product carries an origin trace — know your spice\'s altitude, harvest season, and drying method.' },
  { icon: '⚡', title: 'Fresh-Pack Guarantee', desc: 'Orders packed within 72 hours of harvest and dispatched the same day — no warehouse aging.' },
  { icon: '🛡️', title: 'Zero Adulterants', desc: 'FSSAI certified. No artificial color, no preservatives, no synthetic fillers — ever.' },
  { icon: '🌿', title: 'Eco Packaging', desc: 'Biodegradable, recyclable, and minimal — packaging as responsible as the spices inside.' },
  { icon: '🌾', title: 'Tribal Farmer Sourced', desc: 'Direct partnership with indigenous farmers of Wayanad. Fair price. Sustainable practice.' },
];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const leaves = [
    { top: '10%', left: '-1%',  size: 52, color: '#4CAF50',              stroke: '#2D5A27', rotate: '20deg'  },
    { top: '22%', left: '2%',   size: 34, color: '#66BB6A',              stroke: '#388E3C', rotate: '-10deg' },
    { top: '44%', left: '-1%',  size: 42, color: '#43A047',              stroke: '#2D5A27', rotate: '35deg'  },
    { top: '67%', left: '3%',   size: 28, color: '#81C784',              stroke: '#4CAF50', rotate: '-20deg' },
    { top: '5%',  right: '1%',  size: 58, color: '#4CAF50',              stroke: '#2D5A27', rotate: '-25deg' },
    { top: '30%', right: '0%',  size: 36, color: '#66BB6A',              stroke: '#388E3C', rotate: '15deg'  },
    { top: '57%', right: '2%',  size: 46, color: '#43A047',              stroke: '#2D5A27', rotate: '-40deg' },
    { top: '82%', left: '4%',   size: 30, color: '#81C784',              stroke: '#4CAF50', rotate: '50deg'  },
    { top: '89%', right: '3%',  size: 34, color: '#4CAF50',              stroke: '#2D5A27', rotate: '-15deg' },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes leafFloat {
          0%, 100% { transform: translateY(0px) rotate(var(--r, 0deg)); }
          33%       { transform: translateY(-12px) rotate(calc(var(--r, 0deg) + 5deg)); }
          66%       { transform: translateY(-6px)  rotate(calc(var(--r, 0deg) - 3deg)); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gentlePulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.05); }
        }
        @keyframes scrollDown {
          0%   { transform: translateY(0);   opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }
        @keyframes mtnDrift {
          0%, 100% { transform: translateX(0); }
          50%       { transform: translateX(-6px); }
        }
        .fade-in-up           { animation: fadeInUp 0.8s ease-out forwards; }
        .fade-in-up-delay-1   { animation: fadeInUp 0.8s ease-out 0.15s forwards; opacity: 0; }
        .fade-in-up-delay-2   { animation: fadeInUp 0.8s ease-out 0.30s forwards; opacity: 0; }
        .fade-in-up-delay-3   { animation: fadeInUp 0.8s ease-out 0.45s forwards; opacity: 0; }
        .feature-card         { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .feature-card:hover   { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(45,90,39,0.12); }
        .hero-leaf-bg {
          background-image:
            radial-gradient(ellipse at 10% 50%, rgba(76,175,80,0.07) 0%, transparent 50%),
            radial-gradient(ellipse at 90% 20%, rgba(45,90,39,0.06) 0%, transparent 50%);
        }
        @media (prefers-reduced-motion: reduce) {
          .fade-in-up, .fade-in-up-delay-1,
          .fade-in-up-delay-2, .fade-in-up-delay-3 { animation: none; opacity: 1; }
        }
      `}</style>

      {/* ══ Navbar ══ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-50' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="SIGWE" className="h-9 object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            <a href="https://sigwe.in" target="_blank" rel="noopener noreferrer"
              className="hidden sm:block text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors">
              sigwe.in
            </a>
            <Link to="/shop" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
              Shop
            </Link>
            <Link to="/login"
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 shadow-sm">
              <LogIn size={15} /> Login
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ Hero Section with Mountain Background ══ */}
      <section className="relative min-h-screen flex items-center hero-leaf-bg overflow-hidden">

        {/* Animated Wayanad mountain background */}
        <WayanadMountainBg />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.60) 50%, rgba(234,244,232,0.30) 100%)',
        }} />

        {/* Floating leaves (above mountain) */}
        {leaves.map((leaf, i) => (
          <FloatingLeaf key={i} delay={i * 0.8} style={leaf} />
        ))}

        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ height: 5, background: 'linear-gradient(90deg, transparent 0%, rgba(45,90,39,0.18) 30%, rgba(76,175,80,0.22) 60%, transparent 100%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">

          {/* Origin badges */}
          <div className="fade-in-up flex flex-wrap items-center justify-center gap-3 mb-6">
            <OriginBadge />
            <MapChip />
          </div>

          {/* Headline */}
          <h1 className="fade-in-up-delay-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight max-w-4xl mx-auto"
            style={{ fontFamily: 'Manrope, sans-serif' }}>
            Pure Spices from the
            <span className="block bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 bg-clip-text text-transparent">
              Heart of Wayanad
            </span>
          </h1>

          <p className="fade-in-up-delay-2 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mt-5 leading-relaxed">
            Naturally grown curry powders &amp; spice blends. Sourced from tribal farms at 900m altitude in Kerala's Western Ghats — packed fresh, delivered to your door.
          </p>

          {/* Flavor tag row */}
          <div className="fade-in-up-delay-2 flex justify-center mt-5">
            <FlavorTagRow tags={FLAVOR_TAGS} />
          </div>

          {/* CTAs */}
          <div className="fade-in-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link to="/shop"
              className="group flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all duration-200 shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5">
              <ShoppingBag size={20} />
              Shop Spices
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login"
              className="flex items-center gap-2 bg-white border border-emerald-200 hover:border-emerald-400 text-emerald-700 font-bold px-8 py-4 rounded-2xl text-base transition-all duration-200 hover:-translate-y-0.5">
              <LogIn size={18} /> Login
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-14 flex justify-center">
            <div className="flex flex-col items-center gap-1 text-gray-400">
              <span className="text-xs tracking-widest uppercase">Scroll</span>
              <div style={{ animation: 'scrollDown 1.5s ease-in-out infinite' }}
                className="w-0.5 h-8 bg-gradient-to-b from-emerald-400 to-transparent rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ Freshness Strip ══ */}
      <FreshnessStrip />

      {/* ══ Culture Stats ══ */}
      <section className="py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6">
            <HeritageTags tags={['Hill country harvest', 'Monsoon-grown', 'GI tagged region']} />
          </div>
          <CultureStats />
        </div>
      </section>

      {/* ══ Stats Banner ══ */}
      <section className="bg-gradient-to-r from-emerald-800 to-emerald-700 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { value: 400,  suffix: '+', label: 'Years of Wayanad farming'  },
            { value: 12,   suffix: '',  label: 'Native spice varieties'     },
            { value: 72,   suffix: 'h', label: 'Harvest-to-pack time'       },
            { value: 100,  suffix: '%', label: 'Farmer-direct sourcing'     },
          ].map(s => (
            <div key={s.label} className="text-center">
              <StatCard value={s.value} suffix={s.suffix} label={s.label} />
            </div>
          ))}
        </div>
      </section>

      {/* ══ Features Grid ══ */}
      <section className="py-24 bg-[#f5fbf5] relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent opacity-40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-widest mb-4">
              <TreePine size={14} /> Why SIGWE Palankara
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Nature's best — delivered right
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm sm:text-base">
              From Wayanad's misty hills to your kitchen — every step is traceable, ethical, and delicious.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i}
                className="feature-card bg-white rounded-2xl p-7 border border-gray-100 cursor-default"
                onMouseEnter={() => setActiveFeature(i)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-2xl transition-colors duration-200 ${activeFeature === i ? 'bg-emerald-700' : 'bg-emerald-50'}`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Harvest Journey ══ */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-start">

          {/* Left: Timeline */}
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-widest mb-4">
              <Leaf size={14} /> From Farm to Jar
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
              The Harvest
              <span className="block text-emerald-700"> Journey</span>
            </h2>
            <HarvestJourney />
          </div>

          {/* Right: Brand story */}
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-widest mb-4">
              <Wind size={14} /> Our Story
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Rooted in Wayanad's
              <span className="block text-emerald-700"> Spice Legacy</span>
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">
              SIGWE Palankara partners directly with tribal farming families in Wayanad — Kerala's crown jewel of biodiversity. At 900m altitude, bathed in monsoon rains, their spices develop complex, layered aromas you won't find in mass-market brands.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
              Every batch is sun-dried, hand-sorted, cold-ground in traditional stone mills, and sealed to lock in essential oils. No shortcuts. No adulterants. Just pure, honest spice.
            </p>

            <div className="mb-6">
              <HeritageTags />
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={16} color="#639922" />
              <span style={{ fontSize: 13, color: '#639922', fontWeight: 600 }}>
                Mananthavady &amp; Sultan Bathery, Wayanad, Kerala — 680651
              </span>
            </div>

            <a href="https://sigwe.in" target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-emerald-700 font-bold hover:text-emerald-800 transition-colors mt-6">
              Visit SIGWE.in
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* ══ CTA Banner ══ */}
      <section className="relative py-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a4019 0%, #2D5A27 50%, #3a7a35 100%)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-10">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute" style={{
              top: `${(i * 17 + 5) % 100}%`,
              left: `${(i * 23 + 8) % 100}%`,
              fontSize: `${20 + (i % 3) * 10}px`,
              transform: `rotate(${i * 30}deg)`,
              animation: `gentlePulse ${3 + (i % 2)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.4) % 2}s`,
            }}>🍃</div>
          ))}
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Ready to taste Wayanad?
          </h2>
          <p className="text-emerald-200 text-base md:text-lg mb-10">
            Order fresh, farmer-direct spices. Packed within 72 hours. Delivered to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop"
              className="flex items-center justify-center gap-2 bg-white text-emerald-700 font-bold px-8 py-4 rounded-2xl hover:bg-emerald-50 transition-all duration-200 hover:-translate-y-0.5 shadow-xl">
              <ShoppingBag size={20} /> Browse Shop
            </Link>
            <Link to="/login"
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 font-bold px-8 py-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5">
              <LogIn size={20} /> Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ══ Footer ══ */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trust badges */}
          <div className="mb-8">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Our Commitments</p>
            <TrustBadges />
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="SIGWE" className="h-8 object-contain brightness-0 invert opacity-70" />
              <div>
                <div className="text-white font-semibold text-sm">SIGWE Palankara</div>
                <div className="text-xs text-gray-500">Wayanad Spices · Kerala, India</div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/shop" className="hover:text-emerald-400 transition-colors">Shop</Link>
              <Link to="/login" className="hover:text-emerald-400 transition-colors">Login</Link>
              <a href="https://sigwe.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">sigwe.in ↗</a>
            </div>
            <div className="text-xs text-gray-600">© {new Date().getFullYear()} SIGWE. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
