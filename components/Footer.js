import Link from "next/link";

const labels = {
  en: { privacy: "Privacy Policy", email: "Email Us" },
  zh: { privacy: "隐私政策", email: "联系我们" },
  es: { privacy: "Política de Privacidad", email: "Contáctenos" },
  fr: { privacy: "Politique de Confidentialité", email: "Contactez-nous" },
  de: { privacy: "Datenschutz", email: "Kontakt" }
};

export default function Footer({ lang }) {
  const year = new Date().getFullYear();
  const text = labels[lang] || labels.en;
  
  return (
    <footer className="bg-slate-900 py-12 text-sm text-slate-400">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
            <span className="font-semibold text-slate-200">Daily Health Tips</span>
            <span>© {year} All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="transition-colors hover:text-white">
              {text.privacy}
            </Link>
            <a href="mailto:jinsong915@gmail.com" className="transition-colors hover:text-white">
              {text.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
