import React, { useState } from 'react';
import { SUGGESTED_MENU } from '../data/portalData';

export default function Header({ currentView, setCurrentView, onOpenForm, onOpenStatus, onOpenEdit }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleNavClick = (href, isCta) => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    if (href === 'status') {
      onOpenStatus();
      return;
    }
    if (isCta || href === '#apply-online') {
      if (onOpenForm) {
        onOpenForm();
      } else {
        setCurrentView('form');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    if (currentView !== 'portal') {
      setCurrentView('portal');
      setTimeout(() => {
        if (href && href !== '#') {
          const el = document.querySelector(href);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      if (!href || href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navItems = SUGGESTED_MENU;

  return (
    <header className="bg-white border-b border-slate-200/90 shadow-xs sticky top-0 z-40 select-none w-full max-w-full overflow-hidden">
      {/* Main University Identity Bar */}
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-2.5 sm:px-6 lg:px-8 py-2 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-3.5">
          {/* Logo & University Identity matching rvrnriuniversity.edu.in */}
          <div
            onClick={() => handleNavClick('#')}
            className="flex items-center gap-2 sm:gap-3.5 min-w-0 cursor-pointer group flex-1"
          >
            <img
              src="https://rvrnriuniversity.edu.in/wp-content/uploads/2026/01/NRI-LOGO-FINAL.png"
              alt="Dr. RVR NRI INSTITUTE OF TECHNOLOGY Logo"
              className="h-10 sm:h-14 md:h-16 w-auto object-contain shrink-0 drop-shadow-xs group-hover:scale-[1.02] transition-transform"
              onError={(e) => {
                if (!e.target.dataset.fallback) {
                  e.target.dataset.fallback = 'true';
                  e.target.src = '/nrilogo.png';
                }
              }}
            />
            <div className="min-w-0 flex-1">
              <h1 className="text-xs sm:text-base md:text-xl lg:text-2xl font-black text-[#EC691F] tracking-tight leading-tight transition-colors">
                Dr. RVR NRI INSTITUTE OF TECHNOLOGY
              </h1>
              <p className="text-[9px] sm:text-xs md:text-sm font-semibold text-[#1E1D1D] leading-tight mt-0.5">
                (An Institution deemed to be University u/s 3 of UGC Act, 1956)
              </p>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 text-[8.5px] sm:text-[11px] text-[#5B5B5B] font-medium">
                <span className="font-bold text-[#1E1D1D]">Directorate of Research & Development</span>
                <span className="hidden sm:inline text-slate-300">·</span>
                <span className="hidden sm:inline text-[#EC691F] font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  Ph.D. Admissions 2026–2027
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Portal Action Buttons (shown when on portal or admin view) */}
            {currentView !== 'form' && (
              <>
                {/* Application Status Modal trigger */}
                <button
                  type="button"
                  onClick={onOpenStatus}
                  className="hidden md:inline-flex px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-md border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition shadow-xs items-center gap-1.5 cursor-pointer shrink-0"
                  title="Check Submitted Application Status"
                >
                  <span>Status</span>
                </button>

                {/* Edit Application via OTP Modal trigger */}
                {onOpenEdit && (
                  <button
                    type="button"
                    onClick={onOpenEdit}
                    className="hidden lg:inline-flex px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-md border border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 transition shadow-2xs items-center gap-1 cursor-pointer shrink-0"
                    title="Edit previously submitted application via Email OTP"
                  >
                    <span>Edit Form</span>
                  </button>
                )}

                {/* PROMINENT APPLICATION FORM BUTTON - Central User Requirement (Desktop/Tablet) */}
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenForm) {
                      onOpenForm();
                    } else {
                      setCurrentView('form');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="hidden sm:inline-flex relative group px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 text-xs md:text-sm font-extrabold rounded-md bg-[#EC691F] hover:bg-[#d95a14] active:scale-[0.98] text-white shadow-xs hover:shadow transition-all items-center gap-1 cursor-pointer border border-[#d95a14] shrink-0 uppercase tracking-wide"
                  title="Click to Open 7-Step Ph.D. Online Application Form"
                >
                  <span>Admissions 2026</span>
                  <span className="hidden xl:inline text-xs font-normal opacity-90">| Apply Online</span>
                  <span className="flex absolute -top-1 -right-1 h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#A51C30]" />
                  </span>
                </button>
              </>
            )}

            {/* Admin Portal Toggle */}
            <button
              type="button"
              onClick={() => {
                setCurrentView(currentView === 'admin' ? 'portal' : 'admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hidden md:inline-flex px-2.5 py-1.5 sm:py-2 text-xs font-semibold rounded-md transition cursor-pointer items-center gap-1.5 shrink-0 ${
                currentView === 'admin'
                  ? 'bg-[#1E1D1D] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
              title="Dean R&D Administration Portal"
            >
              <span>Admin</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              <span className="text-base font-bold leading-none">{mobileMenuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Full Academic Navigation Bar (Desktop) matching Section 13 Suggested Menu */}
      {currentView === 'portal' && (
        <nav className="hidden lg:block bg-white border-y border-slate-200 text-[#1E1D1D] shadow-xs w-full overflow-hidden">
          <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-2 py-1 overflow-x-auto no-scrollbar">
              <ul className="flex items-center text-[11px] xl:text-xs font-bold tracking-wider uppercase whitespace-nowrap">
                {navItems.map((item, idx) => (
                  <React.Fragment key={item.label}>
                    <li
                      className="relative group shrink-0"
                      onMouseEnter={() => item.children && setActiveDropdown(idx)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button
                        type="button"
                        onClick={() => handleNavClick(item.href, item.isCta)}
                        className={`px-2.5 xl:px-3 py-2.5 flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer ${
                          item.isCta
                            ? 'text-white bg-[#EC691F] hover:bg-[#d95a14] px-3 py-1.5 rounded-sm font-extrabold shadow-xs'
                            : item.label === 'Home'
                            ? 'text-[#EC691F] font-black'
                            : 'text-[#1E1D1D] hover:text-[#EC691F]'
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.children && <span className="opacity-70 text-[10px] group-hover:rotate-180 transition-transform inline-block">▾</span>}
                      </button>

                      {/* Dropdown Menu */}
                      {item.children && (
                        <div className="absolute left-0 top-full w-56 bg-white text-slate-800 shadow-xl border border-slate-200 py-2 rounded-b-md hidden group-hover:block animate-fadeIn z-50">
                          {item.children.map((subItem) => (
                            <button
                              key={subItem.label}
                              type="button"
                              onClick={() => handleNavClick(subItem.href)}
                              className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-orange-50 hover:text-[#EC691F] transition-colors flex items-center justify-between cursor-pointer text-slate-700"
                            >
                              <span>{subItem.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </li>

                    {/* Pipe Separator | between items */}
                    {idx < navItems.length - 1 && (
                      <span className="text-slate-300 font-normal select-none px-0.5">|</span>
                    )}
                  </React.Fragment>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      )}

      {/* 5. Mobile Navigation Dropdown */}
      {/* 5. Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-3 py-1.5 space-y-1 shadow-2xl animate-fadeIn text-xs max-h-[92vh] overflow-y-auto">
          {/* Quick CTA inside Mobile Menu */}
          <div className="px-2.5 py-1 rounded bg-[#FAF7F5] border border-orange-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-[#1E1D1D] text-xs leading-tight">Ph.D. Admissions 2026–2027</p>
              <p className="text-[10px] text-slate-500 leading-none">Full-Time / Part-Time Doctoral Study</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenForm) {
                  onOpenForm();
                } else {
                  setCurrentView('form');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="px-2.5 py-1 bg-[#EC691F] hover:bg-[#d95a14] text-white font-bold rounded text-xs shadow-xs shrink-0 cursor-pointer"
            >
              Apply Form
            </button>
          </div>

          {/* Nav Links */}
          <div className="divide-y divide-slate-100">
            {navItems.map((item) => (
              <div key={item.label} className="py-0.5">
                <button
                  type="button"
                  onClick={() => handleNavClick(item.href, item.isCta)}
                  className={`w-full text-left font-bold py-0.5 flex items-center justify-between transition-colors cursor-pointer ${
                    item.isCta ? 'text-[#EC691F] font-black' : 'text-slate-800 hover:text-[#EC691F]'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
                {item.children && (
                  <div className="flex items-center gap-3 pl-2.5 py-0.5 text-slate-600 text-[11px] font-semibold">
                    {item.children.map((sub) => (
                      <button
                        key={sub.label}
                        type="button"
                        onClick={() => handleNavClick(sub.href)}
                        className="hover:text-[#EC691F] transition-colors py-0 cursor-pointer"
                      >
                        • {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Quick Actions (Check Status & Edit Form OTP) */}
          <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenStatus();
              }}
              className="w-full py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-xs flex items-center justify-center border border-slate-200 cursor-pointer"
            >
              Check Status
            </button>
            {onOpenEdit && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEdit();
                }}
                className="w-full py-1 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded text-xs flex items-center justify-center border border-amber-200 cursor-pointer"
              >
                Edit Form (OTP)
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

