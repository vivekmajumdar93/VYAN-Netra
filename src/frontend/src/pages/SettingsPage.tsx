import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useSetZohoConfig, useZohoStatus } from "@/hooks/use-backend";
import { useVyanAuth } from "@/hooks/use-vyan-auth";
import {
  Activity,
  AtSign,
  CheckCircle2,
  ExternalLink,
  Info,
  Link2,
  LogOut,
  Mail,
  Palette,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ── Zoho Email config form ──────────────────────────────────────────────
function ZohoConfigForm() {
  const { data: status } = useZohoStatus();
  const setZoho = useSetZohoConfig();
  const [accountId, setAccountId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [fromAddress, setFromAddress] = useState(status?.fromAddress ?? "");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!accountId.trim() || !accessToken.trim() || !fromAddress.trim()) {
      toast.error("All three fields are required");
      return;
    }
    try {
      await setZoho.mutateAsync({
        accountId: accountId.trim(),
        accessToken: accessToken.trim(),
        fromAddress: fromAddress.trim(),
      });
      toast.success("Zoho configuration saved");
      setAccessToken("");
    } catch {
      toast.error("Failed to save Zoho configuration");
    }
  }

  return (
    <div className="py-3 space-y-4">
      {status?.configured && (
        <div
          className="rounded-xl p-3 flex items-center gap-2.5"
          style={{
            background: "rgba(52,211,153,0.08)",
            border: "1px solid rgba(52,211,153,0.2)",
          }}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <p className="text-[11px] font-mono text-emerald-300">
            Configured — sending as {status.fromAddress} (account{" "}
            {status.accountId})
          </p>
        </div>
      )}
      <p className="text-[10px] font-mono text-[rgba(232,232,255,0.35)] leading-relaxed">
        Netra sends real email through Zoho's Mail API (an HTTPS outcall — not
        raw SMTP, which a canister can't speak). The access token is write-only:
        once saved, it's never returned to the browser again. Zoho tokens expire
        periodically — re-paste a fresh one here when sends start failing.
      </p>
      <form onSubmit={handleSave} className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-wider">
            Zoho Account ID
          </Label>
          <Input
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            placeholder="e.g. 60001234567"
            data-ocid="settings.zoho.account_id"
            className="bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF] font-mono text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-wider">
            From Address
          </Label>
          <Input
            type="email"
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value)}
            placeholder="no-reply@vyan.com"
            data-ocid="settings.zoho.from_address"
            className="bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF] font-mono text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-wider">
            Access Token
          </Label>
          <Input
            type="password"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder={
              status?.configured
                ? "•••••••• (unchanged)"
                : "Zoho OAuth access token"
            }
            data-ocid="settings.zoho.access_token"
            className="bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF] font-mono text-xs"
          />
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={setZoho.isPending}
          data-ocid="settings.zoho.save_button"
        >
          {setZoho.isPending ? "Saving…" : "Save Zoho Config"}
        </Button>
      </form>
    </div>
  );
}

// ── Local-storage helpers ───────────────────────────────────────────────

function loadBool(key: string, fallback: boolean): boolean {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v === "true";
  } catch {
    return fallback;
  }
}

function saveBool(key: string, value: boolean) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // silently fail in restricted contexts
  }
}

// ── Reusable glass section wrapper ─────────────────────────────────────────

const GLASS_SECTION = {
  background: "rgba(10,20,45,0.6)",
  border: "1px solid rgba(91,157,255,0.12)",
  backdropFilter: "blur(12px)",
};

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  ocid: string;
  children: React.ReactNode;
  index?: number;
}

function Section({ icon, title, ocid, children, index = 0 }: SectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className="rounded-xl overflow-hidden"
      style={GLASS_SECTION}
      data-ocid={ocid}
    >
      <div className="px-5 py-3 border-b border-[rgba(91,157,255,0.1)] flex items-center gap-2">
        <span className="text-blue-400">{icon}</span>
        <h2 className="text-[10px] font-mono text-[rgba(232,232,255,0.45)] uppercase tracking-widest">
          {title}
        </h2>
      </div>
      <div className="px-5">{children}</div>
    </motion.section>
  );
}

// ── Setting row ─────────────────────────────────────────────────────────────

interface SettingRowProps {
  label: string;
  description: string;
  children: React.ReactNode;
  divider?: boolean;
}

