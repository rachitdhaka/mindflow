import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple ID generator for local fallback
export function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9);
}

// Parse tags from text (#tag1 #tag2)
export function extractTags(text: string): { tags: string[], cleanText: string } {
  const tagRegex = /#[\w-]+/g;
  const tags = text.match(tagRegex) || [];
  const cleanTags = tags.map(t => t.substring(1));
  const cleanText = text.replace(tagRegex, '').trim();
  
  return { tags: cleanTags, cleanText };
}

// Auto-detect type based on starting keywords
export function detectType(text: string): { type: 'idea' | 'task', content: string } {
  const taskKeywords = ['do ', 'complete ', 'watch ', 'learn ', 'build ', 'fix ', 'finish ', 'todo '];
  const lowerText = text.toLowerCase();
  
  for (const keyword of taskKeywords) {
    if (lowerText.startsWith(keyword)) {
      return { type: 'task', content: text };
    }
  }
  
  return { type: 'idea', content: text };
}
