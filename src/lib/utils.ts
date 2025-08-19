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
  
  // Enhanced URL extraction for comprehensive link detection
  const urlRegex = /(https?:\/\/[^\s\)\]\,\;]+)|www\.[^\s\)\]\,\;]+/gi;
  const matches = description.match(urlRegex) || [];
  
  // Add https:// to www links that don't have protocol
  const links: string[] = matches.map(link => {
    if (link.toLowerCase().startsWith('www.') && !link.toLowerCase().startsWith('http')) {
      return 'https://' + link;
    }
    return link;
  });
  
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
    if (sentence.length > 20 && sentence.length < 150) score += 1;
    
    return { sentence, score };
  });
  
  // Filter out negative scored sentences and sort by score
  const validSentences = scoredSentences
    .filter(item => item.score >= 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.sentence);
  
  // Select best sentences for 2-line max summary
  const selectedSentences = validSentences.length > 0 ? validSentences : sentences;
  
  // Build summary with 2-line constraint (approximately 160 characters max)
  let summary = "";
  let charCount = 0;
  const maxChars = 160;
  
  for (const sentence of selectedSentences.slice(0, 2)) {
    const proposedSummary = summary ? `${summary} ${sentence}` : sentence;
    if (proposedSummary.length <= maxChars) {
      summary = proposedSummary;
      charCount = summary.length;
    } else {
      // If adding this sentence exceeds limit, try just the first sentence if we have none
      if (!summary && sentence.length <= maxChars) {
        summary = sentence;
      }
      break;
    }
  }
  
  // If we still don't have a good summary, try to extract first meaningful sentence from original
  if (!summary && sentences.length > 0) {
    const firstSentence = sentences[0];
    if (firstSentence.length <= maxChars) {
      summary = firstSentence;
    } else {
      // Truncate first sentence to fit 2 lines
      summary = firstSentence.substring(0, maxChars - 3) + "...";
    }
  }
  
  // Ensure proper sentence ending
  if (summary && !summary.match(/[.!]$/)) {
    summary += '.';
  }
  
  return { 
    text: summary || "Alert information unavailable - check links below for details.",
    links: links
  };
}
