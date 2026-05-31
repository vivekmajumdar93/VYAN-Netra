import { Toaster } from "@/components/ui/sonner";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

// VYAN Security: direct admin access — Firebase auth will be linked later.
export default function Layout({ title, subtitle, children }: LayoutProps) {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#000010" }}
    >
      {/* Ambient background gradient */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(11,46,92,0.45) 0%, rgba(74,26,107,0.25) 50%, rgba(0,0,0,0) 100%)",
        }}
        aria-hidden="true"
      />

      <Sidebar />

      <div className="relative z-10 flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      <Toaster richColors position="bottom-right" />
    </div>
  );
}
