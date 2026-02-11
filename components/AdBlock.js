"use client";

import { useEffect } from "react";

export default function AdBlock({ slot, enabled, client, format = "auto", label = "Advertisement", className = "" }) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    window.adsbygoogle = window.adsbygoogle || [];
    try {
      window.adsbygoogle.push({});
    } catch (error) {
      console.error("AdSense push error", error);
    }
  }, [enabled, slot]);

  if (!enabled) return null;

  return (
    <div className={`overflow-hidden rounded-xl bg-slate-50 text-center ${className}`}>
      <div className="py-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">
        {label}
      </div>
      <div className="flex justify-center pb-2">
         {/* AdSense Unit */}
         <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%" }}
            data-ad-client={client}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
      </div>
      {/* Fallback visual for development (when no ad loads) */}
      <div className="hidden h-32 items-center justify-center border-2 border-dashed border-slate-200 text-sm text-slate-400 empty:flex">
         Ad Space ({format})
      </div>
    </div>
  );
}
