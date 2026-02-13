import { remark } from "remark";
import html from "remark-html";

export async function markdownToHtml(markdown) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export function extractFAQ(markdown) {
  const lines = markdown.split('\n');
  const faqs = [];
  let inFaqSection = false;
  let faqHeaderLevel = 0;
  let currentQ = null;
  let currentA = [];

  // Regex for headers (e.g. ## Title)
  const headerRegex = /^(#{1,6})\s+(.+)$/;
  // Regex for FAQ title variants
  const faqTitleRegex = /^(?:FAQ|Frequently Asked Questions|Common Questions|Questions)/i;
  // Regex for headers that signal end of FAQ (even if nested)
  const endOfFaqRegex = /^(?:Conclusion|Summary|References|Sources|Footnotes|Final Thoughts|Takeaway)$/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const headerMatch = line.match(headerRegex);

    if (headerMatch) {
      const level = headerMatch[1].length;
      const text = headerMatch[2];

      if (!inFaqSection) {
        if (faqTitleRegex.test(text)) {
          inFaqSection = true;
          faqHeaderLevel = level;
        }
      } else {
        // We are in FAQ section
        if (level <= faqHeaderLevel) {
          // Found a header of same or higher importance -> End of FAQ section
          break;
        }
        
        if (endOfFaqRegex.test(text)) {
          // Found a section that clearly ends the FAQ part
          break;
        }
        
        // Found a sub-header -> Treat as Question
        if (currentQ) {
           faqs.push({ question: currentQ, answer: currentA.join('\n').trim() });
           currentA = [];
        }
        currentQ = text;
      }
    } else if (inFaqSection) {
       // Check for bold questions: **Question?**
       const boldMatch = line.match(/^\*\*(.+?)\*\*$/);
       if (boldMatch) {
           if (currentQ) {
               faqs.push({ question: currentQ, answer: currentA.join('\n').trim() });
               currentA = [];
           }
           currentQ = boldMatch[1];
       } else {
           if (currentQ) {
               currentA.push(line);
           }
       }
    }
  }
  
  if (currentQ) {
      faqs.push({ question: currentQ, answer: currentA.join('\n').trim() });
  }

  return faqs;
}
