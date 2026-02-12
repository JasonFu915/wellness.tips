import Link from "next/link";
import FeaturedPosts from "../../components/FeaturedPosts";
import SearchBox from "../../components/SearchBox";
import { getAllLanguages, getAllPosts } from "../../lib/posts";

const labels = {
  en: {
    headline: "Daily Health Tips",
    subhead: "Science-backed tips for better sleep, nutrition, and wellbeing.",
    recommended: "Recommended For You",
    searchPlaceholder: "Search health tips...",
    dailyUpdates: "Daily Updates",
    viewAll: "View All Tips"
  },
  zh: {
    headline: "健康小贴士",
    subhead: "每日科学健康建议，涵盖睡眠、饮食与心理。",
    recommended: "精选推荐",
    searchPlaceholder: "搜索健康贴士...",
    dailyUpdates: "每日更新",
    viewAll: "查看所有贴士"
  },
  es: {
    headline: "Consejos de Salud",
    subhead: "Consejos diarios sobre sueño, nutrición y bienestar.",
    recommended: "Recomendado",
    searchPlaceholder: "Buscar consejos...",
    dailyUpdates: "Actualizaciones Diarias",
    viewAll: "Ver Todos los Consejos"
  },
  fr: {
    headline: "Conseils Santé",
    subhead: "Conseils quotidiens sur le sommeil, la nutrition et le bien-être.",
    recommended: "Recommandé",
    searchPlaceholder: "Rechercher...",
    dailyUpdates: "Mises à jour Quotidiennes",
    viewAll: "Voir Tous les Conseils"
  },
  de: {
    headline: "Gesundheitstipps",
    subhead: "Tägliche Tipps zu Schlaf, Ernährung und Wohlbefinden.",
    recommended: "Empfohlen",
    searchPlaceholder: "Suchen...",
    dailyUpdates: "Tägliche Updates",
    viewAll: "Alle Tipps Ansehen"
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

// 配置首页显示的帖子数量
const HOME_POST_COUNT = 9;

export default function LangHomePage({ params }) {
  const allPosts = getAllPosts(params.lang);
  const featured = allPosts.slice(0, HOME_POST_COUNT); // Show configured posts
  const text = labels[params.lang] || labels.en;

  const searchPosts = allPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    tags: post.tags
  }));

  return (
    <div className="flex flex-col pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-24 sm:pt-32 sm:pb-32">
        {/* Decorative Background Blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-secondary-100/50 blur-3xl mix-blend-multiply opacity-70"></div>
          <div className="absolute -right-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-primary-100/50 blur-3xl mix-blend-multiply opacity-70"></div>
          <div className="absolute bottom-[-10%] left-[20%] h-[300px] w-[300px] rounded-full bg-accent-100/40 blur-3xl mix-blend-multiply opacity-60"></div>
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-sm text-primary-700">
            <span className="mr-2 flex h-2 w-2 rounded-full bg-primary-500"></span>
            {text.dailyUpdates} 
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            {text.headline}
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 sm:text-xl">
            {text.subhead}
          </p>
          <div className="mx-auto max-w-xl">
            <SearchBox posts={searchPosts} lang={params.lang} variant="default" placeholder={text.searchPlaceholder} />
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto -mt-10 px-4">
        <div className="mb-10 flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-900">{text.recommended}</h2>
          <div className="h-px flex-1 bg-slate-200"></div>
        </div>
        <FeaturedPosts posts={featured} lang={params.lang} />
        
        {/* View All Button */}
        <div className="mt-12 flex justify-center">
          <Link 
            href={`/${params.lang}/archive`}
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-3 text-base font-medium text-slate-700 shadow-sm transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
          >
            {text.viewAll}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 transition-transform group-hover:translate-x-1">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
