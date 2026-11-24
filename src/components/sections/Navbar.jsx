import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ArrowUpRight, Search, Sparkles, Headphones } from 'lucide-react';
import { audioEngine } from '../../utils/audio';

export default function Navbar({ onOpenOrderModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      // Threshold for switching from cream hero styling to dark section styling
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Synchronize audio engine state in real time
    const unsubscribe = audioEngine.subscribe((active) => {
      setIsAudioActive(active);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const handleToggleAudio = () => {
    audioEngine.toggleMute();
  };

  const navLinks = [
    { name: 'IEMs', href: '#hero' },
    { name: 'Careers', href: '#careers' },
  ];

  const searchResults = [
    { label: 'Aetheris X-1 Monarch (Flagship IEM)', target: '#hero', tag: 'Product' },
    { label: '3D Disintegration & Acoustic Lab', target: '#deconstruction', tag: '3D Experience' },
    { label: 'Beryllium Sub-Woofer & Driver Array', target: '#engineering', tag: 'Engineering' },
    { label: '360° Interactive Product Showcase', target: '#product-showcase', tag: 'Showcase' },
    { label: 'Critical Acclaim & Master Reviews', target: '#reviews', tag: 'Reviews' },
    { label: 'Careers @ Headphone Zone Mumbai HQ', target: '#careers', tag: 'Hiring' },
  ].filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()) || item.tag.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSmoothNav = (href) => {
    audioEngine.playHapticBlip(800, 0.03, 0.04);
    setSearchOpen(false);
    setMobileMenuOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3.5 bg-[#080808]/92 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-white'
            : 'py-5 bg-[#FAF8F5]/85 backdrop-blur-md border-b border-[#EBE7DF]/80 text-[#111111]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Brand Logo on Left */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleSmoothNav('#hero');
            }}
            className="group flex items-center gap-3 focus:outline-none"
          >
            <div
              className={`relative w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 border ${
                scrolled
                  ? 'bg-white/[0.04] border-white/15 group-hover:border-[#C2410C]/80'
                  : 'bg-black/[0.04] border-black/15 group-hover:border-[#C2410C]'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rotate-45 border-2 transition-colors duration-300 ${
                  scrolled ? 'border-white/90 group-hover:border-[#C2410C]' : 'border-black group-hover:border-[#C2410C]'
                }`}
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-display font-extrabold text-base tracking-[0.22em] transition-colors ${
                  scrolled ? 'text-white' : 'text-[#111111]'
                }`}
              >
                HEADPHONE ZONE
              </span>
              <span
                className={`font-mono-tech text-[8px] tracking-[0.28em] uppercase transition-colors ${
                  scrolled ? 'text-neutral-400' : 'text-[#71717A]'
                }`}
              >
                AETHERIS LABS // REFERENCE IEM
              </span>
            </div>
          </a>

          {/* Clean Navigation Links: IEMs and Careers */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothNav(link.href);
                }}
                className={`text-xs uppercase tracking-[0.2em] font-semibold transition-colors duration-200 relative py-1 group flex items-center gap-1.5 ${
                  scrolled
                    ? 'text-neutral-300 hover:text-white'
                    : 'text-[#27272A] hover:text-[#C2410C]'
                }`}
              >
                {link.name === 'Careers' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C] animate-pulse" />
                )}
                <span>{link.name}</span>
                <span
                  className={`absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${
                    scrolled ? 'bg-[#C2410C]' : 'bg-[#C2410C]'
                  }`}
                />
              </a>
            ))}
          </nav>

          {/* Search, Audio Toggle & Action CTA on Right */}
          <div className="flex items-center gap-3">
            {/* Search Icon */}
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                audioEngine.playHapticBlip(1100, 0.03, 0.04);
              }}
              className={`p-2 rounded-full transition-colors ${
                scrolled
                  ? 'text-neutral-300 hover:text-white hover:bg-white/[0.08]'
                  : 'text-[#27272A] hover:text-black hover:bg-black/[0.05]'
              }`}
              title="Search catalog & sections"
              aria-label="Search catalog & sections"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Audio Feedback Toggle */}
            <button
              onClick={handleToggleAudio}
              className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono-tech transition-all duration-300 ${
                scrolled
                  ? isAudioActive
                    ? 'border-[#C2410C]/60 bg-[#C2410C]/15 text-[#EA580C] shadow-[0_0_15px_rgba(194,65,12,0.25)]'
                    : 'border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white hover:border-white/20'
                  : isAudioActive
                  ? 'border-[#C2410C]/40 bg-[#C2410C]/10 text-[#C2410C] font-semibold'
                  : 'border-[#E2DDD5] bg-white/70 text-[#52525B] hover:text-black hover:border-black/30'
              }`}
              title={isAudioActive ? 'Mute soundscape' : 'Enable soundscape'}
            >
              {isAudioActive ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#C2410C]" />
                  <span className="hidden sm:inline text-[10px] tracking-wider uppercase font-semibold">Sound On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px] tracking-wider uppercase">Sound</span>
                </>
              )}
            </button>

            {/* Pre-Order / Inquire CTA Button */}
            <button
              onClick={() => {
                audioEngine.playHapticBlip(1200, 0.06, 0.08);
                onOpenOrderModal();
              }}
              className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-sm hover:scale-[1.02] active:scale-[0.98] ${
                scrolled
                  ? 'bg-white text-black hover:bg-neutral-200'
                  : 'bg-[#111111] text-white hover:bg-[#27272A]'
              }`}
            >
              <span>Explore Series</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 focus:outline-none transition-colors ${
                scrolled ? 'text-neutral-300 hover:text-white' : 'text-[#111111]'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Flyout with Live Suggestions */}
        {searchOpen && (
          <div
            className={`px-6 py-4 border-t transition-colors animate-fadeIn ${
              scrolled ? 'bg-[#0d0d10] border-white/10' : 'bg-[#F5F2EB] border-[#E8E4DC]'
            }`}
          >
            <div className="max-w-4xl mx-auto flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Search className={`w-4 h-4 ${scrolled ? 'text-neutral-400' : 'text-[#71717A]'}`} />
                <input
                  type="text"
                  placeholder="Search IEMs, 3D deconstruction, engineering specs, careers..."
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full bg-transparent text-sm focus:outline-none font-sans ${
                    scrolled ? 'text-white placeholder:text-neutral-500' : 'text-[#111111] placeholder:text-[#888888]'
                  }`}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className={`text-xs font-mono-tech uppercase ${scrolled ? 'text-neutral-400' : 'text-[#71717A]'}`}
                >
                  Close
                </button>
              </div>

              {/* Quick Jump Suggestions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-black/5 dark:border-white/5">
                {searchResults.map((res, i) => (
                  <button
                    key={i}
                    onClick={() => handleSmoothNav(res.target)}
                    className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-2 transition-colors ${
                      scrolled
                        ? 'bg-white/5 hover:bg-white/15 text-neutral-300'
                        : 'bg-black/5 hover:bg-black/10 text-neutral-800'
                    }`}
                  >
                    <span>{res.label}</span>
                    <span className="text-[10px] font-mono-tech text-[#C2410C] uppercase">{res.tag}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#FAF8F5]/98 backdrop-blur-2xl flex flex-col justify-center px-8 md:hidden border-b border-[#E2DDD5] animate-fadeIn text-[#111111]">
          <div className="flex flex-col gap-6 max-w-sm mx-auto w-full">
            <span className="font-mono-tech text-[10px] text-[#C2410C] tracking-[0.3em] uppercase font-bold">
              // Headphone Zone Index
            </span>
            {navLinks.map((link, idx) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothNav(link.href);
                }}
                className="font-display text-3xl font-bold tracking-wider text-[#111111] hover:text-[#C2410C] transition-colors flex items-center justify-between"
              >
                <span>{link.name}</span>
                <span className="font-mono-tech text-xs text-[#888888]">0{idx + 1}</span>
              </a>
            ))}
            <div className="pt-6 border-t border-[#E2DDD5] flex flex-col gap-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOrderModal();
                }}
                className="w-full py-3.5 rounded-full bg-[#111111] text-white font-semibold text-xs uppercase tracking-widest text-center shadow-lg hover:bg-neutral-800"
              >
                Inquire Pre-Order ($1,499)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
