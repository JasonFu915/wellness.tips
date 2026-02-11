import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold">页面不存在</h1>
      <p className="text-slate-600 dark:text-slate-300">请检查链接是否正确。</p>
      <Link
        href="/en"
        className="rounded-full bg-slate-900 px-5 py-2 text-white hover:bg-slate-700"
      >
        返回首页
      </Link>
    </div>
  );
}
