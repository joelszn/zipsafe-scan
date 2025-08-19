import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ProcessedAlert {
  text: string;
  links: string[];
}

export function processAlertDescription(description: string): ProcessedAlert {
  if (!description) return { text: "", links: [] };
  
  // Extract URLs from description
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const links = description.match(urlRegex) || [];
  
  // Remove URLs from text for processing
  const textWithoutUrls = description.replace(urlRegex, '').trim();
  
  // Split into sentences
  const sentences = textWithoutUrls.split(/[.!]\s+/).filter(s => s.trim().length > 0);
  
  // Keywords for actionable and impactful information
  const actionKeywords = ['expect', 'conditions', 'impacts', 'areas', 'through', 'until', 'possible', 'likely', 'continue', 'affecting', 'begin', 'end', 'dangerous', 'avoid'];
  const timeKeywords = ['today', 'tonight', 'tomorrow', 'this', 'next', 'from', 'until', 'through'];
  const locationKeywords = ['county', 'counties', 'area', 'areas', 'region', 'portions', 'including'];
  
  // Score sentences based on relevance
  const scoredSentences = sentences.map(sentence => {
    let score = 0;
    const lowerSentence = sentence.toLowerCase();
    
    // Skip technical meteorological data
    if (lowerSentence.includes('mb') || lowerSentence.includes('pressure') || 
        lowerSentence.includes('wind speed') || lowerSentence.includes('barometric')) {
      return { sentence, score: -1 };
    }
    
    // Prioritize actionable information
    actionKeywords.forEach(keyword => {
      if (lowerSentence.includes(keyword)) score += 3;
    });
    
    // Prioritize timing information
    timeKeywords.forEach(keyword => {
      if (lowerSentence.includes(keyword)) score += 2;
    });
    
    // Prioritize location information
    locationKeywords.forEach(keyword => {
      if (lowerSentence.includes(keyword)) score += 1;
    });
    
    // Prefer sentences with reasonable length
    if (sentence.length > 20 && sentence.length < 200) score += 1;
    
    return { sentence, score };
  });
  
  // Filter out negative scored sentences and sort by score
  const validSentences = scoredSentences
    .filter(item => item.score >= 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.sentence);
  
  // Select best 1-2 sentences for summary
  const selectedSentences = validSentences.length > 0 ? validSentences : sentences;
  let summary = selectedSentences.slice(0, 2).join('. ');
  
  // Ensure proper sentence ending
  if (summary && !summary.match(/[.!]$/)) {
    summary += '.';
  }
  
  // Keep summary concise but complete
  if (summary.length > 200) {
    summary = selectedSentences[0];
    if (summary && !summary.match(/[.!]$/)) {
      summary += '.';
    }
  }
  
  return { 
    text: summary || "Weather alert issued for your area.",
    links: links
  };
}
