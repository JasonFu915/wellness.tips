import Link from "next/link";
import Image from "next/image";
import { buildCover } from "../lib/utils";
import AdBlock from "./AdBlock";

export default function Sidebar({ lang, posts, adClient, adSlot, adsEnabled }) {
  // Use first 5 posts as "Recent/Popular" for now
  const recentPosts = posts.slice(0, 5);

  const labels = {
    en: { recent: "Recent Tips", ad: "Advertisement" },
    zh: { recent: "最新贴士", ad: "广告" },
    es: { recent: "Consejos Recientes", ad: "Publicidad" },
    fr: { recent: "Conseils Récents", ad: "Publicité" },
    de: { recent: "Neueste Tipps", ad: "Anzeige" }
  };

  const text = labels[lang] || labels.en;

  return (
    <aside className="space-y-8">
      {/* About Widget */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Daily Health Tips</h3>
        </div>
        <p className="text-sm leading-relaxed text-slate-500">
          Science-backed tips for better sleep, nutrition, and mental wellbeing. Small habits, big changes.
        </p>
      </div>

      {/* Sticky Container */}
      <div className="sticky top-24 space-y-8">
        {/* Ad Widget */}
        {adsEnabled && (
          <AdBlock 
            client={adClient} 
            slot={adSlot} 
            enabled={true} 
            format="rectangle"
            label={text.ad}
            className="min-h-[250px] shadow-sm"
          />
        )}

        {/* Recent Posts Widget */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-slate-800">{text.recent}</h3>
          <div className="flex flex-col gap-4">
            {recentPosts.map((post) => (
              <Link key={post.slug} href={`/${lang}/${post.slug}`} className="group flex gap-3">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <Image
                    src={buildCover(post.title)}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="line-clamp-2 text-sm font-medium text-slate-700 transition-colors group-hover:text-primary-700">
                    {post.title}
                  </h4>
                  <span className="mt-1 text-xs text-slate-400">Read Now</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
