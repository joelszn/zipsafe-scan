import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Container from "@/components/ui/Container";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page not found | MyRiskMap</title>
        <meta name="description" content="The page you requested could not be found." />
        <link rel="canonical" href={typeof window!=="undefined"? window.location.href: ''} />
      </Helmet>
      <Header />
      <main>
        <Container className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-lg text-muted-foreground">Oops! Page not found</p>
            <Link to="/" className="underline">Return to Home</Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
