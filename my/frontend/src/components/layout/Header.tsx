'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';

interface MenuItem {
  id: number;
  label: string;
  href: string;
  isActive: boolean;
}

interface CTAButton {
  id: number;
  text?: string;
  href?: string;
}

interface HeaderProps {
  ownerName: string;
  menuItems?: MenuItem[];
  ctaButton?: CTAButton;
  locale: string;
}

export function Header({ ownerName, menuItems = [], ctaButton, locale }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuStage, setMobileMenuStage] = useState(0);

  const addLocaleToHref = (href: string) => {
    if (!href) return '/';
    if (href.startsWith(`/${locale}`)) return href;
    if (href.startsWith('/')) return `/${locale}${href}`;
    return href;
  };

  // Mount effect - enable animations after hydration
  useEffect(() => {
    setMounted(true);
    setTimeout(() => setHeaderVisible(true), 100);
  }, []);

  // Handle scroll effects
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroThreshold = window.innerHeight * 0.3;
      setIsScrolled(scrollPosition > heroThreshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle mobile menu animation stages
  useEffect(() => {
    if (mobileMenuOpen) {
      setTimeout(() => setMobileMenuStage(1), 50);
      setTimeout(() => setMobileMenuStage(2), 150);
      setTimeout(() => setMobileMenuStage(3), 250);
    } else {
      setMobileMenuStage(0);
    }
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-700 ${
        mounted && headerVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <nav
        className={`relative transition-all duration-500 ${
          isScrolled
            ? 'bg-white shadow-lg border-b border-gray-100'
            : 'bg-gradient-to-b from-black/30 to-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Premium gradient overlay - only show when scrolled */}
        {isScrolled && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        )}

        <div className="w-full flex h-20 items-center justify-center px-4">
          <div className="flex items-center justify-between w-full max-w-7xl">
            {/* Enhanced Logo with Animation */}
            <div
              className={`flex items-center flex-shrink-0 transition-all duration-500 ${
                mounted ? 'hover:scale-110' : ''
              }`}
            >
              <Link
                href={`/${locale}`}
                className="relative group"
                aria-label={`${ownerName} - Home`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 blur-xl group-hover:blur-2xl transition-all duration-500 rounded-full" />
                <span
                  className={`relative z-10 text-2xl font-bold bg-gradient-to-r transition-all duration-300 ${
                    isScrolled
                      ? 'from-primary to-primary/60'
                      : 'from-white to-white/80'
                  } bg-clip-text text-transparent`}
                >
                  {ownerName}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation with Premium Effects */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <ul className="flex items-center gap-6 lg:gap-8" role="menubar">
                {menuItems.map((item) => (
                  <li
                    key={item.id}
                    role="none"
                    className="relative"
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Link
                      href={addLocaleToHref(item.href)}
                      className={`relative py-3 font-medium text-sm lg:text-base transition-all duration-300 flex items-center gap-2 group ${
                        isScrolled
                          ? 'text-gray-700 hover:text-primary'
                          : 'text-white hover:text-primary/80'
                      }`}
                      role="menuitem"
                    >
                      <span className="relative">
                        {item.label}
                        {/* Premium hover effect */}
                        <span
                          className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary/60 to-primary transform origin-left transition-transform duration-300 ${
                            hoveredItem === item.id ? 'scale-x-100' : 'scale-x-0'
                          }`}
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Language Switcher */}
              <LanguageSwitcher isScrolled={isScrolled} />

              {/* Premium CTA Button */}
              {ctaButton?.text && ctaButton?.href && (
                <Link
                  href={addLocaleToHref(ctaButton.href)}
                  className="group relative px-6 py-3 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2">
                    {ctaButton.text}
                  </span>
                </Link>
              )}
            </div>

            {/* Premium Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden relative p-3 rounded-xl transition-all duration-300 ${
                isScrolled
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute top-0 left-0 w-6 h-0.5 ${
                    isScrolled ? 'bg-gray-700' : 'bg-white'
                  } transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-45 top-[11px]' : ''
                  }`}
                />
                <span
                  className={`absolute top-[11px] left-0 w-6 h-0.5 ${
                    isScrolled ? 'bg-gray-700' : 'bg-white'
                  } transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}
                />
                <span
                  className={`absolute bottom-0 left-0 w-6 h-0.5 ${
                    isScrolled ? 'bg-gray-700' : 'bg-white'
                  } transition-all duration-300 ${
                    mobileMenuOpen ? '-rotate-45 bottom-[11px]' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Premium Mobile Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/60 backdrop-blur-md md:hidden transition-all duration-500 ${
              mobileMenuStage >= 1 ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ zIndex: 9998 }}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div
            className={`fixed right-0 top-0 bottom-0 w-full sm:w-96 md:w-[420px] bg-white md:hidden transition-all duration-500 ease-out ${
              mobileMenuStage >= 2 ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{
              boxShadow: mobileMenuStage >= 2 ? '-10px 0 40px rgba(0,0,0,0.1)' : 'none',
              zIndex: 9999,
              height: '100vh',
              overflow: 'auto'
            }}
          >
            <div className="flex flex-col h-full bg-gradient-to-br from-white via-gray-50/30 to-primary/5">
              {/* Header */}
              <div
                className={`flex items-center justify-between p-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm transition-all duration-500 delay-100 ${
                  mobileMenuStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}
              >
                <Link
                  href={`/${locale}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="transform hover:scale-105 transition-transform"
                >
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {ownerName}
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-xl hover:bg-gray-100 transition-all duration-300 group"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-6 h-6 text-gray-700 group-hover:rotate-90 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto px-6 py-6">
                {/* Navigation Title */}
                <div
                  className={`transition-all duration-500 mb-4 ${
                    mobileMenuStage >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                  }`}
                  style={{
                    transitionDelay: mobileMenuStage >= 3 ? '150ms' : '0ms'
                  }}
                >
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">
                    Navigation
                  </h2>
                </div>

                <ul className="space-y-2 mb-8">
                  {menuItems.map((item, itemIndex) => (
                    <li
                      key={item.id}
                      className={`transition-all duration-500 ${
                        mobileMenuStage >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                      }`}
                      style={{
                        transitionDelay: mobileMenuStage >= 3 ? `${200 + itemIndex * 60}ms` : '0ms'
                      }}
                    >
                      <Link
                        href={addLocaleToHref(item.href)}
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-left px-4 py-3.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-between group bg-white hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 border border-gray-100 hover:border-primary/20 hover:shadow-md"
                      >
                        <span className="text-base text-gray-800 group-hover:text-primary transition-colors">
                          {item.label}
                        </span>
                        <svg
                          className="w-4 h-4 text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Divider */}
                <div
                  className={`transition-all duration-500 ${
                    mobileMenuStage >= 3 ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    transitionDelay: mobileMenuStage >= 3 ? `${200 + menuItems.length * 60}ms` : '0ms'
                  }}
                >
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6" />
                </div>

                {/* Language Switcher - Mobile */}
                <div
                  className={`transition-all duration-500 ${
                    mobileMenuStage >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                  }`}
                  style={{
                    transitionDelay: mobileMenuStage >= 3 ? `${200 + menuItems.length * 60 + 50}ms` : '0ms'
                  }}
                >
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
                    Language
                  </h2>
                  <LanguageSwitcher isScrolled={true} className="w-full" />
                </div>
              </nav>

              {/* CTA Button */}
              {ctaButton?.text && ctaButton?.href && (
                <div
                  className={`p-6 border-t border-gray-100 bg-white/80 backdrop-blur-sm transition-all duration-500 ${
                    mobileMenuStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{
                    transitionDelay: mobileMenuStage >= 3 ? '700ms' : '0ms'
                  }}
                >
                  <Link
                    href={addLocaleToHref(ctaButton.href)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group"
                  >
                    <span>{ctaButton.text}</span>
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
