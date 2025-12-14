import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "#components/Navbar";
import { CartLoader } from "#components/CartLoader";
import { ToastProvider } from "#components/Toast";
import { SITE_DESCRIPTION, SITE_NAME } from "#config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-base-100 text-base-content`}
      >
        <ToastProvider>
          <CartLoader />
          <header className="sticky top-0 z-50">
            <Navbar />
          </header>
          <main className="flex-grow">{children}</main>
          <footer className="footer footer-center p-10 bg-base-200 text-base-content">
            <p className="text-sm">
              © {new Date().getFullYear()} {SITE_NAME}
            </p>
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}

export default RootLayout;