function SettingRow({
  label,
  description,
  children,
  divider = true,
}: SettingRowProps) {
  return (
    <>
      <div className="flex items-center justify-between gap-6 py-4">
        <div className="min-w-0">
          <p className="text-sm font-body font-medium text-[#E8E8FF]">
            {label}
          </p>
          <p className="text-xs font-mono text-[rgba(232,232,255,0.4)] mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex-shrink-0">{children}</div>
      </div>
      {divider && <Separator className="bg-[rgba(91,157,255,0.07)]" />}
    </>
  );
}

// ── Info row (key-value) ──────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-xs font-mono text-[rgba(232,232,255,0.35)]">
        {label}
      </span>
      <span className="text-xs font-mono text-[#E8E8FF]">{value}</span>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { currentUser, logout: vyanLogout } = useVyanAuth();

  // VYAN Auth identity display
  const adminEmail = currentUser?.email ?? "Not connected";

  // ── LocalStorage-backed settings
  const [autoRefresh, setAutoRefresh] = useState(() =>
    loadBool("netra_auto_refresh", true),
  );
  const [nanoParticles, setNanoParticles] = useState(() =>
    loadBool("netra_nano_particles", true),
  );
  const [alertNotifications, setAlertNotifications] = useState(() =>
    loadBool("netra_alert_notifications", true),
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    loadBool("netra_sidebar_collapsed", false),
  );

  function toggle(key: string, value: boolean, setter: (v: boolean) => void) {
    setter(value);
    saveBool(key, value);
  }

  function handleSignOut() {
    vyanLogout();
    toast.success("Signed out from VYAN Netra");
  }

  return (
    <div className="p-6 max-w-2xl" data-ocid="settings.page">
      {/* Page title */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-7"
      >
        <h1 className="text-xl font-display font-bold text-[#E8E8FF]">
          Settings
        </h1>
        <p className="text-xs font-mono text-[rgba(232,232,255,0.35)] mt-1">
          Manage your console preferences and account
        </p>
      </motion.div>

      <div className="space-y-4">
        {/* ── Account ── */}
        <Section
          icon={<User className="w-3.5 h-3.5" />}
          title="Account"
          ocid="settings.account.section"
          index={0}
        >
          <SettingRow
            label="VYAN Identity"
            description="Your VYAN Security admin identity for this console"
          >
            <Button
              variant="destructive"
              size="sm"
              onClick={handleSignOut}
              className="text-xs gap-1.5"
              data-ocid="settings.signout.button"
            >
              <LogOut className="w-3 h-3" /> Sign Out
            </Button>
          </SettingRow>

          {/* VYAN Identity email display */}
          <div className="pb-4">
            <p className="text-[10px] font-mono text-[rgba(232,232,255,0.35)] uppercase tracking-widest mb-2">
              Admin Email
            </p>
            <div
              className="rounded-lg px-3 py-2.5 flex items-start gap-2"
              style={{
                background: "rgba(91,157,255,0.06)",
                border: "1px solid rgba(91,157,255,0.14)",
              }}
            >
              <AtSign className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p
                className="text-xs font-mono text-[#E8E8FF] break-all select-all leading-relaxed"
                data-ocid="settings.principal.display"
              >
                {adminEmail}
              </p>
            </div>
          </div>
        </Section>

        {/* ── Monitoring ── */}
        <Section
          icon={<Activity className="w-3.5 h-3.5" />}
          title="Monitoring"
          ocid="settings.monitoring.section"
          index={1}
        >
          <SettingRow
            label="Auto-Refresh Metrics"
            description="Automatically poll for new system metrics every 30 s. Disabling this reduces background requests."
          >
            <Switch
              checked={autoRefresh}
              onCheckedChange={(v) =>
                toggle("netra_auto_refresh", v, setAutoRefresh)
              }
              data-ocid="settings.autorefresh.switch"
            />
          </SettingRow>
          <SettingRow
            label="Alert Notifications"
            description="Show badge counts for active alerts in the sidebar navigation"
            divider={false}
          >
            <Switch
              checked={alertNotifications}
              onCheckedChange={(v) =>
                toggle("netra_alert_notifications", v, setAlertNotifications)
              }
              data-ocid="settings.alerts.switch"
            />
          </SettingRow>
        </Section>

        {/* ── Display ── */}
        <Section
          icon={<Palette className="w-3.5 h-3.5" />}
          title="Display"
          ocid="settings.display.section"
          index={2}
        >
          <SettingRow
            label="Nano-Particle Animation"
            description="Show the animated cosmic particle orbs in the hero area. Disable for reduced motion or better performance."
          >
            <Switch
              checked={nanoParticles}
              onCheckedChange={(v) =>
                toggle("netra_nano_particles", v, setNanoParticles)
              }
              data-ocid="settings.particles.switch"
            />
          </SettingRow>
          <SettingRow
            label="Sidebar Collapsed by Default"
            description="Start with the sidebar minimized to give more room to the main content area"
            divider={false}
          >
            <Switch
              checked={sidebarCollapsed}
              onCheckedChange={(v) =>
                toggle("netra_sidebar_collapsed", v, setSidebarCollapsed)
              }
              data-ocid="settings.sidebar_collapsed.switch"
            />
          </SettingRow>
        </Section>

        {/* ── Security ── */}
        <Section
          icon={<Shield className="w-3.5 h-3.5" />}
          title="VYAN Security"
          ocid="settings.security.section"
          index={3}
        >
          <div className="py-3">
            <div
              className="rounded-xl p-4 flex items-center gap-3"
              style={{
                background:
                  "linear-gradient(135deg, rgba(11,46,92,0.4), rgba(74,26,107,0.3))",
                border: "1px solid rgba(91,157,255,0.15)",
              }}
            >
              <Shield className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-mono text-[rgba(232,232,255,0.7)]">
                  VYAN Security · Direct Admin Access
                </p>
                <p className="text-[10px] font-mono text-[rgba(232,232,255,0.35)] mt-0.5">
                  {/* Firebase integration will be linked here by VYAN */}
                  Firebase auth integration pending — open access mode active
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Linked Applications ── */}
        <Section
          icon={<Link2 className="w-3.5 h-3.5" />}
          title="Linked Applications"
          ocid="settings.linked_apps.section"
          index={4}
        >
          <div className="py-3">
            <div
              className="rounded-xl p-4 flex items-center justify-between gap-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(11,46,92,0.4), rgba(74,26,107,0.3))",
                border: "1px solid rgba(91,157,255,0.15)",
              }}
            >
              <div className="min-w-0">
                <p className="text-xs font-mono text-[rgba(232,232,255,0.7)]">
                  Connect VYAN ecosystem apps via 6-digit App Code
                </p>
                <p className="text-[10px] font-mono text-[rgba(232,232,255,0.35)] mt-0.5">
                  Register, monitor and route admin queries to linked apps
                </p>
              </div>
              <a
                href="/apps"
                className="flex-shrink-0 inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-[rgba(91,157,255,0.12)]"
                style={{
                  background: "rgba(91,157,255,0.08)",
                  border: "1px solid rgba(91,157,255,0.25)",
                  color: "rgba(91,157,255,0.9)",
                }}
                data-ocid="settings.apps.link"
              >
                <ExternalLink className="w-3 h-3" /> Manage
              </a>
            </div>
          </div>
        </Section>

        {/* ── Zoho Email ── */}
        <Section
          icon={<Mail className="w-3.5 h-3.5" />}
          title="Zoho Email"
          ocid="settings.zoho.section"
          index={5}
        >
          <ZohoConfigForm />
        </Section>

        {/* ── About ── */}
        <Section
          icon={<Info className="w-3.5 h-3.5" />}
          title="About"
          ocid="settings.about.section"
          index={6}
        >
          <div className="py-1">
            {/* VYAN Netra brand block */}
            <div
              className="rounded-xl p-4 mb-4 mt-3 flex items-center gap-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(11,46,92,0.5), rgba(74,26,107,0.4))",
                border: "1px solid rgba(91,157,255,0.15)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(91,157,255,0.12)",
                  border: "1px solid rgba(91,157,255,0.25)",
                }}
              >
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-display font-bold text-[#E8E8FF]">
                  <span className="text-blue-400">VYAN</span>{" "}
                  <span className="text-purple-300">Netra</span>
                </p>
                <p className="text-[10px] font-mono text-[rgba(232,232,255,0.4)] mt-0.5">
                  Unified admin control for the VYAN ecosystem
                </p>
              </div>
              <span
                className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  background: "rgba(52,211,153,0.1)",
                  color: "#34D399",
                  border: "1px solid rgba(52,211,153,0.2)",
                }}
              >
                v1.0.0
              </span>
            </div>

            <div className="space-y-0.5 divide-y divide-[rgba(91,157,255,0.07)]">
              <InfoRow label="Product" value="VYAN Netra" />
              <InfoRow label="Company" value="VYAN" />
              <InfoRow label="Ecosystem" value="VYAN Ecosystem" />
              <InfoRow label="Version" value="v1.0.0" />
              <InfoRow label="Security" value="VYAN Security" />
            </div>

            <p className="text-[10px] font-mono text-[rgba(232,232,255,0.2)] text-center mt-4 pb-3">
              All your products, users, systems and emails — controlled from one
              void.
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
}
