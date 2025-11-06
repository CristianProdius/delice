import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Analytics } from '@vercel/analytics/react';
import { Geist, Geist_Mono } from "next/font/google";
import { getHeader, getFooter } from '@/lib/strapi/api';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Fetch Header and Footer data
  let headerData = null;
  let footerData = null;

  try {
    const headerResponse = await getHeader(locale);
    headerData = headerResponse.data;
    console.log(`[Layout] Locale: ${locale}, Owner Name: ${headerData.ownerName}`);
  } catch (error) {
    console.error('Error fetching header:', error);
  }

  try {
    const footerResponse = await getFooter(locale);
    footerData = footerResponse.data;
  } catch (error) {
    console.error('Error fetching footer:', error);
  }

  // Transform footer logo data to match Footer component expectations
  const footerLogo = footerData?.logo?.data ? {
    url: (footerData.logo.data as any).url,
    alternativeText: (footerData.logo.data as any).alternativeText || 'Logo'
  } : undefined;

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {headerData && (
            <Header
              ownerName={headerData.ownerName}
              menuItems={headerData.menuItems}
              ctaButton={headerData.ctaButton}
              locale={locale}
            />
          )}
          {children}
          {footerData && (
            <Footer
              logo={footerLogo}
              tagline={footerData.tagline}
              description={footerData.description}
              servicesSection={footerData.servicesSection}
              learnSection={footerData.learnSection}
              exploreSection={footerData.exploreSection}
              connectSection={footerData.connectSection}
              contactInfo={footerData.contactInfo}
              socialTitle={footerData.socialTitle}
              socialLinks={footerData.socialLinks}
              newsletter={footerData.newsletter}
              certifications={footerData.certifications}
              copyright={footerData.copyright}
              locale={locale}
            />
          )}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
