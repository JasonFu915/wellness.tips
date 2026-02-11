import {
  getAllLanguages,
  getAllSlugs,
  getPaginatedPosts,
  getSiteUrl
} from "../lib/posts";

export default function sitemap() {
  const siteUrl = getSiteUrl();
  const entries = [];

  getAllLanguages().forEach((lang) => {
    entries.push({
      url: `${siteUrl}/${lang}`,
      changefreq: "daily",
      priority: 0.9
    });
    const { totalPages } = getPaginatedPosts(lang, 1);
    for (let page = 2; page <= totalPages; page += 1) {
      entries.push({
        url: `${siteUrl}/${lang}/page/${page}`,
        changefreq: "daily",
        priority: 0.7
      });
    }
  });

  getAllSlugs().forEach((item) => {
    entries.push({
      url: `${siteUrl}/${item.lang}/${item.slug}`,
      changefreq: "weekly",
      priority: 0.8
    });
  });

  return entries;
}
