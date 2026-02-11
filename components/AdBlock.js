"use client";

import { useEffect } from "react";

export default function AdBlock({ slot, enabled, client }) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    window.adsbygoogle = window.adsbygoogle || [];
    try {
      window.adsbygoogle.push({});
    } catch (error) {
      return;
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="my-6 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <p className="mt-3">广告位占位</p>
    </div>
  );
}
