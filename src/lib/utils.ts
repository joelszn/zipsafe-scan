import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function processAlertDescription(description: string): string {
  if (!description) return "";
  
  // Split into sentences
  const sentences = description.split(/[.!]\s+/).filter(s => s.trim().length > 0);
  
  // Priority keywords for actionable information
  const priorityKeywords = ['expect', 'conditions', 'impacts', 'areas', 'through', 'until', 'possible', 'likely', 'continue'];
  
  // Find sentences with priority keywords
  const prioritySentences = sentences.filter(sentence => 
    priorityKeywords.some(keyword => sentence.toLowerCase().includes(keyword)) &&
    !sentence.toLowerCase().includes('pressure') &&
    !sentence.toLowerCase().includes('mb') &&
    sentence.length > 20
  );
  
  // Use priority sentences if found, otherwise use first sentences
  const selectedSentences = prioritySentences.length > 0 ? prioritySentences : sentences;
  
  // Return first 1-2 sentences, max 150 characters
  const result = selectedSentences.slice(0, 2).join('. ');
  return result.length > 150 ? result.substring(0, 147) + '...' : result;
}
