import Link from "next/link";

export default function Pagination({ currentPage, totalPages, lang }) {
  if (totalPages <= 1) return null;

  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  const getPageUrl = (page) => {
    if (page === 1) return `/${lang}/archive`;
    return `/${lang}/archive/page/${page}`;
  };

  const labels = {
    en: { prev: "Previous", next: "Next" },
    zh: { prev: "上一页", next: "下一页" },
    es: { prev: "Anterior", next: "Siguiente" },
    fr: { prev: "Précédent", next: "Suivant" },
    de: { prev: "Zurück", next: "Weiter" }
  };

  const text = labels[lang] || labels.en;

  return (
    <div className="mt-12 flex justify-center gap-4">
      {prevPage >= 1 && (
        <Link
          href={getPageUrl(prevPage)}
          className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
        >
          &larr; {text.prev}
        </Link>
      )}
      
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
              currentPage === page
                ? "bg-primary-600 text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      {nextPage <= totalPages && (
        <Link
          href={getPageUrl(nextPage)}
          className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 transition-colors"
        >
          {text.next} &rarr;
        </Link>
      )}
    </div>
  );
}
