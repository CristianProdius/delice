'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

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

  const addLocaleToHref = (href: string) => {
    if (!href) return '/';
    if (href.startsWith(`/${locale}`)) return href;
    if (href.startsWith('/')) return `/${locale}${href}`;
    return href;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="w-full flex h-16 items-center justify-center px-4">
        <div className="flex items-center justify-between w-full max-w-7xl">
          {/* Logo / Owner Name */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {ownerName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={addLocaleToHref(item.href)}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}

            {/* CTA Button */}
            {ctaButton?.text && ctaButton?.href && (
              <Link
                href={addLocaleToHref(ctaButton.href)}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                {ctaButton.text}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container space-y-1 px-4 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={addLocaleToHref(item.href)}
                className="block rounded-md px-3 py-2 text-base font-medium hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile CTA Button */}
            {ctaButton?.text && ctaButton?.href && (
              <Link
                href={addLocaleToHref(ctaButton.href)}
                className="block rounded-md bg-primary px-3 py-2 text-center text-base font-medium text-primary-foreground hover:bg-primary/90 mt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                {ctaButton.text}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
