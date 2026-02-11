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
    
    // If we are on a detail page (path depth > 1 e.g. /en/slug), 
    // it is safer to redirect to the home page of the new language
    // because the slug might not exist or be different in the new language.
    if (segments.length > 1) {
      router.push(`/${nextLang}`);
      return;
    }

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
        className="appearance-none cursor-pointer rounded-full border border-slate-200 bg-white/50 py-1.5 pl-4 pr-8 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-primary-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        value={currentLang}
        onChange={handleChange}
        aria-label="Select Language"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}
