import Image from "next/image";
import Link from "next/link";
import { buildCover } from "../lib/utils";

export default function FeaturedPosts({ posts, lang }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/${lang}/${post.slug}`}
          className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={post.coverImage || buildCover(post.title)}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <div className="mb-3 flex gap-2">
              <span className="rounded-full bg-secondary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                Article
              </span>
            </div>
            <h3 className="mb-3 text-xl font-bold leading-tight text-slate-800 transition-colors group-hover:text-primary-700">
              {post.title}
            </h3>
            <p className="mb-4 flex-1 text-base text-slate-600 line-clamp-3">
              {post.description}
            </p>
            <div className="flex items-center text-sm font-medium text-primary-600">
              Read more 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
