import { Toaster } from "@/components/ui/sonner";
import LoginPage from "@/pages/LoginPage";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function Layout({ title, subtitle, children }: LayoutProps) {
  const { loginStatus, identity } = useInternetIdentity();
  const isAuthenticated = loginStatus === "success" && !!identity;
  const isLoading =
    loginStatus === "initializing" || loginStatus === "logging-in";

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#000" }}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 opacity-70 animate-pulse-glow" />
            <div className="absolute inset-2 rounded-full bg-black" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="font-display text-lg font-semibold text-[#E8E8FF]">
              VYAN Netra
            </p>
            <p className="text-xs font-mono text-[rgba(232,232,255,0.4)] mt-1 animate-pulse">
              Initializing command nexus…
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

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
