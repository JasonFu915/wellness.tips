import Link from "next/link";
import Image from "next/image";
import AdBlock from "../../../components/AdBlock";
import Sidebar from "../../../components/Sidebar";
import { markdownToHtml, extractFAQ } from "../../../lib/markdown";
import { buildCover } from "../../../lib/utils";
import {
  formatDateByLocale,
  getAllSlugs,
  getAllPosts,
  getPostBySlug,
  getSiteUrl,
  getPostAlternates,
  getRelatedPosts
} from "../../../lib/posts";

export async function generateStaticParams() {
  return getAllSlugs();
}

export async function generateMetadata({ params }) {
  const post = getPostBySlug(params.lang, params.slug);
  if (!post) {
      return {};
  }
  
  const siteUrl = getSiteUrl();
  const alternatesMap = getPostAlternates(params.slug);
  const languages = {};
  
  Object.keys(alternatesMap).forEach(lang => {
      languages[lang] = `${siteUrl}/${lang}/${alternatesMap[lang]}`;
  });

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${siteUrl}/${params.lang}/${params.slug}`,
      languages: languages
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      images: [post.coverImage || buildCover(post.title, true)]
    }
  };
}

function splitHtml(html) {
  const parts = html.split("</p>");
  if (parts.length <= 2) {
    return { first: html, second: "" };
  }
  const middle = Math.ceil(parts.length / 2);
  const first = parts.slice(0, middle).join("</p>") + "</p>";
  const second = parts.slice(middle).join("</p>");
  return { first, second };
}

const backLabels = {
  en: "Back to Home",
  zh: "返回首页",
  es: "Volver al Inicio",
  fr: "Retour à l'accueil",
  de: "Zurück zur Startseite"
};

import { notFound } from "next/navigation";

export default async function PostDetailPage({ params }) {
  const post = getPostBySlug(params.lang, params.slug);
  
  if (!post) {
    notFound();
  }

  const html = await markdownToHtml(post.content);
  const { first, second } = splitHtml(html);
  const siteUrl = getSiteUrl();
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT || "";
  const adsEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" && adClient;

  // Get related posts for sidebar
  const sidebarPosts = getRelatedPosts(params.lang, params.slug, post.tags, 5)
    .map(p => ({
      slug: p.slug,
      title: p.title,
      coverImage: p.coverImage
    }));

  const faqs = extractFAQ(post.content);
  let faqSchema = null;
  if (faqs.length > 0) {
      faqSchema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(f => ({
              "@type": "Question",
              "name": f.question,
              "acceptedAnswer": {
                  "@type": "Answer",
                  "text": f.answer
              }
          }))
      };
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishDate,
    inLanguage: post.lang,
    mainEntityOfPage: `${siteUrl}/${params.lang}/${params.slug}`,
    image: post.coverImage || buildCover(post.title, true)
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": `${siteUrl}/${params.lang}`
    }, {
      "@type": "ListItem",
      "position": 2,
      "name": post.title,
      "item": `${siteUrl}/${params.lang}/${params.slug}`
    }]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Daily Health Tips",
    url: siteUrl
  };

  const shareLabels = {
    en: "Share this tip with friends and family",
    zh: "与亲朋好友分享这条健康贴士",
    es: "Comparte este consejo con amigos y familiares",
    fr: "Partagez ce conseil avec vos amis et votre famille",
    de: "Teilen Sie diesen Tipp mit Freunden und Familie"
  };

  const summaryLabels = {
    en: "TL;DR - Quick Summary",
    zh: "文章摘要 (TL;DR)",
    es: "Resumen Rápido",
    fr: "Résumé Rapide",
    de: "Zusammenfassung"
  };

  return (
    <div className="bg-slate-50 pb-20 pt-8">
      <div className="container mx-auto max-w-7xl px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
        {/* Breadcrumb & Back Link */}
        <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
          <Link href={`/${params.lang}`} className="hover:text-primary-600 transition-colors">
            {backLabels[params.lang] || backLabels.en}
          </Link>
          <span className="text-slate-300">/</span>
          <span className="truncate max-w-[200px] text-slate-400">{post.title}</span>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Main Content Column */}
        <main className="lg:col-span-8">
            <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
              {/* Cover Image */}
              <div className="relative aspect-video w-full bg-slate-100">
                <Image
                  src={post.coverImage || buildCover(post.title, false)}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 66vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white">
                   <div className="mb-4 flex flex-wrap gap-2">
                      {post.tags && post.tags.map(tag => (
                        <Link 
                          key={tag} 
                          href={`/${params.lang}/tags/${encodeURIComponent(tag)}`}
                          className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-md hover:bg-white/30 transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                   </div>
                   <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                     {post.title}
                   </h1>
                   <div className="flex items-center gap-4 text-sm font-medium text-white/90">
                     <time dateTime={post.publishDate}>
                       {formatDateByLocale(post.publishDate, params.lang)}
                     </time>
                     <span>•</span>
                     <span>Health Tips</span>
                   </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="px-6 py-10 md:px-10 md:py-12">
                {post.summary && (
                  <div className="mb-10 rounded-2xl bg-blue-50/50 p-6 ring-1 ring-blue-100 lg:p-8">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-blue-900">
                      <span className="text-xl">⚡</span>
                      {summaryLabels[params.lang] || summaryLabels.en}
                    </h3>
                    <div className="whitespace-pre-line text-base leading-relaxed text-blue-800/80 font-medium">
                      {post.summary}
                    </div>
                  </div>
                )}

                <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600 prose-a:text-primary-600 hover:prose-a:text-primary-500 prose-img:rounded-2xl prose-strong:text-slate-800">
                  <div dangerouslySetInnerHTML={{ __html: first }} />
                  
                  {/* In-Article Ad */}
                  {adsEnabled && (
                    <div className="my-10">
                      <AdBlock 
                        client={adClient} 
                        slot={adSlot} 
                        enabled={true} 
                        format="fluid"
                        label="Sponsored"
                        className="mx-auto max-w-2xl bg-slate-50"
                      />
                    </div>
                  )}
                  
                  <div dangerouslySetInnerHTML={{ __html: second }} />
                </div>

                {/* Article Footer / Share Placeholder */}
                <div className="mt-12 border-t border-slate-100 pt-8">
                   <p className="text-center text-sm text-slate-400">
                     {shareLabels[params.lang] || shareLabels.en}
                   </p>
                   {/* Add share buttons here in future */}
                </div>
              </div>
            </article>

            {/* Bottom Ad (Optional) */}
            {adsEnabled && (
              <div className="mt-8">
                <AdBlock 
                  client={adClient} 
                  slot={adSlot} 
                  enabled={true} 
                  format="auto" 
                  className="bg-transparent shadow-none"
                />
              </div>
            )}
          </main>

          {/* Sidebar Column */}
          <div className="lg:col-span-4">
            <Sidebar 
              lang={params.lang} 
              posts={sidebarPosts} 
              adClient={adClient} 
              adSlot={adSlot} 
              adsEnabled={adsEnabled} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
