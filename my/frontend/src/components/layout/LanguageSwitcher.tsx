"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { usePathname, Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';

interface Language {
  code: string;
  label: string;
  flag: string;
}

interface LanguageSwitcherProps {
  isScrolled?: boolean;
  className?: string;
}

const languages: Language[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ro", label: "Română", flag: "🇷🇴" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  isScrolled = false,
  className = "",
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as string;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!mounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mounted]);

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  return (
    <div className={`relative ${className}`} ref={languageRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`flex items-center justify-between w-full gap-3 px-4 py-3 rounded-lg transition-all duration-300 border ${
          isScrolled
            ? "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-primary/30"
            : "hover:bg-white/10 text-white backdrop-blur-sm border-white/20"
        }`}
        aria-label="Change language"
        aria-expanded={showDropdown}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${isScrolled ? 'bg-primary/10' : 'bg-white/20'}`}>
            <Globe size={18} className={isScrolled ? 'text-primary' : 'text-white'} />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs text-gray-500">Language</span>
            <span className="text-sm font-semibold">{currentLanguage.label}</span>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 flex-shrink-0 ${
            showDropdown ? "rotate-180" : ""
          } ${isScrolled ? 'text-gray-400' : 'text-white/70'}`}
        />
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className={`absolute top-full left-0 right-0 mt-2 bg-white/98 backdrop-blur-xl rounded-lg shadow-2xl border border-gray-100 py-1 z-50 transition-all duration-300 ${
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {languages.map((lang) => (
            <Link
              key={lang.code}
              href={pathname}
              locale={lang.code}
              onClick={() => setShowDropdown(false)}
              className={`w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 transition-all duration-300 flex items-center gap-3 border-l-2 ${
                currentLocale === lang.code
                  ? "bg-primary/5 border-primary font-medium"
                  : "border-transparent hover:border-primary/30"
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="flex flex-col">
                <span className={`text-sm ${currentLocale === lang.code ? 'text-primary font-semibold' : 'text-gray-700'}`}>
                  {lang.label}
                </span>
                <span className="text-xs text-gray-500 uppercase">{lang.code}</span>
              </div>
              {currentLocale === lang.code && (
                <svg className="ml-auto w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
