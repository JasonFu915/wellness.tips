"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import Link from "next/link";

export default function SearchBox({ posts, lang }) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => {
    return new Fuse(posts, {
      keys: ["title", "description", "tags"],
      threshold: 0.3
    });
  }, [posts]);

  const results = query ? fuse.search(query).slice(0, 8) : [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-col gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索健康贴士..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((result) => (
              <Link
                key={result.item.slug}
                href={`/${lang}/${result.item.slug}`}
                className="block rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <div className="font-medium">{result.item.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {result.item.description}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
