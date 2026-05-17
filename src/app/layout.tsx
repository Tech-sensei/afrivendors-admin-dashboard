import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import AuthInitializer from "@/providers/AuthInitializer";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import "./globals.css";

// Only load weights actually used in the UI (saves 5 font file requests)
const unboundedSans = localFont({
  src: [
    {
      path: "../../public/fonts/Unbounded/Unbounded-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Unbounded/Unbounded-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Unbounded/Unbounded-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-unbounded-sans",
  display: "swap",
});

const unageo = localFont({
  src: [
    {
      path: "../../public/fonts/Unageo/Unageo-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Unageo/Unageo-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Unageo/Unageo-Semibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Unageo/Unageo-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-unageo-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Afrivendors",
  description: "Connecting African Vendors to the World",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${unboundedSans.variable} ${unageo.variable} antialiased`}
      >
        <ReduxProvider>
          <AuthInitializer>
            <ReactQueryProvider>
              <Toaster />
              {children}
            </ReactQueryProvider>
          </AuthInitializer>
        </ReduxProvider>
      </body>
    </html>
  );
}
