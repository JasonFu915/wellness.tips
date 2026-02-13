import { getSiteUrl } from "../lib/posts";

export default function manifest() {
  return {
    name: 'Daily Health Tips',
    short_name: 'Health Tips',
    description: 'Science-backed daily health tips for better sleep, nutrition, and wellbeing.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
