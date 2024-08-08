import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./globals.css";

const beVietNamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700"],
  preload: false,
});

export const metadata: Metadata = {
  title: "TBoost - The best app for work",
  description: "TBoost - Copy right of r0tc1v.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body className={beVietNamPro.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            {children}
            <SpeedInsights />
            <Toaster />

            <SonnerToaster
              className="bg-dark-primary text-lg"
              position="bottom-left"
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
