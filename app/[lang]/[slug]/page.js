import Link from "next/link";
import AdBlock from "../../../components/AdBlock";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import { markdownToHtml } from "../../../lib/markdown";
import {
  formatDateByLocale,
  getAllSlugs,
  getPostBySlug,
  getSiteUrl
} from "../../../lib/posts";

export async function generateStaticParams() {
  return getAllSlugs();
}

export async function generateMetadata({ params }) {
  const post = getPostBySlug(params.lang, params.slug);
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/${params.lang}/${params.slug}`
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article"
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

export default async function PostDetailPage({ params }) {
  const post = getPostBySlug(params.lang, params.slug);
  const html = await markdownToHtml(post.content);
  const { first, second } = splitHtml(html);
  const siteUrl = getSiteUrl();
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adsEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" && adClient;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishDate,
    inLanguage: post.lang,
    mainEntityOfPage: `${siteUrl}/${params.lang}/${params.slug}`
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Daily Health Tips",
    url: siteUrl
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/${params.lang}`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: post.title,
        item: `${siteUrl}/${params.lang}/${params.slug}`
      }
    ]
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link href={`/${params.lang}`} className="text-sm text-slate-500">
          返回列表
        </Link>
        <LanguageSwitcher />
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <header className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold">{post.title}</h1>
          <p className="text-sm text-slate-500">
            {formatDateByLocale(post.publishDate, params.lang)}
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            {post.description}
          </p>
        </header>

        <AdBlock slot="0000000001" enabled={adsEnabled} client={adClient} />

        <div
          className="prose max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: first }}
        />

        <AdBlock slot="0000000002" enabled={adsEnabled} client={adClient} />

        {second && (
          <div
            className="prose max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: second }}
          />
        )}

        <AdBlock slot="0000000003" enabled={adsEnabled} client={adClient} />
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </main>
  );
}
