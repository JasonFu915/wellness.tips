import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getAllPosts } from "../../lib/posts";

export default function LangLayout({ children, params }) {
  const posts = getAllPosts(params.lang).map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    tags: post.tags
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Header lang={params.lang} posts={posts} />
      <main className="flex-1">
        {children}
      </main>
      <Footer lang={params.lang} />
    </div>
  );
}
