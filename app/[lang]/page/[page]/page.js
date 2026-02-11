import Link from "next/link";
import LanguageSwitcher from "../../../../components/LanguageSwitcher";
import SearchBox from "../../../../components/SearchBox";
import {
  formatDateByLocale,
  getAllLanguages,
  getAllPosts,
  getPaginatedPosts,
  getPostsPerPage
} from "../../../../lib/posts";

const labels = {
  en: { latest: "Latest Posts", search: "Quick Search" },
  zh: { latest: "最新文章", search: "快速搜索" },
  es: { latest: "Artículos recientes", search: "Búsqueda rápida" },
  fr: { latest: "Articles récents", search: "Recherche rapide" },
  de: { latest: "Neueste Beiträge", search: "Schnellsuche" }
};

export async function generateStaticParams() {
  return getAllLanguages().flatMap((lang) => {
    const { totalPages } = getPaginatedPosts(lang, 1);
    return Array.from({ length: totalPages }, (_, index) => ({
      lang,
      page: String(index + 1)
    })).filter((item) => item.page !== "1");
  });
}

export async function generateMetadata({ params }) {
  const text = labels[params.lang] || labels.en;
  return {
    title: `${text.latest} - Page ${params.page}`,
    alternates: {
      canonical: `/${params.lang}/page/${params.page}`
    }
  };
}

export default function PaginatedPage({ params }) {
  const pageNumber = Number(params.page);
  const { posts, totalPages, currentPage } = getPaginatedPosts(
    params.lang,
    pageNumber
  );
  const allPosts = getAllPosts(params.lang);
  const text = labels[params.lang] || labels.en;
  const perPage = getPostsPerPage();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{text.latest}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {currentPage} / {totalPages} · {perPage} 篇/页
          </p>
        </div>
        <LanguageSwitcher />
      </header>

      <div className="mt-6">
        <h2 className="mb-3 text-lg font-semibold">{text.search}</h2>
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

      <section className="mt-8 space-y-4">
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
      </section>

      <nav className="mt-8 flex items-center justify-between">
        <Link
          href={
            currentPage <= 2
              ? `/${params.lang}`
              : `/${params.lang}/page/${currentPage - 1}`
          }
          className={`rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 ${
            currentPage === 1 ? "pointer-events-none opacity-50" : ""
          }`}
        >
          上一页
        </Link>
        <Link
          href={`/${params.lang}/page/${currentPage + 1}`}
          className={`rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 ${
            currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
          }`}
        >
          下一页
        </Link>
      </nav>
    </main>
  );
}
