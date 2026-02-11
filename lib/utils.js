export function buildCover(title, withText = true) {
  const text = title.length > 20 ? title.substring(0, 20) + "..." : title;
  const textElement = withText 
    ? `<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='48' fill='white' font-weight='bold' font-family='sans-serif'>${text}</text>` 
    : '';
    
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop stop-color='#0f766e'/>
          <stop offset='1' stop-color='#14b8a6'/>
        </linearGradient>
      </defs>
      <rect width='800' height='450' fill='url(#g)'/>
      ${textElement}
    </svg>
  `.trim().replace(/\n/g, "");
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
