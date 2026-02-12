import FeaturedPosts from "../../../../components/FeaturedPosts";
import Pagination from "../../../../components/Pagination";
import { getAllLanguages, getAllPosts, getPaginatedPosts, getPostsPerPage } from "../../../../lib/posts";
import { notFound } from "next/navigation";

const labels = {
  en: {
    title: "All Health Tips",
    description: "Browse our complete collection of science-backed health tips.",
  },
  zh: {
    title: "所有健康贴士",
    description: "浏览我们完整的科学健康建议合集。",
  },
  es: {
    title: "Todos los Consejos",
    description: "Explore nuestra colección completa de consejos de salud respaldados por la ciencia.",
  },
  fr: {
    title: "Tous les Conseils",
    description: "Parcourez notre collection complète de conseils santé scientifiques.",
  },
  de: {
    title: "Alle Tipps",
    description: "Durchsuchen Sie unsere komplette Sammlung wissenschaftlich fundierter Gesundheitstipps.",
  }
};

export async function generateStaticParams() {
  const languages = getAllLanguages();
  const postsPerPage = getPostsPerPage();
  const params = [];

  for (const lang of languages) {
    const allPosts = getAllPosts(lang);
    const totalPages = Math.max(1, Math.ceil(allPosts.length / postsPerPage));
    
    // Generate params for page 2 to totalPages
    // Page 1 is handled by /archive/page.js
    for (let page = 2; page <= totalPages; page++) {
      params.push({
        lang,
        page: page.toString(),
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }) {
  const text = labels[params.lang] || labels.en;
  return {
    title: `${text.title} - Page ${params.page}`,
    description: text.description,
    alternates: {
      canonical: `/${params.lang}/archive/page/${params.page}`
    }
  };
}

export default function ArchivePaginationPage({ params }) {
  const page = parseInt(params.page);
  const { posts, totalPages, currentPage } = getPaginatedPosts(params.lang, page);

  // If page is invalid or out of range (though generateStaticParams handles this for static export),
  // for dynamic requests we should check.
  if (page < 2 || page > totalPages) {
    notFound();
  }

  const text = labels[params.lang] || labels.en;

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            {text.title}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {text.description}
          </p>
        </div>

        <FeaturedPosts posts={posts} lang={params.lang} />
        
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          lang={params.lang} 
        />
      </div>
    </div>
  );
}
