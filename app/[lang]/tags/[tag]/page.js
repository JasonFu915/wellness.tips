import { getAllLanguages, getAllTags, getPostsByTag, getSiteUrl } from "../../../../lib/posts";
import FeaturedPosts from "../../../../components/FeaturedPosts";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const languages = getAllLanguages();
  const params = [];
  
  languages.forEach((lang) => {
    const tags = getAllTags(lang);
    tags.forEach((tag) => {
      // We use the raw tag here, Next.js handles encoding
      // But for static generation, we need to be careful
      params.push({ lang, tag: encodeURIComponent(tag) });
    });
  });
  
  return params;
}

export async function generateMetadata({ params }) {
  const decodedTag = decodeURIComponent(params.tag);
  const siteUrl = getSiteUrl();
  
  return {
    title: `${decodedTag} - Health Tips`,
    description: `Read the latest health tips and articles about ${decodedTag}.`,
    alternates: {
      canonical: `${siteUrl}/${params.lang}/tags/${params.tag}`
    }
  };
}

const labels = {
  en: { title: "Tag: ", back: "Back to Home", empty: "No posts found." },
  zh: { title: "标签: ", back: "返回首页", empty: "未找到相关文章。" },
  es: { title: "Etiqueta: ", back: "Volver al Inicio", empty: "No se encontraron publicaciones." },
  fr: { title: "Étiquette: ", back: "Retour à l'accueil", empty: "Aucun article trouvé." },
  de: { title: "Tag: ", back: "Zurück zur Startseite", empty: "Keine Beiträge gefunden." }
};

export default function TagPage({ params }) {
  const decodedTag = decodeURIComponent(params.tag);
  const posts = getPostsByTag(params.lang, decodedTag);
  const text = labels[params.lang] || labels.en;

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Breadcrumb / Back Link */}
        <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
          <Link href={`/${params.lang}`} className="hover:text-primary-600 transition-colors">
            {text.back}
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-medium text-slate-700">Tags</span>
          <span className="text-slate-300">/</span>
          <span className="text-primary-600 font-medium">{decodedTag}</span>
        </div>

        <div className="mb-10 text-center">
           <span className="mb-2 inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-primary-700 tracking-wide uppercase">
             Topic
           </span>
           <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
             {text.title} <span className="text-primary-600">{decodedTag}</span>
           </h1>
        </div>

        <FeaturedPosts posts={posts} lang={params.lang} />
      </div>
    </div>
  );
}
