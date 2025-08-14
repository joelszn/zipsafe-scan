import { useState, useEffect } from 'react';
import { getCached, setCached } from '@/lib/cache';

export interface QuakeItem {
  magnitude: number | null;
  timeISO: string | null;
  place: string;
  url: string;
}

interface UseEarthquakeDataOptions {
  lat: number;
  lon: number;
  zip: string;
  timeRange: string;
}

const TIME_RANGE_HOURS = {
  '72h': 72,
  '7d': 168,
  '30d': 720,
  '6m': 4380
};

export function useEarthquakeData({ lat, lon, zip, timeRange }: UseEarthquakeDataOptions) {
  const [earthquakes, setEarthquakes] = useState<QuakeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !lon || !zip) return;

    const fetchEarthquakes = async () => {
      const cacheKey = `quakes:${zip}:${timeRange}`;
      const cached = getCached<QuakeItem[]>(cacheKey);
      
      if (cached) {
        setEarthquakes(cached);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const hours = TIME_RANGE_HOURS[timeRange as keyof typeof TIME_RANGE_HOURS] || 72;
        const startTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
        
        // Adjust radius based on time range - longer periods might need smaller radius to avoid too much data
        const maxRadius = timeRange === '6m' ? 50 : 100;
        
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000); // Longer timeout for larger datasets

        const response = await fetch(
          `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${lat}&longitude=${lon}&maxradiuskm=${maxRadius}&starttime=${startTime}&orderby=magnitude`,
          { signal: controller.signal }
        );

        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error('USGS API error');
        }

        const data = await response.json();
        
        const earthquakeData = (data?.features || [])
          .map((f: any) => ({
            magnitude: f?.properties?.mag ?? null,
            timeISO: f?.properties?.time ? new Date(f.properties.time).toISOString() : null,
            place: f?.properties?.place || 'Unknown location',
            url: f?.properties?.url || ''
          }))
          .sort((a: QuakeItem, b: QuakeItem) => (b.magnitude || 0) - (a.magnitude || 0))
          .slice(0, timeRange === '6m' ? 50 : 100); // Limit results for performance

        setEarthquakes(earthquakeData);
        
        // Cache for different durations based on time range
        const cacheDuration = timeRange === '72h' ? 300 : timeRange === '7d' ? 900 : 3600; // 5min, 15min, 1hour
        setCached(cacheKey, earthquakeData, cacheDuration);
        
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Request timed out');
        } else {
          setError('Failed to fetch earthquake data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarthquakes();
  }, [lat, lon, zip, timeRange]);

  return { earthquakes, isLoading, error };
}