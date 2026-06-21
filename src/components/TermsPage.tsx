'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Coffee, FileText, Shield, CheckCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { notificationService } from '../utils/notifications';

interface TermsPageProps {
  onBackToHome: () => void;
}

export default function TermsPage({ onBackToHome }: TermsPageProps) {
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleScroll = () => {
    const content = contentRef.current;
    if (!content) return;

    // Check scroll depth
    const scrollPercentage =
      content.scrollTop / (content.scrollHeight - content.clientHeight);
    if (scrollPercentage >= 0.96 && !hasReadToBottom) {
      setHasReadToBottom(true);
      notificationService.send(
        "Terms Read! 📚☕",
        "You have reviewed all the terms successfully. You can now tap Agree & Proceed!"
      );
    }
  };

  const handleAgree = () => {
    notificationService.send(
      "Agreement Confirmed! 🛡️✨",
      "Thank you for accepting Dazeen's boutique organic sourcing agreement."
    );
    onBackToHome();
  };

  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'refund'>(() => {
    const saved = localStorage.getItem("dazeen_terms_active_tab");
    if (saved === 'privacy' || saved === 'refund' || saved === 'terms') {
      return saved;
    }
    return 'terms';
  });

  useEffect(() => {
    localStorage.removeItem("dazeen_terms_active_tab");
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF6F0] selection:bg-[#C5A880]/30 text-stone-900 pb-24 md:pb-32 pt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Header row */}
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-coffee-800 hover:text-[#5E0ED7] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </button>
          
          <div className="flex items-center gap-4 bg-white/60 border border-coffee-200/50 rounded-2xl px-4 py-2 text-xs font-mono font-medium text-coffee-700">
            <span className="flex items-center gap-1.5 flex-wrap">
              <Clock className="w-3.5 h-3.5 text-[#5E0ED7]" />
              <span>Effective Date: June 2026</span>
            </span>
            <span className="text-coffee-300">|</span>
            <span className="flex items-center gap-1.5 flex-wrap">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Refund Safeguard</span>
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-left mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#5E0ED7]/5 border border-[#5E0ED7]/15 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-[#5E0ED7]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>DAZEEN SERVICE GUIDELINES & POLICIES</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-coffee-950 tracking-tight leading-[1.08] select-none">
            Trust & Sourcing Agreements
          </h1>
          <p className="text-base text-coffee-700/90 max-w-2xl font-sans mt-2">
            Please read Dazeen's User Terms, Privacy Safeguards, and Return Policies before placing orders.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Side Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-3xl border border-coffee-200/60 p-5 space-y-3.5 shadow-sm relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-coffee-950">Pure Organic Guarantee</h3>
              <p className="text-[11px] text-coffee-600 leading-relaxed font-sans">
                All estate ground blends are shade-grown under natural forest canopies, chemical-free and moisture-sealed.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-coffee-200/60 p-5 space-y-3.5 shadow-sm relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-serif font-bold text-coffee-950">Refund Protection Rule</h3>
              <p className="text-[11px] text-coffee-600 leading-relaxed font-sans">
                Refund is only processed if your packet received is wrong or physically damaged/spoiled.
              </p>
            </div>

            <div className="bg-gradient-to-br from-stone-900 to-stone-950 rounded-3xl border border-stone-850 p-5 space-y-3 shadow-xl text-stone-100">
              <div className="w-10 h-10 rounded-2xl bg-stone-800 flex items-center justify-center text-[#5E0ED7]">
                <FileText className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="text-sm font-serif font-bold text-stone-50 select-none">Action Required</h3>
              <p className="text-[10px] text-stone-400 leading-relaxed font-sans">
                Select policies below, review terms, and scroll down to agree for instant priority express checkout.
              </p>
            </div>
          </div>

          {/* Right Column: Terms Viewer Component */}
          <div className="lg:col-span-2">
            
            {/* Tabs Row */}
            <div className="flex gap-1.5 mb-3 bg-coffee-100/50 p-1 rounded-xl">
              <button
                onClick={() => { setActiveTab('terms'); setHasReadToBottom(false); }}
                className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'terms' 
                    ? 'bg-white text-coffee-950 shadow-sm border border-coffee-200/40' 
                    : 'text-coffee-600 hover:text-coffee-900'
                }`}
              >
                Terms
              </button>
              <button
                onClick={() => { setActiveTab('privacy'); setHasReadToBottom(false); }}
                className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'privacy' 
                    ? 'bg-white text-coffee-950 shadow-sm border border-coffee-200/40' 
                    : 'text-coffee-600 hover:text-coffee-900'
                }`}
              >
                Privacy Policy
              </button>
              <button
                onClick={() => { setActiveTab('refund'); setHasReadToBottom(false); }}
                className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'refund' 
                    ? 'bg-white text-coffee-950 shadow-sm border border-coffee-200/40' 
                    : 'text-coffee-600 hover:text-coffee-900'
                }`}
              >
                Refund Rules
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-coffee-200/60 shadow-lg overflow-hidden flex flex-col h-[480px]">
              
              {/* Document header bar */}
              <div className="border-b border-coffee-150 px-6 py-3 flex items-center justify-between bg-[#FCFAF7] shrink-0 select-none">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold tracking-wider text-coffee-800 uppercase">
                    {activeTab === 'terms' && '01. USER TERMS OF SERVICE'}
                    {activeTab === 'privacy' && '02. DATA PRIVACY COGNIZANCE'}
                    {activeTab === 'refund' && '03. CONCIERGE RETURN & REFUND RULES'}
                  </span>
                </div>
                {!hasReadToBottom && (
                  <span className="text-[9px] font-mono font-bold bg-amber-100 border border-amber-200 text-amber-800 px-2 py-0.5 rounded-full uppercase tracking-wider animate-bounce">
                    Scroll deep
                  </span>
                )}
              </div>

              {/* Scrollable Container with Scroll Tracker */}
              <div
                ref={contentRef}
                onScroll={handleScroll}
                className="overflow-y-auto flex-grow p-6 sm:p-7 space-y-5 text-xs sm:text-sm text-coffee-700 leading-relaxed font-sans scroll-smooth"
              >
                
                {activeTab === 'terms' && (
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <h4 className="text-coffee-950 font-bold font-serif text-sm tracking-tight flex items-center gap-2 select-none">
                        <span className="text-[10px] font-mono text-[#5E0ED7]">01</span>
                        Acceptance of Terms
                      </h4>
                      <p className="text-stone-600 text-xs pl-5 font-medium leading-relaxed">
                        By accessing, browsing, or buying from Dazeen Coffee Co., you agree to comply with and be bound by these comprehensive Terms of Service. These apply globally to all retail clients, subscription memberships, and customized grinding allocations.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-coffee-950 font-bold font-serif text-sm tracking-tight flex items-center gap-2 select-none">
                        <span className="text-[10px] font-mono text-[#5E0ED7]">02</span>
                        User Account Responsibilities
                      </h4>
                      <p className="text-stone-600 text-xs pl-5 font-medium leading-relaxed">
                        You are responsible for keeping your phone numbers, OTP verification codes, and session tokens strictly confidential. Any purchases or transactions generated through your device remain your responsibilities.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-coffee-950 font-bold font-serif text-sm tracking-tight flex items-center gap-2 select-none">
                        <span className="text-[10px] font-mono text-[#5E0ED7]">03</span>
                        Boutique Estate Grounds & Taste Profiles
                      </h4>
                      <p className="text-stone-600 text-xs pl-5 font-medium leading-relaxed">
                        We blend organic specialty roasts. Natural shifts in regional climate can slightly alter batch acidity levels. We do not provide taste-based modifications once pouches are sealed.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <h4 className="text-coffee-950 font-bold font-serif text-sm tracking-tight flex items-center gap-2 select-none">
                        <span className="text-[10px] font-mono text-[#5E0ED7]">SEC-1</span>
                        Order Information & Address Logs
                      </h4>
                      <p className="text-stone-600 text-xs pl-5 font-medium leading-relaxed">
                        We collect your full name, contact mobile number, address lines, and landmark exclusively to ship order shipments efficiently and provide live delivery coordinates.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-coffee-950 font-bold font-serif text-sm tracking-tight flex items-center gap-2 select-none">
                        <span className="text-[10px] font-mono text-[#5E0ED7]">SEC-2</span>
                        Phone Number OTP Protection
                      </h4>
                      <p className="text-stone-600 text-xs pl-5 font-medium leading-relaxed">
                        Your mobile number is solely invoked to secure account access through the Quick OTP Gateway and verify payment updates. We strictly do not rent, distribute, or sell user records to external marketing corporations.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-coffee-950 font-bold font-serif text-sm tracking-tight flex items-center gap-2 select-none">
                        <span className="text-[10px] font-mono text-[#5E0ED7]">SEC-3</span>
                        Payment Card & Cookies
                      </h4>
                      <p className="text-stone-600 text-xs pl-5 font-medium leading-relaxed">
                        Online operations are compiled securely through PCI-DSS standard Cashfree payments portals. No credit card or banking PIN records are ever processed locally on our roastery servers.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'refund' && (
                  <div className="space-y-5">
                    <div className="space-y-2 border-l-2 border-red-500 pl-3">
                      <h4 className="text-coffee-950 font-extrabold font-serif text-sm tracking-tight flex items-center gap-1.5 select-none">
                        ⚠️ Strict Return & Cancellation Condition
                      </h4>
                      <p className="text-red-950 text-xs font-bold leading-normal">
                        Refund is strictly processed ONLY if the package received by you is incorrect (wrong flavor dispatch) or physically damaged/spoiled.
                      </p>
                      <p className="text-stone-700 text-[11px] font-medium leading-normal italic">
                        Refund tabhi hoga agar packet galat ya physically kharab aaye (e.g. tear/spill/damage).
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-coffee-950 font-bold font-serif text-sm tracking-tight flex items-center gap-2 select-none">
                        <span className="text-[10px] font-mono text-[#5E0ED7]">REF-01</span>
                        Return Claims Process
                      </h4>
                      <p className="text-stone-600 text-xs pl-5 font-medium leading-relaxed">
                        To register a damaged packet claim, please mail clear snapshot images of the unboxing status showing the external courier label and damaged tear sections to <span className="font-bold text-[#5E0ED7]">support@dazeen.in</span> within 24 hours of receiving the shipment.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-coffee-950 font-bold font-serif text-sm tracking-tight flex items-center gap-2 select-none">
                        <span className="text-[10px] font-mono text-[#5E0ED7]">REF-02</span>
                        Reverse Courier Dispatch
                      </h4>
                      <p className="text-stone-600 text-xs pl-5 font-medium leading-relaxed">
                        Once verified, Dazeen logistical desk will schedule a free reverse pickup and request a fresh sealed batch shipment or direct credit to your bank source account within 5-7 business working days.
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Action buttons at the bottom */}
              <div className="border-t border-coffee-100 p-5 bg-[#FCFAF7] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 select-none">
                <div className="flex items-center gap-2 text-xs text-coffee-600">
                  {hasReadToBottom ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Ready to agree
                    </span>
                  ) : (
                    <span>Please scroll to the read bottom.</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={onBackToHome}
                    type="button"
                    variant="outline"
                    className="cursor-pointer font-mono font-bold text-xs uppercase tracking-wider h-10 border-coffee-250 hover:bg-coffee-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAgree}
                    type="button"
                    disabled={!hasReadToBottom}
                    className="bg-coffee-900 border-coffee-900 text-[#FAF6F0] hover:bg-coffee-800 cursor-pointer font-mono font-black text-xs uppercase tracking-wider h-10 disabled:opacity-50 disabled:cursor-not-allowed px-5"
                  >
                    I Agree
                  </Button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
