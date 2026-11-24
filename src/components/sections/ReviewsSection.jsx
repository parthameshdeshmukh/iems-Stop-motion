import React from 'react';
import { Star, Quote, Award } from 'lucide-react';

export default function ReviewsSection() {
  const reviews = [
    {
      quote:
        'The transient speed of the Aetheris X-1 is uncanny. It exposes micro-details in orchestral string decays that even reference 4-figure open-back planar headphones fail to reveal.',
      author: 'Marcus Vance',
      role: 'Chief Mastering Engineer, Abbey Road Studios Contributor',
      rating: 5,
    },
    {
      quote:
        'The deconstruction of soundstage is astounding. The bass slam from the beryllium dynamic driver feels physically present, yet the treble extension remains silky and non-fatiguing for 8-hour sessions.',
      author: 'Dr. Elena Rostova',
      role: 'Acoustical Society of America Fellow & Reviewer',
      rating: 5,
    },
    {
      quote:
        'An absolute masterclass in electro-acoustic design. The CNC titanium finish feels like a fine Patek Philippe horological timepiece in the palm of your hand.',
      author: 'SoundStage! Ultra',
      role: 'Reference Product of the Year Award',
      rating: 5,
    },
  ];

  return (
    <section id="reviews" className="relative w-full py-28 bg-[#080808] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-subtle mb-4">
            <Award className="w-3.5 h-3.5 text-electric-blue" />
            <span className="font-mono-tech text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
              // CRITICAL RECOGNITION
            </span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-gradient-silver tracking-tight">
            PRAISE FROM THE MASTERS.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col justify-between relative group hover:border-white/20 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-electric-blue/30 mb-4 group-hover:text-electric-blue/70 transition-colors" />
              <p className="text-sm md:text-base text-neutral-300 leading-relaxed font-light italic mb-8">
                "{rev.quote}"
              </p>
              <div className="pt-6 border-t border-white/10 flex flex-col">
                <div className="flex gap-1 mb-2">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-electric-blue text-electric-blue" />
                  ))}
                </div>
                <span className="font-display font-bold text-white text-sm">{rev.author}</span>
                <span className="text-xs text-neutral-500 font-mono-tech mt-0.5">{rev.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
