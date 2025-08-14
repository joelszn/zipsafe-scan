import { getTerritoryLocation, isTerritoryZip } from './territoryData';

export function isValidZip(zip: string): boolean {
  return /^\d{5}$/.test(zip);
}

export async function getCoordsForZip(zip: string): Promise<{
  lat: number;
  lon: number;
  city?: string;
  state?: string;
}> {
  if (!isValidZip(zip)) {
    throw new Error('Invalid ZIP code format');
  }

  // Check if this is a US territory ZIP code first
  if (isTerritoryZip(zip)) {
    const territoryData = getTerritoryLocation(zip);
    if (territoryData) {
      console.log(`Using territory data for ZIP ${zip}:`, territoryData);
      return {
        lat: territoryData.lat,
        lon: territoryData.lon,
        city: territoryData.city,
        state: territoryData.state,
      };
    }
  }

  // Try primary geocoding service for mainland US
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zip}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    
    if (!response.ok) {
      // If primary service fails and it's a territory ZIP, fallback to territory data
      if (isTerritoryZip(zip)) {
        const territoryData = getTerritoryLocation(zip);
        if (territoryData) {
          console.log(`Primary service failed, using territory fallback for ZIP ${zip}`);
          return {
            lat: territoryData.lat,
            lon: territoryData.lon,
            city: territoryData.city,
            state: territoryData.state,
          };
        }
      }
      throw new Error('ZIP code not found');
    }
    
    const data = await response.json();
    const place = data.places?.[0];
    return {
      lat: parseFloat(place.latitude),
      lon: parseFloat(place.longitude),
      city: place['place name'],
      state: place['state abbreviation'] || place['state'],
    };
  } catch (error) {
    clearTimeout(timeout);
    
    // Final fallback for territory ZIPs if network fails
    if (isTerritoryZip(zip)) {
      const territoryData = getTerritoryLocation(zip);
      if (territoryData) {
        console.log(`Network error, using territory fallback for ZIP ${zip}`);
        return {
          lat: territoryData.lat,
          lon: territoryData.lon,
          city: territoryData.city,
          state: territoryData.state,
        };
      }
    }
    
    throw error;
  }
}
