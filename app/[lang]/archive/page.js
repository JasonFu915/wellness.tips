import FeaturedPosts from "../../../components/FeaturedPosts";
import Pagination from "../../../components/Pagination";
import { getAllLanguages, getPaginatedPosts } from "../../../lib/posts";

const labels = {
  en: {
    title: "All Health Tips",
    description: "Browse our complete collection of science-backed health tips.",
    backToHome: "Back to Home"
  },
  zh: {
    title: "所有健康贴士",
    description: "浏览我们完整的科学健康建议合集。",
    backToHome: "返回首页"
  },
  es: {
    title: "Todos los Consejos",
    description: "Explore nuestra colección completa de consejos de salud respaldados por la ciencia.",
    backToHome: "Volver al Inicio"
  },
  fr: {
    title: "Tous les Conseils",
    description: "Parcourez notre collection complète de conseils santé scientifiques.",
    backToHome: "Retour à l'accueil"
  },
  de: {
    title: "Alle Tipps",
    description: "Durchsuchen Sie unsere komplette Sammlung wissenschaftlich fundierter Gesundheitstipps.",
    backToHome: "Zurück zur Startseite"
  }
};

export async function generateStaticParams() {
  return getAllLanguages().map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const text = labels[params.lang] || labels.en;
  return {
    title: text.title,
    description: text.description,
    alternates: {
      canonical: `/${params.lang}/archive`
    }
  };
}

export default function ArchivePage({ params }) {
  // Page 1
  const { posts, totalPages, currentPage } = getPaginatedPosts(params.lang, 1);
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
