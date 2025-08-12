import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { Helmet } from "react-helmet-async";

const MethodologyPage = () => {
  const title = "Methodology | RiskByZip";
  const desc = "Data sources, caching, and flood zone simplifications used by RiskByZip.";
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={typeof window!=="undefined"? window.location.href: ''} />
      </Helmet>
      <Header />
      <main>
        <Container className="py-8 space-y-4 max-w-3xl">
          <h1 className="text-3xl font-semibold">Methodology</h1>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Data sources</h2>
            <p>Weather alerts from NOAA National Weather Service (api.weather.gov). Earthquakes from USGS (earthquake.usgs.gov). Flood zones from FEMA National Flood Hazard Layer (ArcGIS REST). ZIP geocoding via Zippopotam.us. Long-term climate hazards from a static JSON bundled with the site.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Caching strategy</h2>
            <p>Client-side caching via localStorage: alerts and earthquakes for 5 minutes, flood data for 24 hours, and static risk data for 1 year. API requests use AbortController timeouts (10s for alerts/earthquakes, 15s for flood, 8s for ZIP lookup) to maintain responsiveness.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">NFHL simplifications</h2>
            <p>Flood insurance likelihood labels are inferred: presence in SFHA (A/AE/AH/AO/A99/AR/V/VE) → High; intersecting NFHL but not SFHA → Moderate; otherwise Low. This is informational only and not a legal determination.</p>
            <p className="text-sm text-muted-foreground">Disclaimer: RiskByZip is informational only and not a substitute for official guidance. Confirm details with local officials, lenders, or insurers.</p>
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default MethodologyPage;
