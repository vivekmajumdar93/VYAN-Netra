import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Loader2, Shield } from "lucide-react";

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoading = loginStatus === "logging-in";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "#000" }}
      data-ocid="login.page"
    >
      {/* Ambient glow layers */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(11,46,92,0.6) 0%, rgba(74,26,107,0.4) 45%, rgba(0,0,0,0) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Animated ring decorations */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        {[240, 340, 440].map((size, i) => (
          <div
            key={size}
            className="absolute rounded-full border border-[rgba(91,157,255,0.08)] animate-pulse"
            style={{
              width: size,
              height: size,
              animationDelay: `${i * 0.8}s`,
              animationDuration: "3s",
            }}
          />
        ))}
      </div>

      {/* Central login card */}
      <div
        className="relative z-10 flex flex-col items-center gap-8 px-8 py-10 rounded-2xl"
        style={{
          backdropFilter: "blur(16px)",
          background: "rgba(5,10,25,0.7)",
          border: "1px solid rgba(91,157,255,0.2)",
          boxShadow:
            "0 0 60px rgba(91,157,255,0.1), 0 0 120px rgba(147,89,255,0.08)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 opacity-20 blur-2xl" />
            <img
              src="https://raw.githubusercontent.com/vivekmajumdar93/VYAN-Technologies-Logo/main/IMG_9695.png"
              alt="VYAN Labs"
              style={{
                maxWidth: 140,
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>
          <div className="text-center">
            <div className="flex items-baseline gap-2 justify-center">
              <span className="font-display text-3xl font-bold tracking-wide text-[#E8E8FF]">
                VYAN
              </span>
              <span className="font-display text-3xl font-light text-[rgba(232,232,255,0.6)]">
                Netra
              </span>
            </div>
            <p className="text-sm font-mono text-[rgba(232,232,255,0.4)] tracking-widest uppercase mt-1">
              Admin Command Console
            </p>
            <p className="text-xs text-[rgba(232,232,255,0.3)] mt-1">
              by VYAN Labs
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(91,157,255,0.3)] to-transparent" />

        {/* Auth section */}
        <div className="flex flex-col items-center gap-5 w-full max-w-xs">
          <div className="flex flex-col items-center gap-2 text-center">
            <Shield className="w-5 h-5 text-blue-400" />
            <p className="text-sm text-[rgba(232,232,255,0.65)] font-body leading-relaxed">
              Authenticate with Internet Identity to access
              <br />
              the unified admin console.
            </p>
          </div>

          <Button
            onClick={() => login()}
            disabled={isLoading}
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 font-display tracking-wide text-sm shadow-[0_0_24px_rgba(91,157,255,0.35)] transition-all duration-300 hover:shadow-[0_0_36px_rgba(91,157,255,0.5)] disabled:opacity-60"
            data-ocid="login.signin.button"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Authenticating…
              </>
            ) : (
              "Sign in with Internet Identity"
            )}
          </Button>

          <p className="text-[11px] text-[rgba(232,232,255,0.25)] font-mono text-center">
            Secured by the Internet Computer Protocol
          </p>
        </div>
      </div>

      {/* Bottom branding */}
      <div className="relative z-10 mt-8 flex flex-col items-center gap-1">
        <p className="text-[11px] text-[rgba(232,232,255,0.25)] font-mono">
          © {new Date().getFullYear()} VYAN Labs · All rights reserved
        </p>
        <p className="text-[10px] text-[rgba(232,232,255,0.15)] font-mono tracking-widest uppercase">
          VYAN Netra · VYAN Ecosystem
        </p>
      </div>
    </div>
  );
}
