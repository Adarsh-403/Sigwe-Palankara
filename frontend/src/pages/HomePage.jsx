import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, BarChart2, Zap, Shield, Leaf, ArrowRight, TreePine, Sprout, Wind, LogIn } from 'lucide-react';

// Animated floating leaf component
function FloatingLeaf({ style, delay = 0 }) {
  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        top: style.top,
        left: style.left,
        right: style.right,
        '--r': style.rotate || '0deg',
        animation: `leafFloat ${7 + (delay % 4)}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        filter: 'drop-shadow(0 2px 6px rgba(45,90,39,0.25))',
      }}
    >
      <svg viewBox="0 0 40 54" fill="none" xmlns="http://www.w3.org/2000/svg"
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

// Counter animation hook
function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.5 });
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
      <div className="text-4xl md:text-5xl font-bold text-white font-heading">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-emerald-200 mt-1 text-sm">{label}</div>
    </div>
  );
}

const features = [
  { icon: <ShoppingBag size={28} />, title: 'Smart POS Counter', desc: 'Lightning-fast billing at the counter with intuitive cart management and order codes for seamless pickup.' },
  { icon: <BarChart2 size={28} />, title: 'Real-time Analytics', desc: 'Track revenue, top products, and payment breakdowns with live dashboards updated every transaction.' },
  { icon: <Zap size={28} />, title: 'Instant Inventory', desc: 'Auto-update stock levels with every sale. Get low-stock alerts before you run out of your best sellers.' },
  { icon: <Shield size={28} />, title: 'Role-based Access', desc: 'Admins control everything. Sales staff only see the POS. Secure, role-aware access for every team member.' },
  { icon: <Leaf size={28} />, title: 'Green Commerce', desc: 'Built for eco-conscious, nature-forward retail businesses. Aligned with SIGWE\'s sustainable values.' },
  { icon: <Sprout size={28} />, title: 'Order Management', desc: 'View, track, and manage every order placed online or at the counter from a single unified dashboard.' },
];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const leaves = [
    { top: '8%',  left: '-1%',  size: 56, color: '#4CAF50',           stroke: '#2D5A27', rotate: '20deg'  },
    { top: '20%', left: '2%',   size: 36, color: '#66BB6A',           stroke: '#388E3C', rotate: '-10deg' },
    { top: '42%', left: '-1%',  size: 44, color: '#43A047',           stroke: '#2D5A27', rotate: '35deg'  },
    { top: '65%', left: '3%',   size: 30, color: '#81C784',           stroke: '#4CAF50', rotate: '-20deg' },
    { top: '5%',  right: '1%',  size: 60, color: '#4CAF50',           stroke: '#2D5A27', rotate: '-25deg' },
    { top: '28%', right: '0%',  size: 38, color: '#66BB6A',           stroke: '#388E3C', rotate: '15deg'  },
    { top: '55%', right: '2%',  size: 48, color: '#43A047',           stroke: '#2D5A27', rotate: '-40deg' },
    { top: '80%', left: '4%',   size: 32, color: '#81C784',           stroke: '#4CAF50', rotate: '50deg'  },
    { top: '88%', right: '3%',  size: 36, color: '#4CAF50',           stroke: '#2D5A27', rotate: '-15deg' },
    { top: '50%', left: '45%',  size: 24, color: 'rgba(76,175,80,0.35)', stroke: '#4CAF50', rotate: '60deg'  },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes leafFloat {
          0%, 100% { transform: translateY(0px) rotate(var(--r, 0deg)); }
          33% { transform: translateY(-12px) rotate(calc(var(--r, 0deg) + 5deg)); }
          66% { transform: translateY(-6px) rotate(calc(var(--r, 0deg) - 3deg)); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes twigSway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes gentlePulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }
        .fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .fade-in-up-delay-1 { animation: fadeInUp 0.8s ease-out 0.15s forwards; opacity: 0; }
        .fade-in-up-delay-2 { animation: fadeInUp 0.8s ease-out 0.3s forwards; opacity: 0; }
        .fade-in-up-delay-3 { animation: fadeInUp 0.8s ease-out 0.45s forwards; opacity: 0; }
        .feature-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .feature-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(45,90,39,0.12); }
        .tree-sway { animation: twigSway 4s ease-in-out infinite; transform-origin: bottom center; }
        .hero-leaf-bg {
          background-image: 
            radial-gradient(ellipse at 10% 50%, rgba(76,175,80,0.07) 0%, transparent 50%),
            radial-gradient(ellipse at 90% 20%, rgba(45,90,39,0.06) 0%, transparent 50%);
        }
      `}</style>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-emerald-50' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="SIGWE" className="h-9 object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            <a href="https://sigwe.in" target="_blank" rel="noopener noreferrer" className="hidden sm:block text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors">
              sigwe.in
            </a>
            <Link
              to="/shop"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-emerald-200 hover:shadow-md"
            >
              <LogIn size={15} /> Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center hero-leaf-bg overflow-hidden">
        {/* Decorative tree silhouettes */}
        <div className="absolute bottom-0 left-0 pointer-events-none select-none" style={{ width: 180, opacity: 0.07 }}>
          <svg viewBox="0 0 180 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="80" y="200" width="20" height="120" fill="#2D5A27" />
            <ellipse cx="90" cy="160" rx="70" ry="90" fill="#2D5A27" />
            <ellipse cx="90" cy="110" rx="50" ry="65" fill="#2D5A27" />
            <ellipse cx="90" cy="70" rx="35" ry="45" fill="#2D5A27" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 pointer-events-none select-none" style={{ width: 220, opacity: 0.06 }}>
          <svg viewBox="0 0 220 380" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="95" y="240" width="24" height="140" fill="#2D5A27" />
            <ellipse cx="107" cy="190" rx="85" ry="110" fill="#2D5A27" />
            <ellipse cx="107" cy="130" rx="60" ry="80" fill="#2D5A27" />
            <ellipse cx="107" cy="80" rx="42" ry="55" fill="#2D5A27" />
          </svg>
        </div>

        {/* Floating leaves */}
        {leaves.map((leaf, i) => (
          <FloatingLeaf
            key={i}
            delay={i * 0.8}
            style={{
              top: leaf.top,
              left: leaf.left,
              right: leaf.right,
              size: leaf.size,
              color: leaf.color,
              stroke: leaf.stroke,
              '--r': leaf.rotate,
            }}
          />
        ))}

        {/* Vine / branch decoration top */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: 6, background: 'linear-gradient(90deg, transparent 0%, rgba(45,90,39,0.15) 30%, rgba(76,175,80,0.2) 60%, transparent 100%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          {/* Badge */}
          <div className="fade-in-up inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <Leaf size={12} />
            <span>SIGWE Palankara — Nature's Retail Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="fade-in-up-delay-1 text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 leading-tight tracking-tight max-w-4xl mx-auto" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Where Nature Meets
            <span className="block bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-700 bg-clip-text text-transparent">
              Smart Commerce
            </span>
          </h1>

          <p className="fade-in-up-delay-2 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mt-6 leading-relaxed">
            SIGWE Palankara is your all-in-one inventory & POS system—built for natural, eco-conscious retail. Manage products, orders, and analytics in a single green-first platform.
          </p>

          {/* CTAs */}
          <div className="fade-in-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              to="/shop"
              className="group flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all duration-200 shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5"
            >
              <ShoppingBag size={20} />
              Browse Products
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 bg-white border border-emerald-200 hover:border-emerald-400 text-emerald-700 font-bold px-8 py-4 rounded-2xl text-base transition-all duration-200 hover:-translate-y-0.5"
            >
              <LogIn size={18} />
              Login
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 flex justify-center">
            <div className="flex flex-col items-center gap-1 text-gray-400">
              <span className="text-xs tracking-widest uppercase">Scroll</span>
              <div style={{ animation: 'scrollDown 1.5s ease-in-out infinite' }} className="w-0.5 h-8 bg-gradient-to-b from-emerald-400 to-transparent rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-emerald-800 to-emerald-700 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { value: 500,  suffix: '+', label: 'Products Managed'  },
            { value: 1200, suffix: '+', label: 'Orders Processed'  },
            { value: 98,   suffix: '%', label: 'Uptime Reliability' },
            { value: 3,    suffix: 'x', label: 'Faster Checkout'   },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <StatCard value={s.value} suffix={s.suffix} label={s.label} />
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[#f5fbf5] relative">
        {/* Leaf border decoration */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent opacity-40" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-widest mb-4">
              <TreePine size={14} /> Features
            </div>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Everything your store needs
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              From the counter to the cloud, SIGWE Palankara brings nature-inspired clarity to every retail operation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="feature-card bg-white rounded-2xl p-7 border border-gray-100 cursor-default"
                onMouseEnter={() => setActiveFeature(i)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-200 ${activeFeature === i ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-5" style={{ width: 300 }}>
          <svg viewBox="0 0 300 500" fill="none">
            <rect x="130" y="300" width="40" height="200" fill="#2D5A27" />
            <ellipse cx="150" cy="240" rx="130" ry="160" fill="#2D5A27" />
            <ellipse cx="150" cy="140" rx="95" ry="120" fill="#2D5A27" />
            <ellipse cx="150" cy="70" rx="65" ry="85" fill="#2D5A27" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <div className="relative flex items-center justify-center">
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center shadow-2xl shadow-emerald-100">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center" style={{ animation: 'gentlePulse 3s ease-in-out infinite' }}>
                <img src={`${import.meta.env.BASE_URL}logo.png`} alt="SIGWE" className="w-28 h-28 object-contain" />
              </div>
            </div>
            {/* Orbiting leaf dots */}
            {[0, 72, 144, 216, 288].map((deg, i) => (
              <div
                key={i}
                className="absolute w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"
                style={{
                  top: '50%', left: '50%',
                  transform: `rotate(${deg}deg) translateX(130px) rotate(-${deg}deg) translate(-50%, -50%)`,
                  animation: `gentlePulse ${2 + i * 0.3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                <Leaf size={10} />
              </div>
            ))}
          </div>

          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-widest mb-4">
              <Wind size={14} /> About Palankara
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Rooted in SIGWE's <br />
              <span className="text-emerald-700">Natural Vision</span>
            </h2>
            <p className="text-gray-600 mb-5 leading-relaxed">
              SIGWE (Sustainable Innovation for Green World Economy) is a parent organization dedicated to building eco-conscious businesses and products that exist in harmony with nature.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Palankara is their retail intelligence arm — a POS and inventory system designed for stores that carry natural, herbal, and sustainable products. Every transaction processed here supports a greener, smarter commerce ecosystem.
            </p>
            <a
              href="https://sigwe.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-emerald-700 font-bold hover:text-emerald-800 transition-colors"
            >
              Visit SIGWE.in
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a4019 0%, #2D5A27 50%, #3a7a35 100%)' }}>
        {/* Leaf patterns */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                fontSize: `${20 + Math.random() * 30}px`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `gentlePulse ${3 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              🍃
            </div>
          ))}
        </div>

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Ready to grow your store?
          </h2>
          <p className="text-emerald-200 text-lg mb-10">
            Sign in to manage your inventory, run POS, and view analytics — your access level is determined by your account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="flex items-center justify-center gap-2 bg-white text-emerald-700 font-bold px-8 py-4 rounded-2xl hover:bg-emerald-50 transition-all duration-200 hover:-translate-y-0.5 shadow-xl"
            >
              <ShoppingBag size={20} /> Browse Shop
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 font-bold px-8 py-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <LogIn size={20} /> Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="SIGWE" className="h-8 object-contain brightness-0 invert opacity-70" />
              <div>
                <div className="text-white font-semibold text-sm">SIGWE Palankara</div>
                <div className="text-xs text-gray-500">Retail Intelligence by SIGWE</div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/shop" className="hover:text-emerald-400 transition-colors">Shop</Link>
              <Link to="/login" className="hover:text-emerald-400 transition-colors">Login</Link>
              <a href="https://sigwe.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">sigwe.in ↗</a>
            </div>
            <div className="text-xs text-gray-600">
              © {new Date().getFullYear()} SIGWE. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
