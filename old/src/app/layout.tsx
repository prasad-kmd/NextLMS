import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/sidebar";
import { FloatingNavbar } from "@/components/floating-navbar";
import { Footer } from "@/components/footer";
import { CustomCursor } from "@/components/custom-cursor";
import { CustomContextMenu } from "@/components/custom-context-menu";
import { ConnectivityListener } from "@/components/connectivity-listener";
import ClickSpark from "@/components/ClickSpark";
import ServiceWorkerRegistrar from "@/components/service-worker-registrar";

export const metadata: Metadata = { title: "NextLMS", description: "Personal LMS" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Sidebar />
            <div className="flex flex-1 flex-col lg:pl-64">
              <ClickSpark
                sparkColor="hsl(var(--primary))"
                sparkSize={10}
                sparkRadius={15}
                sparkCount={8}
                duration={400}
              >
                <FloatingNavbar />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </ClickSpark>
            </div>
          </div>
          <CustomCursor />
          <CustomContextMenu />
          <ConnectivityListener />
          <ServiceWorkerRegistrar />
        </Providers>
      </body>
    </html>
  );
}
