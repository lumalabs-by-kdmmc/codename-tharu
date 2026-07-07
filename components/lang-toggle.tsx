"use client";

import { cn } from "@/lib/utils";

export function LangToggle({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { code: string; label: string }[];
}) {
  return (
    <div className="inline-flex gap-0.5 rounded-full border border-gold/20 bg-black/25 p-1">
      {options.map((o) => (
        <button
          key={o.code}
          type="button"
          onClick={() => onChange(o.code)}
          className={cn(
            "rounded-full px-3 py-1 text-sm font-semibold transition-colors",
            value === o.code
              ? "bg-gradient-to-br from-gold to-gold-2 text-[#241a05]"
              : "text-muted hover:text-gold-soft"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
