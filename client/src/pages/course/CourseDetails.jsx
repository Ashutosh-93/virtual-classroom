import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';

const MOCK_CURRICULUM_CATALOG = {
  'fs-mearn-01': {
    title: 'Production-Grade Full Stack Engineering (MERN)',
    duration: '42 total hours • 12 modules',
    modules: [
      { num: '01', title: 'HTTP-Only Cryptographic Session Architecture', duration: '3.5 hrs' },
      { num: '02', title: 'Redux Lifecycle Hooks & Async Slices Management', duration: '5.0 hrs' },
      { num: '03', title: 'Mongoose Compound Modeling & ObjectId Flattening', duration: '4.5 hrs' },
      { num: '04', title: 'Tailwind v4 Variable Directives & Dark Adaptations', duration: '6.0 hrs' },
    ]
  },
  'dsa-system-02': {
    title: 'Data Structures & Algorithms: Elite Interview Sprint',
    duration: '28 total hours • 8 modules',
    modules: [
      { num: '01', title: 'Asymptotic Array Pointers & Spatial Bounds', duration: '4.0 hrs' },
      { num: '02', title: 'Dynamic Matrices Memoization & Graph Traversals', duration: '6.5 hrs' },
      { num: '03', title: 'Bit Manipulations & Memory Optimization Buffers', duration: '3.0 hrs' },
    ]
  },
  'nextjs-saas-03': {
    title: 'Next.js Commercial Architecture & Cloud Scalability',
    duration: '35 total hours • 10 modules',
    modules: [
      { num: '01', title: 'Edge Middleware Interceptions & Route Guarding', duration: '4.5 hrs' },
      { num: '02', title: 'Incremental Static Regeneration (ISR) Engineering', duration: '5.0 hrs' },
      { num: '03', title: 'Multi-Tenant Subdomain Tunneling Schemes', duration: '7.5 hrs' },
    ]
  }
};

export default function CourseDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [activeAccordion, setActiveAccordion] = useState(0);

  // Safeguard view in case identifier routes desynchronize
  const schema = MOCK_CURRICULUM_CATALOG[id] || MOCK_CURRICULUM_CATALOG['fs-mearn-01'];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] font-sans pb-24 transition-colors duration-200">
      
      {/* ─── VERCEL POLARITY-FLIPPED HEADER STRIP ─── */}
      <header className="w-full bg-[#171717] dark:bg-[#050505] text-[#ededed] py-12 md:py-20 border-b border-black dark:border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center text-xs font-mono text-[#888888] hover:text-white transition-colors">
              ← Return to blueprint stream
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-[-1.5px] leading-tight text-white">
              {schema.title}
            </h1>
            <p className="text-xs font-mono text-[#888888] flex items-center gap-4 flex-wrap">
              <span>Verified Syllabus Level 3</span>
              <span>•</span>
              <span className="text-[#3b82f6]">{schema.duration}</span>
            </p>
          </div>

        </div>
      </header>

      {/* ─── RESPONSIVE TWO-COLUMN SYSTEM FRAMEWORK ─── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Interactive Track: Curriculums Accordion Block */}
        <section className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-[#171717] dark:text-[#ededed] tracking-tight">
              Curriculum Core Layout
            </h2>
            <p className="text-xs text-[#888888] font-mono mt-1">Click a structural block to review details</p>
          </div>

          <div className="border border-[#ebebeb] dark:border-[#232323] rounded-xl bg-white dark:bg-[#121212] overflow-hidden shadow-sm">
            {schema.modules.map((mod, index) => {
              const isOpen = activeAccordion === index;
              return (
                <div key={mod.num} className="border-b border-[#ebebeb] dark:border-[#232323] last:border-none">
                  <button
                    type="button"
                    onClick={() => setActiveAccordion(isOpen ? -1 : index)}
                    className="w-full h-14 px-5 flex items-center justify-between gap-4 hover:bg-[#fafafa] dark:hover:bg-[#161616] text-left transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="font-mono text-xs text-[#888888] font-bold">{mod.num}</span>
                      <h3 className="text-sm font-medium text-[#171717] dark:text-[#ededed] truncate tracking-tight">
                        {mod.title}
                      </h3>
                    </div>
                    <span className="font-mono text-[11px] text-[#888888] shrink-0">{mod.duration}</span>
                  </button>

                  {/* Accordion Expansion Space */}
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 bg-[#fafafa] dark:bg-[#161616] text-xs text-[#4d4d4d] dark:text-[#a3a3a3] font-mono space-y-2 border-t border-[#ebebeb]/60 dark:border-[#232323]/60 leading-relaxed">
                      <p>• Technical Scope: Multi-point network tracing validations and state syncs.</p>
                      <p>• Laboratory Challenge: Build and compile an error-free structural layout array.</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Sticky Track: Dynamic Transaction Actions Card */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-[#121212] border border-[#ebebeb] dark:border-[#232323] rounded-xl p-6 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0px_4px_32px_rgba(0,0,0,0.3)] space-y-6 transition-colors">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#888888]">Access Authorization</p>
              <h3 className="text-2xl font-semibold text-[#171717] dark:text-[#ededed] mt-1 font-mono">
                {isAuthenticated ? 'Workspace Active' : '₹4,999 INR'}
              </h3>
            </div>

            <div className="text-xs text-[#4d4d4d] dark:text-[#a3a3a3] space-y-3 font-mono border-t border-[#ebebeb] dark:border-[#232323] pt-4">
              <div className="flex justify-between"><span>• Runtime access</span> <span className="text-right text-[#171717] dark:text-white font-bold">Lifetime</span></div>
              <div className="flex justify-between"><span>• Code samples</span> <span className="text-right text-[#171717] dark:text-white font-bold">Included</span></div>
              <div className="flex justify-between"><span>• Exam validation</span> <span className="text-right text-[#171717] dark:text-white font-bold">OJEE Compliant</span></div>
            </div>

            {/* HYBRID ROUTE INTERFACE ADAPTATION NODE */}
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full h-11 bg-[#0070f3] text-white font-medium text-sm flex items-center justify-center rounded-lg shadow-[0px_2px_4px_rgba(0,112,243,0.15)] hover:bg-[#0060df] transition-colors"
              >
                Enter Student Dashboard →
              </Link>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="w-full h-11 bg-[#171717] dark:bg-[#ededed] text-white dark:text-[#121212] font-medium text-sm flex items-center justify-center rounded-lg hover:bg-black dark:hover:bg-white transition-colors"
                >
                  Buy and Start Learning
                </Link>
                <p className="text-[10px] font-mono text-[#888888] text-center">
                  Authentication is required to log database session states securely.
                </p>
              </div>
            )}
          </div>
        </aside>

      </main>
    </div>
  );
}