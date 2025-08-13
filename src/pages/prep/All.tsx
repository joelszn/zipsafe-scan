import { Link } from "react-router-dom";
import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { Helmet } from "react-helmet-async";
import { CONTENT, IMAGES } from "./Hazard";

const AllHazardsPage = () => {
  const hazards = Object.entries(CONTENT);
  const title = "Preparedness guide: all hazards | RiskByZip";
  const desc = "Summaries and safety tips for flood, earthquake, heat, wind, winter, air, hurricane, and wildfire.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : ""} />
      </Helmet>
      <Header />
      <main>
        <Container className="py-8 space-y-6">
          <header>
            <h1 className="text-3xl font-semibold">Emergency preparedness by hazard</h1>
            <p className="text-muted-foreground max-w-3xl mt-2">
              Quick summaries and resources for common climate and weather hazards in the U.S.
            </p>
          </header>

          <section className="grid gap-6 sm:grid-cols-2">
            {hazards.map(([key, data]) => {
              const img = (IMAGES as any)[key];
              const snippet = data.body.length > 220 ? data.body.slice(0, 217) + "…" : data.body;
              return (
                <article key={key} className="space-y-3">
                  <figure className="overflow-hidden rounded-md border">
                    <img
                      src={img?.src}
                      alt={img?.alt || `${data.title} image`}
                      loading="lazy"
                      decoding="async"
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="w-full h-40 sm:h-44 md:h-48 object-cover"
                    />
                  </figure>
                  <div className="space-y-2">
                    <h2 className="text-xl font-medium">{data.title}</h2>
                    <p className="text-muted-foreground">{snippet}</p>
                    <Link to={`/prep/${key}`} className="underline">Read more</Link>
                  </div>
                </article>
              );
            })}
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default AllHazardsPage;
