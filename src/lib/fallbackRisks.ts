import { RiskItem } from "@/components/ui/RiskBar";

// State-based risk mappings for fallback when ZIP not in static data
const stateRiskProfiles: Record<string, RiskItem[]> = {
  // California - High earthquake, wildfire, heat
  CA: [
    { name: "earthquake", score: 74, why: "proximity to active fault systems" },
    { name: "wildfire", score: 62, why: "dry conditions and wildland interface" },
    { name: "heat", score: 58, why: "inland heat exposure and urban warming" }
  ],
  
  // Florida - High hurricane, flood, heat
  FL: [
    { name: "hurricane", score: 86, why: "Atlantic and Gulf Coast exposure" },
    { name: "flood", score: 73, why: "storm surge and heavy rainfall" },
    { name: "heat", score: 71, why: "subtropical climate and humidity" }
  ],
  
  // Texas - High heat, moderate flood, wind
  TX: [
    { name: "heat", score: 85, why: "hot summers and urban heat island effect" },
    { name: "flood", score: 48, why: "flash flooding and heavy rain events" },
    { name: "wind", score: 52, why: "severe thunderstorms and tornado activity" }
  ],
  
  // Louisiana - Very high flood, high hurricane
  LA: [
    { name: "flood", score: 92, why: "below sea level areas and storm surge" },
    { name: "hurricane", score: 83, why: "Gulf Coast tropical cyclone exposure" },
    { name: "heat", score: 75, why: "hot humid subtropical climate" }
  ],
  
  // New York - Moderate flood, wind, heat
  NY: [
    { name: "flood", score: 65, why: "coastal storms and heavy precipitation" },
    { name: "heat", score: 63, why: "urban heat island effect" },
    { name: "wind", score: 51, why: "nor'easters and winter storms" }
  ],
  
  // Alaska - High winter, moderate wind
  AK: [
    { name: "winter", score: 88, why: "extreme cold and heavy snowfall" },
    { name: "wind", score: 45, why: "Arctic storms and high winds" },
    { name: "flood", score: 35, why: "spring thaw and coastal flooding" }
  ],
  
  // Hawaii - Moderate earthquake, flood, wind
  HI: [
    { name: "earthquake", score: 55, why: "volcanic activity and seismic zones" },
    { name: "flood", score: 48, why: "tropical storms and heavy rainfall" },
    { name: "wind", score: 58, why: "tropical cyclones and trade winds" }
  ],
  
  // Colorado - High winter, moderate flood
  CO: [
    { name: "winter", score: 82, why: "mountain snowstorms and elevation" },
    { name: "wind", score: 59, why: "mountain winds and weather fronts" },
    { name: "flood", score: 44, why: "spring snowmelt and flash floods" }
  ],
  
  // Washington - Moderate earthquake, winter
  WA: [
    { name: "earthquake", score: 69, why: "Cascadia Subduction Zone proximity" },
    { name: "flood", score: 46, why: "heavy winter rains and urban runoff" },
    { name: "winter", score: 41, why: "occasional severe winter weather" }
  ],
  
  // Oregon - Moderate earthquake, wildfire
  OR: [
    { name: "earthquake", score: 67, why: "Cascadia Subduction Zone proximity" },
    { name: "wildfire", score: 48, why: "wildland interface in dry seasons" },
    { name: "winter", score: 39, why: "occasional ice storms and snow" }
  ],
  
  // Nevada - High heat, moderate earthquake
  NV: [
    { name: "heat", score: 89, why: "desert climate and extreme temperatures" },
    { name: "earthquake", score: 51, why: "Basin and Range seismic activity" },
    { name: "flood", score: 28, why: "flash floods in desert washes" }
  ],
  
  // Arizona - Very high heat, low flood
  AZ: [
    { name: "heat", score: 91, why: "extreme desert temperatures" },
    { name: "flood", score: 37, why: "monsoon flash floods" },
    { name: "wind", score: 31, why: "dust storms and microbursts" }
  ],
  
  // Oklahoma - High wind (tornadoes), moderate heat
  OK: [
    { name: "wind", score: 76, why: "tornado alley location and severe storms" },
    { name: "heat", score: 67, why: "hot summers and continental climate" },
    { name: "flood", score: 43, why: "flash flooding and heavy rainfall" }
  ],
  
  // Kansas - High wind (tornadoes), moderate heat
  KS: [
    { name: "wind", score: 74, why: "tornado activity and severe thunderstorms" },
    { name: "heat", score: 65, why: "hot continental climate" },
    { name: "winter", score: 49, why: "blizzards and ice storms" }
  ],
  
  // Nebraska - Moderate wind, winter
  NE: [
    { name: "wind", score: 68, why: "severe thunderstorms and tornado risk" },
    { name: "winter", score: 58, why: "blizzards and cold snaps" },
    { name: "flood", score: 41, why: "river flooding and heavy rain" }
  ],
  
  // Minnesota - High winter, moderate flood
  MN: [
    { name: "winter", score: 79, why: "severe cold and heavy snowfall" },
    { name: "flood", score: 54, why: "spring thaw and heavy precipitation" },
    { name: "wind", score: 42, why: "severe thunderstorms and derechos" }
  ],
  
  // Wisconsin - High winter, moderate flood
  WI: [
    { name: "winter", score: 76, why: "Great Lakes effect and polar vortex" },
    { name: "flood", score: 51, why: "heavy rainfall and snowmelt" },
    { name: "wind", score: 39, why: "severe thunderstorms" }
  ],
  
  // Illinois - Moderate winter, wind
  IL: [
    { name: "winter", score: 71, why: "Great Lakes effect and cold snaps" },
    { name: "flood", score: 56, why: "heavy rainfall and urban drainage" },
    { name: "wind", score: 47, why: "severe thunderstorms and derechos" }
  ],
  
  // Michigan - Moderate winter, flood
  MI: [
    { name: "winter", score: 73, why: "Great Lakes snow and cold weather" },
    { name: "flood", score: 49, why: "heavy rain and snowmelt flooding" },
    { name: "wind", score: 38, why: "severe thunderstorms" }
  ],
  
  // Puerto Rico - Very high hurricane, high heat, moderate flood
  PR: [
    { name: "hurricane", score: 94, why: "high exposure to Atlantic hurricanes and tropical storms" },
    { name: "heat", score: 78, why: "tropical climate with intense heat and humidity" },
    { name: "flood", score: 72, why: "mountainous terrain causing flash floods and storm surge" }
  ],
  
  // US Virgin Islands - Very high hurricane, high heat, moderate flood
  VI: [
    { name: "hurricane", score: 92, why: "Caribbean location with frequent hurricane exposure" },
    { name: "heat", score: 76, why: "tropical climate with consistent high temperatures" },
    { name: "flood", score: 68, why: "storm surge and heavy rainfall from tropical systems" }
  ],
  
  // Guam - Very high wind (typhoons), high heat, moderate earthquake
  GU: [
    { name: "wind", score: 89, why: "Western Pacific typhoon belt with frequent severe storms" },
    { name: "heat", score: 81, why: "tropical climate with year-round high temperatures" },
    { name: "earthquake", score: 58, why: "Pacific Ring of Fire seismic activity" }
  ],
  
  // American Samoa - High wind (cyclones), high heat, moderate earthquake
  AS: [
    { name: "wind", score: 84, why: "South Pacific cyclone season exposure" },
    { name: "heat", score: 79, why: "equatorial tropical climate" },
    { name: "earthquake", score: 52, why: "Pacific Ring of Fire volcanic and seismic activity" }
  ],
  
  // Northern Mariana Islands - Very high wind (typhoons), high heat, moderate earthquake
  MP: [
    { name: "wind", score: 87, why: "Western Pacific typhoon alley location" },
    { name: "heat", score: 80, why: "tropical marine climate with high humidity" },
    { name: "earthquake", score: 55, why: "Pacific volcanic arc seismic activity" }
  ],

  // Default fallback for other states
  DEFAULT: [
    { name: "heat", score: 55, why: "seasonal temperature extremes" },
    { name: "flood", score: 45, why: "potential for heavy rainfall events" },
    { name: "wind", score: 40, why: "occasional severe weather" }
  ]
};

export function getFallbackRisks(state: string | undefined): RiskItem[] {
  if (!state) return stateRiskProfiles.DEFAULT;
  
  const stateRisks = stateRiskProfiles[state.toUpperCase()];
  return stateRisks || stateRiskProfiles.DEFAULT;
}

export function hasStaticRiskData(zip: string): boolean {
  // This will be called to check if we have static data before falling back
  return false; // Will be overridden by the calling code
}