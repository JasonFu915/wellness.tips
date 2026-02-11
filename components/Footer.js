export default function Footer({ lang }) {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-900 py-12 text-sm text-slate-400">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
            <span className="font-semibold text-slate-200">Daily Health Tips</span>
            <span>© {year} All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-white">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-white">Terms of Service</a>
            <a href="#" className="transition-colors hover:text-white">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
