import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: {
    default: "Daily Health Tips",
    template: "%s | Daily Health Tips"
  },
  description: "科学、实用、每日更新的健康生活建议。",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://example.com")
};

export default function RootLayout({ children }) {
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adsEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" && adClient;
  return (
    <html lang="en">
      <head>
        {adsEnabled && (
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            strategy="afterInteractive"
            data-ad-client={adClient}
          />
        )}
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
