import "../globals.css";
import Script from "next/script";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getAllPosts, getSiteUrl } from "../../lib/posts";

export async function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'zh' },
    { lang: 'es' },
    { lang: 'fr' },
    { lang: 'de' },
  ];
}

export async function generateMetadata({ params }) {
  const siteUrl = getSiteUrl();
  const lang = params.lang;

  const descriptions = {
    en: "Science-backed daily health tips for better sleep, nutrition, and mental wellbeing.",
    zh: "科学、实用、每日更新的健康生活建议，涵盖睡眠、饮食与心理健康。",
    es: "Consejos diarios de salud respaldados por la ciencia para dormir mejor, nutrición y bienestar.",
    fr: "Conseils santé quotidiens validés par la science pour le sommeil, la nutrition et le bien-être.",
    de: "Wissenschaftlich fundierte tägliche Gesundheitstipps für besseren Schlaf, Ernährung und Wohlbefinden."
  };

  return {
    title: {
      default: "Daily Health Tips",
      template: "%s | Daily Health Tips"
    },
    description: descriptions[lang] || descriptions.en,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${lang}`,
      languages: {
        en: `${siteUrl}/en`,
        zh: `${siteUrl}/zh`,
        es: `${siteUrl}/es`,
        fr: `${siteUrl}/fr`,
        de: `${siteUrl}/de`,
      },
    },
  };
}

export default function RootLayout({ children, params }) {
  const { lang } = params;
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adsEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" && adClient;
  
  // Get recent posts for sidebar/header if needed (Header uses it for search or nav?)
  // Checking original app/[lang]/layout.js:
  // const posts = getAllPosts(params.lang).map(...)
  // Header receives `posts`.
  
  const posts = getAllPosts(lang).map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    tags: post.tags
  }));

  const gaId = "G-P5FSGK5QSV";

  return (
    <html lang={lang}>
      <head>
        {adsEnabled && (
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            strategy="afterInteractive"
            data-ad-client={adClient}
          />
        )}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}
        </Script>
      </head>
      <body className="antialiased">
        <div className="flex min-h-screen flex-col">
          <Header lang={lang} posts={posts} />
          <main className="flex-1">
            {children}
          </main>
          <Footer lang={lang} />
        </div>
      </body>
    </html>
  );
}
