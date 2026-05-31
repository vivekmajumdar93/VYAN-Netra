import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RECOGNIZED_ADMINS, useVyanAuth } from "@/hooks/use-vyan-auth";
import { Fingerprint, Shield } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useVyanAuth();
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login(email || "admin@vyanlabs.com");
  }

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
        className="relative z-10 flex flex-col items-center gap-8 px-8 py-10 rounded-2xl w-full max-w-sm"
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
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-5 w-full"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">
                VYAN Security
              </span>
            </div>
            <p className="text-sm text-[rgba(232,232,255,0.65)] font-body leading-relaxed">
              Enter your admin email to access
              <br />
              the unified command console.
            </p>
          </div>

          <Input
            type="email"
            placeholder="admin@vyanlabs.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.25)] font-mono text-sm focus-visible:ring-blue-500/40"
            data-ocid="login.email.input"
          />

          {/* Quick-access chips */}
          <div className="flex flex-col gap-1.5 w-full">
            <p className="text-[10px] font-mono text-[rgba(232,232,255,0.3)] uppercase tracking-widest text-center">
              Quick access
            </p>
            <div className="flex flex-col gap-1.5">
              {Object.values(RECOGNIZED_ADMINS).map((admin) => (
                <button
                  key={admin.email}
                  type="button"
                  onClick={() => setEmail(admin.email)}
                  className="w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between gap-2"
                  style={{
                    background:
                      email === admin.email
                        ? "rgba(91,157,255,0.12)"
                        : "rgba(91,157,255,0.05)",
                    border: `1px solid ${email === admin.email ? "rgba(91,157,255,0.3)" : "rgba(91,157,255,0.1)"}`,
                  }}
                  data-ocid={`login.quickaccess.${admin.email.includes("vivek") ? "vivek" : "admin"}`}
                >
                  <span className="text-xs font-mono text-[rgba(232,232,255,0.6)] truncate">
                    {admin.email}
                  </span>
                  <span
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      background: "rgba(147,89,255,0.15)",
                      color: "#c084fc",
                      border: "1px solid rgba(147,89,255,0.25)",
                    }}
                  >
                    {admin.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 font-display tracking-wide text-sm shadow-[0_0_24px_rgba(91,157,255,0.35)] transition-all duration-300 hover:shadow-[0_0_36px_rgba(91,157,255,0.5)]"
            data-ocid="login.admin_access.button"
          >
            <Fingerprint className="w-4 h-4 mr-2" />
            Admin Access
          </Button>

          <p className="text-[11px] text-[rgba(232,232,255,0.25)] font-mono text-center">
            Protected by VYAN Security · VYAN Labs
          </p>
        </form>
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
