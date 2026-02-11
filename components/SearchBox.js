"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import Link from "next/link";

export default function SearchBox({ posts, lang, variant = "default", placeholder }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const fuse = useMemo(() => {
    return new Fuse(posts, {
      keys: ["title", "description", "tags"],
      threshold: 0.3
    });
  }, [posts]);

  const results = useMemo(() => {
    return query ? fuse.search(query).slice(0, 8) : [];
  }, [query, fuse]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = () => {
    if (query) setIsOpen(true);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const isHeader = variant === "header";

  return (
    <div ref={containerRef} className={`relative ${isHeader ? "w-full md:w-64" : "w-full"}`}>
      <div className="relative">
        <input
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={placeholder || (isHeader ? "Search..." : "搜索健康贴士...")}
          className={`w-full transition-all duration-200 outline-none placeholder:text-slate-400
            ${isHeader 
              ? "rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
              : "rounded-2xl border-2 border-slate-100 bg-white py-4 pl-12 pr-6 text-lg shadow-sm hover:border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
            }`}
        />
        <div className={`absolute left-3 text-slate-400 pointer-events-none ${isHeader ? "top-2.5" : "top-5"}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={isHeader ? "w-4 h-4" : "w-6 h-6"}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full origin-top-right rounded-xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-black/5">
          <div className="flex flex-col gap-1">
            {results.map((result) => (
              <Link
                key={result.item.slug}
                href={`/${lang}/${result.item.slug}`}
                onClick={() => setIsOpen(false)}
                className="group flex flex-col gap-0.5 rounded-lg px-3 py-2 transition-colors hover:bg-primary-50"
              >
                <span className="font-medium text-slate-700 group-hover:text-primary-700">
                  {result.item.title}
                </span>
                {!isHeader && (
                   <span className="line-clamp-1 text-xs text-slate-500 group-hover:text-primary-600/70">
                     {result.item.description}
                   </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
