import Link from "next/link";

export const metadata = {
  title: "隐私政策"
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">隐私政策</h1>
        <Link href="/en" className="text-sm text-slate-500 hover:text-slate-700">
          返回首页
        </Link>
      </div>
      <div className="space-y-4 text-base leading-7 text-slate-700 dark:text-slate-200">
        <p>我们尊重并保护用户隐私。网站可能使用第三方服务（如广告与分析）。</p>
        <p>这些服务可能会使用 Cookie 或类似技术收集匿名数据以提供更相关的内容与广告。</p>
        <p>我们不会主动收集可识别个人身份的信息。</p>
        <p>如有疑问，请通过站点提供的联系方式与我们联系。</p>
      </div>
    </main>
  );
}
