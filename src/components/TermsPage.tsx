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
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#5E0ED7]" />
              <span>Effective Date: June 2026</span>
            </span>
            <span className="text-coffee-300">|</span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Verified Pure</span>
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-left mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#5E0ED7]/5 border border-[#5E0ED7]/15 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-[#5E0ED7]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>DAZEEN LEGAL CENTER</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-coffee-950 tracking-tight leading-[1.08]">
            Terms of Service & Boutiques Sourcing
          </h1>
          <p className="text-base text-coffee-700/90 max-w-2xl font-sans mt-2">
            Please review the legal user agreement & organic purity specifications for Dazeen Specialty Filter Coffees. Scroll deep to authorize your consent.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Side Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-coffee-200/60 p-6 space-y-4 shadow-sm relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-coffee-950">Pure Organic Guarantee</h3>
              <p className="text-xs text-coffee-600 leading-relaxed">
                All high-altitude estate blends are shade-grown, pesticide free, and purified using solvents-free water separation with 0% chemical residues.
              </p>
            </div>

            <div className="bg-gradient-to-br from-stone-900 to-stone-950 rounded-3xl border border-stone-850 p-6 space-y-4 shadow-xl text-stone-100">
              <div className="w-12 h-12 rounded-2xl bg-stone-800/80 flex items-center justify-center text-[#5E0ED7]">
                <FileText className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-base font-serif font-bold text-stone-50">Instant Action Required</h3>
              <p className="text-xs text-stone-400 leading-relaxed font-sans">
                You must scroll through the document content viewport to confirm that you have scanned our quality standards before placing an order.
              </p>
            </div>
          </div>

          {/* Right Column: Terms Viewer Component */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-coffee-200/60 shadow-lg overflow-hidden flex flex-col h-[520px]">
              
              {/* Table header bar */}
              <div className="border-b border-coffee-100 px-6 py-4 flex items-center justify-between bg-[#FCFAF7] shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-wider text-coffee-800 uppercase">
                    Interactive Agreement Document
                  </span>
                </div>
                {!hasReadToBottom && (
                  <span className="text-[10px] font-mono font-bold bg-amber-100/70 border border-amber-200 text-amber-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-bounce">
                    Scroll down
                  </span>
                )}
              </div>

              {/* Scrollable Container with Scroll Tracker */}
              <div
                ref={contentRef}
                onScroll={handleScroll}
                className="overflow-y-auto flex-grow p-6 sm:p-8 space-y-6 text-sm text-coffee-700 leading-relaxed font-sans scroll-smooth"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-coffee-950 font-bold font-serif text-lg tracking-tight flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400">01</span>
                      Acceptance of Terms
                    </h4>
                    <p className="text-zinc-600 text-xs sm:text-sm pl-6">
                      By accessing, browsing, or buying from the website, users agreement to comply with and be bound by these Terms of Service. These apply universally to all retail clients, custom cafe grinding programs, and delivery agreements. Users who do not agree with these terms should discontinue use of the website immediately.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-coffee-950 font-bold font-serif text-lg tracking-tight flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400">02</span>
                      User Account Responsibilities
                    </h4>
                    <p className="text-zinc-600 text-xs sm:text-sm pl-6">
                      Users are responsible for maintaining the confidentiality of their account credentials, phone numbers, and session keys. Any activities occurring under a user&lsquo;s account are the sole responsibility of the account holder. Users must notify the website administrators immediately of any unauthorized account access or safety breach.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-coffee-950 font-bold font-serif text-lg tracking-tight flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400">03</span>
                      Content Sourcing and Taste Guarantees
                    </h4>
                    <p className="text-zinc-600 text-xs sm:text-sm pl-6">
                      All Dazeen designs, roastery formulas, packaging textures, images, and digital coffee profiles are fully protected by intellectual property laws. Users may not reproduce, distribute, modify, create derivative works, or commercially exploit any content without explicit written permission from Shree Deshmukh and Dazeen authorities.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-coffee-950 font-bold font-serif text-lg tracking-tight flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400">04</span>
                      Limitation of Liability
                    </h4>
                    <p className="text-zinc-600 text-xs sm:text-sm pl-6">
                      The website provides content &ldquo;as is&ldquo; without any warranties. The website owners or associate farms shall not be liable for direct, indirect, incidental, consequential, or punitive damages arising from user interactions with the platform, coffee consumption results, or shipping delays.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-coffee-950 font-bold font-serif text-lg tracking-tight flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400">05</span>
                      User Conduct Guidelines
                    </h4>
                    <p className="text-zinc-600 text-xs sm:text-sm pl-6">
                      Our customer guidelines ensure a healthy digital shopping community:
                    </p>
                    <ul className="list-disc pl-12 text-zinc-600 text-xs sm:text-sm space-y-1">
                      <li>Not upload harmful spam or malicious script content to portal forms</li>
                      <li>Respect the rights of and communicate supportively with other customers</li>
                      <li>Avoid activities that could disrupt server or secure gateway operations</li>
                      <li>Comply with applicable local and international food quality laws</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-coffee-950 font-bold font-serif text-lg tracking-tight flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400">06</span>
                      Modifications to Terms
                    </h4>
                    <p className="text-zinc-600 text-xs sm:text-sm pl-6">
                      The website reserves the right to modify these terms at any time. Sourced batches, coffee availability prices, shipping logistics, and delivery taxes are subject to shift. Continued use of the website after changes constitutes acceptance of the new terms.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-coffee-950 font-bold font-serif text-lg tracking-tight flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400">07</span>
                      Termination Clause
                    </h4>
                    <p className="text-zinc-600 text-xs sm:text-sm pl-6">
                      The website may terminate or suspend user access without prior notice for violations of these terms, malicious transactions attempts, or for any other reason deemed appropriate by the system administration.
                    </p>
                  </div>

                  <div className="space-y-2 pb-6">
                    <h4 className="text-coffee-950 font-bold font-serif text-lg tracking-tight flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400">08</span>
                      Governing Law
                    </h4>
                    <p className="text-zinc-600 text-xs sm:text-sm pl-6">
                      These terms are governed by the laws of Pune, Maharashtra, India, without regard to conflict of law principles. All digital transactions, payment settlements, and regional consumer disputes fall under same jurisdiction.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons at the bottom */}
              <div className="border-t border-coffee-100 p-6 bg-[#FCFAF7] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-2 text-xs text-coffee-600">
                  {hasReadToBottom ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Ready to agree
                    </span>
                  ) : (
                    <span>Please read to the bottom edge.</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={onBackToHome}
                    variant="outline"
                    className="cursor-pointer font-mono font-bold text-xs uppercase tracking-wider h-11 border-coffee-250 hover:bg-coffee-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAgree}
                    disabled={!hasReadToBottom}
                    className="bg-coffee-900 border-coffee-900 text-[#FAF6F0] hover:bg-coffee-800 cursor-pointer font-mono font-black text-xs uppercase tracking-wider h-11 disabled:opacity-50 disabled:cursor-not-allowed px-6"
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
