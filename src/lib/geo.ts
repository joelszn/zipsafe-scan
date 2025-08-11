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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zip}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) {
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
    throw error;
  }
}
