import Image from "next/image";
import Link from "next/link";

function buildCover(title) {
  const text = encodeURIComponent(title);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#22c55e'/><stop offset='1' stop-color='#0ea5e9'/></linearGradient></defs><rect width='800' height='500' fill='url(#g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='32' fill='white' font-family='Arial, sans-serif'>${text}</text></svg>`;
  return `data:image/svg+xml;utf8,${svg}`;
}

export default function FeaturedPosts({ posts, lang }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/${lang}/${post.slug}`}
          className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900"
        >
          <Image
            src={buildCover(post.title)}
            alt={post.title}
            width={800}
            height={500}
            className="h-40 w-full object-cover"
            unoptimized
          />
          <div className="p-4">
            <h3 className="text-base font-semibold group-hover:text-green-600">
              {post.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {post.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
