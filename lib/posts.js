import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentRoot = path.join(process.cwd(), "content");
const languages = ["en", "zh", "es", "fr", "de"];
const postsPerPage = 10;

export function getAllLanguages() {
  return languages;
}

export function getPostsPerPage() {
  return postsPerPage;
}

function parseDate(value) {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getPostFiles(lang) {
  const langDir = path.join(contentRoot, lang);
  if (!fs.existsSync(langDir)) return [];
  return fs.readdirSync(langDir).filter((file) => file.endsWith(".md"));
}

function normalizeSlug(slug) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export function getAllPosts(lang) {
  const files = getPostFiles(lang);
  const posts = files.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(contentRoot, lang, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    return {
      slug,
      lang: data.lang || lang,
      title: data.title || slug,
      description: data.description || "",
      publishDate: data.publishDate || data.date || "",
      tags: data.tags || [],
      coverImage: data.coverImage || null,
      content
    };
  });
  return posts.sort((a, b) => parseDate(b.publishDate) - parseDate(a.publishDate));
}

export function getPostBySlug(lang, slug) {
  const normalizedSlug = normalizeSlug(slug);
  const fullPath = path.join(contentRoot, lang, `${normalizedSlug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  return {
    slug: normalizedSlug,
    lang: data.lang || lang,
    title: data.title || normalizedSlug,
    description: data.description || "",
    publishDate: data.publishDate || data.date || "",
    tags: data.tags || [],
    coverImage: data.coverImage || null,
    content
  };
}

export function getAllSlugs() {
  return languages.flatMap((lang) =>
    getPostFiles(lang).map((fileName) => ({
      lang,
      slug: fileName.replace(/\.md$/, "")
    }))
  );
}

export function getPaginatedPosts(lang, page) {
  const all = getAllPosts(lang);
  const totalPages = Math.max(1, Math.ceil(all.length / postsPerPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * postsPerPage;
  return {
    posts: all.slice(start, start + postsPerPage),
    totalPages,
    currentPage
  };
}

export function getPostAlternates(slug) {
  const alternates = {};
  languages.forEach((lang) => {
    const normalizedSlug = normalizeSlug(slug);
    const fullPath = path.join(contentRoot, lang, `${normalizedSlug}.md`);
    if (fs.existsSync(fullPath)) {
      alternates[lang] = normalizedSlug;
    }
  });
  return alternates;
}

export function formatDateByLocale(dateString, locale) {
  const timestamp = Date.parse(dateString);
  if (Number.isNaN(timestamp)) return dateString;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(new Date(timestamp));
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://www.dailywelloo.com";
}
