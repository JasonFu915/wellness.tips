import { NextResponse } from "next/server";

const supportedLanguages = ["en", "zh", "es", "fr", "de"];

function pickLanguage(acceptLanguage) {
  if (!acceptLanguage) return "en";
  const lower = acceptLanguage.toLowerCase();
  for (const lang of supportedLanguages) {
    if (lower.includes(lang)) return lang;
  }
  if (lower.includes("zh")) return "zh";
  return "en";
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  if (pathname !== "/") return NextResponse.next();
  const lang = pickLanguage(request.headers.get("accept-language"));
  return NextResponse.redirect(new URL(`/${lang}`, request.url));
}

export const config = {
  matcher: ["/"]
};
