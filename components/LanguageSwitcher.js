"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

const languages = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" }
];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLang = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments[0] || "en";
  }, [pathname]);

  const handleChange = (event) => {
    const nextLang = event.target.value;
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      router.push(`/${nextLang}`);
      return;
    }
    segments[0] = nextLang;
    router.push(`/${segments.join("/")}`);
  };

  return (
    <div className="relative">
      <select
        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        value={currentLang}
        onChange={handleChange}
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
    </div>
  );
}
