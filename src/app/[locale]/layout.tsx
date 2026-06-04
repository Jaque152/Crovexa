import type { Metadata } from "next";
import "../globals.css";
import { ClientBody } from "@/components/shared/ClientBody";
import { Navigation } from "@/components/shared/Navigation";
import { Footer } from "@/components/shared/Footer";
import { NextIntlClientProvider } from 'next-intl';

import { Playfair_Display, DM_Sans } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Crovexa | Ecosistemas Digitales",
  description: "Crovexa diseña e implementa arquitecturas de crecimiento empresarial a través de tecnología, interfaces modernas y estrategias de alta precisión.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale} className={`${playfair.variable} ${dmSans.variable} scroll-smooth dark`}>
      <body className="antialiased min-h-screen flex flex-col font-sans text-slate-50 bg-[#020617]">
        <NextIntlClientProvider locale={locale} messages={{}}>
          <ClientBody>
            <Navigation />
            <main className="flex-grow flex flex-col relative z-10">
              {children}
            </main>
            <Footer />
          </ClientBody>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}