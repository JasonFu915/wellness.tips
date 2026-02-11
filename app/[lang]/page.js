import Link from "next/link";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import FeaturedPosts from "../../components/FeaturedPosts";
import SearchBox from "../../components/SearchBox";
import {
  formatDateByLocale,
  getAllLanguages,
  getAllPosts,
  getPaginatedPosts
} from "../../lib/posts";

const labels = {
  en: {
    headline: "Daily Health Tips",
    subhead: "Science-backed tips for better sleep, nutrition, and wellbeing.",
    recommended: "Recommended",
    latest: "Latest Posts",
    search: "Quick Search"
  },
  zh: {
    headline: "健康小贴士",
    subhead: "每日科学健康建议，涵盖睡眠、饮食与心理。",
    recommended: "置顶推荐",
    latest: "最新文章",
    search: "快速搜索"
  },
  es: {
    headline: "Consejos de Salud",
    subhead: "Consejos diarios sobre sueño, nutrición y bienestar.",
    recommended: "Recomendado",
    latest: "Artículos recientes",
    search: "Búsqueda rápida"
  },
  fr: {
    headline: "Conseils Santé",
    subhead: "Conseils quotidiens sur le sommeil, la nutrition et le bien-être.",
    recommended: "Recommandé",
    latest: "Articles récents",
    search: "Recherche rapide"
  },
  de: {
    headline: "Gesundheitstipps",
    subhead: "Tägliche Tipps zu Schlaf, Ernährung und Wohlbefinden.",
    recommended: "Empfohlen",
    latest: "Neueste Beiträge",
    search: "Schnellsuche"
  }
};

export async function generateStaticParams() {
  return getAllLanguages().map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const text = labels[params.lang] || labels.en;
  return {
    title: text.headline,
    description: text.subhead,
    alternates: {
      canonical: `/${params.lang}`
    }
  };
}

export default function LangHomePage({ params }) {
  const { posts, totalPages, currentPage } = getPaginatedPosts(params.lang, 1);
  const allPosts = getAllPosts(params.lang);
  const featured = allPosts.slice(0, 3);
  const text = labels[params.lang] || labels.en;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">{text.headline}</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              {text.subhead}
            </p>
          </div>
          <LanguageSwitcher />
        </div>
        <div>
          <h2 className="mb-3 text-xl font-semibold">{text.search}</h2>
          <SearchBox
            posts={allPosts.map((post) => ({
              slug: post.slug,
              title: post.title,
              description: post.description,
              tags: post.tags
            }))}
            lang={params.lang}
          />
        </div>
      </header>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">{text.recommended}</h2>
        <FeaturedPosts posts={featured} lang={params.lang} />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">{text.latest}</h2>
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/${params.lang}/${post.slug}`}
              className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {post.description}
                  </p>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDateByLocale(post.publishDate, params.lang)}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {currentPage} / {totalPages}
            </span>
            <Link
              href={`/${params.lang}/page/2`}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              下一页
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
