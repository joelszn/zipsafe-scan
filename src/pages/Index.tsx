import Container from "@/components/ui/Container";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import ZipSearchForm from "@/components/ui/ZipSearchForm";
import PrepLinks from "@/components/ui/PrepLinks";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const title = "See your local climate risk and live alerts | MyRiskMap";
  const desc = "Enter your ZIP code to get instant hazard information, flood insurance likelihood, and safety steps.";
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={typeof window!=="undefined"? window.location.href: ''} />
      </Helmet>
      <Header />
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-20 bg-gradient-primary" />
          <Container className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-6 py-16">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              See your local climate risk and live alerts
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Enter your ZIP code to get instant hazard information, flood insurance likelihood, and safety steps.
            </p>
            <ZipSearchForm />
            <div className="text-sm text-muted-foreground">
              Try: 11208, 33401, 90210, 70112
            </div>
          </Container>
        </section>
        <section>
          <Container className="py-10">
            <h2 className="sr-only">Preparation links</h2>
            <PrepLinks />
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
