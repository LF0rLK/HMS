import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Suspense } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LoadingProvider } from "@/context/LoadingContext";
import { TopProgressBar } from "@/components/common/Loader";
import { AxiosLoader } from "@/components/common/AxiosLoader";
import { RouteLoader } from "@/components/common/RouteLoader";
import "./globals.css";
import "@/styles/variables.css";
import "@/styles/utilities.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ONE - Hospital Management System",
  description: "Modern healthcare management and patient clinical operations platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <ThemeProvider>
          <LoadingProvider>
            {/* Top progress bar — shown on every API request and route change */}
            <TopProgressBar />
            {/* Registers axios interceptors for the loading bar */}
            <AxiosLoader />
            {/* Watches route changes — must be inside Suspense per Next.js requirement */}
            <Suspense fallback={null}>
              <RouteLoader />
            </Suspense>
            <AuthProvider>{children}</AuthProvider>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
