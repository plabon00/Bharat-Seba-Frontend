import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { MainLayout } from "@/components/layout/main-layout";
import { Footer } from "@/components/layout/footer";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bharat Seva",
  description: "Modern online learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="text/javascript" src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" async></script>
        <script type="text/javascript" dangerouslySetInnerHTML={{__html: `
            function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'en,hi,bn',
                    autoDisplay: false
                }, 'google_translate_element');
            }
        `}} />
        <style>{`
            /* Hide the default Google Translate widget */
            .skiptranslate iframe, .skiptranslate.goog-te-banner-frame { display: none !important; }
            body { top: 0px !important; }
            #google_translate_element { display: none; }
        `}</style>
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <div id="google_translate_element" suppressHydrationWarning></div>
          <Suspense fallback={<div className="min-h-screen" />}>
            <MainLayout>
              {children}
            </MainLayout>
          </Suspense>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
