import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import AlertCard, { AlertData } from "@/components/ui/AlertCard";
import RiskBar, { RiskItem } from "@/components/ui/RiskBar";
import FloodLikelihoodBadge from "@/components/ui/FloodLikelihoodBadge";
import PrepLinks from "@/components/ui/PrepLinks";
import ShareButton from "@/components/ui/ShareButton";
import ZipSearchForm from "@/components/ui/ZipSearchForm";
import { getCoordsForZip, isValidZip } from "@/lib/geo";
import { getFallbackRisks } from "@/lib/fallbackRisks";
import { getCached, setCached } from "@/lib/cache";
import { Helmet } from "react-helmet-async";

interface FloodApiResult {
  zip: string;
  lat: number;
  lon: number;
  likelihood: 'High' | 'Moderate' | 'Low' | 'Unknown';
  rationale: string;
  disclaimer: string;
}

interface QuakeItem { magnitude: number | null; timeISO: string | null; place: string; url: string; }

const ZipResultsPage = () => {
  const { zip = '' } = useParams();
  const valid = isValidZip(zip);

  const [coords, setCoords] = useState<{lat:number;lon:number;city?:string;state?:string}|null>(null);
  const [alerts, setAlerts] = useState<AlertData[] | null>(null);
  const [quakes, setQuakes] = useState<QuakeItem[] | null>(null);
  const [risks, setRisks] = useState<RiskItem[] | null>(null);
  const [flood, setFlood] = useState<FloodApiResult | null>(null);

  const [errors, setErrors] = useState<{alerts?:string;quakes?:string;risks?:string;flood?:string;coords?:string}>({});

  // Clear all state when ZIP changes to prevent cache bleed
  useEffect(() => {
    console.log(`ZIP changed to: ${zip}`);
    setCoords(null);
    setAlerts(null);
    setQuakes(null);
    setRisks(null);
    setFlood(null);
    setErrors({});
  }, [zip]);

  useEffect(() => {
    if (!valid) return;
    let mounted = true;
    
    // Auto-scroll to top when ZIP changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    (async () => {
      try {
        const c = await getCoordsForZip(zip);
        if (!mounted) return;
        setCoords(c);
      } catch (e:any) {
        setErrors(prev=>({...prev, coords: e?.message || 'Failed to locate ZIP'}));
      }
    })();
    return () => { mounted = false; };
  }, [zip, valid]);

  // Alerts
  useEffect(() => {
    if (!coords) return;
    const cacheKey = `alerts:${zip}`;
    const cached = getCached<AlertData[]>(cacheKey);
    if (cached) { setAlerts(cached); return; }

    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), 10000);
    fetch(`https://api.weather.gov/alerts/active?point=${coords.lat},${coords.lon}`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/geo+json' }
    })
      .then(r => r.ok ? r.json() : Promise.reject('NOAA API error'))
      .then(data => {
        const al = (data?.features || []).map((f:any)=>({
          title: f?.properties?.headline || 'Weather Alert',
          severity: f?.properties?.severity || 'Unknown',
          effective: f?.properties?.effective,
          expires: f?.properties?.expires,
          headline: f?.properties?.headline,
          instructions: f?.properties?.instruction,
          description: f?.properties?.description,
          source: 'NOAA NWS'
        })) as AlertData[];
        setAlerts(al);
        setCached(cacheKey, al, 300);
      })
      .catch(()=> setErrors(prev=>({...prev, alerts: 'Failed to fetch weather alerts'})))
      .finally(()=> clearTimeout(timeout));
    return () => controller.abort();
  }, [coords, zip]);

  // Quakes
  useEffect(() => {
    if (!coords) return;
    const cacheKey = `quakes:${zip}`;
    const cached = getCached<QuakeItem[]>(cacheKey);
    if (cached) { setQuakes(cached); return; }

    const startTime = new Date(Date.now() - 72*60*60*1000).toISOString();
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), 10000);
    fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${coords.lat}&longitude=${coords.lon}&maxradiuskm=100&starttime=${startTime}`, { signal: controller.signal })
      .then(r => r.ok ? r.json() : Promise.reject('USGS API error'))
      .then(data => {
        const qs = (data?.features || [])
          .map((f:any)=>({
            magnitude: f?.properties?.mag ?? null,
            timeISO: f?.properties?.time ? new Date(f.properties.time).toISOString() : null,
            place: f?.properties?.place || 'Unknown location',
            url: f?.properties?.url || ''
          }))
          .sort((a:any,b:any)=>(b.magnitude||0)-(a.magnitude||0))
          .slice(0,3);
        setQuakes(qs);
        setCached(cacheKey, qs, 300);
      })
      .catch(()=> setErrors(prev=>({...prev, quakes: 'Failed to fetch earthquakes'})))
      .finally(()=> clearTimeout(timeout));
    return () => controller.abort();
  }, [coords, zip]);

  // Risk (static JSON with robust fallback chain)
  useEffect(() => {
    if (!coords) return; // Wait for coordinates before loading risks
    
    const cacheKey = `risk:${zip}:v2`; // Updated cache version
    const cached = getCached<RiskItem[]>(cacheKey);
    if (cached) { 
      setRisks(cached); 
      return; 
    }

    console.log(`Loading risk data for ZIP ${zip}, state: ${coords.state}`);
    
    // Set loading timeout for better UX
    const loadingTimeout = setTimeout(() => {
      if (!risks) {
        console.log(`Loading timeout for ZIP ${zip}, using fallback data`);
        const fallbackRisks = getFallbackRisks(coords.state);
        setRisks(fallbackRisks.map(item => ({ ...item, dataSource: 'state-fallback-timeout' })));
        setCached(cacheKey, fallbackRisks, 31536000);
      }
    }, 5000);
    
    const controller = new AbortController();
    const fetchTimeout = setTimeout(() => controller.abort(), 8000);
    
    fetch('/data/risk.zip.min.json', { signal: controller.signal })
      .then(r => {
        clearTimeout(loadingTimeout);
        clearTimeout(fetchTimeout);
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
        return r.json();
      })
      .then((json) => {
        console.log(`Static data loaded for ZIP ${zip}:`, json?.[zip]);
        
        let list = json?.[zip]?.hazards || [];
        let dataSource = 'zip-specific';
        
        // If no data for this ZIP, use state-based fallback
        if (list.length === 0) {
          console.log(`No static data for ZIP ${zip}, using state fallback for ${coords.state}`);
          list = getFallbackRisks(coords.state);
          dataSource = 'state-based';
        }
        
        // Validate data structure and ensure minimum data quality
        if (!Array.isArray(list) || list.length === 0) {
          console.warn(`Invalid or empty risk data for ZIP ${zip}`);
          list = getFallbackRisks(coords.state);
          dataSource = 'state-fallback';
        }
        
        // Ensure each risk item has required fields
        list = list.filter(item => item && typeof item.name === 'string' && typeof item.score === 'number');
        
        if (list.length === 0) {
          console.error(`No valid risk items after filtering for ZIP ${zip}`);
          list = getFallbackRisks(coords.state);
          dataSource = 'state-fallback-filtered';
        }
        
        console.log(`Final risk data for ZIP ${zip}:`, list, `(${dataSource})`);
        setRisks(list.map(item => ({ ...item, dataSource })));
        setCached(cacheKey, list, 31536000);
      })
      .catch((error) => {
        clearTimeout(loadingTimeout);
        clearTimeout(fetchTimeout);
        
        console.error(`Failed to load static risk data for ZIP ${zip}:`, error);
        
        // Enhanced fallback chain with better error handling
        if (coords?.state) {
          const fallbackRisks = getFallbackRisks(coords.state);
          
          if (fallbackRisks && fallbackRisks.length > 0) {
            console.log(`Using state fallback for ZIP ${zip}:`, fallbackRisks);
            setRisks(fallbackRisks.map(item => ({ ...item, dataSource: 'state-fallback-error' })));
            setCached(cacheKey, fallbackRisks, 31536000);
          } else {
            console.error(`No fallback risks available for state ${coords.state}`);
            setErrors(prev => ({
              ...prev, 
              risks: 'Climate risk data is temporarily unavailable. Our state-level estimates are being updated. Please check back later.'
            }));
          }
        } else {
          console.error(`No coordinates available for ZIP ${zip}, cannot provide risk data`);
          setErrors(prev => ({
            ...prev, 
            risks: 'Unable to determine location for this ZIP code. Please verify the ZIP code and try again.'
          }));
        }
      });
      
    return () => {
      clearTimeout(loadingTimeout);
      clearTimeout(fetchTimeout);
      controller.abort();
    };
  }, [zip, coords]);

  // Flood
  useEffect(() => {
    if (!coords) return;
    const cacheKey = `flood:${zip}`;
    const cached = getCached<FloodApiResult>(cacheKey);
    if (cached) { setFlood(cached); return; }

    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), 15000);
    const url = `https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28/query?where=1%3D1&geometry=${coords.lon},${coords.lat}&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&outFields=FLD_ZONE,ZONE_SUBTY&returnGeometry=false&f=json`;
    fetch(url, { signal: controller.signal })
      .then(r=> r.ok? r.json(): Promise.reject('FEMA API error'))
      .then(data => {
        const sfhaZones = ['A','AE','AH','AO','A99','AR','V','VE'];
        let likelihood: FloodApiResult['likelihood'] = 'Low';
        let rationale = 'Area shows lower flood risk based on FEMA mapping';
        if (data?.features?.length) {
          const zones = data.features.map((f:any)=> f.attributes?.FLD_ZONE).filter(Boolean);
          const hasSFHA = zones.some((z:string)=> sfhaZones.some(sf=> z?.startsWith(sf)));
          if (hasSFHA) { likelihood = 'High'; rationale = 'Located in Special Flood Hazard Area (SFHA)'; }
          else { likelihood = 'Moderate'; rationale = 'Near mapped flood zones but not in high-risk area'; }
        }
        const result: FloodApiResult = {
          zip, lat: coords.lat, lon: coords.lon, likelihood, rationale,
          disclaimer: 'Informational only. Confirm with local officials or your lender.'
        };
        setFlood(result);
        setCached(cacheKey, result, 86400);
      })
      .catch(()=> setErrors(prev=>({...prev, flood: 'Flood data unavailable'})))
      .finally(()=> clearTimeout(timeout));
    return () => controller.abort();
  }, [coords, zip]);

  const pageTitle = useMemo(()=> valid ? `Climate Risk & Alerts for ZIP ${zip} | RiskByZip` : 'Invalid ZIP | RiskByZip', [valid, zip]);
  const pageDesc = useMemo(()=> valid ? `Live weather alerts, earthquake data, and long-term climate risk for ZIP code ${zip}. Plus flood insurance likelihood assessment.` : 'Invalid ZIP provided.' , [valid, zip]);

  if (!valid) {
    return (
      <>
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDesc} />
          <link rel="canonical" href={typeof window!=="undefined"? window.location.href: ''} />
        </Helmet>
        <Header />
        <Container className="py-10">
          <h1 className="text-3xl font-semibold mb-4">Invalid ZIP</h1>
          <p className="mb-6 text-muted-foreground">Please enter a valid 5-digit U.S. ZIP code.</p>
          <ZipSearchForm />
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={typeof window!=="undefined"? window.location.href: ''} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
      </Helmet>
      <Header />
      <main>
        {/* ZIP Code and Location Header */}
        <section className="bg-gradient-to-r from-primary/5 to-primary-glow/5 border-b">
          <Container className="py-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">ZIP {zip}</h1>
              {coords && (
                <p className="text-xl text-muted-foreground">
                  {coords.city}, {coords.state}
                </p>
              )}
              {!coords && !errors.coords && (
                <div className="flex justify-center">
                  <LoadingSkeleton className="h-6 w-48" showText text="Getting location..." />
                </div>
              )}
            </div>
          </Container>
        </section>
        
        <Container className="py-8 space-y-10">
          <section>
            <h2 className="text-2xl font-semibold mb-1">Live Weather Alerts</h2>
            <p className="text-sm text-muted-foreground mb-4">Official alerts from NOAA NWS</p>
            {!alerts && !errors.alerts && (
              <LoadingSkeleton className="h-20 w-full" lines={2} showText text="Checking for weather alerts..." />
            )}
            {errors.alerts && <p className="text-sm text-destructive">{errors.alerts}</p>}
            {alerts && alerts.length === 0 && <p className="text-sm">No active alerts</p>}
            {alerts && alerts.length > 0 && (
              <div className="grid gap-4">{alerts.map((a, i)=> <AlertCard key={i} alert={a} />)}</div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-1">Recent Earthquakes Nearby</h2>
            <p className="text-sm text-muted-foreground mb-4">Past 72 hours within 100 km</p>
            {!quakes && !errors.quakes && (
              <LoadingSkeleton className="h-16 w-full" lines={3} showText text="Searching for recent earthquakes..." />
            )}
            {errors.quakes && <p className="text-sm text-muted-foreground">Failed to load earthquakes</p>}
            {quakes && quakes.length === 0 && <p className="text-sm">No recent earthquakes nearby</p>}
            {quakes && quakes.length > 0 && (
              <ul className="space-y-2">
                {quakes.map((q,i)=> (
                  <li key={i} className="text-sm">
                    <span className="font-medium">M{q.magnitude ?? '—'}</span>
                    <span className="ml-2">{q.place}</span>
                    {q.timeISO && <span className="ml-2 text-muted-foreground">{new Date(q.timeISO).toLocaleString()}</span>}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-1">Long-term Climate Risks</h2>
            <p className="text-sm text-muted-foreground mb-4">Top hazards for ZIP {zip}</p>
            {!risks && !errors.risks && (
              <LoadingSkeleton className="h-20 w-full" lines={3} showText text="Analyzing climate risks..." />
            )}
            {errors.risks && (
              <div className="bg-muted/50 border border-muted rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-warning rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-sm mb-1">Climate Data Unavailable</p>
                    <p className="text-sm text-muted-foreground">{errors.risks}</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="text-xs text-primary hover:underline mt-2"
                    >
                      Try refreshing the page
                    </button>
                  </div>
                </div>
              </div>
            )}
            {risks && risks.length > 0 && (
              <>
                <div className="grid gap-4">{risks.map((r,i)=> <RiskBar key={i} item={r} />)}</div>
                {risks[0]?.dataSource && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <div className={`w-2 h-2 rounded-full ${
                      risks[0].dataSource === 'zip-specific' ? 'bg-success' :
                      risks[0].dataSource.startsWith('state-based') ? 'bg-info' : 'bg-warning'
                    }`}></div>
                    <span>
                      {risks[0].dataSource === 'zip-specific' && 'Detailed ZIP-specific climate data'}
                      {risks[0].dataSource === 'state-based' && `${coords?.state} state-level climate estimates`}
                      {risks[0].dataSource.includes('fallback') && `${coords?.state} state-level estimates (fallback data)`}
                      {risks[0].dataSource.includes('timeout') && `${coords?.state} state-level estimates (connection timeout)`}
                      {risks[0].dataSource.includes('error') && `${coords?.state} state-level estimates (data service error)`}
                    </span>
                  </div>
                )}
              </>
            )}
            {risks && risks.length === 0 && (
              <div className="bg-muted/50 border border-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground">No climate risk data available for this location.</p>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-1">Flood Insurance Likelihood</h2>
            {!flood && !errors.flood && (
              <LoadingSkeleton className="h-16 w-full" showText text="Checking flood zones..." />
            )}
            {errors.flood && <p className="text-sm text-muted-foreground">Flood data temporarily unavailable</p>}
            {flood && <FloodLikelihoodBadge data={{ likelihood: flood.likelihood, rationale: flood.rationale, disclaimer: flood.disclaimer }} />}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-1">Preparation</h2>
            <PrepLinks />
          </section>

          <section className="flex items-center gap-3">
            <ShareButton title={`RiskByZip for ZIP ${zip}`} text={coords ? `${coords.city || ''} ${coords.state || ''}`.trim() : undefined} />
            <ZipSearchForm initialZip={zip} ctaLabel="Check another ZIP" />
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default ZipResultsPage;
