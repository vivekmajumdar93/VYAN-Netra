import type { CSSProperties } from "react";

export const DIALOG_STYLE: CSSProperties = {
  background: "rgba(8,14,35,0.97)",
  border: "1px solid rgba(91,157,255,0.2)",
  backdropFilter: "blur(20px)",
};

export const FIELD_CLASS =
  "bg-[rgba(255,255,255,0.04)] border-[rgba(91,157,255,0.18)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.25)] font-mono text-sm focus:border-blue-500/50";

export const LABEL_CLASS =
  "text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-wider";

export const PRIMARY_BUTTON_CLASS =
  "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 font-mono text-sm shadow-[0_4px_20px_rgba(91,157,255,0.25)]";
