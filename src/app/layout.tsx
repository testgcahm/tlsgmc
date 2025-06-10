import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/footer/Footer";
import { Analytics } from "@vercel/analytics/next";
// import NotificationPopup from "./NotificationPopup";
import { IsOnlineProvider } from "@/components/context/IsOnlineContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <Analytics />
        <IsOnlineProvider>
          {/* <NotificationPopup /> */}
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </IsOnlineProvider>
      </body>
    </html>
  );
}
