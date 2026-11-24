import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/sections/Navbar';
import Hero from './components/sections/Hero';
import DeconstructionSection from './components/sections/DeconstructionSection';
import EngineeringSection from './components/sections/EngineeringSection';
import ReassemblySection from './components/sections/ReassemblySection';
import ProductShowcase from './components/sections/ProductShowcase';
import PhilosophySection from './components/sections/PhilosophySection';
import ReviewsSection from './components/sections/ReviewsSection';
import CareersSection from './components/sections/CareersSection';
import Footer from './components/sections/Footer';
import OrderModal from './components/ui/OrderModal';
import CustomCursor from './components/ui/CustomCursor';
import AudioBar from './components/ui/AudioBar';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(1000, 16);

    // Refresh triggers after DOM settles
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    // Smooth scroll for all internal anchor hash links via Lenis
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.length > 1) {
          const targetId = href.substring(1);
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            e.preventDefault();
            if (lenisRef.current) {
              lenisRef.current.scrollTo(targetEl, { offset: 0, duration: 1.4 });
            } else {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  const handleExploreClick = () => {
    const el = document.getElementById('deconstruction');
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: 0, duration: 1.6 });
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080808] text-white selection:bg-electric-blue/30 selection:text-white">
      {/* Luxury Audiophile Custom Reticle Cursor */}
      <CustomCursor />

      {/* Floating Audio Engine HUD Pill */}
      <AudioBar />

      {/* Navbar with Audio Engine Toggle & Pre-Order CTA */}
      <Navbar onOpenOrderModal={() => setIsOrderModalOpen(true)} />

      {/* Hero Section */}
      <Hero onExploreClick={handleExploreClick} />

      {/* Main Pinned Scroll Deconstruction Animation (Centerpiece) */}
      <DeconstructionSection />

      {/* Internal Engineering Section */}
      <EngineeringSection />

      {/* Reassembly and Product Reveal ("EVERY DETAIL MATTERS") */}
      <ReassemblySection />

      {/* Product Showcase with 360 Interactive Model Inspection */}
      <ProductShowcase onOpenOrderModal={() => setIsOrderModalOpen(true)} />

      {/* Acoustic Horology Philosophy */}
      <PhilosophySection />

      {/* Critical Acclaim & Sound Engineer Reviews */}
      <ReviewsSection />

      {/* Headphone Zone Official Careers & Recruitment Experience */}
      <CareersSection />

      {/* Luxury Footer */}
      <Footer />

      {/* Bespoke Allocation / Pre-Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </div>
  );
}
