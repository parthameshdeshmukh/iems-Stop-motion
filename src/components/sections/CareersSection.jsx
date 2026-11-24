import React, { useState, useRef } from 'react';
import {
  Briefcase,
  Sparkles,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Music,
  Headphones,
  Code2,
  ChevronRight,
  ChevronLeft,
  Flame,
  Coffee,
  Heart,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { audioEngine } from '../../utils/audio';

export default function CareersSection() {
  const formRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');

  // Form field state strictly matching Jotform names
  const [formData, setFormData] = useState({
    // Step 1: Identity & Commute
    fullName: '',
    email: '',
    phone: '',
    commute: 'YES I do', // Default to YES I do
    joinDate: '',
    joinMonth: '',
    joinDay: '',
    joinYear: '',

    // Step 2: About & Philosophy
    tellUs: '',
    whyWork: '',

    // Step 3: Positions applied for (array for checkboxes)
    positions: ['Customer Happiness Officer\u00A0(Customer Service & After-Sales Specialist)'],

    // Role-specific answers
    // Support/Operations/Warranty
    meenaHelp: '',
    praveenReview: '',
    joshuaWarranty: '',

    // Product Specialist
    productFirstQuestion: '',

    // Website Catalogue
    salesDropDiagnosis: '',
    htmlCssExperience: '',
    websiteChanges: '',

    // Executive Assistant
    eaExperience: '',

    // Email Marketing
    emailAnnouncement: '',
    emailLowClicks: '',
    emailAudienceDifference: '',

    // Automations Assistant
    appScriptDebugging: '',
    n8nTroubleshooting: '',
    webhookDebugging: '',
    codeCallType: '',

    // Social Media Manager
    cringyTrend: '',
    socialMediaChanges: '',

    // Media & Visuals (Photo / Video)
    highPerformingContent: '',
    contentIdea: '',
    softwareFamiliarity: 'Yes',
    portfolioLink: '',

    // Finance Data Analyst
    salesFigureAnalysis: '',
    excelDiscrepancy: '',

    // Step 4: Music & Referral
    musicTaste: '',
    referralSource: 'Website',
    referralOther: '',
  });

  const [errors, setErrors] = useState({});

  // When join date changes, parse month, day, year for Jotform datetime format
  const handleDateChange = (e) => {
    const val = e.target.value; // YYYY-MM-DD
    if (val) {
      const [year, month, day] = val.split('-');
      setFormData(prev => ({
        ...prev,
        joinDate: val,
        joinYear: year,
        joinMonth: month,
        joinDay: day,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        joinDate: '',
        joinYear: '',
        joinMonth: '',
        joinDay: '',
      }));
    }
  };

  const handlePositionToggle = (posValue) => {
    audioEngine.playHapticBlip(880, 0.03, 0.04);
    setFormData(prev => {
      const exists = prev.positions.includes(posValue);
      let newPositions;
      if (exists) {
        newPositions = prev.positions.filter(p => p !== posValue);
      } else {
        newPositions = [...prev.positions, posValue];
      }
      return { ...prev, positions: newPositions };
    });
  };

  const handleTextChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      audioEngine.playHapticBlip(950, 0.04, 0.05);
    }
  };

  // Determine active situational sections based on selected positions
  const hasSupportOrWarranty = formData.positions.some(p =>
    p.includes('Customer Happiness') ||
    p.includes('Customer Operations') ||
    p.includes('Customer Experience')
  );

  const hasCustomerHappiness = formData.positions.some(p => p.includes('Customer Happiness'));
  const hasOperations = formData.positions.some(p => p.includes('Customer Operations'));
  const hasWarranty = formData.positions.some(p => p.includes('Customer Experience'));

  const hasProductSpecialist = formData.positions.some(p => p.includes('Product Specialist'));
  const hasWebsiteCatalogue = formData.positions.some(p => p.includes('Website Catalogue'));
  const hasEA = formData.positions.some(p => p.includes('Executive Assistant'));
  const hasEmailMarketing = formData.positions.some(p => p.includes('Email Marketing'));
  const hasAutomations = formData.positions.some(p => p.includes('Automations Assistant'));
  const hasSocialMedia = formData.positions.some(p => p.includes('Social Media'));
  const hasPhotography = formData.positions.some(p => p.includes('Photographer'));
  const hasVideoEditor = formData.positions.some(p => p.includes('Video Editor'));

  const isCommuteBlocked = formData.commute === 'Way too far for me, bye-bye' || formData.commute === "No, but I'm going to try.";

  // Step validation
  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Please enter your full name';
      if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Please provide a valid email';
      if (!formData.phone.trim() || formData.phone.length < 10) newErrors.phone = '10 digits required';
      if (!formData.joinDate) newErrors.joinDate = 'Please select when you can join';
    } else if (step === 2) {
      if (!formData.tellUs.trim()) newErrors.tellUs = 'Please tell us something about yourself';
      if (!formData.whyWork.trim()) newErrors.whyWork = 'Please tell us why you want to work with us';
    } else if (step === 3) {
      if (formData.positions.length === 0) {
        newErrors.positions = 'Please select at least one role you wish to apply for';
      }
    } else if (step === 4) {
      if (!formData.musicTaste.trim()) newErrors.musicTaste = 'Please tell us your musical taste and tracks';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      audioEngine.playHapticBlip(1050, 0.05, 0.06);
      setCurrentStep(prev => Math.min(prev + 1, 5));
      const section = document.getElementById('application-form-card');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      audioEngine.playHapticBlip(320, 0.08, 0.1);
    }
  };

  const handlePrevStep = () => {
    audioEngine.playHapticBlip(720, 0.04, 0.05);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    if (isCommuteBlocked) {
      e.preventDefault();
      audioEngine.playHapticBlip(300, 0.1, 0.15);
      alert("This role requires working on-site at our Andheri West, Mumbai headquarters. If you are able to commute, please adjust your response.");
      return;
    }

    if (!selectedFileName && !document.getElementById('input_19')?.files?.length) {
      e.preventDefault();
      audioEngine.playHapticBlip(300, 0.1, 0.15);
      setErrors({ resume: 'Please upload your resumé to proceed' });
      return;
    }

    setIsSubmitting(true);
    audioEngine.playHapticBlip(1300, 0.08, 0.12);
    // Let the form submit natively to Jotform via hidden iframe target
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const allPositionsList = [
    {
      id: 'input_18_0',
      value: 'Customer Happiness Officer\u00A0(Customer Service & After-Sales Specialist)',
      title: 'Customer Happiness Officer',
      desc: 'Customer Service & After-Sales Specialist. The voice of Headphone Zone for thousands of music lovers.',
      tag: 'Customer Experience'
    },
    {
      id: 'input_18_1',
      value: 'Customer Operations Executive',
      title: 'Customer Operations Executive',
      desc: 'Seamless fulfillment, courier logistics, inventory alignment, and post-order delight.',
      tag: 'Operations'
    },
    {
      id: 'input_18_2',
      value: 'Customer Experience - (Warranty & Service)',
      title: 'Customer Experience',
      desc: 'Warranty & Service coordination with global audiophile brands and repair partners.',
      tag: 'Technical Care'
    },
    {
      id: 'input_18_3',
      value: 'Product Specialist - Audio & Headphones',
      title: 'Product Specialist',
      desc: 'Audiophile consultant guiding buyers on IEMs, DACs, planar drivers, and tube amplifiers.',
      tag: 'Audiophile Expert'
    },
    {
      id: 'input_18_4',
      value: 'Website Catalogue Executive',
      title: 'Website Catalogue Executive',
      desc: 'Shopify architecture, spec tables, high-res audio assets, and product metadata.',
      tag: 'Web & E-Commerce'
    },
    {
      id: 'input_18_5',
      value: 'Executive Assistant to the CEO',
      title: 'Executive Assistant to CEO',
      desc: 'High-leverage partnership across strategic initiatives, brand campaigns, and company planning.',
      tag: 'Leadership'
    },
    {
      id: 'input_18_6',
      value: 'Marketing Team: Email Marketing',
      title: 'Email Marketing Specialist',
      desc: 'Crafting the famous Headphone Zone newsletters that audiophiles actually read and love.',
      tag: 'Growth & Editorial'
    },
    {
      id: 'input_18_7',
      value: 'Automations Assistant',
      title: 'Automations Assistant',
      desc: 'n8n pipelines, Google AppScripts, Shopify webhooks, and engineering internal tooling.',
      tag: 'Engineering & Ops'
    },
    {
      id: 'input_18_8',
      value: 'Social Media Manager (Content & Community Engagement)',
      title: 'Social Media Manager',
      desc: 'Instagram, YouTube, X, Reddit community engagement and viral audiophile banter.',
      tag: 'Brand & Culture'
    },
    {
      id: 'input_18_9',
      value: 'Photographer & Cinematographer (Product & Brand Visuals)',
      title: 'Photographer & Cinematographer',
      desc: 'Product & Brand Visuals: high-end macro IEM photography, lifestyle sets, and studio lighting.',
      tag: 'Studio Creative'
    },
    {
      id: 'input_18_10',
      value: 'Video Editor (Marketing & Social Content)',
      title: 'Video Editor',
      desc: 'Marketing & Social Content: high-tempo Reels, YouTube reviews, breakdown animations.',
      tag: 'Video Production'
    }
  ];

  return (
    <section
      id="careers"
      className="relative w-full pt-24 pb-28 bg-[#FAF8F5] text-[#111111] overflow-hidden selection:bg-[#C2410C]/20 selection:text-[#C2410C]"
    >
      {/* Seamless Top Gradient Blend: Transitions from #080808 (Reviews section) into #FAF8F5 */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#080808] via-[#080808]/40 to-transparent pointer-events-none z-20" />

      {/* Subtle Warm Tone Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#EA580C]/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#111111]/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Hidden iframe for seamless background Jotform submission */}
      <iframe
        name="hidden_jotform_iframe"
        id="hidden_jotform_iframe"
        style={{ display: 'none' }}
        title="Jotform Submission Target"
      />

      <div className="max-w-6xl mx-auto px-6 md:px-10 relative z-30 pt-10">
        {/* Editorial Header / Culture Introduction */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111]/[0.04] border border-[#111111]/10 text-xs font-mono-tech tracking-widest uppercase text-[#C2410C] mb-6">
            <Headphones className="w-3.5 h-3.5 text-[#C2410C]" />
            <span>Careers at Headphone Zone // Mumbai HQ</span>
          </div>

          <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-[#111111] leading-[1.08] mb-6">
            JOIN INDIA’S CRAZIEST <br />
            <span className="text-[#C2410C] underline decoration-[#C2410C]/30 decoration-wavy underline-offset-8">
              AUDIOPHILES.
            </span>
          </h2>

          <p className="font-sans text-base sm:text-lg text-[#52525B] leading-relaxed mb-8">
            We’re a passionate team of music nerds, problem solvers, storytellers and tech craftspeople
            redefining how India discovers music. We don't care about pedigree or corporate jargon.
            We care about curiosity, obsessive pride in craft, and making people fall in love with great sound.
          </p>

          {/* Culture Pillars Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left pt-6 border-t border-[#E2DDD5]">
            <div className="p-4 rounded-xl bg-white border border-[#E8E4DC] shadow-sm">
              <span className="font-mono-tech text-[10px] text-[#C2410C] font-bold block mb-1">01 // CULTURE</span>
              <p className="font-display font-bold text-sm text-[#111111]">Zero Pedigree Bias</p>
              <p className="text-xs text-[#71717A] mt-1">We don't care where you studied. We care what you build.</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E8E4DC] shadow-sm">
              <span className="font-mono-tech text-[10px] text-[#C2410C] font-bold block mb-1">02 // PLAYGROUND</span>
              <p className="font-display font-bold text-sm text-[#111111]">1,000+ Audiophile Gear</p>
              <p className="text-xs text-[#71717A] mt-1">Planar magnetic cans, balanced IEMs, tube amps everywhere.</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E8E4DC] shadow-sm">
              <span className="font-mono-tech text-[10px] text-[#C2410C] font-bold block mb-1">03 // LOCATION</span>
              <p className="font-display font-bold text-sm text-[#111111]">Andheri West HQ</p>
              <p className="text-xs text-[#71717A] mt-1">Work out of our flagship Mumbai listening lounge & studio.</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E8E4DC] shadow-sm">
              <span className="font-mono-tech text-[10px] text-[#C2410C] font-bold block mb-1">04 // VIBE</span>
              <p className="font-display font-bold text-sm text-[#111111]">Music On Repeat</p>
              <p className="text-xs text-[#71717A] mt-1">Curated vinyl sessions, freshly roasted coffee, zero corporate BS.</p>
            </div>
          </div>
        </div>

        {/* Success Confirmation Modal / Card */}
        {isSubmitted ? (
          <div className="max-w-2xl mx-auto p-10 rounded-2xl bg-white border border-[#E2DDD5] shadow-xl text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#C2410C]/10 text-[#C2410C] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="font-display font-bold text-3xl text-[#111111] mb-3">
              Application Dispatched to the Team!
            </h3>
            <p className="font-sans text-base text-[#52525B] leading-relaxed mb-6">
              Thank you, <strong className="text-[#111111]">{formData.fullName}</strong>. Your application has been directly received by our recruitment crew in Andheri West. We read every word of every response (and we love that you didn’t use generic AI!).
            </p>
            <div className="p-5 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] text-left mb-8 space-y-2 text-xs font-mono-tech text-[#52525B]">
              <p>✓ Confirmation sent to: <span className="text-[#111111] font-semibold">{formData.email}</span></p>
              <p>✓ Positions: <span className="text-[#C2410C] font-semibold">{formData.positions.join(', ')}</span></p>
              <p>✓ Resumé: <span className="text-[#111111] font-semibold">{selectedFileName || 'Uploaded'}</span></p>
              <p>✓ Next step: Our team will reach out within 3–5 business days if there's a mutual spark.</p>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(1);
              }}
              className="px-6 py-3 rounded-full bg-[#111111] text-white text-xs font-mono-tech uppercase tracking-wider hover:bg-[#27272A] transition-colors"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          /* Main Application Form Container */
          <div
            id="application-form-card"
            className="rounded-3xl bg-white border border-[#E2DDD5] shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden"
          >
            {/* Step Progress Header */}
            <div className="px-6 sm:px-10 py-6 border-b border-[#E8E4DC] bg-[#FAF8F5]/60 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-mono-tech text-[10px] uppercase tracking-[0.25em] text-[#C2410C] font-bold block">
                  Application Flow // Step 0{currentStep} of 05
                </span>
                <h3 className="font-display font-extrabold text-xl text-[#111111]">
                  {currentStep === 1 && 'Personal Details & Location'}
                  {currentStep === 2 && 'Tell Us Your Story'}
                  {currentStep === 3 && 'Position & Real Scenarios'}
                  {currentStep === 4 && 'Musical DNA & Referral'}
                  {currentStep === 5 && 'Resumé Upload & Final Submit'}
                </h3>
              </div>

              {/* Step indicator pills */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {[1, 2, 3, 4, 5].map(step => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => {
                      if (step < currentStep || validateStep(currentStep)) {
                        setCurrentStep(step);
                      }
                    }}
                    className={`w-8 h-8 rounded-full text-xs font-mono-tech font-bold transition-all flex items-center justify-center ${
                      currentStep === step
                        ? 'bg-[#C2410C] text-white shadow-md scale-105'
                        : currentStep > step
                        ? 'bg-[#111111] text-white'
                        : 'bg-[#E8E4DC] text-[#71717A] hover:bg-[#D4CEBF]'
                    }`}
                  >
                    0{step}
                  </button>
                ))}
              </div>
            </div>

            {/* The Real Jotform HTML Form strictly pointing to Jotform endpoint */}
            <form
              ref={formRef}
              action="https://submit.jotform.com/submit/82182115693457"
              method="post"
              encType="multipart/form-data"
              name="form_82182115693457"
              id="82182115693457"
              target="hidden_jotform_iframe"
              onSubmit={handleSubmit}
              className="p-6 sm:p-10"
            >
              {/* ======================================================= */}
              {/* JOTFORM REQUIRED HIDDEN FIELDS PRESERVATION            */}
              {/* ======================================================= */}
              <input type="hidden" name="formID" value="82182115693457" />
              <input type="hidden" id="JWTContainer" value="" />
              <input type="hidden" id="cardinalOrderNumber" value="" />
              <input type="hidden" id="jsExecutionTracker" name="jsExecutionTracker" value="build-date-1795411658959" />
              <input type="hidden" id="submitSource" name="submitSource" value="unknown" />
              <input type="hidden" id="submitDate" name="submitDate" value="undefined" />
              <input type="hidden" id="buildDate" name="buildDate" value="1795411658959" />
              <input type="hidden" name="uploadServerUrl" value="https://upload.jotform.com/upload" />
              <input type="hidden" name="eventObserver" value="1" />
              <input type="hidden" className="simple_spc" id="simple_spc" name="simple_spc" value="82182115693457" />

              {/* ======================================================= */}
              {/* STEP 1: IDENTITY & COMMUTE                             */}
              {/* ======================================================= */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-fadeIn">
                  {/* [id_26] Full Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#111111] uppercase tracking-wider font-mono-tech">
                      Full Name <span className="text-[#C2410C]">*</span>
                    </label>
                    <input
                      type="text"
                      name="q26_fullName"
                      id="input_26"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleTextChange('fullName', e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3.5 rounded-xl border border-[#D4CEBF] bg-[#FAF8F5] text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                    />
                    {errors.fullName && <p className="text-xs text-[#DC2626] flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.fullName}</p>}
                  </div>

                  {/* [id_4] Email & [id_7] Phone No. in 2 cols */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-[#111111] uppercase tracking-wider font-mono-tech">
                        Email <span className="text-[#C2410C]">*</span>
                      </label>
                      <input
                        type="email"
                        name="q4_email"
                        id="input_4"
                        required
                        value={formData.email}
                        onChange={(e) => handleTextChange('email', e.target.value)}
                        placeholder="you@email.com"
                        className="w-full px-4 py-3.5 rounded-xl border border-[#D4CEBF] bg-[#FAF8F5] text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                      />
                      {errors.email && <p className="text-xs text-[#DC2626] flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-bold text-[#111111] uppercase tracking-wider font-mono-tech">
                          Phone No. <span className="text-[#C2410C]">*</span>
                        </label>
                        <span className="text-[11px] font-mono-tech text-[#71717A] uppercase tracking-wider">
                          10 DIGITS ONLY
                        </span>
                      </div>
                      <input
                        type="number"
                        name="q7_phoneNo"
                        id="input_7"
                        required
                        value={formData.phone}
                        onChange={(e) => handleTextChange('phone', e.target.value)}
                        placeholder="9876543210"
                        className="w-full px-4 py-3.5 rounded-xl border border-[#D4CEBF] bg-[#FAF8F5] text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                      />
                      {errors.phone && <p className="text-xs text-[#DC2626] flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.phone}</p>}
                    </div>
                  </div>

                  {/* [id_25] Mumbai Commute Question */}
                  <div className="space-y-3 pt-4 border-t border-[#E8E4DC]">
                    <label className="block text-sm font-bold text-[#111111] leading-relaxed">
                      Do you live in Mumbai and can commute to Andheri West conveniently? <span className="text-[#C2410C]">*</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { val: 'YES I do', label: 'YES I do', desc: 'Living in or near Mumbai & ready to work on-site.' },
                        { val: "No, but I'm going to try.", label: "No, but I'm going to try.", desc: 'Planning to relocate or commute.' },
                        { val: 'Way too far for me, bye-bye', label: 'Way too far for me, bye-bye', desc: 'Remote only / cannot commute.' }
                      ].map(option => (
                        <label
                          key={option.val}
                          className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                            formData.commute === option.val
                              ? 'border-[#C2410C] bg-[#C2410C]/[0.04] shadow-sm'
                              : 'border-[#E8E4DC] hover:border-[#D4CEBF] bg-[#FAF8F5]'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-1">
                            <input
                              type="radio"
                              name="q25_doYou25"
                              value={option.val}
                              checked={formData.commute === option.val}
                              onChange={(e) => handleTextChange('commute', e.target.value)}
                              className="w-4 h-4 text-[#C2410C] focus:ring-[#C2410C]"
                            />
                            <span className="font-bold text-xs uppercase tracking-wider font-mono-tech text-[#111111]">
                              {option.label}
                            </span>
                          </div>
                          <span className="text-xs text-[#71717A] ml-7">{option.desc}</span>
                        </label>
                      ))}
                    </div>

                    {isCommuteBlocked && (
                      <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <strong>Note on Office Presence:</strong> Our roles are strictly in-person at our Andheri West Listening Lounge & Studio. Remote positions are not currently offered for this vacancy. Selecting this option will disable final submission as per recruitment guidelines.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* [id_20] When can you join us? */}
                  <div className="space-y-2 pt-4 border-t border-[#E8E4DC]">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-[#111111] uppercase tracking-wider font-mono-tech">
                        When can you join us? <span className="text-[#C2410C]">*</span>
                      </label>
                      <span className="text-[11px] font-mono-tech text-[#71717A]">
                        Expected start date
                      </span>
                    </div>

                    {/* Standard Date picker for best candidate UX */}
                    <input
                      type="date"
                      required
                      value={formData.joinDate}
                      onChange={handleDateChange}
                      className="w-full sm:w-72 px-4 py-3 rounded-xl border border-[#D4CEBF] bg-[#FAF8F5] text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-mono-tech"
                    />

                    {/* Hidden Jotform specific month/day/year inputs to guarantee Jotform receives exact format */}
                    <input type="hidden" name="q20_whenCan[month]" id="month_20" value={formData.joinMonth} />
                    <input type="hidden" name="q20_whenCan[day]" id="day_20" value={formData.joinDay} />
                    <input type="hidden" name="q20_whenCan[year]" id="year_20" value={formData.joinYear} />

                    {errors.joinDate && <p className="text-xs text-[#DC2626] flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.joinDate}</p>}
                  </div>
                </div>
              )}

              {/* ======================================================= */}
              {/* STEP 2: ABOUT & PHILOSOPHY                             */}
              {/* ======================================================= */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-fadeIn">
                  {/* [id_11] Tell us something about yourself */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#111111] uppercase tracking-wider font-mono-tech">
                      Tell us something about yourself <span className="text-[#C2410C]">*</span>
                    </label>
                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] text-xs text-[#52525B] leading-relaxed">
                      <strong className="text-[#111111]">Instructions:</strong> We'd love to know where you've studied, your work experience if any, and your future plans. Oh, and what makes you fun! <span className="text-[#C2410C] font-semibold">Pro Tip: Don't use AI to write this one we can instantly tell!!</span>
                    </div>
                    <textarea
                      name="q11_tellUs11"
                      id="input_11"
                      rows={5}
                      required
                      value={formData.tellUs}
                      onChange={(e) => handleTextChange('tellUs', e.target.value)}
                      placeholder="Write candidly and genuinely..."
                      className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-[#FAF8F5] text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans leading-relaxed"
                    />
                    {errors.tellUs && <p className="text-xs text-[#DC2626] flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.tellUs}</p>}
                  </div>

                  {/* [id_17] Why do you want to work with us? */}
                  <div className="space-y-2 pt-4 border-t border-[#E8E4DC]">
                    <label className="block text-sm font-bold text-[#111111] uppercase tracking-wider font-mono-tech">
                      Why do you want to work with us? <span className="text-[#C2410C]">*</span>
                    </label>
                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] text-xs text-[#52525B] leading-relaxed">
                      <strong className="text-[#111111]">Instructions:</strong> If you're planning on telling us how much you love music, think again.
                    </div>
                    <textarea
                      name="q17_whyDo"
                      id="input_17"
                      rows={5}
                      required
                      value={formData.whyWork}
                      onChange={(e) => handleTextChange('whyWork', e.target.value)}
                      placeholder="Tell us what excites you about the company, the challenges, the problems you want to tackle..."
                      className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-[#FAF8F5] text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans leading-relaxed"
                    />
                    {errors.whyWork && <p className="text-xs text-[#DC2626] flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.whyWork}</p>}
                  </div>
                </div>
              )}

              {/* ======================================================= */}
              {/* STEP 3: POSITION & REAL SCENARIOS                       */}
              {/* ======================================================= */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-fadeIn">
                  {/* [id_18] What position would you like to apply for? */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-[#111111] uppercase tracking-wider font-mono-tech">
                        What position would you like to apply for? <span className="text-[#C2410C]">*</span>
                      </label>
                      <span className="text-[11px] font-mono-tech text-[#C2410C]">
                        {formData.positions.length} selected (Select all that fit)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {allPositionsList.map(pos => {
                        const isChecked = formData.positions.includes(pos.value);
                        return (
                          <label
                            key={pos.id}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                              isChecked
                                ? 'border-[#C2410C] bg-[#C2410C]/[0.04] shadow-sm'
                                : 'border-[#E8E4DC] hover:border-[#D4CEBF] bg-[#FAF8F5]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              name="q18_whatPosition[]"
                              id={pos.id}
                              value={pos.value}
                              checked={isChecked}
                              onChange={() => handlePositionToggle(pos.value)}
                              className="w-4 h-4 mt-1 rounded text-[#C2410C] focus:ring-[#C2410C]"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-display font-bold text-sm text-[#111111]">
                                  {pos.title}
                                </span>
                                <span className="text-[10px] font-mono-tech text-[#C2410C] uppercase tracking-wider">
                                  {pos.tag}
                                </span>
                              </div>
                              <p className="text-xs text-[#71717A] leading-relaxed">
                                {pos.desc}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                    {errors.positions && <p className="text-xs text-[#DC2626] flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.positions}</p>}
                  </div>

                  {/* DYNAMIC SITUATIONAL QUESTIONS HEADER */}
                  <div className="pt-8 border-t border-[#E8E4DC]">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-[#C2410C]" />
                      <h4 className="font-display font-bold text-lg text-[#111111]">
                        Role-Specific Assessment Scenarios
                      </h4>
                    </div>
                    <p className="text-xs text-[#71717A] mb-6">
                      Based on the role(s) you selected above, here are authentic scenarios you'll face on day one at Headphone Zone.
                    </p>

                    <div className="space-y-8">
                      {/* ---------------------------------------------------- */}
                      {/* Customer Happiness / Operations / Warranty Questions */}
                      {/* ---------------------------------------------------- */}
                      {hasSupportOrWarranty && (
                        <div className="space-y-6 p-6 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC]">
                          <span className="font-mono-tech text-[10px] uppercase tracking-widest text-[#C2410C] font-bold block">
                            // Customer Care & Experience Scenarios
                          </span>

                          {/* [id_21] Meena missing headphones */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[#111111]">
                              Meena has ordered a pair of headphones from us. But she hasn't received it as yet. She's calling you seeking help. What would you do? <span className="text-[#C2410C]">*</span>
                            </label>
                            <textarea
                              name="q21_meenaHas"
                              id="input_21"
                              rows={3}
                              value={formData.meenaHelp}
                              onChange={(e) => handleTextChange('meenaHelp', e.target.value)}
                              placeholder="Walk us through how you would handle Meena's call..."
                              className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                            />
                          </div>

                          {/* [id_31] Praveen 1-star Facebook review */}
                          {(hasCustomerHappiness || hasOperations) && (
                            <div className="space-y-2 pt-4 border-t border-[#E8E4DC]">
                              <label className="block text-sm font-semibold text-[#111111]">
                                Praveen leaves a very long 1-star Facebook review stating he has received his order but the box is empty. It's his first order with us and he is damn pissed off. What do you do? <span className="text-[#C2410C]">*</span>
                              </label>
                              <textarea
                                name="q31_praveenLeaves31"
                                id="input_31"
                                rows={3}
                                value={formData.praveenReview}
                                onChange={(e) => handleTextChange('praveenReview', e.target.value)}
                                placeholder="How do you de-escalate and resolve Praveen's situation?"
                                className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                              />
                            </div>
                          )}

                          {/* [id_44] Joshua out of warranty */}
                          {(hasCustomerHappiness || hasWarranty) && (
                            <div className="space-y-2 pt-4 border-t border-[#E8E4DC]">
                              <label className="block text-sm font-semibold text-[#111111]">
                                Joshua a very loyal customer contacts you with a warranty claim for a product that is slightly outside the warranty period. How would you handle this situation to ensure customer satisfaction while also adhering to company policies? <span className="text-[#C2410C]">*</span>
                              </label>
                              <textarea
                                name="q44_joshuaA"
                                id="input_44"
                                rows={3}
                                value={formData.joshuaWarranty}
                                onChange={(e) => handleTextChange('joshuaWarranty', e.target.value)}
                                placeholder="Balance loyalty, brand goodwill, and policy adherence..."
                                className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* ---------------------------------------------------- */}
                      {/* Product Specialist Question                          */}
                      {/* ---------------------------------------------------- */}
                      {hasProductSpecialist && (
                        <div className="space-y-4 p-6 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC]">
                          <span className="font-mono-tech text-[10px] uppercase tracking-widest text-[#C2410C] font-bold block">
                            // Product Specialist
                          </span>
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[#111111]">
                              As a Product Specialist what's the first question you would ask a customer who's looking to buy some headphones? And why? <span className="text-[#C2410C]">*</span>
                            </label>
                            <textarea
                              name="q24_asA"
                              id="input_24"
                              rows={3}
                              value={formData.productFirstQuestion}
                              onChange={(e) => handleTextChange('productFirstQuestion', e.target.value)}
                              placeholder="Your first consultative discovery question..."
                              className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                            />
                          </div>
                        </div>
                      )}

                      {/* ---------------------------------------------------- */}
                      {/* Website Catalogue Executive Questions                */}
                      {/* ---------------------------------------------------- */}
                      {hasWebsiteCatalogue && (
                        <div className="space-y-6 p-6 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC]">
                          <span className="font-mono-tech text-[10px] uppercase tracking-widest text-[#C2410C] font-bold block">
                            // Website Catalogue Executive
                          </span>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[#111111]">
                              Our website's sales have fallen from 500 to 400 orders in the last week. What will you check to arrive at a diagnosis of what's wrong? <span className="text-[#C2410C]">*</span>
                            </label>
                            <textarea
                              name="q28_ourWebsites"
                              id="input_28"
                              rows={3}
                              value={formData.salesDropDiagnosis}
                              onChange={(e) => handleTextChange('salesDropDiagnosis', e.target.value)}
                              placeholder="Analytics, conversion funnels, catalog errors, traffic source drops..."
                              className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                            />
                          </div>

                          <div className="space-y-2 pt-4 border-t border-[#E8E4DC]">
                            <label className="block text-sm font-semibold text-[#111111]">
                              Do you have any experience with HTML/CSS? <span className="text-[#C2410C]">*</span>
                            </label>
                            <textarea
                              name="q29_doYou29"
                              id="input_29"
                              rows={2}
                              value={formData.htmlCssExperience}
                              onChange={(e) => handleTextChange('htmlCssExperience', e.target.value)}
                              placeholder="Describe your comfort level with markup, styles, liquid templates..."
                              className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                            />
                          </div>

                          <div className="space-y-2 pt-4 border-t border-[#E8E4DC]">
                            <label className="block text-sm font-semibold text-[#111111]">
                              What are 5 things you would change on our website (HeadphoneZone.in)? <span className="text-[#C2410C]">*</span>
                            </label>
                            <textarea
                              name="q34_whatAre"
                              id="input_34"
                              rows={3}
                              value={formData.websiteChanges}
                              onChange={(e) => handleTextChange('websiteChanges', e.target.value)}
                              placeholder="1. ... 2. ... 3. ... 4. ... 5. ..."
                              className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                            />
                          </div>
                        </div>
                      )}

                      {/* ---------------------------------------------------- */}
                      {/* Executive Assistant to CEO Question                  */}
                      {/* ---------------------------------------------------- */}
                      {hasEA && (
                        <div className="space-y-4 p-6 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC]">
                          <span className="font-mono-tech text-[10px] uppercase tracking-widest text-[#C2410C] font-bold block">
                            // Executive Assistant to CEO
                          </span>
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[#111111]">
                              Can you describe your past experience as an Executive Assistant (or in a similar role) highlighting the types of leaders you supported and the key responsibilities you managed? <span className="text-[#C2410C]">*</span>
                            </label>
                            <textarea
                              name="q58_canYou58"
                              id="input_58"
                              rows={3}
                              value={formData.eaExperience}
                              onChange={(e) => handleTextChange('eaExperience', e.target.value)}
                              placeholder="Past executive support experience and high-leverage outcomes..."
                              className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                            />
                          </div>
                        </div>
                      )}

                      {/* ---------------------------------------------------- */}
                      {/* Email Marketing Questions                            */}
                      {/* ---------------------------------------------------- */}
                      {hasEmailMarketing && (
                        <div className="space-y-6 p-6 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC]">
                          <span className="font-mono-tech text-[10px] uppercase tracking-widest text-[#C2410C] font-bold block">
                            // Email Marketing Specialist
                          </span>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[#111111]">
                              Imagine you're asked to send an email announcing a new pair of headphones. What would you include in the email? <span className="text-[#C2410C]">*</span>
                            </label>
                            <textarea
                              name="q104_imagineYoure"
                              id="input_104"
                              rows={3}
                              value={formData.emailAnnouncement}
                              onChange={(e) => handleTextChange('emailAnnouncement', e.target.value)}
                              placeholder="Subject line, storytelling hook, sound profile, specs, CTA..."
                              className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                            />
                          </div>

                          <div className="space-y-2 pt-4 border-t border-[#E8E4DC]">
                            <label className="block text-sm font-semibold text-[#111111]">
                              You've sent an email, but very few people are clicking on the product link. What could you do differently next time? <span className="text-[#C2410C]">*</span>
                            </label>
                            <textarea
                              name="q105_youveSent"
                              id="input_105"
                              rows={3}
                              value={formData.emailLowClicks}
                              onChange={(e) => handleTextChange('emailLowClicks', e.target.value)}
                              placeholder="Analyzing preview text, friction points, button placement, copy clarity..."
                              className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                            />
                          </div>

                          <div className="space-y-2 pt-4 border-t border-[#E8E4DC]">
                            <label className="block text-sm font-semibold text-[#111111]">
                              Would you send the same email to someone who has purchased from Headphone Zone before and someone who has never purchased from us? Why or why not? <span className="text-[#C2410C]">*</span>
                            </label>
                            <textarea
                              name="q106_wouldYou"
                              id="input_106"
                              rows={3}
                              value={formData.emailAudienceDifference}
                              onChange={(e) => handleTextChange('emailAudienceDifference', e.target.value)}
                              placeholder="Audience segmentation and brand trust considerations..."
                              className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                            />
                          </div>
                        </div>
                      )}

                      {/* ---------------------------------------------------- */}
                      {/* Automations Assistant Questions                      */}
                      {/* ---------------------------------------------------- */}
                      {hasAutomations && (
                        <div className="space-y-6 p-6 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC]">
                          <span className="font-mono-tech text-[10px] uppercase tracking-widest text-[#C2410C] font-bold block">
                            // Automations & Technical Engineering
                          </span>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[#111111]">
                              You have written an AppScript that runs on a time based trigger. It is failing, but when you open the execution log there is nothing useful, no error, no output. How would you go about figuring out why it is failing? Walk us through your steps. <span className="text-[#C2410C]">*</span>
                            </label>
                            <textarea
                              name="q95_youHave"
                              id="input_95"
                              rows={3}
                              value={formData.appScriptDebugging}
                              onChange={(e) => handleTextChange('appScriptDebugging', e.target.value)}
                              placeholder="Debugging steps, Logger/console telemetry, execution quotas..."
                              className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                            />
                          </div>

                          <div className="space-y-2 pt-4 border-t border-[#E8E4DC]">
                            <label className="block text-sm font-semibold text-[#111111]">
                              You have an n8n workflow that creates a Freshdesk ticket. It is throwing a JSON body error on the HTTP request node. Nothing about the workflow was changed recently. What are the likely causes, and how would you narrow it down? <span className="text-[#C2410C]">*</span>
                            </label>
                            <textarea
                              name="q77_youHave77"
                              id="input_77"
                              rows={3}
                              value={formData.n8nTroubleshooting}
                              onChange={(e) => handleTextChange('n8nTroubleshooting', e.target.value)}
                              placeholder="Payload changes, escaped quotes, missing mandatory ticket fields..."
                              className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                            />
                          </div>

                          <div className="space-y-2 pt-4 border-t border-[#E8E4DC]">
                            <label className="block text-sm font-semibold text-[#111111]">
                              You set up a webhook to notify a Google Sheet whenever a Shopify order is placed. It works perfectly when you fire a test event, but real orders are not showing up in the sheet. Where would you start looking? <span className="text-[#C2410C]">*</span>
                            </label>
                            <textarea
                              name="q78_youSet"
                              id="input_78"
                              rows={3}
                              value={formData.webhookDebugging}
                              onChange={(e) => handleTextChange('webhookDebugging', e.target.value)}
                              placeholder="HMAC validation, cold start timeouts, payload size differences..."
                              className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                            />
                          </div>

                          {/* [id_99] Code snippet */}
                          <div className="pt-4 border-t border-[#E8E4DC]">
                            <span className="text-xs font-mono-tech text-[#71717A] uppercase tracking-wider block mb-2">
                              Code Inspection [id_99]
                            </span>
                            <div className="p-4 rounded-xl bg-[#0F172A] text-[#F8FAFC] font-mono text-xs overflow-x-auto shadow-inner">
                              <pre className="leading-relaxed">
{`function fetchShopifyOrder(orderId) {
  Logger.log("===== FETCH SHOPIFY ORDER =====");

  const response = shopifyRestRequest(
    "get",
    \`/orders/\${orderId}.json\`
  );

  return response.order;
}`}
                              </pre>
                            </div>
                          </div>

                          {/* [id_98] Code analysis question */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[#111111]">
                              (Referring to the above code): What type of call is this, and how do you know? <span className="text-[#C2410C]">*</span>
                            </label>
                            <textarea
                              name="q98_whatType98"
                              id="input_98"
                              rows={2}
                              value={formData.codeCallType}
                              onChange={(e) => handleTextChange('codeCallType', e.target.value)}
                              placeholder="Explain the call type and the telltale signs in the code..."
                              className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                            />
                          </div>
                        </div>
                      )}

                      {/* ---------------------------------------------------- */}
                      {/* Social Media Manager Questions                       */}
                      {/* ---------------------------------------------------- */}
                      {hasSocialMedia && (
                        <div className="space-y-6 p-6 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC]">
                          <span className="font-mono-tech text-[10px] uppercase tracking-widest text-[#C2410C] font-bold block">
                            // Social Media & Community
                          </span>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[#111111]">
                              Tell us one Instagram trend that you find cringy currently? <span className="text-[#C2410C]">*</span>
                            </label>
                            <textarea
                              name="q43_tellUs"
                              id="input_43"
                              rows={2}
                              value={formData.cringyTrend}
                              onChange={(e) => handleTextChange('cringyTrend', e.target.value)}
                              placeholder="Be unfiltered and honest..."
                              className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                            />
                          </div>

                          <div className="space-y-2 pt-4 border-t border-[#E8E4DC]">
                            <label className="block text-sm font-semibold text-[#111111]">
                              What are 5 things you would change about Headphone Zone's Social Media Handles? <span className="text-[#C2410C]">*</span>
                            </label>
                            <textarea
                              name="q37_whatAre37"
                              id="input_37"
                              rows={3}
                              value={formData.socialMediaChanges}
                              onChange={(e) => handleTextChange('socialMediaChanges', e.target.value)}
                              placeholder="1. ... 2. ... 3. ... 4. ... 5. ..."
                              className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                            />
                          </div>
                        </div>
                      )}

                      {/* ---------------------------------------------------- */}
                      {/* Photographer & Cinematographer / Video Editor        */}
                      {/* ---------------------------------------------------- */}
                      {(hasPhotography || hasVideoEditor) && (
                        <div className="space-y-6 p-6 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC]">
                          <span className="font-mono-tech text-[10px] uppercase tracking-widest text-[#C2410C] font-bold block">
                            // Visuals & Creative Production
                          </span>

                          {hasPhotography && (
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-[#111111]">
                                What’s one piece of content you made that performed well? Why do you think it worked? <span className="text-[#C2410C]">*</span>
                              </label>
                              <textarea
                                name="q60_typeA60"
                                id="input_60"
                                rows={3}
                                value={formData.highPerformingContent}
                                onChange={(e) => handleTextChange('highPerformingContent', e.target.value)}
                                placeholder="Describe the shoot, lighting, hook, or visual texture..."
                                className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                              />
                            </div>
                          )}

                          {hasVideoEditor && (
                            <>
                              <div className="space-y-2 pt-4 border-t border-[#E8E4DC]">
                                <label className="block text-sm font-semibold text-[#111111]">
                                  Share a content idea you would create for our brand (Reels or YouTube). <span className="text-[#C2410C]">*</span>
                                </label>
                                <textarea
                                  name="q59_shareA"
                                  id="input_59"
                                  rows={3}
                                  value={formData.contentIdea}
                                  onChange={(e) => handleTextChange('contentIdea', e.target.value)}
                                  placeholder="Concept hook, visual pacing, audio track, resolution..."
                                  className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                                />
                              </div>

                              {/* [id_68] Radio for software familiarity */}
                              <div className="space-y-2 pt-4 border-t border-[#E8E4DC]">
                                <label className="block text-sm font-semibold text-[#111111]">
                                  Are you familiar with Final Cut/Adobe Premiere Pro/ Photoshop/ Canva? <span className="text-[#C2410C]">*</span>
                                </label>
                                <div className="flex items-center gap-6">
                                  {['Yes', 'No'].map(val => (
                                    <label key={val} className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="q68_areYou68"
                                        value={val}
                                        checked={formData.softwareFamiliarity === val}
                                        onChange={(e) => handleTextChange('softwareFamiliarity', e.target.value)}
                                        className="w-4 h-4 text-[#C2410C] focus:ring-[#C2410C]"
                                      />
                                      <span className="text-sm font-mono-tech text-[#111111]">{val}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}

                          {/* [id_69] Portfolio Link */}
                          <div className="space-y-2 pt-4 border-t border-[#E8E4DC]">
                            <label className="block text-sm font-semibold text-[#111111]">
                              Add a link to your Portfolio <span className="text-[#C2410C]">*</span>
                            </label>
                            <input
                              type="url"
                              name="q69_addA69"
                              id="input_69"
                              value={formData.portfolioLink}
                              onChange={(e) => handleTextChange('portfolioLink', e.target.value)}
                              placeholder="https://behance.net/... or https://youtube.com/..."
                              className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-white text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================= */}
              {/* STEP 4: MUSICAL DNA & REFERRAL                         */}
              {/* ======================================================= */}
              {currentStep === 4 && (
                <div className="space-y-8 animate-fadeIn">
                  {/* [id_40] Favorite musician */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#111111] uppercase tracking-wider font-mono-tech">
                      Who is your favourite musician? What's your current favourite track(s)? Which music streaming service do you use? <span className="text-[#C2410C]">*</span>
                    </label>
                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] text-xs text-[#52525B]">
                      There are zero wrong answers here. Whether it's Hans Zimmer, Steely Dan, AR Rahman, Radiohead, Taylor Swift, or underground ambient synthwave—we care about what moves you.
                    </div>
                    <textarea
                      name="q40_whoIs"
                      id="input_40"
                      rows={4}
                      required
                      value={formData.musicTaste}
                      onChange={(e) => handleTextChange('musicTaste', e.target.value)}
                      placeholder="My favorite artist is... Currently playing track: ... on Apple Music / Spotify / Qobuz..."
                      className="w-full px-4 py-3 rounded-xl border border-[#D4CEBF] bg-[#FAF8F5] text-[#111111] text-sm focus:outline-none focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20 transition-all font-sans"
                    />
                    {errors.musicTaste && <p className="text-xs text-[#DC2626] flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.musicTaste}</p>}
                  </div>

                  {/* [id_41] Referral Source */}
                  <div className="space-y-3 pt-4 border-t border-[#E8E4DC]">
                    <label className="block text-sm font-bold text-[#111111] uppercase tracking-wider font-mono-tech">
                      Where did you find out about the opening from? <span className="text-[#C2410C]">*</span>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        'LinkedIn',
                        'Social Media',
                        'Indeed',
                        'Internshala',
                        'Website',
                        "I'm a Customer and I love you guys!",
                        'other'
                      ].map(src => (
                        <label
                          key={src}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                            formData.referralSource === src
                              ? 'border-[#C2410C] bg-[#C2410C]/[0.04]'
                              : 'border-[#E8E4DC] bg-[#FAF8F5] hover:border-[#D4CEBF]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="q41_doYou41"
                            value={src}
                            checked={formData.referralSource === src}
                            onChange={(e) => handleTextChange('referralSource', e.target.value)}
                            className="w-4 h-4 text-[#C2410C] focus:ring-[#C2410C]"
                          />
                          <span className="text-xs font-semibold text-[#111111]">
                            {src === 'other' ? 'Other' : src}
                          </span>
                        </label>
                      ))}
                    </div>

                    {formData.referralSource === 'other' && (
                      <div className="pt-2">
                        <input
                          type="text"
                          name="q41_doYou41[other]"
                          id="input_41"
                          placeholder="Please specify where you found out..."
                          value={formData.referralOther}
                          onChange={(e) => handleTextChange('referralOther', e.target.value)}
                          className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-[#D4CEBF] bg-[#FAF8F5] text-sm text-[#111111] focus:outline-none focus:border-[#C2410C]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ======================================================= */}
              {/* STEP 5: RESUMÉ & SUBMISSION                            */}
              {/* ======================================================= */}
              {currentStep === 5 && (
                <div className="space-y-8 animate-fadeIn">
                  {/* [id_19] Resumé Upload */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-[#111111] uppercase tracking-wider font-mono-tech">
                        Upload your Resumé <span className="text-[#C2410C]">*</span>
                      </label>
                      <span className="text-[11px] font-mono-tech text-[#71717A]">
                        PDF, DOCX, ZIP (Max 10MB)
                      </span>
                    </div>

                    <div className="relative border-2 border-dashed border-[#D4CEBF] hover:border-[#C2410C] rounded-2xl p-8 text-center bg-[#FAF8F5] transition-all cursor-pointer group">
                      <input
                        type="file"
                        name="q19_uploadYour19[]"
                        id="input_19"
                        required={!selectedFileName}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.rtf,.txt,.zip"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-14 h-14 rounded-full bg-white border border-[#E8E4DC] flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-[#C2410C]" />
                      </div>
                      <p className="font-display font-bold text-sm text-[#111111] mb-1">
                        {selectedFileName ? selectedFileName : 'Click or drag & drop your resumé here'}
                      </p>
                      <p className="text-xs text-[#71717A]">
                        {selectedFileName ? 'Click to replace document' : 'Supported formats: PDF, DOCX, RTF'}
                      </p>
                    </div>
                    {errors.resume && <p className="text-xs text-[#DC2626] flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.resume}</p>}
                  </div>

                  {/* Review Summary Card */}
                  <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E4DC] space-y-3 text-xs">
                    <span className="font-mono-tech text-[10px] uppercase tracking-widest text-[#C2410C] font-bold block">
                      // Application Overview
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#52525B]">
                      <p><strong className="text-[#111111]">Candidate:</strong> {formData.fullName || '—'}</p>
                      <p><strong className="text-[#111111]">Contact:</strong> {formData.email || '—'}</p>
                      <p><strong className="text-[#111111]">Phone:</strong> {formData.phone || '—'}</p>
                      <p><strong className="text-[#111111]">Commute:</strong> {formData.commute}</p>
                      <p><strong className="text-[#111111]">Availability:</strong> {formData.joinDate || 'Immediate'}</p>
                      <p className="sm:col-span-2"><strong className="text-[#111111]">Applied For:</strong> {formData.positions.join(', ')}</p>
                    </div>
                  </div>

                  {/* Submission Warning if Commute is blocked */}
                  {isCommuteBlocked && (
                    <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Submission disabled because "Way too far for me" was selected in Step 1. All roles require working on-site at Andheri West, Mumbai.</span>
                    </div>
                  )}

                  {/* [id_2] Submit Application Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      id="input_2"
                      disabled={isCommuteBlocked || isSubmitting}
                      className={`w-full py-4 rounded-full font-display font-bold text-sm uppercase tracking-[0.18em] transition-all duration-300 shadow-md flex items-center justify-center gap-3 ${
                        isCommuteBlocked
                          ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                          : isSubmitting
                          ? 'bg-[#C2410C] text-white opacity-80 cursor-wait'
                          : 'bg-[#C2410C] hover:bg-[#EA580C] text-white hover:scale-[1.01] active:scale-[0.99] shadow-[0_10px_25px_rgba(194,65,12,0.3)]'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>DISPATCHING APPLICATION...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>SUBMIT YOUR APPLICATION</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-[#71717A] mt-3 font-mono-tech">
                      Directly posted to Headphone Zone recruitment inbox • No spam guarantee
                    </p>
                  </div>
                </div>
              )}

              {/* Form Navigation Buttons (Previous / Next) */}
              <div className="flex items-center justify-between pt-8 mt-8 border-t border-[#E8E4DC]">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#D4CEBF] bg-white text-xs font-mono-tech uppercase tracking-wider text-[#111111] hover:bg-[#FAF8F5] transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                ) : <div />}

                {currentStep < 5 && (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#111111] text-white text-xs font-mono-tech uppercase tracking-wider hover:bg-[#27272A] transition-all shadow-sm hover:scale-105"
                  >
                    <span>Proceed to Step 0{currentStep + 1}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Seamless Bottom Gradient Blend: Transitions from #FAF8F5 into #050507 (Footer) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#050507]/40 to-[#050507] pointer-events-none z-20" />
    </section>
  );
}
